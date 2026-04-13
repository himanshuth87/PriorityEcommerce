import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { getCategoryBySlug, getProductsByCategory, CATEGORIES, PRODUCTS } from '../constants/products';
import { Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Filter, ChevronRight } from 'lucide-react';

export const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [priceRange, setPriceRange] = useState<number>(10000);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [openFilters, setOpenFilters] = useState<string[]>(['categories', 'price', 'specifications']);

  const slug = category || 'backpacks';
  const currentCategory = getCategoryBySlug(slug);

  const isGenderFilter = ['men', 'women', 'kids'].includes(slug);
  const isPremiumFilter = slug === 'premium';

  const allProducts = useMemo(() => {
    if (isGenderFilter) return (PRODUCTS as Product[]).filter(p => p.gender === slug);
    if (isPremiumFilter) return (PRODUCTS as Product[]).filter(p => p.isPremium);
    
    const products = getProductsByCategory(slug);
    const subcategoryProducts = CATEGORIES
      .filter((c) => c.parentCategory === slug)
      .flatMap((c) => getProductsByCategory(c.slug));
    
    return products.length > 0 ? products as Product[] : subcategoryProducts as Product[];
  }, [slug, isGenderFilter, isPremiumFilter]);

  const filteredProducts = useMemo(() => {
    let result = allProducts.filter(product => {
      const matchesPrice = product.price <= priceRange;
      const matchesSub = selectedSubcategories.length === 0 || selectedSubcategories.includes(product.category);
      return matchesPrice && matchesSub;
    });
    
    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
    
    return result;
  }, [allProducts, priceRange, sortBy, selectedSubcategories]);

  const subcategories = useMemo(() => {
    return CATEGORIES.filter(c => c.parentCategory === slug);
  }, [slug]);

  const toggleFilter = (id: string) => {
    setOpenFilters(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const FilterSection = ({ id, title, children }: { id: string, title: string, children: React.ReactNode }) => {
    const isOpen = openFilters.includes(id);
    return (
      <div className="border-b border-gray-100 py-4">
        <button 
          onClick={() => toggleFilter(id)}
          className="w-full flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-gray-900"
        >
          {title}
          <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 pb-2">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <main className="bg-white min-h-screen font-outfit pt-8">
      {/* Category Header */}
      <div className="py-6 border-b border-gray-50">
        <div className="container mx-auto px-8">
           <h1 className="text-3xl font-black text-center uppercase tracking-[0.2em] text-[#14052b]">
             {category === 'junior' ? 'PRIORITY JUNIOR' : 
              (isGenderFilter ? `FOR ${slug}` : 
              (currentCategory ? (currentCategory.subtitle || currentCategory.title) : slug.replace('-', ' ')))}
           </h1>
        </div>
      </div>

      <div className="container mx-auto px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Filters Sidebar */}
          <aside className="lg:w-64 shrink-0 space-y-8">
            <div>
              <h3 className="text-[12px] font-black uppercase tracking-[0.2em] border-b border-gray-900 pb-2 mb-4">Filters</h3>
              
              {subcategories.length > 0 && (
                <FilterSection id="categories" title="Collection">
                  <div className="space-y-2">
                    {subcategories.map(sub => (
                      <label key={sub.slug} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={selectedSubcategories.includes(sub.slug)}
                          onChange={() => {
                            setSelectedSubcategories(prev => 
                              prev.includes(sub.slug) ? prev.filter(s => s !== sub.slug) : [...prev, sub.slug]
                            );
                          }}
                          className="w-4 h-4 border-gray-300 rounded accent-[#14052b]" 
                        />
                        <span className="text-[12px] font-medium text-gray-600 group-hover:text-black transition-colors">{sub.subtitle || sub.slug}</span>
                      </label>
                    ))}
                  </div>
                </FilterSection>
              )}

              <FilterSection id="price" title="Price Range">
                <div className="px-1 py-2">
                  <div className="flex justify-between items-center mb-6">
                    <div className="bg-gray-50 px-3 py-1.5 rounded border border-gray-100">
                       <span className="text-[10px] block text-gray-400 font-bold uppercase mb-0.5">Min</span>
                       <span className="text-[12px] font-black tracking-tight">Rs. 400</span>
                    </div>
                    <div className="w-4 h-[1px] bg-gray-200"></div>
                    <div className="bg-gray-50 px-3 py-1.5 rounded border border-gray-100 text-right">
                       <span className="text-[10px] block text-gray-400 font-bold uppercase mb-0.5">Max</span>
                       <span className="text-[12px] font-black tracking-tight">Rs. {priceRange.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <input 
                    type="range" 
                    min="400" 
                    max="10000" 
                    step="100"
                    value={priceRange}
                    onChange={(e) => setPriceRange(parseInt(e.target.value))}
                    className="w-full cursor-pointer"
                  />
                  
                  <p className="mt-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center">
                    Showing products up to Rs. {priceRange.toLocaleString()}
                  </p>
                </div>
              </FilterSection>

              {/* Dynamic Specifications Filter */}
              <FilterSection id="specifications" title="Specifications">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</p>
                    {slug === 'luggage' ? (
                       ['Hard Shell', 'Soft Shell'].map(type => (
                         <label key={type} className="flex items-center gap-3 cursor-pointer group">
                           <input type="checkbox" className="w-4 h-4 border-gray-300 rounded accent-[#14052b]" />
                           <span className="text-[12px] font-medium text-gray-600 group-hover:text-black transition-colors">{type}</span>
                         </label>
                       ))
                    ) : (
                       ['Daily Use', 'Travel', 'Professional'].map(type => (
                        <label key={type} className="flex items-center gap-3 cursor-pointer group">
                          <input type="checkbox" className="w-4 h-4 border-gray-300 rounded accent-[#14052b]" />
                          <span className="text-[12px] font-medium text-gray-600 group-hover:text-black transition-colors">{type}</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>
              </FilterSection>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="flex-1">
            {/* Sort Bar */}
            <div className="flex justify-between items-center mb-8">
              <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{filteredProducts.length} Artifacts Found</span>
              <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 px-4 py-2 rounded-lg">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sort:</span>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-[11px] font-bold uppercase tracking-widest outline-none cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            <AnimatePresence mode="wait">
              {filteredProducts.length > 0 ? (
                <motion.div 
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
                >
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </motion.div>
              ) : (
                <div className="py-40 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No products found matching your inventory path.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
};
