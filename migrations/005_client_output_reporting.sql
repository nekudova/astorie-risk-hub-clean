ALTER TABLE brh_offers
ADD COLUMN IF NOT EXISTS client_report_note TEXT;

CREATE TABLE IF NOT EXISTS brh_client_reports (
 id BIGSERIAL PRIMARY KEY,
 case_id BIGINT,
 generated_by TEXT,
 report_version TEXT,
 created_at TIMESTAMPTZ DEFAULT now()
);
