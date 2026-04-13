import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  ShoppingCart,
  Heart,
  ChevronRight,
  ChevronDown,
  Minus,
  Plus,
  Laptop,
  Sparkles,
  Briefcase,
  Feather,
  ShieldCheck,
  Maximize,
  TramFront,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getProductById, getProductsByCategory, formatPrice } from '../constants/products';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<string | null>('highlight');

  const product = getProductById(id || '');

  if (!product) {
    return (
      <main className="container mx-auto px-4 py-32 text-center font-outfit">
        <h1 className="text-3xl font-black mb-4 uppercase italic tracking-tighter">Product Not Found</h1>
        <p className="text-gray-400 mb-8 font-bold uppercase tracking-widest text-[11px]">We couldn't find the product you're looking for.</p>
        <Link to="/" className="bg-[#14052b] text-white font-black text-xs px-10 py-5 rounded-xl hover:scale-105 transition-all tracking-widest uppercase inline-block">
          Go Home
        </Link>
      </main>
    );
  }

  const relatedProducts = getProductsByCategory(product.category).filter((p) => p.id !== product.id).slice(0, 4);
  const inStock = product.stock > 0;

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  const AccordionItem = ({ id, title, children }: { id: string, title: string, children: React.ReactNode }) => {
    const isOpen = openAccordion === id;
    return (
      <div className="border-b border-gray-100 last:border-0 font-outfit">
        <button
          onClick={() => setOpenAccordion(isOpen ? null : id)}
          className="w-full py-6 flex justify-between items-center group"
        >
          <span className="text-[13px] font-black uppercase tracking-[0.2em] text-[#14052b] group-hover:text-[#ae9efd] transition-colors">{title}</span>
          <ChevronDown size={16} className={`text-gray-300 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#ae9efd]' : ''}`} />
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pb-8 text-[13px] text-gray-500 leading-relaxed font-medium">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const highlights = [
    { Icon: Laptop, title: 'Laptop Sleeve', desc: 'Secure padded pocket for up to 15.6" devices.' },
    { Icon: Sparkles, title: 'Stylish yet Functional', desc: 'Minimalist aesthetic with high-performance utility.' },
    { Icon: Briefcase, title: 'Easy access Pockets', desc: 'Quick-access front compartment for essentials.' },
    { Icon: Feather, title: 'Premium Fabric', desc: 'Water-resistant luxury nylon construction.' },
    { Icon: ShieldCheck, title: '12 Month Warranty', desc: 'Peace of mind with our quality guarantee.' },
    { Icon: Maximize, title: 'Spacious - 2 Compartment', desc: 'Optimized organization for daily travel.' },
    { Icon: TramFront, title: 'Trolley Sleeve', desc: 'Easily slides onto luggage handles for travel convenience.' },
  ];

  return (
    <main className="bg-white min-h-screen font-outfit pt-8">
      <div className="container mx-auto px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* Left Column: Gallery */}
          <div className="lg:col-span-7">
            <div className="sticky top-32 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="aspect-square bg-white border border-gray-50 rounded-[3rem] p-12 flex items-center justify-center relative shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)]"
              >
                <img
                  src={product.images[selectedImage] || product.image}
                  alt={product.name}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
                <button className="absolute top-10 right-10 p-4 bg-white shadow-xl rounded-full text-gray-300 hover:text-red-500 transition-all border border-gray-50">
                  <Heart size={20} />
                </button>
              </motion.div>

              <div className="flex gap-4 pb-4 overflow-x-auto no-scrollbar">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-24 h-24 rounded-2xl border-2 transition-all p-3 shrink-0 bg-white ${selectedImage === idx ? 'border-[#ae9efd] shadow-lg' : 'border-gray-50 hover:border-gray-200'}`}
                  >
                    <img src={img} alt="Thumb" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Info */}
          <div className="lg:col-span-12 xl:col-span-5 space-y-12">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold text-[#14052b] leading-[1.1] tracking-tight">{product.name}</h1>

              <div className="flex items-center gap-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} />
                  ))}
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">{product.reviews} reviews</span>
              </div>

              <div className="flex items-baseline gap-6 border-t border-gray-50 pt-8">
                <span className="text-4xl font-black text-[#14052b] tracking-tighter italic">{formatPrice(product.price)}</span>
                <span className="text-xl text-gray-300 line-through font-black italic tracking-tighter">{formatPrice(product.originalPrice)}</span>
              </div>

            </div>

            {/* Actions */}
            <div className="flex items-center gap-6">
              <div className="h-14 bg-gray-50 rounded-xl flex items-center border border-gray-100 overflow-hidden">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-12 h-full flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-400"><Minus size={16} /></button>
                <span className="w-12 text-center font-black text-lg">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="w-12 h-full flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-400"><Plus size={16} /></button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className="flex-1 h-14 bg-[#14052b] text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-xl shadow-[0_20px_40px_-10px_rgba(20,5,43,0.3)] hover:scale-[1.02] transition-all active:scale-98 disabled:grayscale disabled:opacity-50"
              >
                Add to Cart
              </button>
            </div>

            {/* Accordions */}
            <div className="pt-12">
              <AccordionItem id="highlight" title="Highlight">
                <ul className="space-y-8 pt-4">
                  {highlights.map((h, i) => (
                    <li key={i} className="flex gap-6 group">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-[#ae9efd] group-hover:bg-[#ae9efd]/10 transition-all shrink-0">
                        <h.Icon size={22} strokeWidth={1.5} />
                      </div>
                      <div className="space-y-1 py-1">
                        <h4 className="font-black text-[#14052b] uppercase text-[11px] tracking-widest">{h.title}</h4>
                        <p className="text-[12px] text-gray-400 leading-relaxed max-w-sm">{h.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </AccordionItem>

              <AccordionItem id="description" title="Description">
                <p>{product.description}</p>
              </AccordionItem>

              <AccordionItem id="size" title="Size and Dimension">
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="p-4 bg-gray-50 rounded-xl">
                      <span className="block text-[9px] font-black uppercase text-gray-400 tracking-widest mb-1">{key}</span>
                      <span className="block text-[13px] font-bold text-[#14052b]">{val as string}</span>
                    </div>
                  ))}
                </div>
              </AccordionItem>

              <AccordionItem id="additional" title="Additional Info">
                <p>Weight: {product.specifications.weight || 'N/A'}</p>
                <p>Material: Premium Nylon</p>
                <p>SKU: {product.sku}</p>
              </AccordionItem>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-40 pt-20 border-t border-gray-100">
            <div className="flex justify-between items-end mb-16">
              <div>

                <h2 className="text-4xl font-black uppercase tracking-tighter text-[#14052b]">You May Also Like</h2>
              </div>
              <Link to={`/${product.category}`} className="text-[11px] font-black uppercase tracking-widest text-[#14052b] border-b-2 border-[#14052b] pb-1 hover:text-[#ae9efd] hover:border-[#ae9efd] transition-all">View All</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
