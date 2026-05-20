-- ============================================================
-- ASTORIE Business Risk Hub 2.1.0 – Workflow Engine
-- Bezpečná migrace: pouze ADD COLUMN IF NOT EXISTS / CREATE TABLE IF NOT EXISTS
-- ============================================================

ALTER TABLE brh_cases ADD COLUMN IF NOT EXISTS workflow_owner TEXT;
ALTER TABLE brh_cases ADD COLUMN IF NOT EXISTS workflow_last_change TIMESTAMPTZ;
ALTER TABLE brh_cases ADD COLUMN IF NOT EXISTS workflow_note TEXT;

ALTER TABLE brh_case_insurers ADD COLUMN IF NOT EXISTS request_email_subject TEXT;
ALTER TABLE brh_case_insurers ADD COLUMN IF NOT EXISTS request_email_body TEXT;
ALTER TABLE brh_case_insurers ADD COLUMN IF NOT EXISTS request_sent_by TEXT;

ALTER TABLE brh_offers ADD COLUMN IF NOT EXISTS internal_note TEXT;
ALTER TABLE brh_offers ADD COLUMN IF NOT EXISTS client_visible_note TEXT;

CREATE TABLE IF NOT EXISTS brh_workflow_events (
  id BIGSERIAL PRIMARY KEY,
  case_id BIGINT,
  workflow_step TEXT,
  action TEXT NOT NULL,
  note TEXT,
  user_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
