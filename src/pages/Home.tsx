import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ProductCard } from '../components/ProductCard';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, ArrowRight, Truck, CreditCard, ShieldCheck, PackageCheck } from 'lucide-react';
import { CATEGORIES, getProductsByCategory, getBestSellers } from '../constants/products';
import { AnimatePresence, motion } from 'motion/react';

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

// ─── Hero Slider (isolated component so slide changes don't re-render the whole page) ───
const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const isPausedRef = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isPausedRef.current) setCurrent((p) => (p + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((p) => (p + 1) % HERO_SLIDES.length);
  const prev = () => setCurrent((p) => (p - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <section
      className="relative w-full aspect-[16/9] bg-black overflow-hidden"
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') isPausedRef.current = true; }}
      onPointerLeave={(e) => { if (e.pointerType === 'mouse') isPausedRef.current = false; }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <img
            alt="Priority Premium Collection"
            className="w-full h-full object-cover object-center"
            src={HERO_SLIDES[current].src}
            loading="eager"
          />
          <div className="absolute inset-x-0 bottom-0 h-28 md:h-32 bg-gradient-to-t from-black/55 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Desktop arrows */}
      <button onClick={prev} className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-30 w-14 h-14 border border-white/30 rounded-full items-center justify-center hover:bg-white hover:text-gray-900 backdrop-blur-sm transition-all duration-300 text-white group shadow-xl">
        <ChevronLeft size={26} className="group-hover:-translate-x-0.5 transition-transform" />
      </button>
      <button onClick={next} className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-30 w-14 h-14 border border-white/30 rounded-full items-center justify-center hover:bg-white hover:text-gray-900 backdrop-blur-sm transition-all duration-300 text-white group shadow-xl">
        <ChevronRight size={26} className="group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Mobile dots */}
      <div className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {HERO_SLIDES.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-white' : 'w-1.5 bg-white/40'}`} />
        ))}
      </div>

      {/* Desktop slide counter + progress bar */}
      <div className="hidden md:flex absolute bottom-6 inset-x-0 z-30 items-center justify-end px-8 gap-4">
        <span className="text-[11px] font-bold tabular-nums tracking-widest text-white/40">{String(current + 1).padStart(2, '0')}</span>
        <div className="w-32 h-[1.5px] bg-white/20 relative overflow-hidden rounded-full">
          <motion.div key={current} className="absolute inset-y-0 left-0 bg-white rounded-full" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 5, ease: 'linear' }} />
        </div>
        <span className="text-[11px] font-bold tabular-nums tracking-widest text-white/40">{String(HERO_SLIDES.length).padStart(2, '0')}</span>
      </div>
    </section>
  );
};

export const Home = () => {
  const [activeTab, setActiveTab] = useState<string>('college-backpacks');
  const [catFlipIndex, setCatFlipIndex] = useState(0);
  const [catFlipDir, setCatFlipDir] = useState(1);
  const catTouchRef = useRef<number | null>(null);
  const tabProducts = useMemo(() => getProductsByCategory(activeTab), [activeTab]);
  const bestSellers = useMemo(() => getBestSellers(), []);
  const tabCategory = CATEGORIES.find((c) => c.slug === activeTab);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bestSellersRef = useRef<HTMLDivElement>(null);

  const scrollRight = () => scrollRef.current?.scrollBy({ left: 320, behavior: 'smooth' });
  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -320, behavior: 'smooth' });

  const goNextCat = () => {
    if (catFlipIndex < CATS.length - 1) { setCatFlipDir(1); setCatFlipIndex(i => i + 1); }
  };
  const goPrevCat = () => {
    if (catFlipIndex > 0) { setCatFlipDir(-1); setCatFlipIndex(i => i - 1); }
  };
  const onCatTouchStart = (e: React.TouchEvent) => { catTouchRef.current = e.touches[0].clientX; };
  const onCatTouchEnd = (e: React.TouchEvent) => {
    if (catTouchRef.current === null) return;
    const diff = catTouchRef.current - e.changedTouches[0].clientX;
    if (diff > 40) goNextCat();
    else if (diff < -40) goPrevCat();
    catTouchRef.current = null;
  };

  return (
    <main className="font-outfit">
      <HeroSlider />

      {/* Mobile Categories — Book-page flip stack */}
      <section className="md:hidden py-4 px-4">
        <div
          className="relative select-none max-w-xs mx-auto"
          style={{ perspective: '1200px' }}
          onTouchStart={onCatTouchStart}
          onTouchEnd={onCatTouchEnd}
        >
          {/* Stacked cards behind for depth effect */}
          {[2, 1].map((offset) => {
            const idx = catFlipIndex + offset;
            if (idx >= CATS.length) return null;
            return (
              <div
                key={`stack-${offset}`}
                className="absolute inset-x-0 bottom-0 rounded-2xl overflow-hidden pointer-events-none"
                style={{
                  top: `${offset * 10}px`,
                  transform: `scale(${1 - offset * 0.05}) translateY(${offset * 4}px)`,
                  filter: `brightness(${0.6 - offset * 0.15})`,
                  zIndex: 10 - offset,
                  transformOrigin: 'bottom center',
                }}
              >
                <div className="relative w-full" style={{ paddingBottom: '78%' }}>
                  <img src={CATS[idx].img} alt="" className="absolute inset-0 w-full h-full object-cover bg-gray-100" />
                </div>
              </div>
            );
          })}

          {/* Active card */}
          <div style={{ position: 'relative', zIndex: 20 }}>
            <AnimatePresence mode="wait" custom={catFlipDir}>
              <motion.div
                key={catFlipIndex}
                custom={catFlipDir}
                initial={{ x: catFlipDir * 160, opacity: 0, scale: 0.95 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ x: catFlipDir * -160, opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="w-full rounded-2xl overflow-hidden shadow-2xl"
              >
                <Link to={CATS[catFlipIndex].to} className="block w-full relative" style={{ paddingBottom: '78%' }}>
                  <img src={CATS[catFlipIndex].img} alt={CATS[catFlipIndex].label} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                    <span className="text-white text-base font-black uppercase tracking-widest">{CATS[catFlipIndex].label}</span>
                    <div className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-lg shrink-0">
                      <ArrowRight size={15} className="text-gray-900" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-5 px-1">
            <button onClick={goPrevCat} disabled={catFlipIndex === 0} className="p-2 text-gray-400 disabled:opacity-20 transition-opacity">
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-2">
              {CATS.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === catFlipIndex ? 'w-6 bg-priority-blue' : 'w-1.5 bg-gray-200'}`} />
              ))}
            </div>
            <button onClick={goNextCat} disabled={catFlipIndex === CATS.length - 1} className="p-2 text-gray-400 disabled:opacity-20 transition-opacity">
              <ChevronRight size={20} />
            </button>
          </div>
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
      <section className="bg-banner-blue text-white relative" style={{ padding: '0', overflow: 'visible', zIndex: 1 }}>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-16">
            {/* Image — bleeds above and below the blue section */}
            <div className="md:w-1/2 relative" style={{ zIndex: 30, marginTop: '-60px', marginBottom: '-60px' }}>
              <img src={IMG.banner} alt="Style" className="rounded-2xl md:rounded-[3rem] shadow-2xl w-full h-auto" />
            </div>

            {/* Text column */}
            <div className="md:w-1/2 text-center md:text-left py-10 md:py-16">
              {/* NEW ARRIVAL — big bold heading at top */}
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-[0.15em] text-white mb-4 md:mb-6">
                New Arrival
              </h2>
              {/* Ready For Your Journey — watermark below */}
              <p className="text-[clamp(2rem,10vw,5rem)] font-black leading-none uppercase tracking-tighter italic text-white/15 select-none pointer-events-none">
                Ready For<br />Your Journey
              </p>
              <div className="flex justify-center md:justify-start gap-4 md:gap-6 mt-6 md:mt-8">
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
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-priority-blue rounded-full" />}
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
                className="flex gap-3 sm:gap-4 lg:gap-6 overflow-x-auto no-scrollbar snap-x snap-proximity pb-6 px-1"
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
