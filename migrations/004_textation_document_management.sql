CREATE TABLE IF NOT EXISTS brh_textation_reviews (
 id BIGSERIAL PRIMARY KEY,
 template_id BIGINT,
 action TEXT,
 reviewer TEXT,
 note TEXT,
 created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS brh_document_categories (
 id BIGSERIAL PRIMARY KEY,
 code TEXT,
 name TEXT,
 active BOOLEAN DEFAULT TRUE
);
