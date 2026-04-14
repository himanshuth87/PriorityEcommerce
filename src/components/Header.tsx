import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, ShoppingCart, ChevronDown, Menu, X, LogOut, LayoutDashboard, Heart, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface NavItemProps {
  title: string;
  to: string;
  items?: { label: string; slug: string }[];
}

const NavItem = ({ title, to, items }: NavItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <li className="relative group" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <Link
        className="h-16 flex items-center gap-1.5 px-4 text-[13px] font-semibold font-outfit tracking-[0.15em] text-white hover:text-white/70 transition-all duration-300 relative border-b-4 border-transparent hover:border-white uppercase"
        to={to}
      >
        {title}
        {items && <ChevronDown size={12} className={`opacity-40 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />}
      </Link>

      <AnimatePresence>
        {isOpen && items && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-[90%] left-0 w-max min-w-[240px] bg-white shadow-2xl z-50 rounded-xl overflow-hidden border border-gray-100 p-2"
          >
            {items.map((item) => (
              <Link
                key={item.slug}
                to={`/${item.slug}`}
                className="block px-5 py-3 text-[11px] font-semibold font-outfit tracking-widest text-priority-blue hover:text-black hover:bg-gray-50 rounded-lg transition-all uppercase"
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
};

export const Header = ({ onSearchOpen }: { onSearchOpen: () => void }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { itemCount, toggleCart } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    const dark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    setIsDarkMode(dark);
  };

  const navData = [
    {
      title: 'BACKPACKS',
      to: '/backpacks',
      items: [
        { label: 'College Backpacks', slug: 'college-backpacks' },
        { label: 'School Backpacks', slug: 'school-backpacks' },
        { label: 'Laptop/Office Backpacks', slug: 'laptop-backpacks' },
        { label: 'Trekking Backpacks', slug: 'trekking-backpacks' },
      ]
    },
    {
      title: 'LUGGAGE',
      to: '/luggage',
      items: [
        { label: 'Soft Shell', slug: 'soft-luggage' },
        { label: 'Hard Shell', slug: 'hard-luggage' },
      ]
    },
    { title: 'ACCESSORIES', to: '/accessories' },
    { title: 'PRIORITY JUNIOR', to: '/junior' },
    { title: 'PREMIUM Collection', to: '/premium' },
  ];

  return (
    <header className={`sticky top-0 left-0 right-0 z-50 transition-all duration-[0.8s] h-16 bg-[var(--color-nav-bg)] ${isScrolled ? 'shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md' : ''
      }`}>
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-full flex justify-between items-center text-white">

        <div className="flex-1 flex items-center">
          <Link to="/" className="flex items-center">
            <img
              src="/nav bar.png"
              alt="Priority"
              className="w-[140px] h-auto"
            />
          </Link>
        </div>

        <nav className="hidden lg:block">
          <ul className="flex items-center">
            {navData.map((nav) => <NavItem key={nav.title} {...nav} />)}
          </ul>
        </nav>

        <div className="flex-1 flex items-center justify-end gap-3 md:gap-6 font-outfit">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="hidden md:flex p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            onClick={onSearchOpen}
            className="hidden xl:flex items-center gap-3 px-6 py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/15 hover:border-white/30 transition-all text-white/60 hover:text-white"
          >
            <Search size={14} />
            <span className="text-[11px] font-semibold uppercase tracking-widest border-r border-white/20 pr-4">Search</span>
          </button>

          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/wishlist"
              className={`p-2 rounded-full transition-all duration-300 ${location.pathname === '/wishlist'
                ? 'bg-white text-priority-blue scale-110 shadow-lg'
                : 'text-white/80 hover:text-white hover:scale-110'}`}
            >
              <Heart size={20} fill={location.pathname === '/wishlist' ? 'currentColor' : 'none'} />
            </Link>

            {isAuthenticated ? (
              <div className="relative group">
                <Link
                  to={user?.role === 'admin' ? "/admin" : "/account"}
                  className={`flex items-center p-1 rounded-full border transition-all duration-300 ${location.pathname.startsWith('/account') || location.pathname.startsWith('/admin')
                    ? 'bg-white border-white scale-110 shadow-lg'
                    : 'bg-white/10 border-white/20 hover:bg-white/20'
                    }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold uppercase transition-colors ${location.pathname.startsWith('/account') || location.pathname.startsWith('/admin')
                    ? 'bg-priority-blue text-white'
                    : 'bg-white text-priority-blue'
                    }`}>
                    {user?.name?.charAt(0)}
                  </div>
                </Link>
                <div className="absolute top-full right-0 w-56 mt-3 bg-white shadow-2xl z-50 rounded-2xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border border-gray-100 p-2">
                  <div className="text-priority-blue">
                    <Link to={user?.role === 'admin' ? "/admin" : "/account"} className="w-full flex items-center gap-3 px-6 py-4 text-[11px] font-semibold tracking-widest uppercase hover:bg-gray-50 rounded-xl transition-all">
                      <LayoutDashboard size={16} /> Admin Panel
                    </Link>
                    <button onClick={logout} className="w-full flex items-center gap-3 px-6 py-4 text-[11px] font-semibold tracking-widest uppercase text-red-500 hover:bg-red-50 rounded-xl transition-all">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className={`p-2 rounded-full transition-all duration-300 ${location.pathname === '/login'
                  ? 'bg-white text-priority-blue scale-110 shadow-lg'
                  : 'text-white/80 hover:text-white hover:scale-110'}`}
              >
                <User size={20} />
              </Link>
            )}

            <button
              onClick={() => toggleCart()}
              className={`p-2.5 rounded-full relative transition-all duration-300 hover:scale-110 active:scale-95 ${(itemCount > 0 || location.pathname === '/checkout')
                ? 'bg-white text-priority-blue scale-110 shadow-lg'
                : 'text-white/80 hover:text-white'
                }`}
            >
              <ShoppingCart size={18} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-semibold w-4 h-4 rounded-full flex items-center justify-center border-2 border-[var(--color-nav-bg)]">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <button className="lg:hidden p-2 text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }} className="fixed inset-0 z-[60] bg-[var(--color-bg-main)] text-[var(--color-text-main)] overflow-y-auto font-outfit">
            <div className="flex justify-between items-center px-5 py-4 border-b border-[var(--color-border-main)]">
              <img src="/nav bar.png" alt="Priority" className="w-[120px] h-auto dark:invert" />
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleDarkMode}
                  className="p-2.5 rounded-full border border-[var(--color-border-main)] text-[var(--color-text-muted)]"
                  aria-label="Toggle dark mode"
                >
                  {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <button onClick={() => setIsMenuOpen(false)} className="p-2.5 border border-[var(--color-border-main)] rounded-full text-[var(--color-text-main)]"><X size={20} /></button>
              </div>
            </div>
            <nav className="px-5 py-6 space-y-1">
              {navData.map((nav) => (
                <div key={nav.title}>
                  <Link to={nav.to} className="block py-3.5 text-xl font-bold uppercase tracking-tight text-[var(--color-text-main)] border-b border-[var(--color-border-main)]" onClick={() => setIsMenuOpen(false)}>{nav.title}</Link>
                  {nav.items && (
                    <div className="pl-4 py-2 flex flex-col gap-1">
                      {nav.items.map(item => (
                        <Link key={item.slug} to={`/${item.slug}`} className="py-2 text-xs font-semibold uppercase text-[var(--color-text-muted)] tracking-widest" onClick={() => setIsMenuOpen(false)}>
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
            <div className="px-5 pt-4 pb-8 border-t border-[var(--color-border-main)]">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <Link to={user?.role === 'admin' ? "/admin" : "/account"} className="w-full bg-priority-blue text-white py-4 rounded-2xl text-[11px] font-semibold uppercase tracking-widest text-center block" onClick={() => setIsMenuOpen(false)}>My Account</Link>
                  <button onClick={() => { logout(); setIsMenuOpen(false); }} className="w-full border border-red-200 text-red-500 py-4 rounded-2xl text-[11px] font-semibold uppercase tracking-widest text-center block">Logout</button>
                </div>
              ) : (
                <Link to="/login" className="w-full bg-priority-blue text-white py-4 rounded-2xl text-[11px] font-semibold uppercase tracking-widest text-center block" onClick={() => setIsMenuOpen(false)}>Member Login</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
