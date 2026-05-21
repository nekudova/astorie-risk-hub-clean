-- Business Risk Hub 3.3.0 – Smart Nabídky & Textation Workflow PRO
-- Nedestruktivní doplnění pomocných tabulek pro workflow textací a nabídek.

CREATE TABLE IF NOT EXISTS case_textations (
    id SERIAL PRIMARY KEY,
    inquiry_id INTEGER REFERENCES inquiries(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    area TEXT,
    type TEXT,
    text TEXT,
    targets JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS insurer_offer_workflow (
    id SERIAL PRIMARY KEY,
    inquiry_id INTEGER REFERENCES inquiries(id) ON DELETE CASCADE,
    insurer_code TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'rozpracováno',
    sent_at TEXT,
    received_at TEXT,
    premium TEXT,
    insurance_start TEXT,
    insurance_period TEXT,
    payment_frequency TEXT,
    payload JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(inquiry_id, insurer_code)
);
