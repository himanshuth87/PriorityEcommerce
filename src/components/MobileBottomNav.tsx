import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingCart, User, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { useCart } from '../context/CartContext';

export const MobileBottomNav = ({ onSearchOpen }: { onSearchOpen: () => void }) => {
  const location = useLocation();
  const { itemCount, toggleCart } = useCart();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Heart, label: 'Wishlist', path: '/wishlist' },
    { icon: Search, label: 'Search', onClick: onSearchOpen },
    { icon: ShoppingCart, label: 'Cart', onClick: () => toggleCart() },
    { icon: User, label: 'Account', path: '/login' },
  ];

  return (
    <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-[400px]">
      <motion.nav 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-black/80 dark:bg-white/10 backdrop-blur-2xl border border-white/10 rounded-full py-3 px-6 shadow-2xl shadow-black/20 flex items-center justify-between"
      >
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          const content = (
            <div className="relative flex flex-col items-center">
              <Icon 
                size={20} 
                className={`transition-all duration-300 ${isActive ? 'text-white scale-110' : 'text-white/40'}`} 
              />
              {item.label === 'Cart' && itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-black">
                  {item.itemCount || itemCount}
                </span>
              )}
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute -bottom-1.5 w-1 h-1 bg-white rounded-full"
                />
              )}
            </div>
          );

          if (item.onClick) {
            return (
              <button key={index} onClick={item.onClick} className="p-2 outline-none">
                {content}
              </button>
            );
          }

          return (
            <Link key={index} to={item.path!} className="p-2">
              {content}
            </Link>
          );
        })}
      </motion.nav>
    </div>
  );
};
