DROP TABLE IF EXISTS clients;

CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    status TEXT DEFAULT 'active',
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial data
INSERT INTO clients (name, email, status, last_activity)
VALUES
    ('Brand Alpha', 'contact@brandalpha.com', 'active', NOW() - INTERVAL '2 days'),
    ('Brand Beta', 'hello@brandbeta.com', 'active', NOW() - INTERVAL '7 days'),
    ('Brand Gamma', 'info@brandgamma.com', 'inactive', NOW() - INTERVAL '14 days'),
    ('Brand Delta', 'team@branddelta.com', 'active', NOW() - INTERVAL '3 hours');
