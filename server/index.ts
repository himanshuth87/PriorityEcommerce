import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';

// --- Middleware ---
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// --- Database ---
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// --- Auth Middleware ---
function authenticateToken(req: any, res: any, next: any) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
}

function requireAdmin(req: any, res: any, next: any) {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  next();
}

// ═══════════════════════════════════════════════════════════
// AUTH ROUTES
// ═══════════════════════════════════════════════════════════

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: 'Name, email and password are required' });

  try {
    const hash = await bcrypt.hash(password, 12);
    const result = await pool.query(
      'INSERT INTO users (name, email, password, phone) VALUES ($1, $2, $3, $4) RETURNING id, name, email, phone, role, created_at',
      [name, email, hash, phone || null],
    );
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ user, token });
  } catch (err: any) {
    if (err.code === '23505') return res.status(400).json({ error: 'Email already registered' });
    console.error('register error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, created_at: user.created_at },
      token,
    });
  } catch (err) {
    console.error('login error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ═══════════════════════════════════════════════════════════
// USER PROFILE ROUTES
// ═══════════════════════════════════════════════════════════

app.get('/api/users/me', authenticateToken, async (req: any, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, phone, role, created_at FROM users WHERE id = $1',
      [req.user.id],
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/users/me', authenticateToken, async (req: any, res) => {
  const { name, phone } = req.body;
  try {
    const result = await pool.query(
      'UPDATE users SET name = COALESCE($1, name), phone = COALESCE($2, phone), updated_at = NOW() WHERE id = $3 RETURNING id, name, email, phone, role',
      [name || null, phone || null, req.user.id],
    );
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── Addresses ───────────────────────────────────────────────

app.get('/api/users/me/addresses', authenticateToken, async (req: any, res) => {
  const result = await pool.query(
    'SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at ASC',
    [req.user.id],
  );
  res.json(result.rows);
});

app.post('/api/users/me/addresses', authenticateToken, async (req: any, res) => {
  const { label, line1, line2, city, state, pincode, phone, is_default } = req.body;
  if (!line1 || !city || !state || !pincode || !phone)
    return res.status(400).json({ error: 'Missing required address fields' });

  try {
    if (is_default) {
      await pool.query('UPDATE addresses SET is_default = false WHERE user_id = $1', [req.user.id]);
    }
    const result = await pool.query(
      'INSERT INTO addresses (user_id, label, line1, line2, city, state, pincode, phone, is_default) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',
      [req.user.id, label || 'Home', line1, line2 || null, city, state, pincode, phone, !!is_default],
    );
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/users/me/addresses/:id', authenticateToken, async (req: any, res) => {
  await pool.query('DELETE FROM addresses WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
  res.json({ success: true });
});

// ═══════════════════════════════════════════════════════════
// CATEGORY ROUTES
// ═══════════════════════════════════════════════════════════

app.get('/api/categories', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories WHERE is_active = true ORDER BY sort_order ASC, title ASC');
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Database error' });
  }
});

// ═══════════════════════════════════════════════════════════
// PRODUCT ROUTES
// ═══════════════════════════════════════════════════════════

app.get('/api/products', async (req, res) => {
  const { category, sort, min_price, max_price, search, page = 1, limit = 20 } = req.query as any;
  try {
    let query = 'SELECT p.*, c.slug AS category_slug FROM products p JOIN categories c ON p.category_id = c.id WHERE p.is_active = true';
    const params: any[] = [];

    if (category)  { params.push(category);       query += ` AND c.slug = $${params.length}`; }
    if (min_price) { params.push(min_price);       query += ` AND p.price >= $${params.length}`; }
    if (max_price) { params.push(max_price);       query += ` AND p.price <= $${params.length}`; }
    if (search)    { params.push(`%${search}%`);   query += ` AND p.name ILIKE $${params.length}`; }

    const sortMap: Record<string, string> = {
      'price-asc':  'p.price ASC',
      'price-desc': 'p.price DESC',
      'rating':     'p.rating DESC',
      'newest':     'p.created_at DESC',
    };
    query += ` ORDER BY ${sortMap[sort] || 'p.created_at DESC'}`;

    const offset = (Number(page) - 1) * Number(limit);
    params.push(Number(limit)); query += ` LIMIT $${params.length}`;
    params.push(offset);        query += ` OFFSET $${params.length}`;

    const result = await pool.query(query, params);
    res.json({ products: result.rows, page: Number(page), limit: Number(limit) });
  } catch (err) {
    console.error('products list error', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/products/:idOrSlug', async (req, res) => {
  const { idOrSlug } = req.params;
  try {
    const result = await pool.query(
      `SELECT p.*, c.slug AS category_slug FROM products p
       JOIN categories c ON p.category_id = c.id
       WHERE p.is_active = true AND (p.slug = $1)`,
      [idOrSlug],
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Product not found' });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Database error' });
  }
});

// Admin: create product
app.post('/api/products', authenticateToken, requireAdmin, async (req: any, res) => {
  const { sku, slug, name, description, price, original_price, category_id, image, images, features, specifications, stock, is_new, is_highlighted } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO products (sku, slug, name, description, price, original_price, category_id, image, images, features, specifications, stock, is_new, is_highlighted)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
      [sku, slug, name, description, price, original_price, category_id, image, JSON.stringify(images || []), JSON.stringify(features || []), JSON.stringify(specifications || {}), stock || 0, !!is_new, !!is_highlighted],
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    if (err.code === '23505') return res.status(400).json({ error: 'SKU or slug already exists' });
    res.status(500).json({ error: 'Database error' });
  }
});

// Admin: update product
app.put('/api/products/:id', authenticateToken, requireAdmin, async (req: any, res) => {
  const fields = ['name', 'description', 'price', 'original_price', 'stock', 'is_active', 'is_new', 'is_highlighted'];
  const updates: string[] = [];
  const params: any[] = [];

  fields.forEach((f) => {
    if (req.body[f] !== undefined) {
      params.push(req.body[f]);
      updates.push(`${f} = $${params.length}`);
    }
  });

  if (!updates.length) return res.status(400).json({ error: 'No fields to update' });
  updates.push('updated_at = NOW()');
  params.push(req.params.id);

  try {
    const result = await pool.query(
      `UPDATE products SET ${updates.join(', ')} WHERE id = $${params.length} RETURNING *`,
      params,
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Product not found' });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Database error' });
  }
});

// ═══════════════════════════════════════════════════════════
// ORDER ROUTES
// ═══════════════════════════════════════════════════════════

app.get('/api/orders', authenticateToken, async (req: any, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const query = isAdmin
      ? 'SELECT o.*, u.name AS user_name, u.email AS user_email FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC LIMIT 100'
      : 'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC';
    const params = isAdmin ? [] : [req.user.id];
    const result = await pool.query(query, params);

    const orders = await Promise.all(
      result.rows.map(async (order) => {
        const items = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [order.id]);
        return { ...order, items: items.rows };
      }),
    );
    res.json(orders);
  } catch (err) {
    console.error('orders list error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/orders/:id', authenticateToken, async (req: any, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
    const order = result.rows[0];
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.user_id !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ error: 'Access denied' });

    const items = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [order.id]);
    res.json({ ...order, items: items.rows });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/orders', authenticateToken, async (req: any, res) => {
  const {
    items, shipping_name, shipping_phone, shipping_line1, shipping_line2,
    shipping_city, shipping_state, shipping_pincode, payment_method, notes,
  } = req.body;

  if (!items?.length || !shipping_name || !shipping_phone || !shipping_line1 || !shipping_city || !shipping_state || !shipping_pincode)
    return res.status(400).json({ error: 'Missing required order fields' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const productIds = items.map((i: any) => i.product_id);
    const productResult = await client.query(
      'SELECT id, name, price, image, stock FROM products WHERE id = ANY($1::uuid[])',
      [productIds],
    );
    const productMap: Record<string, any> = {};
    productResult.rows.forEach((p) => { productMap[p.id] = p; });

    let subtotal = 0;
    const orderItems: any[] = [];

    for (const item of items) {
      const product = productMap[item.product_id];
      if (!product) throw new Error(`Product not found`);
      if (product.stock < item.quantity) throw new Error(`Insufficient stock for ${product.name}`);
      subtotal += product.price * item.quantity;
      orderItems.push({ ...item, name: product.name, price: product.price, image: product.image });
    }

    const shipping_fee = subtotal >= 1499 ? 0 : 99;
    const total = subtotal + shipping_fee;

    const orderResult = await client.query(
      `INSERT INTO orders (user_id, subtotal, shipping_fee, total, shipping_name, shipping_phone, shipping_line1, shipping_line2, shipping_city, shipping_state, shipping_pincode, payment_method, notes, status, payment_status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,'confirmed','pending') RETURNING *`,
      [req.user.id, subtotal, shipping_fee, total, shipping_name, shipping_phone, shipping_line1, shipping_line2 || null, shipping_city, shipping_state, shipping_pincode, payment_method || 'cod', notes || null],
    );
    const order = orderResult.rows[0];

    for (const item of orderItems) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, name, price, quantity, image) VALUES ($1,$2,$3,$4,$5,$6)',
        [order.id, item.product_id, item.name, item.price, item.quantity, item.image],
      );
      await client.query('UPDATE products SET stock = stock - $1 WHERE id = $2', [item.quantity, item.product_id]);
    }

    await client.query('COMMIT');
    const finalItems = await client.query('SELECT * FROM order_items WHERE order_id = $1', [order.id]);
    res.status(201).json({ ...order, items: finalItems.rows });
  } catch (err: any) {
    await client.query('ROLLBACK');
    console.error('create order error', err);
    res.status(400).json({ error: err.message || 'Order creation failed' });
  } finally {
    client.release();
  }
});

// Admin: update order status
app.patch('/api/orders/:id/status', authenticateToken, requireAdmin, async (req: any, res) => {
  const { status } = req.body;
  const valid = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];
  if (!valid.includes(status)) return res.status(400).json({ error: 'Invalid status' });

  try {
    const result = await pool.query(
      'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, req.params.id],
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Order not found' });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

// ═══════════════════════════════════════════════════════════
// HEALTH CHECK
// ═══════════════════════════════════════════════════════════

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected', timestamp: new Date().toISOString() });
  } catch {
    res.status(503).json({ status: 'error', db: 'disconnected' });
  }
});

app.listen(PORT, () => {
  console.log(`Priority Bags API running on port ${PORT}`);
});
