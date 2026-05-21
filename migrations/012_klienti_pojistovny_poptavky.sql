-- Business Risk Hub 2.9.0 – Klienti, pojišťovny a poptávky

CREATE TABLE IF NOT EXISTS brh_klienti (
  id BIGSERIAL PRIMARY KEY,
  nazev TEXT NOT NULL,
  ico TEXT,
  dic TEXT,
  adresa TEXT,
  cinnost TEXT,
  kontakt TEXT,
  email TEXT,
  telefon TEXT,
  obrat TEXT,
  zamestnanci TEXT,
  uzemi TEXT,
  poradce TEXT,
  poznamka TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS brh_pojistovny (
  id BIGSERIAL PRIMARY KEY,
  nazev TEXT NOT NULL,
  zkratka TEXT,
  email TEXT,
  kontakt TEXT,
  portal TEXT,
  aktivni BOOLEAN DEFAULT TRUE,
  poznamka TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS brh_poptavky_pojistovnam (
  id BIGSERIAL PRIMARY KEY,
  case_id TEXT,
  klient_id TEXT,
  pojistovna_id TEXT,
  limit_pozadovany TEXT,
  spoluucast_pozadovana TEXT,
  termin_odpovedi DATE,
  rozsah TEXT,
  stav TEXT DEFAULT 'připraveno k odeslání',
  created_at TIMESTAMPTZ DEFAULT now()
);
