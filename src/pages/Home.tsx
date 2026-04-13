import React, { useState, useRef, useEffect } from 'react';
import { ProductCard } from '../components/ProductCard';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, ArrowRight, Truck, CreditCard, ShieldCheck, PackageCheck } from 'lucide-react';
import { CATEGORIES, getProductsByCategory, getBestSellers, formatPrice } from '../constants/products';
import { AnimatePresence, motion } from 'motion/react';
import type { Product } from '../types';

const BACKPACK_TABS = [
  { id: 'college-backpacks', label: 'College Backpack' },
  { id: 'school-backpacks', label: 'School Backpack' },
  { id: 'laptop-backpacks', label: 'Laptop Backpack' },
  { id: 'trekking-backpacks', label: 'Trekking Backpack' },
] as const;

const HERO_IMAGES = [
  '/Creatives/hero-main.jpg',
  '/Creatives/editorial-1.jpg',
  '/Creatives/editorial-2.jpg',
  '/Creatives/editorial-3.jpg',
  '/Creatives/editorial-4.jpg',
  '/Creatives/editorial-5.jpg',
];

const IMG = {
  banner: '/Category/Artboard 1 1.png',
  catBackpacks: '/Category/Backpack.png',
  catLuggage: '/Category/Travelling Bag.png',
  catAccessories: '/Category/Accessories.png',
  refPoster: '/Category/ref.png',
};

export const Home = () => {
  const [activeTab, setActiveTab] = useState<string>('college-backpacks');
  const [currentHero, setCurrentHero] = useState(0);
  const tabProducts = getProductsByCategory(activeTab);
  const bestSellers = getBestSellers();
  const tabCategory = CATEGORIES.find((c) => c.slug === activeTab);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bestSellersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const nextHero = () => setCurrentHero((prev) => (prev + 1) % HERO_IMAGES.length);
  const prevHero = () => setCurrentHero((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);

  return (
    <main className="font-outfit">
      {/* Hero Section */}
      <section className="relative w-full aspect-[4/5] md:aspect-[16/9] bg-[var(--color-bg-main)] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentHero}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <div
              className="absolute inset-0 scale-110 blur-3xl opacity-40 brightness-50"
              style={{
                backgroundImage: `url(${HERO_IMAGES[currentHero]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            <img
              alt="Background"
              className="w-full h-full object-contain relative z-10"
              src={HERO_IMAGES[currentHero]}
              referrerPolicy="no-referrer"
              loading="eager"
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-6 z-20">
          <button onClick={prevHero} className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-white/10 transition-all text-white">
            <ChevronLeft size={20} />
          </button>
          <div className="flex gap-2.5">
            {HERO_IMAGES.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === currentHero ? 'w-10 bg-priority-blue' : 'w-2 bg-white/30'}`} />
            ))}
          </div>
          <button onClick={nextHero} className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-white/10 transition-all text-white">
            <ChevronRight size={20} />
          </button>
        </div>
      </section>

      {/* Main Categories */}
      <section className="container mx-auto px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { to: '/backpacks', label: 'Backpacks', img: IMG.catBackpacks },
            { to: '/luggage', label: 'Luggage', img: IMG.catLuggage },
            { to: '/accessories', label: 'Accessories', img: IMG.catAccessories },
          ].map((cat) => (
            <Link 
              key={cat.label} 
              to={cat.to} 
              className="group relative h-[560px] rounded-[3rem] overflow-hidden transition-all duration-700 hover:-translate-y-3 shadow-2xl bg-gray-100"
            >
              <img 
                src={cat.img} 
                alt={cat.label} 
                className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-700" />
              <div className="absolute bottom-10 right-10 w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-2xl translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <ArrowRight size={24} className="text-gray-900" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Editorial Banner */}
      <section className="bg-banner-blue text-white py-24 relative overflow-hidden">
        <div className="container mx-auto px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2">
              <img src={IMG.banner} alt="Style" className="rounded-[3rem] shadow-2xl w-full h-auto" />
            </div>
            <div className="md:w-1/2 space-y-6">
              <span className="text-[16px] font-semibold uppercase tracking-[0.5em] text-white/60">New Arrival</span>
              <h2 className="text-4xl md:text-7xl font-semibold leading-none uppercase tracking-tighter italic">Ready for<br />Your Journey</h2>
              <div className="flex gap-6 pt-6">
                <Link to="/women" className="text-xs font-semibold uppercase tracking-widest border-b-2 border-white pb-1 hover:opacity-70 transition-all">Shop For Women</Link>
                <Link to="/men" className="text-xs font-semibold uppercase tracking-widest border-b-2 border-white pb-1 hover:opacity-70 transition-all">Shop For Men</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Tabs Section */}
      <section className="pt-24 pb-12 bg-white">
        <div className="container mx-auto px-8">
          <div className="flex justify-center flex-wrap gap-8 mb-16 border-b border-gray-100 pb-1">
            {BACKPACK_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 text-[11px] font-semibold uppercase tracking-[0.3em] transition-all relative ${activeTab === tab.id ? 'text-priority-blue' : 'text-gray-300 hover:text-gray-500'}`}
              >
                {tab.label}
                {activeTab === tab.id && <motion.div layoutId="home-tab-line" className="absolute bottom-0 left-0 right-0 h-1 bg-priority-blue rounded-full" />}
              </button>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row items-start gap-8">
            {tabCategory && (
              <div className="lg:w-[450px] shrink-0 h-[520px] rounded-[3rem] overflow-hidden relative group" style={{ backgroundColor: tabCategory.bgColor }}>
                <div className="absolute inset-0 p-10 z-10 flex flex-col justify-end">
                  <h3 className="text-4xl font-semibold text-white uppercase italic tracking-tighter leading-none mb-4">{tabCategory.subtitle}</h3>
                </div>
                <img src={IMG.refPoster} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            )}

            <div className="flex-1 relative min-w-0 group/tabs">
              <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between pointer-events-none z-10">
                <button
                  onClick={scrollLeft}
                  className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-gray-900 hover:bg-gray-50 border border-gray-200 shadow-xl pointer-events-auto transition-all -translate-x-6 active:scale-95 hover:-translate-x-8"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={scrollRight}
                  className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-gray-900 hover:bg-gray-50 border border-gray-200 shadow-xl pointer-events-auto transition-all translate-x-6 active:scale-95 hover:translate-x-8"
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              <div ref={scrollRef} className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-6">
                {tabProducts.map(p => (
                  <div key={p.id} className="min-w-[300px] snap-start">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="pb-8 pt-12 bg-white overflow-hidden">
        <div className="container mx-auto px-8">
          <div className="flex flex-col items-center mb-16">
            <h2 className="text-[24pxs] font-semibold uppercase tracking-[0.5em] text-gray-900 mb-2">Shop Best Sellers</h2>
          </div>

          <div className="relative group/carousel">
            <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between pointer-events-none z-10">
              <button
                onClick={() => bestSellersRef.current?.scrollBy({ left: -400, behavior: 'smooth' })}
                className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-gray-900 hover:bg-gray-50 border border-gray-200 shadow-xl pointer-events-auto transition-all -translate-x-6 active:scale-95 hover:-translate-x-8"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() => bestSellersRef.current?.scrollBy({ left: 400, behavior: 'smooth' })}
                className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-gray-900 hover:bg-gray-50 border border-gray-200 shadow-xl pointer-events-auto transition-all translate-x-6 active:scale-95 hover:translate-x-8"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            <div
              ref={bestSellersRef}
              className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-10"
              style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
            >
              {getBestSellers().map((product) => (
                <Link key={product.id} to={`/product/${product.id}`} className="group block shrink-0 w-[280px] md:w-[320px]">
                  <div className="aspect-[4/5] bg-[#f8f8f8] rounded-3xl overflow-hidden flex items-center justify-center p-8 mb-6 transition-all group-hover:bg-[#f3f3f3] relative shadow-sm">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.01] transition-colors"></div>
                  </div>
                  <div className="space-y-1 px-2">
                    <h3 className="text-[14px] font-semibold text-[#14052b] leading-tight group-hover:text-priority-blue transition-colors line-clamp-2">{product.name}</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-[14px] font-semibold text-priority-blue">₹ {product.price.toLocaleString()}</span>
                      <span className="text-[11px] font-semibold text-gray-300 line-through decoration-1 opacity-60">₹ {product.originalPrice.toLocaleString()}</span>
                      <span className="text-[11px] font-semibold text-red-400 uppercase tracking-tighter">{product.discount} OFF</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="pt-20 pb-32 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-8">
          <div className="flex flex-col items-center mb-20">
            <p className="text-3xl font-semibold text-[#14052b] uppercase tracking-tighter">Why Shop With Us</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16">
            {[
              { Icon: Truck, label: 'Fast Delivery', desc: 'Secure shipping across India' },
              { Icon: CreditCard, label: 'Safe Payment', desc: 'UPI and Card ready' },
              { Icon: ShieldCheck, label: 'Brand Promise', desc: 'Certified priority items' },
              { Icon: PackageCheck, label: 'Quality Unit', desc: '8-stage strength testing' }
            ].map((f, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl shadow-priority-blue/5 border border-gray-100 mb-2 text-priority-blue">
                  <f.Icon size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em]">{f.label}</h3>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};
