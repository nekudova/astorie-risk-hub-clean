CREATE TABLE IF NOT EXISTS brh_insurer_requests (
 id BIGSERIAL PRIMARY KEY,
 case_id BIGINT,
 insurer_name TEXT,
 email TEXT,
 subject TEXT,
 body TEXT,
 status TEXT,
 deadline DATE,
 sent_at TIMESTAMPTZ,
 reply_at TIMESTAMPTZ,
 created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS brh_insurer_request_replies (
 id BIGSERIAL PRIMARY KEY,
 request_id BIGINT,
 reply_text TEXT,
 created_at TIMESTAMPTZ DEFAULT now()
);
