import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, LogOut, Settings, Users, BarChart3, 
  Truck, LayoutDashboard, Box, Activity, Bell,
  ArrowUpRight, Plus, Search, Filter, Edit3, Trash2, Camera, ExternalLink, X, Check, ArrowRight, Save
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PRODUCTS as INITIAL_PRODUCTS } from '../constants/products';
import { Product } from '../types';
import { CloudinaryUpload } from '../components/CloudinaryUpload';

export const AdminDashboard = () => {
  const { user, logout, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    originalPrice: 0,
    category: 'backpacks',
    gender: 'unisex',
    stock: 50,
    description: '',
    isPremium: false,
    images: [],
    sku: 'PB-' + Math.floor(1000 + Math.random() * 9000)
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate('/login');
    if (user && user.role !== 'admin') navigate('/account');
    
    if (products.length === 0) {
      setProducts(INITIAL_PRODUCTS as Product[]);
    }
  }, [isAuthenticated, isLoading, navigate, user, products.length]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'inventory', label: 'Products', icon: Box },
    { id: 'orders', label: 'Orders', icon: Truck },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'analytics', label: 'Settings', icon: Settings },
  ];

  const metrics = [
    { label: 'Total Revenue', value: '₹14,28,450', trend: '+12.5%', info: 'vs last month' },
    { label: 'Active Orders', value: '842', trend: '+8.1%', info: 'Pending shipping' },
    { label: 'Total Customers', value: '3,240', trend: '+14.2%', info: 'New signups' },
    { label: 'Success Rate', value: '98.4%', trend: '+0.4%', info: 'Completed' },
  ];

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...formData } as Product : p));
      setEditingProduct(null);
    } else {
      const newProduct: Product = {
        ...formData,
        id: 'new-' + Date.now(),
        slug: formData.name?.toLowerCase().replace(/\s+/g, '-') || 'new-product',
        createdAt: new Date().toISOString(),
        rating: 4.5,
        reviews: 0,
        highlighted: false,
        isNew: true,
        image: formData.images?.[0] || '',
      } as Product;
      setProducts(prev => [newProduct, ...prev]);
      setIsAddingProduct(false);
    }
    setFormData({
      name: '',
      price: 0,
      originalPrice: 0,
      category: 'backpacks',
      gender: 'unisex',
      stock: 50,
      description: '',
      isPremium: false,
      images: [],
      sku: 'PB-' + Math.floor(1000 + Math.random() * 9000)
    });
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setIsAddingProduct(true);
  };

  if (isLoading || !user) return null;

  return (
    <main className="min-h-screen bg-[var(--color-bg-main)] font-outfit selection:bg-priority-blue selection:text-white pt-20 transition-colors duration-300">
      <div className="pt-12 pb-16 px-6">
        <div className="max-w-[1400px] mx-auto px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-black text-[var(--color-text-main)]"
          >
            Admin Dashboard
          </motion.h1>
          <p className="text-sm font-bold text-priority-blue uppercase tracking-widest mt-2">Manage your store and orders</p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 pb-32">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Nav */}
          <div className="w-full lg:w-64 shrink-0">
            <div className="sticky top-32 bg-[var(--color-bg-card)] p-4 rounded-3xl border border-[var(--color-border-main)] shadow-sm">
              <div className="mb-6 p-4 bg-[var(--color-bg-main)] rounded-2xl border border-[var(--color-border-main)]">
                <p className="text-[10px] font-bold uppercase text-[var(--color-text-muted)] mb-1">Welcome back,</p>
                <h2 className="text-lg font-black text-[var(--color-text-main)] truncate">{user?.name || 'Admin'}</h2>
              </div>

              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setIsAddingProduct(false); setEditingProduct(null); }}
                    className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl text-xs font-bold transition-all ${
                      activeTab === tab.id 
                        ? 'bg-priority-blue text-white shadow-lg' 
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-bg-main)]'
                    }`}
                  >
                    <tab.icon size={16} />
                    {tab.label}
                  </button>
                ))}
              </nav>

              <div className="mt-6 pt-4 border-t border-[var(--color-border-main)]">
                <button onClick={logout} className="w-full flex items-center gap-3 px-5 py-3.5 text-xs font-bold text-red-500 hover:bg-red-500/5 rounded-xl transition-all">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div 
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {metrics.map((m, i) => (
                       <div key={i} className="bg-[var(--color-bg-card)] p-6 rounded-3xl border border-[var(--color-border-main)]">
                         <p className="text-xs font-bold text-[var(--color-text-muted)] mb-2 uppercase tracking-wider">{m.label}</p>
                         <p className="text-2xl font-black text-[var(--color-text-main)]">{m.value}</p>
                         <div className="flex items-center gap-2 mt-2">
                           <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${m.trend.startsWith('+') ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>{m.trend}</span>
                           <span className="text-[10px] text-[var(--color-text-muted)] uppercase">{m.info}</span>
                         </div>
                       </div>
                    ))}
                  </div>

                  <div className="bg-[var(--color-bg-card)] p-8 rounded-3xl border border-[var(--color-border-main)]">
                    <h3 className="text-xl font-black text-[var(--color-text-main)] mb-6 uppercase tracking-tight">Recent Orders</h3>
                    <div className="space-y-3">
                      {[
                        { id: 'ORD-8842', user: 'John Wick', loc: 'Mumbai', price: '₹18,450', status: 'Shipped' },
                        { id: 'ORD-8841', user: 'Sarah Connor', loc: 'New Delhi', price: '₹14,200', status: 'Pending' },
                        { id: 'ORD-8840', user: 'Bruce Wayne', loc: 'Bangalore', price: '₹42,000', status: 'Delivered' }
                      ].map((order, i) => (
                        <div key={i} className="flex flex-wrap items-center justify-between p-5 bg-[var(--color-bg-main)] border border-[var(--color-border-main)] rounded-2xl hover:border-priority-blue transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-priority-blue/10 text-priority-blue rounded-xl flex items-center justify-center font-bold text-xs">{order.id.split('-')[1]}</div>
                            <div>
                              <p className="text-sm font-bold text-[var(--color-text-main)]">{order.user}</p>
                              <p className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold">{order.loc} • Order {order.id}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-black text-[var(--color-text-main)]">{order.price}</p>
                            <span className="text-[9px] font-black uppercase bg-priority-blue text-white px-3 py-1 rounded-full tracking-widest">{order.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'inventory' && (
                <motion.div 
                  key="products"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                       <h2 className="text-2xl font-black text-[var(--color-text-main)]">Product Manager</h2>
                       <p className="text-xs font-bold text-priority-blue uppercase tracking-widest">{products.length} Items in store</p>
                    </div>
                    {!isAddingProduct && (
                      <button 
                        onClick={() => { setIsAddingProduct(true); setEditingProduct(null); }}
                        className="bg-priority-blue text-white px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:scale-[1.02] transition-all shadow-lg shadow-priority-blue/20"
                      >
                        <Plus size={16} /> Add Product
                      </button>
                    )}
                  </div>

                  {isAddingProduct ? (
                    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-[var(--color-bg-card)] rounded-3xl border border-[var(--color-border-main)] p-8">
                      <div className="flex justify-between items-center mb-8 border-b border-[var(--color-border-main)] pb-6">
                         <h3 className="text-xl font-bold text-[var(--color-text-main)] uppercase tracking-tight">
                           {editingProduct ? 'Edit Product' : 'Create New Product'}
                         </h3>
                         <button onClick={() => { setIsAddingProduct(false); setEditingProduct(null); }} className="p-2 hover:text-red-500 transition-colors">
                           <X size={20} />
                         </button>
                      </div>

                      <form onSubmit={handleSaveProduct} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-priority-blue">Product Name</label>
                            <input 
                              required
                              type="text" 
                              value={formData.name}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                              placeholder="e.g. Urban Blue Pack"
                              className="w-full bg-[var(--color-bg-main)] border border-[var(--color-border-main)] rounded-xl px-4 py-3.5 text-sm font-medium text-[var(--color-text-main)] focus:border-priority-blue outline-none transition-all"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-priority-blue">Price (₹)</label>
                            <input 
                              required
                              type="number" 
                              value={formData.price}
                              onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})}
                              className="w-full bg-[var(--color-bg-main)] border border-[var(--color-border-main)] rounded-xl px-4 py-3.5 text-sm font-medium text-[var(--color-text-main)] focus:border-priority-blue outline-none transition-all"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-priority-blue">Original Price (₹)</label>
                            <input 
                              required
                              type="number" 
                              value={formData.originalPrice}
                              onChange={(e) => setFormData({...formData, originalPrice: parseInt(e.target.value)})}
                              className="w-full bg-[var(--color-bg-main)] border border-[var(--color-border-main)] rounded-xl px-4 py-3.5 text-sm font-medium text-[var(--color-text-main)] focus:border-priority-blue outline-none transition-all"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-priority-blue">Main Category</label>
                            <select 
                              value={formData.category}
                              onChange={(e) => setFormData({...formData, category: e.target.value})}
                              className="w-full bg-[var(--color-bg-main)] border border-[var(--color-border-main)] rounded-xl px-4 py-3.5 text-sm font-medium text-[var(--color-text-main)] focus:border-priority-blue outline-none transition-all"
                            >
                              <option value="backpacks">Backpacks</option>
                              <option value="luggage">Luggage</option>
                              <option value="accessories">Accessories</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-priority-blue">Gender/Style</label>
                            <select 
                              value={formData.gender}
                              onChange={(e) => setFormData({...formData, gender: e.target.value as any})}
                              className="w-full bg-[var(--color-bg-main)] border border-[var(--color-border-main)] rounded-xl px-4 py-3.5 text-sm font-medium text-[var(--color-text-main)] focus:border-priority-blue outline-none transition-all"
                            >
                              <option value="men">Men</option>
                              <option value="women">Women</option>
                              <option value="kids">Kids</option>
                              <option value="premium">Premium</option>
                              <option value="unisex">Unisex</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-priority-blue">Units in Stock</label>
                            <input 
                              type="number" 
                              value={formData.stock}
                              onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
                              className="w-full bg-[var(--color-bg-main)] border border-[var(--color-border-main)] rounded-xl px-4 py-3.5 text-sm font-medium text-[var(--color-text-main)] focus:border-priority-blue outline-none transition-all"
                            />
                          </div>
                        </div>

                        <CloudinaryUpload
                          label="Product Image"
                          value={formData.images?.[0] || ''}
                          onChange={(url) => setFormData({ ...formData, images: [url], image: url })}
                        />

                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase text-priority-blue">Product Description</label>
                          <textarea 
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            rows={3}
                            placeholder="Briefly describe the product features..."
                            className="w-full bg-[var(--color-bg-main)] border border-[var(--color-border-main)] rounded-xl px-4 py-3.5 text-sm font-medium text-[var(--color-text-main)] focus:border-priority-blue outline-none transition-all resize-none"
                          />
                        </div>

                        <div className="flex items-center gap-3">
                           <button 
                             type="button"
                             onClick={() => setFormData({...formData, isPremium: !formData.isPremium})}
                             className={`w-10 h-5 rounded-full transition-all relative ${formData.isPremium ? 'bg-priority-blue' : 'bg-gray-200'}`}
                           >
                             <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${formData.isPremium ? 'left-5.5' : 'left-0.5'}`} />
                           </button>
                           <span className="text-xs font-bold text-[var(--color-text-main)]">Mark as Premium</span>
                        </div>

                        <div className="pt-6 border-t border-[var(--color-border-main)] flex gap-4">
                           <button 
                             type="submit"
                             className="flex-1 bg-priority-blue text-white font-bold text-xs py-4 rounded-xl uppercase tracking-widest hover:bg-priority-dark transition-all flex items-center justify-center gap-2"
                           >
                              <Check size={16} /> {editingProduct ? 'Save Changes' : 'Add Product'}
                           </button>
                           <button 
                             type="button"
                             onClick={() => { setIsAddingProduct(false); setEditingProduct(null); }}
                             className="px-8 bg-gray-100 text-[var(--color-text-main)] font-bold text-xs rounded-xl uppercase tracking-widest hover:bg-gray-200 transition-all"
                           >
                             Cancel
                           </button>
                        </div>
                      </form>
                    </motion.div>
                  ) : (
                    <div className="bg-[var(--color-bg-card)] rounded-3xl border border-[var(--color-border-main)] shadow-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b border-[var(--color-border-main)] bg-gray-50/50">
                              <th className="px-6 py-5 text-[10px] font-bold text-priority-blue uppercase tracking-widest">Product</th>
                              <th className="px-6 py-5 text-[10px] font-bold text-priority-blue uppercase tracking-widest">Category</th>
                              <th className="px-6 py-5 text-[10px] font-bold text-priority-blue uppercase tracking-widest">Price</th>
                              <th className="px-6 py-5 text-[10px] font-bold text-priority-blue uppercase tracking-widest">Stock</th>
                              <th className="px-6 py-5 text-[10px] font-bold text-priority-blue uppercase tracking-widest text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[var(--color-border-main)]">
                            {products.map((product) => (
                              <tr key={product.id} className="hover:bg-[var(--color-bg-main)] transition-all group">
                                <td className="px-6 py-5">
                                  <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border border-[var(--color-border-main)] p-1 flex items-center justify-center">
                                      <img src={product.image} className="w-full h-full object-contain" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="text-sm font-bold text-[var(--color-text-main)] truncate">{product.name}</p>
                                      <p className="text-[10px] text-[var(--color-text-muted)] font-bold uppercase tracking-wider">{product.sku}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-5">
                                  <div className="flex flex-col gap-1">
                                    <p className="text-[10px] font-bold text-[var(--color-text-main)] uppercase tracking-wider">{product.category}</p>
                                    <span className="text-[8px] font-black bg-priority-blue/10 text-priority-blue px-2 py-0.5 rounded-full uppercase tracking-widest w-fit">{product.gender || 'unisex'}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-5">
                                  <p className="text-sm font-bold text-[var(--color-text-main)]">₹{product.price.toLocaleString()}</p>
                                  <p className="text-[9px] text-green-600 font-bold uppercase">{product.discount}</p>
                                </td>
                                <td className="px-6 py-5">
                                  <div className="flex flex-col gap-1 w-24">
                                    <span className={`text-[10px] font-bold uppercase ${product.stock < 10 ? 'text-red-500' : 'text-green-600'}`}>{product.stock} in stock</span>
                                    <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                                       <div className={`h-full rounded-full transition-all duration-500 ${product.stock < 10 ? 'bg-red-500' : 'bg-green-600'}`} style={{ width: `${Math.min(100, product.stock)}%` }} />
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-5 text-right">
                                  <div className="flex justify-end gap-2">
                                    <button onClick={() => openEdit(product)} className="p-2.5 text-priority-blue hover:bg-priority-blue hover:text-white border border-priority-blue/20 bg-priority-blue/5 rounded-lg transition-all">
                                      <Edit3 size={14} />
                                    </button>
                                    <button onClick={() => handleDeleteProduct(product.id)} className="p-2.5 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 bg-red-500/5 rounded-lg transition-all">
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
};
