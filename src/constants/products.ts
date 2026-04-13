import type { Product, CategoryInfo } from '../types';

// ─── Categories ──────────────────────────────────────────────
export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'backpacks',
    title: 'TRENDY',
    subtitle: 'BACKPACKS',
    slug: 'backpacks',
    image: 'https://lh3.googleusercontent.com/aida/ADBb0ujuQPAAo1qnLVdfWGCHjfcF2mTWv5IC-o-PStyWouff_BWsOBXS-HJLTa1S2M63l3LLw0-ARnnoivB9fU1vExT0fH87tg66KKoVtcq7P_4FRLjnB7fSUT9CC1JQHuH9aWcNLvUAy1DhppzaAN0WUf8whsecUq0f6IMy7FhjIgWpTXXRvdb9Jyh0FZz7sC2zJ3qbY3K760qyFDMNqIlArv8dwPbMfRCQ4_yGLuoruQcTTAQKR1fO2Lqy3cQ',
    bgColor: '#f2c94c',
    description: 'Explore our range of stylish and functional backpacks for every occasion.',
  },
  {
    id: 'college-backpacks',
    title: 'TRENDY',
    subtitle: 'COLLEGE BACKPACKS',
    slug: 'college-backpacks',
    image: 'https://lh3.googleusercontent.com/aida/ADBb0ujuQPAAo1qnLVdfWGCHjfcF2mTWv5IC-o-PStyWouff_BWsOBXS-HJLTa1S2M63l3LLw0-ARnnoivB9fU1vExT0fH87tg66KKoVtcq7P_4FRLjnB7fSUT9CC1JQHuH9aWcNLvUAy1DhppzaAN0WUf8whsecUq0f6IMy7FhjIgWpTXXRvdb9Jyh0FZz7sC2zJ3qbY3K760qyFDMNqIlArv8dwPbMfRCQ4_yGLuoruQcTTAQKR1fO2Lqy3cQ',
    bgColor: '#f2c94c',
    description: 'Backpacks designed for college life — spacious, durable, and stylish.',
    parentCategory: 'backpacks',
  },
  {
    id: 'school-backpacks',
    title: 'DURABLE',
    subtitle: 'SCHOOL BACKPACKS',
    slug: 'school-backpacks',
    image: 'https://lh3.googleusercontent.com/aida/ADBb0ujuQPAAo1qnLVdfWGCHjfcF2mTWv5IC-o-PStyWouff_BWsOBXS-HJLTa1S2M63l3LLw0-ARnnoivB9fU1vExT0fH87tg66KKoVtcq7P_4FRLjnB7fSUT9CC1JQHuH9aWcNLvUAy1DhppzaAN0WUf8whsecUq0f6IMy7FhjIgWpTXXRvdb9Jyh0FZz7sC2zJ3qbY3K760qyFDMNqIlArv8dwPbMfRCQ4_yGLuoruQcTTAQKR1fO2Lqy3cQ',
    bgColor: '#6aa5de',
    description: 'Sturdy, fun backpacks built to handle the school day.',
    parentCategory: 'backpacks',
  },
  {
    id: 'laptop-backpacks',
    title: 'PROFESSIONAL',
    subtitle: 'LAPTOP BACKPACKS',
    slug: 'laptop-backpacks',
    image: 'https://lh3.googleusercontent.com/aida/ADBb0ujuQPAAo1qnLVdfWGCHjfcF2mTWv5IC-o-PStyWouff_BWsOBXS-HJLTa1S2M63l3LLw0-ARnnoivB9fU1vExT0fH87tg66KKoVtcq7P_4FRLjnB7fSUT9CC1JQHuH9aWcNLvUAy1DhppzaAN0WUf8whsecUq0f6IMy7FhjIgWpTXXRvdb9Jyh0FZz7sC2zJ3qbY3K760qyFDMNqIlArv8dwPbMfRCQ4_yGLuoruQcTTAQKR1fO2Lqy3cQ',
    bgColor: '#a2d59b',
    description: 'Padded, protective bags engineered for your laptop and tech gear.',
    parentCategory: 'backpacks',
  },
  {
    id: 'trekking-backpacks',
    title: 'ADVENTURE',
    subtitle: 'TREKKING BACKPACKS',
    slug: 'trekking-backpacks',
    image: 'https://lh3.googleusercontent.com/aida/ADBb0ujuQPAAo1qnLVdfWGCHjfcF2mTWv5IC-o-PStyWouff_BWsOBXS-HJLTa1S2M63l3LLw0-ARnnoivB9fU1vExT0fH87tg66KKoVtcq7P_4FRLjnB7fSUT9CC1JQHuH9aWcNLvUAy1DhppzaAN0WUf8whsecUq0f6IMy7FhjIgWpTXXRvdb9Jyh0FZz7sC2zJ3qbY3K760qyFDMNqIlArv8dwPbMfRCQ4_yGLuoruQcTTAQKR1fO2Lqy3cQ',
    bgColor: '#ff7675',
    description: 'Heavy-duty packs for hikers, campers, and outdoor enthusiasts.',
    parentCategory: 'backpacks',
  },
  {
    id: 'luggage',
    title: 'PREMIUM',
    subtitle: 'LUGGAGE',
    slug: 'luggage',
    image: 'https://lh3.googleusercontent.com/aida/ADBb0ugpMFql-z8CZ76u7Kv1ANeppDp-zkjm1-9N_DjNMJhEt86N7NrwWDE2B25Zz87CMECAjO5qkTg7HuRdXiYH6ahRxxX0h6j4sOxf4dIJBexMVtilAu-I95P-z_IhQNTQBEBNlUbLijvFtAH5lGfIGQb0rtOwTi6PWcf99-nfACCAcxYPwVRohOMk4UyxfeXBF_sQVQhM3xWcO6p34DV93BXTbrPit3VOpJPugMfx9-c9o_CY2dnztdti67I',
    bgColor: '#a2d59b',
    description: 'Travel in style with our collection of premium luggage.',
  },
  {
    id: 'accessories',
    title: 'STYLISH',
    subtitle: 'ACCESSORIES',
    slug: 'accessories',
    image: 'https://lh3.googleusercontent.com/aida/ADBb0uhmc_Pc02VGmcnle5vS1_BQTHh5B1xJhWFdlXKj65tl5yFYCJasjMQBSWmPe0p0UAlLV8k9MkEXwTj95BDJTxP6mYogzYtMWGKQhWp5DcPUWyvZ9J_Bqcxe0npjbVsw0rOWylfgCUM7iKQiNvsHBK_w2x2U890sFNfkXcx3A9qSzCsOHGAgWQwHPtje4BztfZq2SIObaKfVeKMEB0cMqVCCIU0qDWK9b3DIxdXhGPdI8korNKiFC8mAKO0',
    bgColor: '#6aa5de',
    description: 'Complete your look with our range of bags and travel accessories.',
  },
  {
    id: 'junior',
    title: 'FUN & DURABLE',
    subtitle: 'PRIORITY JUNIOR',
    slug: 'junior',
    image: 'https://lh3.googleusercontent.com/aida/ADBb0ujuQPAAo1qnLVdfWGCHjfcF2mTWv5IC-o-PStyWouff_BWsOBXS-HJLTa1S2M63l3LLw0-ARnnoivB9fU1vExT0fH87tg66KKoVtcq7P_4FRLjnB7fSUT9CC1JQHuH9aWcNLvUAy1DhppzaAN0WUf8whsecUq0f6IMy7FhjIgWpTXXRvdb9Jyh0FZz7sC2zJ3qbY3K760qyFDMNqIlArv8dwPbMfRCQ4_yGLuoruQcTTAQKR1fO2Lqy3cQ',
    bgColor: '#ff7675',
    description: 'Fun, durable bags designed specifically for little explorers.',
  },
  {
    id: 'premium',
    title: 'COLLECTION',
    subtitle: 'PREMIUM COLLECTION',
    slug: 'premium',
    image: 'https://lh3.googleusercontent.com/aida/ADBb0uhzm92TzHT0BVAIYYXSuCFymoj0WkZF2ABtFxBQpaNuWlYc4JQs31v9FqjXuuM9MuGjx82KACn1vS3GnpVv42-N9i6qWNMqLpFYAeAr0ZYMiru5D5N-Gh1SFh24TB5WHIvQOvKEdlnTeEYxrwa85bV0YIkcLwXW1ab9sdfFbje2EEetEQToz_5yjSeGyUVDKHcN6DQP_JmLLbHxdL6VACKP0lWfKQf6UZw_Dw_9_x84AW4dPubjbPtv-Qs',
    bgColor: '#302a5e',
    description: 'Exclusive, high-end travel gear and accessories for the discerning traveller.',
  },
];

// ─── Products ────────────────────────────────────────────────
const IMG_BASE = 'https://lh3.googleusercontent.com/aida/';

export const IMG = {
  backpack1: `${IMG_BASE}ADBb0ujWnQw3nne-ttH0oVbhutDwcQQYtbla0Sp2YUbstWz30QBd0pBc_FBHqDlg3YPAM0SoddMSCX3jX62MM7ZruE9fFfl2NW8UYFrdqKW63MY_W8L3eO3DS_wlMTuI2F-AU64zdv4NAjtVczIWfIh07enKRmnBnA0-mj58joO7E4tzENY7m8V-GROCo27NxwStKZ6UE_n6k8hQcV0q8WoTA6Vj1aBrZ3OXnqsZVe4cGModrXVH9zE-HGZBOQ`,
  backpack2: `${IMG_BASE}ADBb0uhmmzC8P6o7b65x8ylXswEmjgEZq3XLV6WqlYsEgypxxUFv1YIcz_yhVv0xejKPhX3GlMMLcqW_cjFH65C5jo6Y6GOS0q9CZeK69OUZXgQv3Fjy_j-0owPD9HQAeOOaGi5HCUHz1LMs7iHDqKJLW3oTJPzweibA3PF2LkmbfZn8ICDqKQ0X5lY2IfKW4AUsVgxMRM3DQouKCZcKGDuyKiiVf_eKIPA0v-2AT50EEAldIuSSuCyvMaoiI-o`,
  backpack3: `${IMG_BASE}ADBb0uhNg6ZdwU6GXk-L7dzSXIAWORKJBG5MkaWm2Hdb6gyTPQqy6N39ywI7E5yO2fbvR9kURJKkFpRx5JIIOUem3Ie5093LXLRrtDKZQh0uFWgRc8MD-aAcpTKcIU3T9_qWxy2jvOonebxzKgZlLPMJV3MjnNp5xV3NuXD87iKyCeQa77DHAOeVRk35NzcnhzehSHtrl2BpkjjS9R89eneZw_zpw11uMlxr57ubFYBlqO-Y03NPRef59CcE8Q`,
  luggage1: `${IMG_BASE}ADBb0ugpMFql-z8CZ76u7Kv1ANeppDp-zkjm1-9N_DjNMJhEt86N7NrwWDE2B25Zz87CMECAjO5qkTg7HuRdXiYH6ahRxxX0h6j4sOxf4dIJBexMVtilAu-I95P-z_IhQNTQBEBNlUbLijvFtAH5lGfIGQb0rtOwTi6PWcf99-nfACCAcxYPwVRohOMk4UyxfeXBF_sQVQhM3xWcO6p34DV93BXTbrPit3VOpJPugMfx9-c9o_CY2dnztdti67I`,
  accessories1: `${IMG_BASE}ADBb0uhmc_Pc02VGmcnle5vS1_BQTHh5B1xJhWFdlXKj65tl5yFYCJasjMQBSWmPe0p0UAlLV8k9MkEXwTj95BDJTxP6mYogzYtMWGKQhWp5DcPUWyvZ9J_Bqcxe0npjbVsw0rOWylfgCUM7iKQiNvsHBK_w2x2U890sFNfkXcx3A9qSzCsOHGAgWQwHPtje4BztfZq2SIObaKfVeKMEB0cMqVCCIU0qDWK9b3DIxdXhGPdI8korNKiFC8mAKO0`,
  hero: '/Creatives/hero-main.jpg',
  banner: '/Creatives/editorial-1.jpg',
  categoryBackpacks: '/Category/Backpack.png',
  categoryLuggage: '/Category/Travelling Bag.png',
  categoryAccessories: '/Category/Accessories.png',
};

const productTemplate = (overrides: Partial<Product> & { id: string; name: string; price: number; originalPrice: number; image: string; category: string }): Product => ({
  slug: overrides.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  discount: `${Math.round((1 - overrides.price / overrides.originalPrice) * 100)}% off`,
  rating: 4.5,
  reviews: 10,
  images: [overrides.image],
  isNew: false,
  highlighted: false,
  isPremium: false,
  subcategory: undefined,
  gender: 'unisex',
  description: '',
  features: [],
  specifications: {},
  stock: 50,
  sku: `PB-${overrides.id.toUpperCase()}`,
  createdAt: new Date().toISOString(),
  ...overrides,
});

export const PRODUCTS: Product[] = [
  // ─── College Backpacks ─────────────────────────────────────
  productTemplate({
    id: 'b1',
    name: 'Fabulous 17 Inch Future Dusk Backpack',
    price: 950,
    originalPrice: 1500,
    rating: 4.8,
    reviews: 128,
    image: IMG.backpack1,
    images: [IMG.backpack1, IMG.backpack2, IMG.backpack3],
    category: 'college-backpacks',
    gender: 'men',
    isNew: true,
    highlighted: true,
    description: 'The Priority Fabulous Backpack is designed for the modern explorer. Featuring a spacious 17-inch laptop compartment, ergonomic padded straps, and water-resistant fabric, it\'s perfect for college, work, or weekend trips.',
    features: [
      '17-inch dedicated laptop sleeve',
      'Water-resistant premium polyester fabric',
      'Ergonomic S-curve padded shoulder straps',
      'Hidden anti-theft back pocket',
      'Dual side pockets for water bottles',
      'Reinforced base for extra durability',
    ],
    specifications: { Material: 'Polyester', Capacity: '30 Liters', Dimensions: '45 × 30 × 15 cm', Weight: '650g', Warranty: '1 Year' },
    stock: 42,
  }),
  productTemplate({
    id: 'b2',
    name: 'Urban Edge Pro College Bag',
    price: 1150,
    originalPrice: 1800,
    rating: 4.5,
    reviews: 25,
    image: IMG.backpack2,
    images: [IMG.backpack2, IMG.backpack1, IMG.backpack3],
    category: 'college-backpacks',
    gender: 'women',
    isNew: true,
    description: 'The Urban Edge Pro combines street-style aesthetics with functionality. Multiple compartments, padded laptop pocket, and a sleek silhouette make it the go-to bag for the fashion-forward student.',
    features: ['Padded 15.6" laptop pocket', 'Quick-access front pocket', 'Reflective accents for night visibility', 'Compression straps', 'Breathable mesh back panel'],
    specifications: { Material: 'Nylon', Capacity: '28 Liters', Dimensions: '44 × 29 × 14 cm', Weight: '580g', Warranty: '1 Year' },
    stock: 35,
  }),
  productTemplate({
    id: 'b3',
    name: 'Campus Classic Daily Pack',
    price: 850,
    originalPrice: 1200,
    rating: 4.7,
    reviews: 15,
    image: IMG.backpack3,
    images: [IMG.backpack3, IMG.backpack1, IMG.backpack2],
    category: 'college-backpacks',
    gender: 'unisex',
    description: 'A clean, versatile pack built for everyday campus life. Lightweight construction with surprisingly deep storage and organiser pockets for pens, cables, and notebooks.',
    features: ['Lightweight 450g construction', 'Internal organiser pocket', 'Padded tablet sleeve', 'YKK zippers', 'Machine washable'],
    specifications: { Material: 'Canvas', Capacity: '22 Liters', Dimensions: '42 × 28 × 12 cm', Weight: '450g', Warranty: '1 Year' },
    stock: 60,
  }),
  productTemplate({
    id: 'b5',
    name: 'Scholar Series Premium Bag',
    price: 1299,
    originalPrice: 1999,
    rating: 4.9,
    reviews: 12,
    image: IMG.backpack2,
    images: [IMG.backpack2, IMG.backpack3],
    category: 'college-backpacks',
    gender: 'men',
    isPremium: true,
    description: 'Top-tier materials and construction for the serious student. Premium leather accents, metal hardware, and a lifetime-grade main compartment.',
    features: ['Premium leather accents', 'Metal YKK zippers', 'Padded 17" laptop compartment', 'Rain cover included', 'USB charging port'],
    specifications: { Material: 'Ballistic Nylon', Capacity: '32 Liters', Dimensions: '46 × 31 × 16 cm', Weight: '720g', Warranty: '3 Years' },
    stock: 18,
  }),

  // ─── School Backpacks ──────────────────────────────────────
  productTemplate({
    id: 's1',
    name: 'Junior Explorer School Bag',
    price: 1299,
    originalPrice: 1999,
    rating: 4.8,
    reviews: 45,
    image: IMG.backpack3,
    images: [IMG.backpack3, IMG.backpack1],
    category: 'school-backpacks',
    gender: 'kids',
    isNew: true,
    highlighted: true,
    description: 'Ergonomically designed for growing spines. Lightweight with wide padded straps and a chest strap to distribute weight evenly.',
    features: ['Ergonomic spine-safe design', 'Chest strap for weight distribution', 'Reflective strips', 'Easy-clean material', 'Name tag inside'],
    specifications: { Material: 'Polyester', Capacity: '20 Liters', Dimensions: '38 × 26 × 12 cm', Weight: '380g', Warranty: '1 Year', 'Recommended Age': '6–10 years' },
    stock: 70,
  }),

  // ─── Laptop Backpacks ──────────────────────────────────────
  productTemplate({
    id: 'lp1',
    name: 'Executive 15.6" Laptop Bag',
    price: 1450,
    originalPrice: 2500,
    rating: 4.8,
    reviews: 88,
    image: IMG.backpack1,
    images: [IMG.backpack1, IMG.backpack2, IMG.backpack3],
    category: 'laptop-backpacks',
    gender: 'men',
    isNew: true,
    isPremium: true,
    highlighted: true,
    description: 'Professional laptop bag with separate padded compartment, TSA-friendly flat-open design, and anti-theft features.',
    features: ['TSA-friendly flat-open design', 'Separate padded laptop compartment', 'RFID-blocking pocket', 'Luggage pass-through', 'Water-repellent coating'],
    specifications: { Material: 'Ballistic Nylon', Capacity: '28 Liters', Dimensions: '44 × 30 × 15 cm', Weight: '680g', Warranty: '3 Years', 'Laptop Size': 'Up to 15.6"' },
    stock: 32,
  }),

  // ─── Luggage ───────────────────────────────────────────────
  productTemplate({
    id: 'l1',
    name: 'Executive Hard-Shell Spinner',
    price: 8999,
    originalPrice: 12000,
    rating: 4.8,
    reviews: 120,
    image: IMG.luggage1,
    images: [IMG.luggage1],
    category: 'luggage',
    gender: 'women',
    isNew: true,
    isPremium: true,
    highlighted: true,
    description: 'Polycarbonate hard-shell with 360° spinner wheels, TSA-approved lock, and expandable packing space.',
    features: ['Polycarbonate shell', '360° spinner wheels', 'TSA-approved combination lock', 'Expandable by 20%', 'Interior divider with zippered mesh'],
    specifications: { Material: 'Polycarbonate', Capacity: '65 Liters', Dimensions: '68 × 45 × 28 cm', Weight: '3.8 kg', Warranty: '5 Years', Wheels: '4 Spinner' },
    stock: 20,
  }),

  // ─── Accessories ───────────────────────────────────────────
  productTemplate({
    id: 'a1',
    name: 'Premium Leather Duffle Bag',
    price: 4500,
    originalPrice: 7500,
    rating: 4.8,
    reviews: 92,
    image: IMG.accessories1,
    images: [IMG.accessories1],
    category: 'accessories',
    gender: 'men',
    isNew: true,
    isPremium: true,
    highlighted: true,
    description: 'Versatile leather duffle perfect for gym, overnight trips, or weekend getaways.',
    features: ['Genuine leather', 'Shoe compartment', 'Detachable strap', 'Metal feet protection', 'Interior zip pocket'],
    specifications: { Material: 'Genuine Leather', Capacity: '35 Liters', Dimensions: '50 × 25 × 25 cm', Weight: '1.2 kg', Warranty: '3 Years' },
    stock: 25,
  }),
];

// ─── Helper Functions ────────────────────────────────────────
export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return PRODUCTS.filter((p) => p.category === categorySlug);
}

export function getPremiumProducts(): Product[] {
  return PRODUCTS.filter((p) => p.isPremium);
}

export function getCategoryBySlug(slug: string): CategoryInfo | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getSubcategories(parentSlug: string): CategoryInfo[] {
  return CATEGORIES.filter((c) => c.parentCategory === parentSlug);
}

export function getBestSellers(): Product[] {
  return [...PRODUCTS].sort((a, b) => b.reviews - a.reviews).slice(0, 5);
}

export function getNewArrivals(): Product[] {
  return PRODUCTS.filter((p) => p.isNew).slice(0, 8);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
  );
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// Legacy compat — map from old CATEGORY_DATA keys to new system
export const CATEGORY_DATA: Record<string, { title: string; subtitle: string; image: string; bgColor: string; products: Product[] }> = {};
for (const cat of CATEGORIES) {
  CATEGORY_DATA[cat.id.toUpperCase().replace(/-/g, '_')] = {
    title: cat.title,
    subtitle: cat.subtitle,
    image: cat.image,
    bgColor: cat.bgColor,
    products: getProductsByCategory(cat.slug),
  };
}
// Also map parent categories to include all subcategory products
CATEGORY_DATA['BACKPACKS'] = {
  ...CATEGORY_DATA['BACKPACKS'] || { title: 'TRENDY', subtitle: 'BACKPACKS', image: '', bgColor: '#f2c94c' },
  products: PRODUCTS.filter((p) => p.category.includes('backpack')),
};
