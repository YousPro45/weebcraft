-- ============================================================
-- WebCraft Maroc — Complete Supabase Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. PROFILES (extends auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT,
  full_name   TEXT,
  avatar_url  TEXT,
  role        TEXT DEFAULT 'admin',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by owner" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Profiles are updatable by owner" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO profiles(id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- 2. NICHES / CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS niches (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  description TEXT,
  icon        TEXT,
  emoji       TEXT,
  color       TEXT DEFAULT '#1E90D4',
  is_active   BOOLEAN DEFAULT TRUE,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE niches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Niches readable by all"        ON niches FOR SELECT USING (TRUE);
CREATE POLICY "Niches writable by admins"     ON niches FOR ALL   USING (auth.role() = 'authenticated');

INSERT INTO niches (name, slug, emoji, color, sort_order) VALUES
  ('Restaurant',         'restaurant',   '🍽️', '#C0392B', 1),
  ('Santé / Clinique',   'sante',        '🏥', '#2255A4', 2),
  ('Hôtellerie',         'hotellerie',   '🏨', '#0D1F3C', 3),
  ('Fitness / Gym',      'fitness',      '💪', '#E67E22', 4),
  ('E-commerce',         'ecommerce',    '🛒', '#1E90D4', 5),
  ('Avocat / Juridique', 'avocat',       '⚖️', '#1A3A6B', 6),
  ('Salon de Beauté',    'beaute',       '💇', '#8E44AD', 7),
  ('Construction / BTP', 'construction', '🏗️', '#D4A017', 8),
  ('Agence / Services',  'agence',       '🏢', '#1A3A6B', 9),
  ('Voyage / Tourisme',  'voyage',       '✈️', '#1E90D4', 10)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 3. SERVICES
-- ============================================================
CREATE TABLE IF NOT EXISTS services (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  description TEXT,
  short_desc  TEXT,
  icon        TEXT,
  color       TEXT DEFAULT '#1E90D4',
  is_featured BOOLEAN DEFAULT FALSE,
  is_active   BOOLEAN DEFAULT TRUE,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Services readable by all"    ON services FOR SELECT USING (TRUE);
CREATE POLICY "Services writable by admins" ON services FOR ALL   USING (auth.role() = 'authenticated');

INSERT INTO services (title, slug, short_desc, color, sort_order) VALUES
  ('Création de Site Web',     'creation-site-web',    'Sites vitrines modernes et rapides', '#1E90D4', 1),
  ('E-commerce',               'ecommerce',            'Boutiques en ligne complètes',        '#1A3A6B', 2),
  ('Référencement SEO',        'seo',                  'Visibilité sur Google garantie',      '#2255A4', 3),
  ('Développement Sur Mesure', 'dev-sur-mesure',       'Applications web complexes',          '#1E90D4', 4),
  ('Réseaux Sociaux',          'reseaux-sociaux',      'Gestion des réseaux et publicités',   '#1A3A6B', 5),
  ('Design & Identité',        'design-identite',      'Logo, charte graphique, branding',    '#2255A4', 6)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 4. PRICING PLANS
-- ============================================================
CREATE TABLE IF NOT EXISTS pricing_plans (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  subtitle    TEXT,
  price       NUMERIC NOT NULL DEFAULT 0,
  currency    TEXT DEFAULT 'MAD',
  period      TEXT DEFAULT 'paiement unique',
  features    JSONB DEFAULT '[]'::JSONB,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active   BOOLEAN DEFAULT TRUE,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Plans readable by all"    ON pricing_plans FOR SELECT USING (TRUE);
CREATE POLICY "Plans writable by admins" ON pricing_plans FOR ALL   USING (auth.role() = 'authenticated');

INSERT INTO pricing_plans (name, subtitle, price, is_featured, sort_order, features) VALUES
  ('Starter',   'Site Vitrine',      2500, FALSE, 1, '["5 pages professionnelles","Design responsive","Formulaire de contact","SEO de base","Hébergement 1 an","Livraison en 7 jours"]'::JSONB),
  ('Business',  'Site Pro Complet',  5500, TRUE,  2, '["10 pages personnalisées","Design premium sur mesure","Blog / Actualités","Réservation en ligne","SEO avancé","Hébergement 1 an","Support 3 mois","Livraison en 10 jours"]'::JSONB),
  ('E-commerce','Boutique en Ligne', 9900, FALSE, 3, '["Produits illimités","Paiement sécurisé","Gestion commandes","Dashboard admin","SEO e-commerce","Hébergement 1 an","Support 6 mois","Livraison en 14 jours"]'::JSONB)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 5. PORTFOLIO PROJECTS
-- ============================================================
CREATE TABLE IF NOT EXISTS portfolio_projects (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  niche_id    UUID REFERENCES niches(id) ON DELETE SET NULL,
  description TEXT,
  short_desc  TEXT,
  client_name TEXT,
  website_url TEXT,
  cover_image TEXT,
  tags        TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT FALSE,
  is_active   BOOLEAN DEFAULT TRUE,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Projects readable by all"    ON portfolio_projects FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Projects writable by admins" ON portfolio_projects FOR ALL   USING (auth.role() = 'authenticated');

-- ============================================================
-- 6. PORTFOLIO IMAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS portfolio_images (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id   UUID REFERENCES portfolio_projects(id) ON DELETE CASCADE,
  url          TEXT NOT NULL,
  storage_path TEXT,
  alt_text     TEXT,
  is_primary   BOOLEAN DEFAULT FALSE,
  sort_order   INT DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE portfolio_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Images readable by all"    ON portfolio_images FOR SELECT USING (TRUE);
CREATE POLICY "Images writable by admins" ON portfolio_images FOR ALL   USING (auth.role() = 'authenticated');

-- ============================================================
-- 7. TESTIMONIALS
-- ============================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  role        TEXT,
  company     TEXT,
  niche       TEXT,
  niche_emoji TEXT,
  content     TEXT NOT NULL,
  rating      INT DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  avatar_url  TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Testimonials readable if published" ON testimonials FOR SELECT USING (is_published = TRUE OR auth.role() = 'authenticated');
CREATE POLICY "Testimonials writable by admins"    ON testimonials FOR ALL   USING (auth.role() = 'authenticated');

INSERT INTO testimonials (name, role, company, niche, niche_emoji, content, rating, is_published) VALUES
  ('Karim El Fassi',        'Propriétaire',     'Le Jardin Restaurant', 'Restaurant', '🍽️', 'WebCraft a créé notre site en moins de 10 jours. Les réservations en ligne ont augmenté de 40% !',         5, TRUE),
  ('Dr. Samira Benali',     'Médecin',          'Clinique MediCare',    'Clinique',   '🏥', 'Le site de ma clinique est parfait. Les patients prennent rendez-vous en ligne maintenant.',                 5, TRUE),
  ('Youssef Tachfine',      'Gérant',           'FitZone Gym',         'Gym',        '💪', 'Notre salle de sport a doublé ses inscriptions depuis la mise en ligne du site.',                            5, TRUE),
  ('Fatima Zahra Idrissi',  'Fondatrice',       'Boutique Chériffa',   'E-commerce', '🛒', 'Ma boutique e-commerce fonctionne parfaitement. Les commandes arrivent même la nuit !',                     5, TRUE)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 8. CONTACT SUBMISSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_submissions (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT,
  subject    TEXT,
  message    TEXT NOT NULL,
  status     TEXT DEFAULT 'new' CHECK (status IN ('new','read','replied','archived')),
  notes      TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert contact"          ON contact_submissions FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admins can read/update contacts"    ON contact_submissions FOR ALL   USING (auth.role() = 'authenticated');

-- ============================================================
-- 9. QUOTE REQUESTS
-- ============================================================
CREATE TABLE IF NOT EXISTS quote_requests (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  phone         TEXT,
  company       TEXT,
  niche         TEXT,
  budget        TEXT,
  timeline      TEXT,
  description   TEXT,
  selected_plan TEXT,
  status        TEXT DEFAULT 'new' CHECK (status IN ('new','contacted','in_progress','completed','cancelled')),
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert quote"        ON quote_requests FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admins can manage quotes"       ON quote_requests FOR ALL   USING (auth.role() = 'authenticated');

-- ============================================================
-- 10. BLOG CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS blog_categories (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  slug       TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Blog cats readable by all"    ON blog_categories FOR SELECT USING (TRUE);
CREATE POLICY "Blog cats writable by admins" ON blog_categories FOR ALL   USING (auth.role() = 'authenticated');

INSERT INTO blog_categories (name, slug) VALUES
  ('Conseils Web',      'conseils-web'),
  ('SEO & Marketing',   'seo-marketing'),
  ('E-commerce',        'ecommerce'),
  ('Design',            'design'),
  ('Actualités',        'actualites')
ON CONFLICT DO NOTHING;

-- ============================================================
-- 11. BLOG POSTS
-- ============================================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  excerpt         TEXT,
  content         TEXT,
  cover_image     TEXT,
  category_id     UUID REFERENCES blog_categories(id) ON DELETE SET NULL,
  author_id       UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status          TEXT DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  seo_title       TEXT,
  seo_description TEXT,
  tags            TEXT[] DEFAULT '{}',
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published posts readable by all" ON blog_posts FOR SELECT USING (status = 'published' OR auth.role() = 'authenticated');
CREATE POLICY "Posts writable by admins"        ON blog_posts FOR ALL   USING (auth.role() = 'authenticated');

-- ============================================================
-- 12. NEWSLETTER SUBSCRIBERS
-- ============================================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email      TEXT UNIQUE NOT NULL,
  is_active  BOOLEAN DEFAULT TRUE,
  source     TEXT DEFAULT 'website',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe"           ON newsletter_subscribers FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admins can manage subscribers"  ON newsletter_subscribers FOR ALL   USING (auth.role() = 'authenticated');

-- ============================================================
-- 13. SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS settings (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key        TEXT UNIQUE NOT NULL,
  value      TEXT,
  type       TEXT DEFAULT 'text',
  label      TEXT,
  grp        TEXT DEFAULT 'general',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Settings readable by all"    ON settings FOR SELECT USING (TRUE);
CREATE POLICY "Settings writable by admins" ON settings FOR ALL   USING (auth.role() = 'authenticated');

INSERT INTO settings (key, value, label, grp) VALUES
  ('site_name',    'WebCraft Maroc',            'Nom du site',      'general'),
  ('site_tagline', 'Agence Web Professionnelle', 'Slogan',          'general'),
  ('phone',        '+212 658 242 225',           'Téléphone',       'contact'),
  ('whatsapp',     '212658242225',               'WhatsApp (sans +)','contact'),
  ('email',        'webcraft50@gmail.com',       'Email',           'contact'),
  ('address',      'Maroc',                      'Adresse',         'contact'),
  ('facebook',     '',                           'Facebook URL',    'social'),
  ('instagram',    '',                           'Instagram URL',   'social'),
  ('linkedin',     '',                           'LinkedIn URL',    'social')
ON CONFLICT DO NOTHING;

-- ============================================================
-- 14. SEO SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS seo_settings (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page        TEXT UNIQUE NOT NULL,
  title       TEXT,
  description TEXT,
  keywords    TEXT,
  og_image    TEXT,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "SEO readable by all"    ON seo_settings FOR SELECT USING (TRUE);
CREATE POLICY "SEO writable by admins" ON seo_settings FOR ALL   USING (auth.role() = 'authenticated');

INSERT INTO seo_settings (page, title, description) VALUES
  ('home',      'WebCraft Maroc — Création de Sites Web Professionnels', 'Agence web au Maroc. Sites web pour restaurants, cliniques, hôtels, e-commerce et tous les secteurs.'),
  ('portfolio', 'Portfolio — WebCraft Maroc',                            'Découvrez nos réalisations pour tous les secteurs d''activité.'),
  ('blog',      'Blog — WebCraft Maroc',                                 'Conseils, astuces et actualités sur la création de sites web au Maroc.')
ON CONFLICT DO NOTHING;

-- ============================================================
-- STORAGE BUCKETS (run separately or in Supabase dashboard)
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-images', 'portfolio-images', TRUE);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', TRUE);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('assets', 'assets', TRUE);
-- CREATE POLICY "Public read portfolio" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-images');
-- CREATE POLICY "Auth upload portfolio" ON storage.objects FOR INSERT USING (auth.role() = 'authenticated' AND bucket_id = 'portfolio-images');
