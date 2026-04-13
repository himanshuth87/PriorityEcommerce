import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

// --- Middleware ---
app.use(helmet());
app.use(compression());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

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
    const { data: user, error } = await supabase
      .from('users')
      .insert({ name, email, password: hash, phone: phone || null })
      .select('id, name, email, phone, role, created_at')
      .single();

    if (error) {
      if (error.code === '23505') return res.status(400).json({ error: 'Email already registered' });
      throw error;
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ user, token });
  } catch (err: any) {
    console.error('register error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user || !(await bcrypt.compare(password, user.password)))
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
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, phone, role, created_at')
    .eq('id', req.user.id)
    .single();

  if (error || !data) return res.status(404).json({ error: 'User not found' });
  res.json(data);
});

app.put('/api/users/me', authenticateToken, async (req: any, res) => {
  const { name, phone } = req.body;
  const updates: any = {};
  if (name) updates.name = name;
  if (phone) updates.phone = phone;

  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', req.user.id)
    .select('id, name, email, phone, role')
    .single();

  if (error) return res.status(500).json({ error: 'Server error' });
  res.json(data);
});

// ─── Addresses ───────────────────────────────────────────────

app.get('/api/users/me/addresses', authenticateToken, async (req: any, res) => {
  const { data } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', req.user.id)
    .order('is_default', { ascending: false });
  res.json(data || []);
});

app.post('/api/users/me/addresses', authenticateToken, async (req: any, res) => {
  const { label, line1, line2, city, state, pincode, phone, is_default } = req.body;
  if (!line1 || !city || !state || !pincode || !phone)
    return res.status(400).json({ error: 'Missing required address fields' });

  if (is_default) {
    await supabase.from('addresses').update({ is_default: false }).eq('user_id', req.user.id);
  }

  const { data, error } = await supabase
    .from('addresses')
    .insert({ user_id: req.user.id, label: label || 'Home', line1, line2: line2 || null, city, state, pincode, phone, is_default: !!is_default })
    .select()
    .single();

  if (error) return res.status(500).json({ error: 'Server error' });
  res.status(201).json(data);
});

app.delete('/api/users/me/addresses/:id', authenticateToken, async (req: any, res) => {
  await supabase.from('addresses').delete().eq('id', req.params.id).eq('user_id', req.user.id);
  res.json({ success: true });
});

// ═══════════════════════════════════════════════════════════
// CATEGORY ROUTES
// ═══════════════════════════════════════════════════════════

app.get('/api/categories', async (_req, res) => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');

  if (error) return res.status(500).json({ error: 'Database error' });
  res.json(data);
});

// ═══════════════════════════════════════════════════════════
// PRODUCT ROUTES
// ═══════════════════════════════════════════════════════════

app.get('/api/products', async (req, res) => {
  const { category, sort, min_price, max_price, search, page = '1', limit = '20' } = req.query as any;

  try {
    let query = supabase
      .from('products')
      .select('*, categories!inner(slug)')
      .eq('is_active', true);

    if (category)  query = query.eq('categories.slug', category);
    if (min_price) query = query.gte('price', Number(min_price));
    if (max_price) query = query.lte('price', Number(max_price));
    if (search)    query = query.ilike('name', `%${search}%`);

    const sortMap: Record<string, { column: string; ascending: boolean }> = {
      'price-asc':  { column: 'price', ascending: true },
      'price-desc': { column: 'price', ascending: false },
      'rating':     { column: 'rating', ascending: false },
      'newest':     { column: 'created_at', ascending: false },
    };
    const s = sortMap[sort] || { column: 'created_at', ascending: false };
    query = query.order(s.column, { ascending: s.ascending });

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const offset = (pageNum - 1) * limitNum;
    query = query.range(offset, offset + limitNum - 1);

    const { data, error } = await query;
    if (error) throw error;
    res.json({ products: data, page: pageNum, limit: limitNum });
  } catch (err) {
    console.error('products list error', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/products/:slug', async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories!inner(slug)')
    .eq('is_active', true)
    .eq('slug', req.params.slug)
    .single();

  if (error || !data) return res.status(404).json({ error: 'Product not found' });
  res.json(data);
});

app.post('/api/products', authenticateToken, requireAdmin, async (req: any, res) => {
  const { data, error } = await supabase.from('products').insert(req.body).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

app.put('/api/products/:id', authenticateToken, requireAdmin, async (req: any, res) => {
  const allowed = ['name', 'description', 'price', 'original_price', 'stock', 'is_active', 'is_new', 'is_highlighted'];
  const updates: any = {};
  allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

  if (!Object.keys(updates).length) return res.status(400).json({ error: 'No fields to update' });

  const { data, error } = await supabase.from('products').update(updates).eq('id', req.params.id).select().single();
  if (error || !data) return res.status(404).json({ error: 'Product not found' });
  res.json(data);
});

// ═══════════════════════════════════════════════════════════
// ORDER ROUTES
// ═══════════════════════════════════════════════════════════

app.get('/api/orders', authenticateToken, async (req: any, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    let query = supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });
    if (!isAdmin) query = query.eq('user_id', req.user.id);

    const { data, error } = await query;
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/orders/:id', authenticateToken, async (req: any, res) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', req.params.id)
    .single();

  if (error || !data) return res.status(404).json({ error: 'Order not found' });
  if (data.user_id !== req.user.id && req.user.role !== 'admin')
    return res.status(403).json({ error: 'Access denied' });
  res.json(data);
});

app.post('/api/orders', authenticateToken, async (req: any, res) => {
  const {
    items, shipping_name, shipping_phone, shipping_line1, shipping_line2,
    shipping_city, shipping_state, shipping_pincode, payment_method, notes,
  } = req.body;

  if (!items?.length || !shipping_name || !shipping_phone || !shipping_line1 || !shipping_city || !shipping_state || !shipping_pincode)
    return res.status(400).json({ error: 'Missing required order fields' });

  try {
    // Fetch product prices and stock from DB
    const productIds = items.map((i: any) => i.product_id);
    const { data: products, error: pErr } = await supabase
      .from('products')
      .select('id, name, price, image, stock')
      .in('id', productIds);

    if (pErr || !products) throw new Error('Failed to fetch products');

    const productMap: Record<string, any> = {};
    products.forEach((p) => { productMap[p.id] = p; });

    let subtotal = 0;
    const orderItems: any[] = [];

    for (const item of items) {
      const product = productMap[item.product_id];
      if (!product) throw new Error('Product not found');
      if (product.stock < item.quantity) throw new Error(`Insufficient stock for ${product.name}`);
      subtotal += product.price * item.quantity;
      orderItems.push({ product_id: item.product_id, name: product.name, price: product.price, image: product.image, quantity: item.quantity });
    }

    const shipping_fee = subtotal >= 1499 ? 0 : 99;
    const total = subtotal + shipping_fee;

    // Create order
    const { data: order, error: oErr } = await supabase
      .from('orders')
      .insert({
        user_id: req.user.id, subtotal, shipping_fee, total,
        shipping_name, shipping_phone, shipping_line1, shipping_line2: shipping_line2 || null,
        shipping_city, shipping_state, shipping_pincode,
        payment_method: payment_method || 'cod', notes: notes || null,
        status: 'confirmed', payment_status: 'pending',
      })
      .select()
      .single();

    if (oErr || !order) throw new Error('Failed to create order');

    // Insert order items
    const { error: iErr } = await supabase
      .from('order_items')
      .insert(orderItems.map((i) => ({ ...i, order_id: order.id })));

    if (iErr) throw new Error('Failed to create order items');

    // Decrement stock for each product
    for (const item of orderItems) {
      await supabase.rpc('decrement_stock', { product_id: item.product_id, qty: item.quantity });
    }

    const { data: finalOrder } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', order.id)
      .single();

    res.status(201).json(finalOrder);
  } catch (err: any) {
    console.error('create order error', err);
    res.status(400).json({ error: err.message || 'Order creation failed' });
  }
});

app.patch('/api/orders/:id/status', authenticateToken, requireAdmin, async (req: any, res) => {
  const { status } = req.body;
  const valid = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];
  if (!valid.includes(status)) return res.status(400).json({ error: 'Invalid status' });

  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error || !data) return res.status(404).json({ error: 'Order not found' });
  res.json(data);
});

// ═══════════════════════════════════════════════════════════
// HEALTH CHECK
// ═══════════════════════════════════════════════════════════

app.get('/api/health', async (_req, res) => {
  try {
    const { error } = await supabase.from('categories').select('id').limit(1);
    if (error) throw error;
    res.json({ status: 'ok', db: 'connected', timestamp: new Date().toISOString() });
  } catch {
    res.status(503).json({ status: 'error', db: 'disconnected' });
  }
});

app.listen(PORT, () => {
  console.log(`Priority Bags API running on port ${PORT}`);
});
