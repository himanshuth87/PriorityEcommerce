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

// --- Middleware ---
app.use(helmet());
app.use(compression());
app.use(cors({ 
  origin: process.env.CORS_ORIGIN || '*', 
  credentials: true 
}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({ 
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// --- Database Connection ---
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// --- Auth Middleware ---
function authenticateToken(req: any, res: any, next: any) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ error: 'Invalid token' });
  }
}

// --- AUTH ROUTES ---

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing required fields' });

  try {
    const hash = await bcrypt.hash(password, 12);
    const result = await pool.query(
      'INSERT INTO users (name, email, password, phone) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, hash, phone]
    );
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.status(201).json({ user, token });
  } catch (err: any) {
    if (err.code === '23505') return res.status(400).json({ error: 'Email already registered' });
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- PRODUCT ROUTES ---

app.get('/api/products', async (req, res) => {
  const { category, sort, min_price, max_price, search, page = 1, limit = 20 } = req.query as any;
  try {
    let query = 'SELECT p.*, c.slug as category_slug FROM products p JOIN categories c ON p.category_id = c.id WHERE p.is_active = true';
    const params: any[] = [];

    if (category) { params.push(category); query += ` AND c.slug = $${params.length}`; }
    if (min_price) { params.push(min_price); query += ` AND p.price >= $${params.length}`; }
    if (max_price) { params.push(max_price); query += ` AND p.price <= $${params.length}`; }
    if (search) { params.push(search); query += ` AND p.name ILIKE '%' || $${params.length} || '%'`; }

    const sortMap: any = { 
      'price-asc': 'p.price ASC', 
      'price-desc': 'p.price DESC', 
      'rating': 'p.rating DESC', 
      'newest': 'p.created_at DESC' 
    };
    query += ` ORDER BY ${sortMap[sort] || 'p.created_at DESC'}`;
    
    const offset = (page - 1) * limit;
    params.push(limit);
    query += ` LIMIT $${params.length}`;
    params.push(offset);
    query += ` OFFSET $${params.length}`;

    const result = await pool.query(query, params);
    res.json({ products: result.rows, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// --- HEALTH CHECK ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Priority Bags API running on port ${PORT}`);
});
