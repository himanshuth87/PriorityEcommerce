import React, { useState, useRef, useEffect, useCallback } from 'react';
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

  const nextHero = useCallback(() => setCurrentHero((prev) => (prev + 1) % HERO_IMAGES.length), []);
  const prevHero = useCallback(() => setCurrentHero((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length), []);

  // Touch swipe for hero
  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? nextHero() : prevHero(); }
  };

  return (
    <main className="font-outfit overflow-x-hidden">
      {/* Hero Section */}
      <section
        className="relative w-full aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/9] bg-black overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentHero}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img
              alt="Priority Premium Collection"
              className="w-full h-full object-cover object-center relative z-10"
              src={HERO_IMAGES[currentHero]}
              referrerPolicy="no-referrer"
              loading="eager"
            />
            <div className="absolute inset-x-0 bottom-0 h-32 md:h-40 bg-gradient-to-t from-black/50 to-transparent z-20" />
          </motion.div>
        </AnimatePresence>

        {/* Desktop arrow buttons */}
        <button onClick={prevHero} className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 border border-white/20 rounded-full items-center justify-center hover:bg-white/10 backdrop-blur-sm transition-all text-white">
          <ChevronLeft size={24} />
        </button>
        <button onClick={nextHero} className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 border border-white/20 rounded-full items-center justify-center hover:bg-white/10 backdrop-blur-sm transition-all text-white">
          <ChevronRight size={24} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3 z-30">
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentHero(i)}
              className={`h-1.5 md:h-2 rounded-full transition-all duration-500 ${i === currentHero ? 'w-8 md:w-10 bg-white' : 'w-1.5 md:w-2 bg-white/40 hover:bg-white/60'}`}
            />
          ))}
        </div>
      </section>

      {/* Main Categories */}
      <section className="container mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-24">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-10">
          {[
            { to: '/backpacks', label: 'Backpacks', img: IMG.catBackpacks },
            { to: '/luggage', label: 'Luggage', img: IMG.catLuggage },
            { to: '/accessories', label: 'Accessories', img: IMG.catAccessories },
          ].map((cat, i) => (
            <Link
              key={cat.label}
              to={cat.to}
              className={`group relative h-[220px] sm:h-[350px] md:h-[560px] rounded-2xl md:rounded-[3rem] overflow-hidden transition-all duration-700 hover:-translate-y-3 shadow-lg md:shadow-2xl bg-gray-100 ${i === 2 ? 'col-span-2 md:col-span-1 h-[180px] sm:h-[350px] md:h-[560px]' : ''}`}
            >
              <img
                src={cat.img}
                alt={cat.label}
                className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent md:from-transparent md:bg-black/0 group-hover:bg-black/10 transition-colors duration-700" />
              <span className="absolute bottom-4 left-4 text-white text-xs font-bold uppercase tracking-widest md:hidden">{cat.label}</span>
              <div className="absolute bottom-4 right-4 md:bottom-10 md:right-10 w-10 h-10 md:w-14 md:h-14 rounded-full bg-white flex items-center justify-center shadow-2xl md:translate-y-4 md:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <ArrowRight size={18} className="text-gray-900 md:hidden" /><ArrowRight size={24} className="text-gray-900 hidden md:block" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Editorial Banner */}
      <section className="bg-banner-blue text-white py-12 md:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="md:w-1/2">
              <img src={IMG.banner} alt="Style" className="rounded-2xl md:rounded-[3rem] shadow-2xl w-full h-auto" />
            </div>
            <div className="md:w-1/2 space-y-4 md:space-y-6 text-center md:text-left">
              <span className="text-[11px] md:text-[16px] font-semibold uppercase tracking-[0.5em] text-white/60">New Arrival</span>
              <h2 className="text-3xl md:text-7xl font-semibold leading-none uppercase tracking-tighter italic">Ready for<br />Your Journey</h2>
              <div className="flex justify-center md:justify-start gap-4 md:gap-6 pt-4 md:pt-6">
                <Link to="/women" className="text-[10px] md:text-xs font-semibold uppercase tracking-widest border-b-2 border-white pb-1 hover:opacity-70 transition-all">Shop For Women</Link>
                <Link to="/men" className="text-[10px] md:text-xs font-semibold uppercase tracking-widest border-b-2 border-white pb-1 hover:opacity-70 transition-all">Shop For Men</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Tabs Section */}
      <section className="pt-10 md:pt-24 pb-12 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex overflow-x-auto no-scrollbar gap-4 md:gap-8 md:justify-center md:flex-wrap mb-8 md:mb-16 border-b border-gray-100 pb-1">
            {BACKPACK_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 md:pb-4 text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.15em] md:tracking-[0.3em] transition-all relative whitespace-nowrap ${activeTab === tab.id ? 'text-priority-blue' : 'text-gray-300 hover:text-gray-500'}`}
              >
                {tab.label}
                {activeTab === tab.id && <motion.div layoutId="home-tab-line" className="absolute bottom-0 left-0 right-0 h-1 bg-priority-blue rounded-full" />}
              </button>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row items-start gap-6 md:gap-8">
            {tabCategory && (
              <div className="w-full lg:w-[450px] shrink-0 h-[200px] md:h-[520px] rounded-2xl md:rounded-[3rem] overflow-hidden relative group" style={{ backgroundColor: tabCategory.bgColor }}>
                <div className="absolute inset-0 p-6 md:p-10 z-10 flex flex-col justify-end">
                  <h3 className="text-xl md:text-4xl font-semibold text-white uppercase italic tracking-tighter leading-none mb-2 md:mb-4">{tabCategory.subtitle}</h3>
                </div>
                <img src={IMG.refPoster} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            )}

            <div className="flex-1 relative min-w-0 group/tabs overflow-hidden md:overflow-visible">
              <div className="absolute top-1/2 -translate-y-1/2 w-full hidden md:flex justify-between pointer-events-none z-10">
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

              <div ref={scrollRef} className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-6 touch-pan-x">
                {tabProducts.map(p => (
                  <div key={p.id} className="min-w-[200px] md:min-w-[300px] snap-start">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="pb-8 pt-10 md:pt-12 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col items-center mb-8 md:mb-16">
            <h2 className="text-sm md:text-xl font-semibold uppercase tracking-[0.3em] md:tracking-[0.5em] text-gray-900 mb-2">Shop Best Sellers</h2>
          </div>

          <div className="relative group/carousel overflow-hidden md:overflow-visible">
            <div className="absolute top-1/2 -translate-y-1/2 w-full hidden md:flex justify-between pointer-events-none z-10">
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
              className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-10 px-1 sm:px-4 touch-pan-x"
              style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
            >
              {getBestSellers().map((product) => (
                <div key={product.id} className="min-w-[180px] sm:min-w-[240px] md:min-w-[320px] snap-start">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="pt-10 pb-8 md:pt-20 md:pb-32 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col items-center mb-10 md:mb-20">
            <p className="text-lg md:text-3xl font-semibold text-[#14052b] uppercase tracking-tighter">Why Shop With Us</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-16">
            {[
              { Icon: Truck, label: 'Fast Delivery', desc: 'Secure shipping across India' },
              { Icon: CreditCard, label: 'Safe Payment', desc: 'UPI and Card ready' },
              { Icon: ShieldCheck, label: 'Brand Promise', desc: 'Certified priority items' },
              { Icon: PackageCheck, label: 'Quality Unit', desc: '8-stage strength testing' }
            ].map((f, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-2 md:space-y-4">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center shadow-xl shadow-priority-blue/5 border border-gray-100 mb-1 md:mb-2 text-priority-blue">
                  <f.Icon size={24} className="md:hidden" strokeWidth={1.5} /><f.Icon size={32} className="hidden md:block" strokeWidth={1.5} />
                </div>
                <h3 className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.1em] md:tracking-[0.2em]">{f.label}</h3>
                <p className="text-[9px] md:text-[10px] font-semibold text-gray-400 uppercase tracking-wider md:tracking-widest">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};
