-- Schema SQL pour WARRIORS MARKET
-- Projet Supabase: ITACORE2 (ampktfwcpopkomrsckjm)

-- Supprimer les tables existantes si elles existent (pour réinitialisation)
DROP TABLE IF EXISTS public.warriors_wholesale_requests CASCADE;
DROP TABLE IF EXISTS public.warriors_order_items CASCADE;
DROP TABLE IF EXISTS public.warriors_orders CASCADE;
DROP TABLE IF EXISTS public.warriors_products CASCADE;
DROP TABLE IF EXISTS public.warriors_categories CASCADE;
DROP TABLE IF EXISTS public.warriors_clients CASCADE;
DROP TABLE IF EXISTS public.warriors_admins CASCADE;

-- 1. Table des Catégories
CREATE TABLE public.warriors_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS (Row Level Security) - Optionnel mais recommandé
ALTER TABLE public.warriors_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to categories" ON public.warriors_categories FOR SELECT USING (true);
CREATE POLICY "Allow all access to admin categories" ON public.warriors_categories FOR ALL USING (true);

-- 2. Table des Produits
CREATE TABLE public.warriors_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.warriors_categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    price NUMERIC NOT NULL, -- Prix de base ou par défaut
    unit TEXT NOT NULL, -- Ex: "kg", "pièce", "pot", "bouteille"
    formats JSONB DEFAULT '[]'::jsonb, -- Formats optionnels: [{"name": "250g", "price": 1500}]
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'available', -- 'available' | 'out_of_stock'
    is_featured BOOLEAN DEFAULT false,
    min_wholesale_qty INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.warriors_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to products" ON public.warriors_products FOR SELECT USING (true);
CREATE POLICY "Allow all access to admin products" ON public.warriors_products FOR ALL USING (true);

-- 3. Table des Clients
CREATE TABLE public.warriors_clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    email TEXT,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.warriors_clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert access to clients" ON public.warriors_clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all access to admin clients" ON public.warriors_clients FOR ALL USING (true);

-- 4. Table des Commandes
CREATE TABLE public.warriors_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    delivery_zone TEXT NOT NULL,
    delivery_fee NUMERIC DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'validated' | 'delivered' | 'cancelled'
    total_amount NUMERIC NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'cash_on_delivery', -- 'cash_on_delivery' | 'mobile_money'
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.warriors_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert access to orders" ON public.warriors_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read own orders" ON public.warriors_orders FOR SELECT USING (true);
CREATE POLICY "Allow all access to admin orders" ON public.warriors_orders FOR ALL USING (true);

-- 5. Table des Articles de Commande
CREATE TABLE public.warriors_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.warriors_orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.warriors_products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL, -- Pour conserver l'historique
    quantity INTEGER NOT NULL,
    price_at_purchase NUMERIC NOT NULL,
    format TEXT, -- Format sélectionné (ex: "250g")
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.warriors_order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert access to order items" ON public.warriors_order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read own order items" ON public.warriors_order_items FOR SELECT USING (true);
CREATE POLICY "Allow all access to admin order items" ON public.warriors_order_items FOR ALL USING (true);

-- 6. Table des Demandes de Vente en Gros
CREATE TABLE public.warriors_wholesale_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    company_name TEXT,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    product_details TEXT NOT NULL,
    quantity TEXT NOT NULL,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'contacted' | 'resolved'
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.warriors_wholesale_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert access to wholesale requests" ON public.warriors_wholesale_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all access to admin wholesale requests" ON public.warriors_wholesale_requests FOR ALL USING (true);

-- 7. Table des Administrateurs
CREATE TABLE public.warriors_admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.warriors_admins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to admin accounts" ON public.warriors_admins FOR ALL USING (true);

-- ==========================================
-- SEED DATA (DONNÉES INITIALES)
-- ==========================================

-- Insérer l'administrateur par défaut (admin / adminwarriors2026)
INSERT INTO public.warriors_admins (username, password_hash)
VALUES ('admin', '$2b$10$xRDMTOWsGwNoXKY/zfum1.1qJOYkf0w.VV/GEo4UH.I.MDyRZHCCy')
ON CONFLICT (username) DO NOTHING;

-- Insérer les Catégories
INSERT INTO public.warriors_categories (name, slug, description, image_url) VALUES
('Viandes', 'viandes', 'Sélection de viandes fraîches et de qualité supérieure (bœuf, mouton, cabri, pintade).', '/images-rayon/nos-viandes.jpg'),
('Épices', 'epices', 'Épices naturelles et aromates locaux moulus ou entiers pour sublimer vos plats.', '/images-rayon/nos-epices.jpg'),
('Farines', 'farines', 'Farines locales béninoises riches en nutriments pour vos bouillies, pâtes et pâtisseries.', '/images-rayon/nos-farines.jpg'),
('Produits Transformés', 'transformes', 'Produits agroalimentaires locaux transformés avec soin (huiles, pâte d''arachide, miel).', '/images-rayon/produits-transformes.jpg');

-- Récupérer les UUIDs des catégories pour l'insertion des produits
-- Nous utiliserons une requête avec sous-requête basée sur le slug.

-- Produits de la catégorie Viandes
INSERT INTO public.warriors_products (category_id, name, slug, description, price, unit, image_url, is_featured)
VALUES 
((SELECT id FROM public.warriors_categories WHERE slug = 'viandes'), 'Viande de Bœuf', 'viande-de-boeuf', 'Viande de bœuf fraîche, découpée selon vos préférences (avec ou sans os). Issue d''élevages locaux sains.', 4000, 'kg', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600', true),
((SELECT id FROM public.warriors_categories WHERE slug = 'viandes'), 'Viande de Mouton', 'viande-de-mouton', 'Viande de mouton tendre et savoureuse pour vos ragoûts et grillades.', 4500, 'kg', '/images-articles/viande-de-mouton.png', true),
((SELECT id FROM public.warriors_categories WHERE slug = 'viandes'), 'Viande de Cabri', 'viande-de-cabri', 'Viande de cabri fraîche de qualité supérieure, idéale pour les sauces locales.', 5000, 'kg', 'https://images.unsplash.com/photo-1524450373400-58079f298816?auto=format&fit=crop&q=80&w=600', false),
((SELECT id FROM public.warriors_categories WHERE slug = 'viandes'), 'Poulet Bicyclette', 'poulet-bicyclette', 'Poulet local béninois élevé en plein air. Chair ferme et savoureuse (prix indicatif 4000 - 4500 FCFA selon taille).', 4000, 'pièce', 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&q=80&w=600', true),
((SELECT id FROM public.warriors_categories WHERE slug = 'viandes'), 'Pintade', 'pintade', 'Pintade locale fraîche, nettoyée et prête à la cuisson. Idéale pour les fêtes.', 5500, 'pièce', 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&q=80&w=600', false),
((SELECT id FROM public.warriors_categories WHERE slug = 'viandes'), 'Blokoto (Pied de bœuf)', 'blokoto', 'Pied de bœuf découpé en morceaux, parfait pour préparer la fameuse sauce Blokoto traditionnelle.', 3500, 'lot', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600', false),
((SELECT id FROM public.warriors_categories WHERE slug = 'viandes'), 'Viande Hachée', 'viande-hachee', 'Viande de bœuf pure fraîchement hachée, sans additifs.', 4000, 'kg', 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80&w=600', false);

-- Produits de la catégorie Épices (avec formats)
INSERT INTO public.warriors_products (category_id, name, slug, description, price, unit, formats, image_url, is_featured)
VALUES 
((SELECT id FROM public.warriors_categories WHERE slug = 'epices'), 'Curcuma', 'curcuma', 'Curcuma local pur séché et réduit en poudre, excellent antioxydant.', 1000, 'format', '[{"name": "250g", "price": 1000}, {"name": "500g", "price": 1800}, {"name": "1kg", "price": 3500}]'::jsonb, '/images-articles/curcuma.png', true),
((SELECT id FROM public.warriors_categories WHERE slug = 'epices'), 'Poivre Noir', 'poivre-noir', 'Poivre noir moulu de première qualité, arôme intense.', 1000, 'format', '[{"name": "250g", "price": 1000}, {"name": "500g", "price": 1800}]'::jsonb, '/images-articles/poivre-noir.jpg', true),
((SELECT id FROM public.warriors_categories WHERE slug = 'epices'), 'Poivre Blanc', 'poivre-blanc', 'Poivre blanc raffiné en poudre pour vos sauces blanches et grillades.', 2500, 'format', '[{"name": "250g", "price": 2500}, {"name": "500g", "price": 4800}]'::jsonb, '/images-articles/poivre-blanc.jpg', false),
((SELECT id FROM public.warriors_categories WHERE slug = 'epices'), 'Clou de Girofle', 'clou-de-girofle', 'Clous de girofle entiers ou moulus pour parfumer vos thés, bouillies et plats.', 1000, 'format', '[{"name": "250g", "price": 1000}, {"name": "500g", "price": 1800}]'::jsonb, 'https://images.unsplash.com/photo-1609144883398-356a6552a4ea?auto=format&fit=crop&q=80&w=600', false),
((SELECT id FROM public.warriors_categories WHERE slug = 'epices'), 'Romarin sec', 'romarin', 'Herbes de romarin séchées, idéales pour assaisonner les viandes rôties.', 1000, 'format', '[{"name": "250g", "price": 1000}, {"name": "500g", "price": 1800}]'::jsonb, '/images-articles/romarin.jpg', false),
((SELECT id FROM public.warriors_categories WHERE slug = 'epices'), 'Thym', 'thym', 'Thym séché sélectionné, parfait pour vos marinades.', 1000, 'format', '[{"name": "250g", "price": 1000}, {"name": "500g", "price": 1800}]'::jsonb, '/images-articles/thym.jpg', false),
((SELECT id FROM public.warriors_categories WHERE slug = 'epices'), 'Herbes de Provence', 'herbes-de-provence', 'Mélange traditionnel d''herbes séchées pour toutes vos grillades.', 1000, 'format', '[{"name": "250g", "price": 1000}, {"name": "500g", "price": 1800}]'::jsonb, '/images-articles/herbes-de-provence.jpg', false),
((SELECT id FROM public.warriors_categories WHERE slug = 'epices'), 'Piment en Poudre', 'piment-en-poudre', 'Piment rouge local piquant moulu, pour relever vos plats.', 1000, 'format', '[{"name": "250g", "price": 1000}, {"name": "500g", "price": 1800}]'::jsonb, '/images-articles/piment-en-poudre.jpg', true),
((SELECT id FROM public.warriors_categories WHERE slug = 'epices'), 'Cumin', 'cumin', 'Cumin moulu au parfum chaud et épicé.', 1600, 'format', '[{"name": "250g", "price": 1600}, {"name": "500g", "price": 3000}]'::jsonb, '/images-articles/cumin.jpg', false),
((SELECT id FROM public.warriors_categories WHERE slug = 'epices'), 'Kouka', 'kouka', 'Épice traditionnelle locale réputée pour ses vertus et sa saveur unique.', 1000, 'format', '[{"name": "250g", "price": 1000}, {"name": "500g", "price": 1800}]'::jsonb, '/images-articles/kouka.jpg', false),
((SELECT id FROM public.warriors_categories WHERE slug = 'epices'), 'Goussi (Pépites de courge)', 'goussi', 'Goussi moulu de qualité supérieure pour la préparation de la sauce Egoussi.', 1000, 'format', '[{"name": "250g", "price": 1000}, {"name": "500g", "price": 1800}]'::jsonb, '/images-articles/goussi.jpg', false),
((SELECT id FROM public.warriors_categories WHERE slug = 'epices'), 'Gorona', 'gorona', 'Épice locale traditionnelle pour parfumer et relever les sauces.', 1000, 'format', '[{"name": "250g", "price": 1000}, {"name": "500g", "price": 1800}]'::jsonb, '/images-articles/gorona.jpg', false),
((SELECT id FROM public.warriors_categories WHERE slug = 'epices'), 'Asrokouin', 'asrokouin', 'Poivre de Selim traditionnel, idéal pour les sauces et bouillies.', 1000, 'format', '[{"name": "250g", "price": 1000}, {"name": "500g", "price": 1800}]'::jsonb, 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600', false),
((SELECT id FROM public.warriors_categories WHERE slug = 'epices'), 'Frétin', 'fretin', 'Petits poissons séchés et moulus en poudre, pour rehausser le goût de vos sauces.', 1500, 'format', '[{"name": "250g", "price": 1500}, {"name": "500g", "price": 2800}]'::jsonb, '/images-articles/fretin.jpg', false);

-- Produits de la catégorie Farines (avec formats)
INSERT INTO public.warriors_products (category_id, name, slug, description, price, unit, formats, image_url, is_featured)
VALUES 
((SELECT id FROM public.warriors_categories WHERE slug = 'farines'), 'Farine de Télibo (Cossette d''igname)', 'farine-de-telibo', 'Farine d''igname de qualité supérieure pour la préparation de l''Amala / Télibo traditionnel.', 750, 'format', '[{"name": "500g", "price": 750}, {"name": "1kg", "price": 1500}]'::jsonb, '/images-articles/farine-de-telibo.jpg', true),
((SELECT id FROM public.warriors_categories WHERE slug = 'farines'), 'Farine de Soja', 'farine-de-soja', 'Farine de soja grillé, riche en protéines, parfaite pour fortifier les bouillies pour enfants et adultes.', 750, 'format', '[{"name": "500g", "price": 750}, {"name": "1kg", "price": 1500}]'::jsonb, '/images-articles/farine-de-soja.jpg', true),
((SELECT id FROM public.warriors_categories WHERE slug = 'farines'), 'Farine de Mil', 'farine-de-mil', 'Farine de mil pur, idéale pour la préparation de bouillies nutritives traditionnelles.', 500, 'format', '[{"name": "500g", "price": 500}, {"name": "1kg", "price": 1000}]'::jsonb, 'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?auto=format&fit=crop&q=80&w=600', false),
((SELECT id FROM public.warriors_categories WHERE slug = 'farines'), 'Farine de Sorgho', 'farine-de-sorgho', 'Farine de sorgho rouge riche en fer et nutriments, excellente pour la santé.', 500, 'format', '[{"name": "500g", "price": 500}, {"name": "1kg", "price": 1000}]'::jsonb, '/images-articles/farine-de-sorgho.jpg', false),
((SELECT id FROM public.warriors_categories WHERE slug = 'farines'), 'Farine de Baobab', 'farine-de-baobab', 'Poudre de pulpe de fruit de Baobab (Pain de singe), riche en vitamine C et fibres.', 2500, 'format', '[{"name": "500g", "price": 2500}, {"name": "1kg", "price": 4500}]'::jsonb, 'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?auto=format&fit=crop&q=80&w=600', true),
((SELECT id FROM public.warriors_categories WHERE slug = 'farines'), 'Farine de Maïs', 'farine-de-mais', 'Farine de maïs blanc ou jaune sélectionné pour la pâte et les bouillies.', 700, 'format', '[{"name": "500g", "price": 700}, {"name": "1kg", "price": 1200}]'::jsonb, 'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?auto=format&fit=crop&q=80&w=600', false);

-- Produits de la catégorie Produits Transformés
INSERT INTO public.warriors_products (category_id, name, slug, description, price, unit, formats, image_url, is_featured)
VALUES 
((SELECT id FROM public.warriors_categories WHERE slug = 'transformes'), 'Pâte d''arachide', 'pate-d-arachide', 'Pâte d''arachide crémeuse et 100% naturelle, sans additifs ni huiles ajoutées. Idéale pour les sauces.', 500, 'format', '[{"name": "250g", "price": 500}, {"name": "500g", "price": 1500}]'::jsonb, '/images-articles/pate-d-arachide.png', true),
((SELECT id FROM public.warriors_categories WHERE slug = 'transformes'), 'Huile d''arachide', 'huile-d-arachide', 'Huile d''arachide pure extraite localement de manière artisanale et saine.', 1000, 'format', '[{"name": "500ml", "price": 1000}, {"name": "1L", "price": 2000}]'::jsonb, '/images-articles/huile-d-arachide.jpg', true),
((SELECT id FROM public.warriors_categories WHERE slug = 'transformes'), 'Miel', 'miel-naturel', 'Miel sauvage 100% pur récolté dans les forêts béninoises. Qualité garantie sans sucre ajouté.', 2000, 'format', '[{"name": "500ml", "price": 2000}, {"name": "1L", "price": 4000}]'::jsonb, '/images-articles/miel.png', true),
((SELECT id FROM public.warriors_categories WHERE slug = 'transformes'), 'Beurre de Karité', 'beurre-de-karite', 'Beurre de karité brut pur, extrait dans le nord du Bénin. Idéal pour l''usage alimentaire et cosmétique.', 500, 'format', '[{"name": "250g", "price": 500}, {"name": "500g", "price": 1000}]'::jsonb, '/images-articles/beurre-de-karite.jpg', false),
((SELECT id FROM public.warriors_categories WHERE slug = 'transformes'), 'Koulikouli', 'koulikouli', 'Koulikouli croquant traditionnel préparé avec de la pâte d''arachide épicée.', 2000, 'sachet', NULL, '/images-articles/koulikouli.jpg', true);
