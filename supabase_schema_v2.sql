-- SCHEMA AB-APP V4.1 SAAS FINAL
-- Copiez ce code dans l'éditeur SQL de Supabase

-- 1. ENTREPRISES (Multi-tenancy)
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo_url TEXT,
    settings JSONB DEFAULT '{"allow_vendeuse_expense": false}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. PROFILS (Utilisateurs avec Rôles)
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'vendeuse')),
    permissions JSONB DEFAULT '{"can_modify": false, "can_change_price": false}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. PRODUITS (Stock)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    purchase_price DECIMAL(12,2),
    sale_price DECIMAL(12,2),
    qty INTEGER DEFAULT 0,
    max_sale_qty INTEGER, -- Restriction Admin
    is_blocked BOOLEAN DEFAULT FALSE, -- Restriction Admin
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. VENTES (Traçabilité)
CREATE TABLE sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES profiles(id),
    client_id UUID REFERENCES clients(id),
    total DECIMAL(12,2) NOT NULL,
    amount_paid DECIMAL(12,2) NOT NULL,
    payment_type TEXT,
    items JSONB NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. CLIENTS
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. LOGS D'ACTIVITÉ (Pour le Boss)
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES profiles(id),
    action TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
