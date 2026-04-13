import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Footer = () => {
  const { isAuthenticated, user } = useAuth();
  return (
    <footer className="bg-priority-dark text-gray-300 py-10 md:py-12 pb-28 lg:pb-12 text-sm font-outfit">
      <div className="container mx-auto px-5 md:px-10 grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1 break-inside-avoid">
          <Link to="/" className="mb-8 block">
            <img src="/Priority Logo-02.png" alt="Priority Bags" className="h-8 w-auto brightness-0 invert" />
          </Link>
          <p className="text-[10px] font-semibold tracking-[0.3em] text-[#ae9efd] uppercase mb-4">The Digital Atelier</p>
          <p className="text-xs text-gray-400 leading-relaxed font-medium">
            Premium bags and luggage for every journey. Quality craftsmanship since 1999. Engineered for movement.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6 uppercase text-[10px] tracking-[0.2em]">Quick Links</h4>
          <ul className="space-y-3">
            <li><Link className="hover:text-white transition-colors text-xs font-medium" to="/backpacks">Backpacks</Link></li>
            <li><Link className="hover:text-white transition-colors text-xs font-medium" to="/luggage">Luggage</Link></li>
            <li><Link className="hover:text-white transition-colors text-xs font-medium" to="/accessories">Accessories</Link></li>
            <li><Link className="hover:text-white transition-colors text-xs font-medium" to="/junior">Priority Junior</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6 uppercase text-[10px] tracking-[0.2em]">Company</h4>
          <ul className="space-y-3">
            <li><Link className="hover:text-white transition-colors text-xs font-medium" to="/about">About Us</Link></li>
            <li><Link className="hover:text-white transition-colors text-xs font-medium" to="/team">Our Team</Link></li>
            <li><Link className="hover:text-white transition-colors text-xs font-medium" to="/careers">Careers</Link></li>
            <li><Link className="hover:text-white transition-colors text-xs font-medium" to={isAuthenticated ? (user?.role === 'admin' ? "/admin" : "/account") : "/login"}>Account</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6 uppercase text-[10px] tracking-[0.2em]">Privacy Policy</h4>
          <ul className="space-y-3">
            <li><Link className="hover:text-white transition-colors text-xs font-medium" to="/shipping">Shipping Policy</Link></li>
            <li><Link className="hover:text-white transition-colors text-xs font-medium" to="/returns">Returns & Refunds</Link></li>
            <li><Link className="hover:text-white transition-colors text-xs font-medium" to="/privacy">Privacy Notice</Link></li>
            <li><Link className="hover:text-white transition-colors text-xs font-medium" to="/terms">Terms of Service</Link></li>
          </ul>
        </div>

        <div className="col-span-2 md:col-span-1">
          <h4 className="text-white font-semibold mb-6 uppercase text-[10px] tracking-[0.2em]">Contact Us</h4>
          <address className="not-italic space-y-5 text-xs font-medium">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[#ae9efd]" />
              <span className="text-gray-400 leading-relaxed">High Spirit Commercial Ventures Pvt. Ltd.<br />Universal Majestic Building, Chembur West <br />Mumbai 400043 </span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 shrink-0 text-[#ae9efd]" />
              <a href="tel:+917400459254" className="text-gray-400 hover:text-white transition-colors">+91 74004 59254</a>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 shrink-0 text-[#ae9efd]" />
              <a href="mailto:info@prioritybags.in" className="text-gray-400 hover:text-white transition-colors">info@prioritybags.in</a>
            </div>
          </address>
        </div>
      </div>

      <div className="container mx-auto px-5 md:px-10 mt-10 md:mt-16 pt-6 md:pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-6">
        <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest">&copy; {new Date().getFullYear()} High Spirit Commercial Ventures Pvt. Ltd. All rights reserved.</p>
        <div className="flex items-center gap-8">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors text-[10px] font-semibold uppercase tracking-widest">Instagram</a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors text-[10px] font-semibold uppercase tracking-widest">Facebook</a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors text-[10px] font-semibold uppercase tracking-widest">YouTube</a>
        </div>
      </div>
    </footer>
  );
};
