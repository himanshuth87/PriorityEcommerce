import React, { useState, useRef, useEffect, useMemo } from 'react';
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

const HERO_SLIDES = [
  { src: '/Creatives/hero-main.jpg',     cta: 'Shop Campus Picks',     to: '/college-backpacks' },
  { src: '/Creatives/editorial-1.jpg',   cta: 'Shop Junior Collection', to: '/junior' },
  { src: '/Creatives/editorial-2.jpg',   cta: 'Shop Junior Collection', to: '/junior' },
  { src: '/Creatives/editorial-3.jpg',   cta: 'Shop Trekking Gear',     to: '/trekking-backpacks' },
  { src: '/Creatives/editorial-4.jpg',   cta: 'Shop Luggage',           to: '/luggage' },
  { src: '/Creatives/editorial-5.jpg',   cta: 'Shop Laptop Bags',       to: '/laptop-backpacks' },
];

const CATS = [
  { to: '/backpacks',   label: 'Backpacks',   img: '/Category/Backpack.png'       },
  { to: '/luggage',     label: 'Luggage',     img: '/Category/Travelling Bag.png' },
  { to: '/accessories', label: 'Accessories', img: '/Category/Accessories.png'    },
];

const IMG = {
  banner: '/Category/Artboard 1 1.png',
  refPoster: '/Category/ref.png',
};

export const Home = () => {
  const [activeTab, setActiveTab] = useState<string>('college-backpacks');
  const [currentHero, setCurrentHero] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(false);
  const tabProducts = useMemo(() => getProductsByCategory(activeTab), [activeTab]);
  const bestSellers = useMemo(() => getBestSellers(), []);
  const tabCategory = CATEGORIES.find((c) => c.slug === activeTab);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bestSellersRef = useRef<HTMLDivElement>(null);

  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isPausedRef.current) {
        setCurrentHero((prev) => (prev + 1) % HERO_SLIDES.length);
      }
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextHero = () => setCurrentHero((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevHero = () => setCurrentHero((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevHero();
      else if (e.key === 'ArrowRight') nextHero();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
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

  return (
    <main className="font-outfit">
      {/* Hero Section */}
      <section
        className="relative w-full aspect-[16/9] bg-black overflow-hidden"
        onPointerEnter={(e) => { if (e.pointerType === 'mouse') setIsPaused(true); }}
        onPointerLeave={(e) => { if (e.pointerType === 'mouse') setIsPaused(false); }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentHero}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <img
              alt="Priority Premium Collection"
              className="w-full h-full object-cover object-center z-10 relative"
              src={HERO_SLIDES[currentHero].src}
              referrerPolicy="no-referrer"
              loading="eager"
            />
            <div className="absolute inset-x-0 bottom-0 h-28 md:h-32 bg-gradient-to-t from-black/55 to-transparent z-20" />
          </motion.div>
        </AnimatePresence>

        {/* Desktop arrows — larger, fill on hover */}
        <button
          onClick={prevHero}
          className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-30 w-14 h-14 border border-white/30 rounded-full items-center justify-center hover:bg-white hover:text-gray-900 backdrop-blur-sm transition-all duration-300 text-white group shadow-xl"
        >
          <ChevronLeft size={26} className="group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <button
          onClick={nextHero}
          className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-30 w-14 h-14 border border-white/30 rounded-full items-center justify-center hover:bg-white hover:text-gray-900 backdrop-blur-sm transition-all duration-300 text-white group shadow-xl"
        >
          <ChevronRight size={26} className="group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Mobile dots */}
        <div className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
          {HERO_SLIDES.map((_, i: number) => (
            <button
              key={i}
              onClick={() => setCurrentHero(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${i === currentHero ? 'w-8 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'}`}
            />
          ))}
        </div>

        {/* Desktop bottom bar — slide counter + animated progress */}
        <div className="hidden md:flex absolute bottom-6 inset-x-0 z-30 items-center justify-end px-8 gap-4">
          <span className="text-[11px] font-bold tabular-nums tracking-widest text-white/40">
            {String(currentHero + 1).padStart(2, '0')}
          </span>
          <div className="w-32 h-[1.5px] bg-white/20 relative overflow-hidden rounded-full">
            <motion.div
              key={currentHero}
              className="absolute inset-y-0 left-0 bg-white rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 5, ease: 'linear' }}
            />
          </div>
          <span className="text-[11px] font-bold tabular-nums tracking-widest text-white/40">
            {String(HERO_SLIDES.length).padStart(2, '0')}
          </span>
        </div>
      </section>

      {/* Mobile Categories — Hotstar snippet scroll */}
      <section className="md:hidden py-8">
        <div
          className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory px-4 pb-2"
          style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x' }}
        >
          {CATS.map((cat) => (
            <Link
              key={cat.label}
              to={cat.to}
              style={{ width: '72vw', height: '85vw', flexShrink: 0 }}
              className="relative rounded-2xl overflow-hidden snap-start bg-gray-100 active:scale-[0.97] transition-transform duration-150"
            >
              <img src={cat.img} alt={cat.label} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <span className="text-white text-sm font-black uppercase tracking-widest">{cat.label}</span>
                <div className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-lg shrink-0">
                  <ArrowRight size={15} className="text-gray-900" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Desktop Categories — 3-column grid */}
      <section className="hidden md:block container mx-auto px-6 lg:px-8 py-24">
        <div className="grid grid-cols-3 gap-10">
          {CATS.map((cat) => (
            <Link
              key={cat.label}
              to={cat.to}
              className="group relative h-[560px] rounded-[3rem] overflow-hidden transition-all duration-700 hover:-translate-y-3 shadow-2xl bg-gray-100"
            >
              <img src={cat.img} alt={cat.label} className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-700" />
              <div className="absolute bottom-10 right-10 w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-2xl translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <ArrowRight size={24} className="text-gray-900" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Editorial Banner */}
      <section className="bg-banner-blue text-white py-6 md:py-12 relative">
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="md:w-1/2 -mb-12 md:-mb-20 relative z-20">
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

          {/* Layout: poster on desktop only, full-width product scroll on mobile */}
          <div className="flex items-start gap-8">
            {/* Poster — desktop only */}
            {tabCategory && (
              <div className="hidden lg:block w-[420px] shrink-0 h-[520px] rounded-[3rem] overflow-hidden relative group" style={{ backgroundColor: tabCategory.bgColor }}>
                <div className="absolute inset-0 p-10 z-10 flex flex-col justify-end">
                  <h3 className="text-4xl font-semibold text-white uppercase italic tracking-tighter leading-none mb-4">{tabCategory.subtitle}</h3>
                </div>
                <img src={IMG.refPoster} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            )}

            {/* Product scroll — full width on mobile, flex-1 on desktop */}
            <div className="flex-1 relative min-w-0 w-full">
              {/* Desktop arrow buttons */}
              <div className="absolute top-1/2 -translate-y-1/2 w-full hidden lg:flex justify-between pointer-events-none z-10">
                <button onClick={scrollLeft} className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-gray-900 hover:bg-gray-50 border border-gray-200 shadow-xl pointer-events-auto transition-all -translate-x-6 active:scale-95 hover:-translate-x-8">
                  <ChevronLeft size={24} />
                </button>
                <button onClick={scrollRight} className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-gray-900 hover:bg-gray-50 border border-gray-200 shadow-xl pointer-events-auto transition-all translate-x-6 active:scale-95 hover:translate-x-8">
                  <ChevronRight size={24} />
                </button>
              </div>
              <div
                ref={scrollRef}
                className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-6 px-1"
                style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x' }}
              >
                {tabProducts.map(p => (
                  <div key={p.id} className="min-w-[47vw] sm:min-w-[220px] md:min-w-[240px] lg:min-w-[280px] snap-start shrink-0">
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

          <div className="relative group/carousel">
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
              className="flex gap-3 sm:gap-4 md:gap-6 overflow-x-auto no-scrollbar pb-10 px-1 sm:px-4"
              style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x' }}
            >
              {bestSellers.map((product) => (
                <div key={product.id} className="min-w-[47vw] sm:min-w-[240px] md:min-w-[280px] lg:min-w-[320px] shrink-0">
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
