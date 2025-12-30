-- SCHEMA AB-APP V4.1 SAAS - VERSION AVANCÉE
-- Gestion granulaire des rôles et permissions

-- 1. Table des Entreprises
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slogan TEXT,
    logo_url TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    settings JSONB DEFAULT '{"allow_vendeuse_expense": false, "default_lang": "fr"}'::jsonb
);

-- 2. Table des Profils (Utilisateurs)
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'vendeuse')),
    display_name TEXT,
    permissions JSONB DEFAULT '{}'::jsonb, -- Permissions temporaires/spécifiques
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Table des Produits avec restrictions
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    specs TEXT,
    purchase_price DECIMAL(12,2) DEFAULT 0,
    sale_price DECIMAL(12,2) DEFAULT 0,
    qty INTEGER DEFAULT 0,
    alert_qty INTEGER DEFAULT 5,
    max_sale_qty INTEGER DEFAULT NULL, -- Quantité max vendable par une vendeuse
    is_blocked BOOLEAN DEFAULT FALSE, -- Bloquer le produit pour les vendeuses
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Table des Ventes avec traçabilité
CREATE TABLE sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES profiles(id), -- Qui a fait la vente
    client_id UUID REFERENCES clients(id),
    client_name TEXT,
    total DECIMAL(12,2) NOT NULL,
    amount_paid DECIMAL(12,2) NOT NULL,
    payment_type TEXT NOT NULL,
    items JSONB NOT NULL,
    expense DECIMAL(12,2) DEFAULT 0, -- Dépenses additionnelles
    is_modified BOOLEAN DEFAULT FALSE,
    modified_by UUID REFERENCES profiles(id),
    date DATE DEFAULT CURRENT_DATE,
    time TIME DEFAULT CURRENT_TIME,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Table des Logs d'activité
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES profiles(id),
    action_type TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Table des Clients
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Table des Dettes
CREATE TABLE debts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    remaining DECIMAL(12,2) NOT NULL,
    due_date DATE,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
