import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProductById, formatPrice } from '../constants/products';
import { Star, Plus, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import type { Product } from '../types';

interface ProductCardProps {
  product?: Product;
  id?: string;
  name?: string;
  price?: string | number;
  rating?: number;
  reviews?: number;
  image?: string;
  badge?: string;
  isNew?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = (props) => {
  const { addItem } = useCart();

  const product = props.product || (props.id ? getProductById(props.id) : undefined);

  const id = product?.id || props.id || '1';
  const name = product?.name || props.name || '';
  const price = product?.price || (typeof props.price === 'string' ? parseFloat(props.price) : props.price) || 0;
  const originalPrice = product?.originalPrice;
  const image = product?.image || props.image || '';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product) {
      addItem(product);
    }
  };

  return (
    <div className="group flex flex-col font-outfit">
      {/* Product Image Container */}
      <div className="relative aspect-square bg-[#f9f9f9] overflow-hidden border border-gray-100 rounded-sm">
        <Link to={`/product/${id}`} className="block h-full w-full">
          <div className="h-full w-full flex justify-center items-center p-8">
            <img
              alt={name}
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
              src={image}
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          </div>
        </Link>

        {/* Hover Action: Quick Add */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-0 left-0 right-0 h-10 bg-black text-white text-[10px] font-semibold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-full group-hover:translate-y-0"
        >
          Add to Cart
        </button>

        {/* Wishlist Icon */}
        <button className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
          <Heart size={18} />
        </button>
      </div>

      {/* Product Information */}
      <div className="mt-4 flex flex-col items-center text-center px-2">
        <Link to={`/product/${id}`} className="block">
          <h4 className="font-semibold text-[13px] text-gray-900 uppercase tracking-wider mb-1 group-hover:text-priority-blue transition-colors line-clamp-1">{name}</h4>
        </Link>
        <div className="flex items-center gap-3">
          <span className="font-semibold text-[13px] text-gray-900">Rs. {price.toLocaleString()}</span>
          {originalPrice && (
            <span className="text-gray-400 line-through text-[11px] font-semibold">Rs. {originalPrice.toLocaleString()}</span>
          )}
        </div>
      </div>
    </div>
  );
};
