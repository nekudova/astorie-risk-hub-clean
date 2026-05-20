-- ============================================================
-- ASTORIE Business Risk Hub 2.2.0 – Offer Engine Foundation
-- Bezpečná migrace: pouze ADD COLUMN IF NOT EXISTS / CREATE TABLE IF NOT EXISTS
-- ============================================================

ALTER TABLE brh_offers ADD COLUMN IF NOT EXISTS offer_quality_score NUMERIC;
ALTER TABLE brh_offers ADD COLUMN IF NOT EXISTS comparison_note TEXT;
ALTER TABLE brh_offers ADD COLUMN IF NOT EXISTS client_summary TEXT;

ALTER TABLE brh_offer_risks ADD COLUMN IF NOT EXISTS risk_name TEXT;
ALTER TABLE brh_offer_risks ADD COLUMN IF NOT EXISTS coverage_quality TEXT DEFAULT 'nutno_ověřit';
ALTER TABLE brh_offer_risks ADD COLUMN IF NOT EXISTS client_visible_note TEXT;
ALTER TABLE brh_offer_risks ADD COLUMN IF NOT EXISTS internal_note TEXT;

CREATE TABLE IF NOT EXISTS brh_offer_validation_events (
  id BIGSERIAL PRIMARY KEY,
  offer_id BIGINT,
  case_id BIGINT,
  validation_status TEXT,
  validation_errors JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
