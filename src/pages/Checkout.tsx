import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck, Truck, CreditCard, ArrowRight, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../constants/products';
import { motion } from 'motion/react';
import { api } from '../lib/api';

export const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const { isAuthenticated, setShowAuthModal, setAuthMode } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const shipping = total >= 1499 ? 0 : 99;
  const grandTotal = total + shipping;

  if (items.length === 0 && !orderPlaced) {
    return (
      <main className="container mx-auto px-4 py-32 text-center font-outfit">
        <h1 className="text-4xl font-black mb-4 tracking-tighter uppercase italic">Your cart is empty</h1>
        <p className="text-gray-400 mb- aggregation-12 font-bold uppercase tracking-widest text-[11px]">Please add some products before checking out.</p>
        <Link to="/" className="bg-priority-blue text-white font-black text-[11px] px-12 py-5 rounded-2xl hover:scale-105 transition-all tracking-[0.2em] uppercase shadow-2xl shadow-priority-blue/20 inline-block mt-8">CONTINUE SHOPPING</Link>
      </main>
    );
  }

  if (orderPlaced) {
    return (
      <main className="container mx-auto px-4 py-32 text-center max-w-lg font-outfit">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 rounded-[3rem] p-16 border border-green-100 shadow-2xl shadow-green-500/5"
        >
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-10 shadow-xl border border-green-100">
            <ShieldCheck className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-5xl font-black text-green-900 mb-6 uppercase italic tracking-tighter">Order Placed!</h1>
          <p className="text-green-800 font-bold mb-4 uppercase tracking-widest text-xs">Authentic Priority Gear reserved.</p>
          <p className="text-sm text-green-600/70 mb-12 font-bold uppercase tracking-widest leading-loose">We'll send you a confirmation message on WhatsApp and Email shortly. Your journey begins.</p>
          <Link to="/" className="bg-priority-blue text-white font-black text-[11px] px-12 py-5 rounded-2xl hover:scale-105 transition-all tracking-[0.2em] uppercase shadow-2xl shadow-priority-blue/20 inline-block">Back to Shop</Link>
        </motion.div>
      </main>
    );
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      await api.createOrder({
        items: items.map((i) => ({ product_id: i.product.id, quantity: i.quantity })),
        shipping_name: form.name,
        shipping_phone: form.phone,
        shipping_line1: form.line1,
        shipping_line2: form.line2 || undefined,
        shipping_city: form.city,
        shipping_state: form.state,
        shipping_pincode: form.pincode,
        payment_method: 'cod',
      });
      clearCart();
      setOrderPlaced(true);
    } catch (err: any) {
      alert(err.message || 'Could not place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const updateField = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));
  const isFormValid = !!(form.name && form.email && form.phone && form.line1 && form.city && form.state && form.pincode);

  if (!isAuthenticated) {
    return (
      <main className="container mx-auto px-4 py-32 text-center max-w-md font-outfit">
        <h1 className="text-4xl font-black mb-6 uppercase italic tracking-tighter">Login Required</h1>
        <p className="text-gray-400 mb-12 font-bold uppercase tracking-widest text-[11px] leading-loose">Please sign in to your priority account to continue with your premium order and secure your points.</p>
        <button onClick={() => { setAuthMode('login'); setShowAuthModal(true); }} className="bg-priority-blue text-white font-black text-[11px] px-12 py-5 rounded-2xl hover:scale-105 transition-all tracking-[0.2em] uppercase shadow-2xl shadow-priority-blue/20">SIGN IN NOW</button>
      </main>
    );
  }

  return (
    <main className="bg-white min-h-screen font-outfit selection:bg-priority-blue selection:text-white pb-32">
      {/* Subtle Breadcrumb */}
      <nav className="border-b border-gray-100 bg-gray-50/30">
        <div className="container mx-auto px-8 py-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
           <Link to="/" className="hover:text-priority-blue transition-colors">Home</Link>
           <ChevronRight size={10} />
           <span className="text-gray-900">Checkout</span>
        </div>
      </nav>

      <div className="container mx-auto px-8 max-w-[1300px] pt-16">
        <div className="flex flex-col lg:flex-row gap-20">
          {/* Main Content */}
          <div className="lg:w-[60%] space-y-16">
            <div className="space-y-4">
               <span className="text-priority-blue text-[11px] font-black uppercase tracking-[0.4em]">Final Step</span>
               <h1 className="text-6xl font-black tracking-tighter uppercase italic text-gray-900">Checkout</h1>
            </div>

            {/* Delivery Form */}
            <section className="space-y-10">
              <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
                 <div className="w-12 h-12 bg-priority-blue/5 rounded-2xl flex items-center justify-center">
                    <Truck className="w-6 h-6 text-priority-blue" />
                 </div>
                 <h2 className="text-2xl font-black uppercase tracking-tight italic">Delivery Information</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  { label: 'Full Recipient Name', field: 'name', type: 'text', placeholder: 'Name on identification', span: false },
                  { label: 'Communication Email', field: 'email', type: 'email', placeholder: 'For order tracking', span: false },
                  { label: 'Mobile Number', field: 'phone', type: 'tel', placeholder: '10-digit primary number', span: false },
                  { label: 'Address Line 1', field: 'line1', type: 'text', placeholder: 'Building / Street', span: true },
                  { label: 'Landmark', field: 'line2', type: 'text', placeholder: 'Optional point of reference', span: true },
                  { label: 'City Hub', field: 'city', type: 'text', placeholder: 'Metropolitan / Town', span: false },
                  { label: 'State Zone', field: 'state', type: 'text', placeholder: 'Current state', span: false },
                  { label: 'Postal Code', field: 'pincode', type: 'text', placeholder: '6-digit PIN', span: false },
                ].map((f) => (
                  <div key={f.field} className={f.span ? 'sm:col-span-2' : ''}>
                    <label className="block text-[10px] font-black text-priority-blue uppercase tracking-widest mb-3 ml-1">{f.label}</label>
                    <input
                      required
                      type={f.type}
                      value={(form as any)[f.field]}
                      onChange={(e) => updateField(f.field, e.target.value)}
                      placeholder={f.placeholder}
                      className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-3xl focus:outline-none focus:ring-8 focus:ring-priority-blue/5 focus:border-priority-blue focus:bg-white transition-all text-sm font-bold uppercase tracking-tight placeholder:text-gray-300"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Payment Summary */}
            <section className="bg-gray-50 rounded-[3rem] p-12 border border-gray-100 space-y-6 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-[2s]">
                  <CreditCard size={120} className="text-priority-blue" />
               </div>
               <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <ShieldCheck className="w-6 h-6 text-priority-blue" />
                  </div>
                  <h3 className="text-xl font-black uppercase italic tracking-tight">Verified Digital Payment</h3>
               </div>
               <p className="text-sm font-bold text-gray-500 uppercase tracking-widest max-w-lg leading-loose">
                  Your transaction is protected by 256-bit encryption. We accept UPI, Cards, and Net Banking through our secure Razorpay gateway.
               </p>
            </section>
          </div>

          {/* Sidebar Receipt */}
          <aside className="lg:w-[40%]">
            <div className="sticky top-24 bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-black/[0.03] p-12 space-y-10">
              <div>
                 <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-8 pb-4 border-b border-gray-100">Review Items</h2>
                 <div className="space-y-8 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                   {items.map((item) => (
                     <div key={item.product.id} className="flex gap-6 items-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center justify-center shrink-0">
                           <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="min-w-0">
                           <p className="text-sm font-black uppercase tracking-tight text-gray-900 truncate">{item.product.name}</p>
                           <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">{item.quantity} Unit(s) • {formatPrice(item.product.price)}</p>
                        </div>
                     </div>
                   ))}
                 </div>
              </div>

              <div className="space-y-5 pt-10 border-t border-gray-100">
                <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
                   <span>Unit Subtotal</span>
                   <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
                   <span>Logistic Fee</span>
                   <span className={shipping === 0 ? 'text-green-600' : ''}>{shipping === 0 ? 'COMPLIMENTARY' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between items-end pt-8 mt-4 border-t border-gray-100">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-priority-blue mb-1">Total Payable</span>
                      <span className="text-4xl font-black tracking-tighter uppercase italic">{formatPrice(grandTotal)}</span>
                   </div>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={!isFormValid || isProcessing}
                className="w-full bg-priority-blue text-white font-black text-xs py-5 rounded-2xl flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-98 transition-all shadow-2xl shadow-priority-blue/30 uppercase tracking-[0.2em] disabled:opacity-30 disabled:grayscale h-16 group"
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>Secure Pay <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" /></>
                )}
              </button>
              
              <div className="flex items-center justify-center gap-3 opacity-30">
                 <div className="w-2 h-2 rounded-full bg-gray-400" />
                 <span className="text-[9px] font-black uppercase tracking-[0.3em]">Encrypted Session Active</span>
                 <div className="w-2 h-2 rounded-full bg-gray-400" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};
