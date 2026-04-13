-- ═══════════════════════════════════════════════════════════════
-- Priority Bags — Seed Data
-- Run AFTER schema.sql:  psql $DATABASE_URL -f server/seed.sql
-- ═══════════════════════════════════════════════════════════════

-- ─── Categories ───────────────────────────────────────────────
INSERT INTO categories (slug, title, subtitle, description, bg_color, sort_order) VALUES
  ('backpacks',         'TRENDY',        'BACKPACKS',          'Explore our range of stylish and functional backpacks.', '#f2c94c', 1),
  ('college-backpacks', 'TRENDY',        'COLLEGE BACKPACKS',  'Backpacks designed for college life — spacious, durable, and stylish.', '#f2c94c', 2),
  ('school-backpacks',  'DURABLE',       'SCHOOL BACKPACKS',   'Sturdy, fun backpacks built to handle the school day.', '#6aa5de', 3),
  ('laptop-backpacks',  'PROFESSIONAL',  'LAPTOP BACKPACKS',   'Padded, protective bags engineered for your laptop and tech gear.', '#a2d59b', 4),
  ('trekking-backpacks','ADVENTURE',     'TREKKING BACKPACKS', 'Heavy-duty packs for hikers, campers, and outdoor enthusiasts.', '#ff7675', 5),
  ('luggage',           'PREMIUM',       'LUGGAGE',            'Travel in style with our collection of premium luggage.', '#a2d59b', 6),
  ('accessories',       'STYLISH',       'ACCESSORIES',        'Complete your look with our range of bags and travel accessories.', '#6aa5de', 7),
  ('junior',            'FUN & DURABLE', 'PRIORITY JUNIOR',    'Fun, durable bags designed specifically for little explorers.', '#ff7675', 8),
  ('premium',           'COLLECTION',    'PREMIUM COLLECTION', 'Exclusive, high-end travel gear for the discerning traveller.', '#302a5e', 9)
ON CONFLICT (slug) DO NOTHING;

-- ─── Products ─────────────────────────────────────────────────
-- College Backpacks
INSERT INTO products (sku, slug, name, description, price, original_price, category_id, image, images, features, specifications, rating, review_count, stock, is_new, is_highlighted)
SELECT
  'PB-B1',
  'fabulous-17-inch-future-dusk-backpack',
  'Fabulous 17 Inch Future Dusk Backpack',
  'The Priority Fabulous Backpack is designed for the modern explorer. Featuring a spacious 17-inch laptop compartment, ergonomic padded straps, and water-resistant fabric.',
  950, 1500,
  c.id,
  'https://lh3.googleusercontent.com/aida/ADBb0ujWnQw3nne-ttH0oVbhutDwcQQYtbla0Sp2YUbstWz30QBd0pBc_FBHqDlg3YPAM0SoddMSCX3jX62MM7ZruE9fFfl2NW8UYFrdqKW63MY_W8L3eO3DS_wlMTuI2F-AU64zdv4NAjtVczIWfIh07enKRmnBnA0-mj58joO7E4tzENY7m8V-GROCo27NxwStKZ6UE_n6k8hQcV0q8WoTA6Vj1aBrZ3OXnqsZVe4cGModrXVH9zE-HGZBOQ',
  '["https://lh3.googleusercontent.com/aida/ADBb0ujWnQw3nne-ttH0oVbhutDwcQQYtbla0Sp2YUbstWz30QBd0pBc_FBHqDlg3YPAM0SoddMSCX3jX62MM7ZruE9fFfl2NW8UYFrdqKW63MY_W8L3eO3DS_wlMTuI2F-AU64zdv4NAjtVczIWfIh07enKRmnBnA0-mj58joO7E4tzENY7m8V-GROCo27NxwStKZ6UE_n6k8hQcV0q8WoTA6Vj1aBrZ3OXnqsZVe4cGModrXVH9zE-HGZBOQ"]',
  '["17-inch dedicated laptop sleeve","Water-resistant premium polyester fabric","Ergonomic S-curve padded shoulder straps","Hidden anti-theft back pocket","Dual side pockets for water bottles","Reinforced base for extra durability"]',
  '{"Material":"Polyester","Capacity":"30 Liters","Dimensions":"45 × 30 × 15 cm","Weight":"650g","Warranty":"1 Year"}',
  4.8, 128, 42, true, true
FROM categories c WHERE c.slug = 'college-backpacks'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (sku, slug, name, description, price, original_price, category_id, image, images, features, specifications, rating, review_count, stock, is_new)
SELECT
  'PB-B2',
  'urban-edge-pro-college-bag',
  'Urban Edge Pro College Bag',
  'The Urban Edge Pro combines street-style aesthetics with functionality. Multiple compartments, padded laptop pocket, and a sleek silhouette.',
  1150, 1800,
  c.id,
  'https://lh3.googleusercontent.com/aida/ADBb0uhmmzC8P6o7b65x8ylXswEmjgEZq3XLV6WqlYsEgypxxUFv1YIcz_yhVv0xejKPhX3GlMMLcqW_cjFH65C5jo6Y6GOS0q9CZeK69OUZXgQv3Fjy_j-0owPD9HQAeOOaGi5HCUHz1LMs7iHDqKJLW3oTJPzweibA3PF2LkmbfZn8ICDqKQ0X5lY2IfKW4AUsVgxMRM3DQouKCZcKGDuyKiiVf_eKIPA0v-2AT50EEAldIuSSuCyvMaoiI-o',
  '["https://lh3.googleusercontent.com/aida/ADBb0uhmmzC8P6o7b65x8ylXswEmjgEZq3XLV6WqlYsEgypxxUFv1YIcz_yhVv0xejKPhX3GlMMLcqW_cjFH65C5jo6Y6GOS0q9CZeK69OUZXgQv3Fjy_j-0owPD9HQAeOOaGi5HCUHz1LMs7iHDqKJLW3oTJPzweibA3PF2LkmbfZn8ICDqKQ0X5lY2IfKW4AUsVgxMRM3DQouKCZcKGDuyKiiVf_eKIPA0v-2AT50EEAldIuSSuCyvMaoiI-o"]',
  '["Padded 15.6\" laptop pocket","Quick-access front pocket","Reflective accents for night visibility","Compression straps","Breathable mesh back panel"]',
  '{"Material":"Nylon","Capacity":"28 Liters","Dimensions":"44 × 29 × 14 cm","Weight":"580g","Warranty":"1 Year"}',
  4.5, 25, 35, true
FROM categories c WHERE c.slug = 'college-backpacks'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (sku, slug, name, description, price, original_price, category_id, image, images, features, specifications, rating, review_count, stock)
SELECT
  'PB-B3',
  'campus-classic-daily-pack',
  'Campus Classic Daily Pack',
  'A clean, versatile pack built for everyday campus life. Lightweight construction with surprisingly deep storage.',
  850, 1200,
  c.id,
  'https://lh3.googleusercontent.com/aida/ADBb0uhNg6ZdwU6GXk-L7dzSXIAWORKJBG5MkaWm2Hdb6gyTPQqy6N39ywI7E5yO2fbvR9kURJKkFpRx5JIIOUem3Ie5093LXLRrtDKZQh0uFWgRc8MD-aAcpTKcIU3T9_qWxy2jvOonebxzKgZlLPMJV3MjnNp5xV3NuXD87iKyCeQa77DHAOeVRk35NzcnhzehSHtrl2BpkjjS9R89eneZw_zpw11uMlxr57ubFYBlqO-Y03NPRef59CcE8Q',
  '["https://lh3.googleusercontent.com/aida/ADBb0uhNg6ZdwU6GXk-L7dzSXIAWORKJBG5MkaWm2Hdb6gyTPQqy6N39ywI7E5yO2fbvR9kURJKkFpRx5JIIOUem3Ie5093LXLRrtDKZQh0uFWgRc8MD-aAcpTKcIU3T9_qWxy2jvOonebxzKgZlLPMJV3MjnNp5xV3NuXD87iKyCeQa77DHAOeVRk35NzcnhzehSHtrl2BpkjjS9R89eneZw_zpw11uMlxr57ubFYBlqO-Y03NPRef59CcE8Q"]',
  '["Lightweight 450g construction","Internal organiser pocket","Padded tablet sleeve","YKK zippers","Machine washable"]',
  '{"Material":"Canvas","Capacity":"22 Liters","Dimensions":"42 × 28 × 12 cm","Weight":"450g","Warranty":"1 Year"}',
  4.7, 15, 60
FROM categories c WHERE c.slug = 'college-backpacks'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (sku, slug, name, description, price, original_price, category_id, image, images, features, specifications, rating, review_count, stock, is_highlighted)
SELECT
  'PB-B5',
  'scholar-series-premium-bag',
  'Scholar Series Premium Bag',
  'Top-tier materials and construction for the serious student. Premium leather accents, metal hardware, and lifetime-grade main compartment.',
  1299, 1999,
  c.id,
  'https://lh3.googleusercontent.com/aida/ADBb0uhmmzC8P6o7b65x8ylXswEmjgEZq3XLV6WqlYsEgypxxUFv1YIcz_yhVv0xejKPhX3GlMMLcqW_cjFH65C5jo6Y6GOS0q9CZeK69OUZXgQv3Fjy_j-0owPD9HQAeOOaGi5HCUHz1LMs7iHDqKJLW3oTJPzweibA3PF2LkmbfZn8ICDqKQ0X5lY2IfKW4AUsVgxMRM3DQouKCZcKGDuyKiiVf_eKIPA0v-2AT50EEAldIuSSuCyvMaoiI-o',
  '["https://lh3.googleusercontent.com/aida/ADBb0uhmmzC8P6o7b65x8ylXswEmjgEZq3XLV6WqlYsEgypxxUFv1YIcz_yhVv0xejKPhX3GlMMLcqW_cjFH65C5jo6Y6GOS0q9CZeK69OUZXgQv3Fjy_j-0owPD9HQAeOOaGi5HCUHz1LMs7iHDqKJLW3oTJPzweibA3PF2LkmbfZn8ICDqKQ0X5lY2IfKW4AUsVgxMRM3DQouKCZcKGDuyKiiVf_eKIPA0v-2AT50EEAldIuSSuCyvMaoiI-o"]',
  '["Premium leather accents","Metal YKK zippers","Padded 17\" laptop compartment","Rain cover included","USB charging port"]',
  '{"Material":"Ballistic Nylon","Capacity":"32 Liters","Dimensions":"46 × 31 × 16 cm","Weight":"720g","Warranty":"3 Years"}',
  4.9, 12, 18, true
FROM categories c WHERE c.slug = 'college-backpacks'
ON CONFLICT (slug) DO NOTHING;

-- School Backpacks
INSERT INTO products (sku, slug, name, description, price, original_price, category_id, image, images, features, specifications, rating, review_count, stock, is_new, is_highlighted)
SELECT
  'PB-S1',
  'junior-explorer-school-bag',
  'Junior Explorer School Bag',
  'Ergonomically designed for growing spines. Lightweight with wide padded straps and a chest strap to distribute weight evenly.',
  1299, 1999,
  c.id,
  'https://lh3.googleusercontent.com/aida/ADBb0uhNg6ZdwU6GXk-L7dzSXIAWORKJBG5MkaWm2Hdb6gyTPQqy6N39ywI7E5yO2fbvR9kURJKkFpRx5JIIOUem3Ie5093LXLRrtDKZQh0uFWgRc8MD-aAcpTKcIU3T9_qWxy2jvOonebxzKgZlLPMJV3MjnNp5xV3NuXD87iKyCeQa77DHAOeVRk35NzcnhzehSHtrl2BpkjjS9R89eneZw_zpw11uMlxr57ubFYBlqO-Y03NPRef59CcE8Q',
  '["https://lh3.googleusercontent.com/aida/ADBb0uhNg6ZdwU6GXk-L7dzSXIAWORKJBG5MkaWm2Hdb6gyTPQqy6N39ywI7E5yO2fbvR9kURJKkFpRx5JIIOUem3Ie5093LXLRrtDKZQh0uFWgRc8MD-aAcpTKcIU3T9_qWxy2jvOonebxzKgZlLPMJV3MjnNp5xV3NuXD87iKyCeQa77DHAOeVRk35NzcnhzehSHtrl2BpkjjS9R89eneZw_zpw11uMlxr57ubFYBlqO-Y03NPRef59CcE8Q"]',
  '["Ergonomic spine-safe design","Chest strap for weight distribution","Reflective strips","Easy-clean material","Name tag inside"]',
  '{"Material":"Polyester","Capacity":"20 Liters","Dimensions":"38 × 26 × 12 cm","Weight":"380g","Warranty":"1 Year","Recommended Age":"6–10 years"}',
  4.8, 45, 70, true, true
FROM categories c WHERE c.slug = 'school-backpacks'
ON CONFLICT (slug) DO NOTHING;

-- Laptop Backpacks
INSERT INTO products (sku, slug, name, description, price, original_price, category_id, image, images, features, specifications, rating, review_count, stock, is_new, is_highlighted)
SELECT
  'PB-LP1',
  'executive-15-6-laptop-bag',
  'Executive 15.6" Laptop Bag',
  'Professional laptop bag with separate padded compartment, TSA-friendly flat-open design, and anti-theft features.',
  1450, 2500,
  c.id,
  'https://lh3.googleusercontent.com/aida/ADBb0ujWnQw3nne-ttH0oVbhutDwcQQYtbla0Sp2YUbstWz30QBd0pBc_FBHqDlg3YPAM0SoddMSCX3jX62MM7ZruE9fFfl2NW8UYFrdqKW63MY_W8L3eO3DS_wlMTuI2F-AU64zdv4NAjtVczIWfIh07enKRmnBnA0-mj58joO7E4tzENY7m8V-GROCo27NxwStKZ6UE_n6k8hQcV0q8WoTA6Vj1aBrZ3OXnqsZVe4cGModrXVH9zE-HGZBOQ',
  '["https://lh3.googleusercontent.com/aida/ADBb0ujWnQw3nne-ttH0oVbhutDwcQQYtbla0Sp2YUbstWz30QBd0pBc_FBHqDlg3YPAM0SoddMSCX3jX62MM7ZruE9fFfl2NW8UYFrdqKW63MY_W8L3eO3DS_wlMTuI2F-AU64zdv4NAjtVczIWfIh07enKRmnBnA0-mj58joO7E4tzENY7m8V-GROCo27NxwStKZ6UE_n6k8hQcV0q8WoTA6Vj1aBrZ3OXnqsZVe4cGModrXVH9zE-HGZBOQ"]',
  '["TSA-friendly flat-open design","Separate padded laptop compartment","RFID-blocking pocket","Luggage pass-through","Water-repellent coating"]',
  '{"Material":"Ballistic Nylon","Capacity":"28 Liters","Dimensions":"44 × 30 × 15 cm","Weight":"680g","Warranty":"3 Years","Laptop Size":"Up to 15.6\""}',
  4.8, 88, 32, true, true
FROM categories c WHERE c.slug = 'laptop-backpacks'
ON CONFLICT (slug) DO NOTHING;

-- Luggage
INSERT INTO products (sku, slug, name, description, price, original_price, category_id, image, images, features, specifications, rating, review_count, stock, is_new, is_highlighted)
SELECT
  'PB-L1',
  'executive-hard-shell-spinner',
  'Executive Hard-Shell Spinner',
  'Polycarbonate hard-shell with 360° spinner wheels, TSA-approved lock, and expandable packing space.',
  8999, 12000,
  c.id,
  'https://lh3.googleusercontent.com/aida/ADBb0ugpMFql-z8CZ76u7Kv1ANeppDp-zkjm1-9N_DjNMJhEt86N7NrwWDE2B25Zz87CMECAjO5qkTg7HuRdXiYH6ahRxxX0h6j4sOxf4dIJBexMVtilAu-I95P-z_IhQNTQBEBNlUbLijvFtAH5lGfIGQb0rtOwTi6PWcf99-nfACCAcxYPwVRohOMk4UyxfeXBF_sQVQhM3xWcO6p34DV93BXTbrPit3VOpJPugMfx9-c9o_CY2dnztdti67I',
  '["https://lh3.googleusercontent.com/aida/ADBb0ugpMFql-z8CZ76u7Kv1ANeppDp-zkjm1-9N_DjNMJhEt86N7NrwWDE2B25Zz87CMECAjO5qkTg7HuRdXiYH6ahRxxX0h6j4sOxf4dIJBexMVtilAu-I95P-z_IhQNTQBEBNlUbLijvFtAH5lGfIGQb0rtOwTi6PWcf99-nfACCAcxYPwVRohOMk4UyxfeXBF_sQVQhM3xWcO6p34DV93BXTbrPit3VOpJPugMfx9-c9o_CY2dnztdti67I"]',
  '["Polycarbonate shell","360° spinner wheels","TSA-approved combination lock","Expandable by 20%","Interior divider with zippered mesh"]',
  '{"Material":"Polycarbonate","Capacity":"65 Liters","Dimensions":"68 × 45 × 28 cm","Weight":"3.8 kg","Warranty":"5 Years","Wheels":"4 Spinner"}',
  4.8, 120, 20, true, true
FROM categories c WHERE c.slug = 'luggage'
ON CONFLICT (slug) DO NOTHING;

-- Accessories
INSERT INTO products (sku, slug, name, description, price, original_price, category_id, image, images, features, specifications, rating, review_count, stock, is_new, is_highlighted)
SELECT
  'PB-A1',
  'premium-leather-duffle-bag',
  'Premium Leather Duffle Bag',
  'Versatile leather duffle perfect for gym, overnight trips, or weekend getaways.',
  4500, 7500,
  c.id,
  'https://lh3.googleusercontent.com/aida/ADBb0uhmc_Pc02VGmcnle5vS1_BQTHh5B1xJhWFdlXKj65tl5yFYCJasjMQBSWmPe0p0UAlLV8k9MkEXwTj95BDJTxP6mYogzYtMWGKQhWp5DcPUWyvZ9J_Bqcxe0npjbVsw0rOWylfgCUM7iKQiNvsHBK_w2x2U890sFNfkXcx3A9qSzCsOHGAgWQwHPtje4BztfZq2SIObaKfVeKMEB0cMqVCCIU0qDWK9b3DIxdXhGPdI8korNKiFC8mAKO0',
  '["https://lh3.googleusercontent.com/aida/ADBb0uhmc_Pc02VGmcnle5vS1_BQTHh5B1xJhWFdlXKj65tl5yFYCJasjMQBSWmPe0p0UAlLV8k9MkEXwTj95BDJTxP6mYogzYtMWGKQhWp5DcPUWyvZ9J_Bqcxe0npjbVsw0rOWylfgCUM7iKQiNvsHBK_w2x2U890sFNfkXcx3A9qSzCsOHGAgWQwHPtje4BztfZq2SIObaKfVeKMEB0cMqVCCIU0qDWK9b3DIxdXhGPdI8korNKiFC8mAKO0"]',
  '["Genuine leather","Shoe compartment","Detachable strap","Metal feet protection","Interior zip pocket"]',
  '{"Material":"Genuine Leather","Capacity":"35 Liters","Dimensions":"50 × 25 × 25 cm","Weight":"1.2 kg","Warranty":"3 Years"}',
  4.8, 92, 25, true, true
FROM categories c WHERE c.slug = 'accessories'
ON CONFLICT (slug) DO NOTHING;
