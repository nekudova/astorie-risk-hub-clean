import json
import os
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

import httpx
import psycopg2
import psycopg2.extras
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

BASE_DIR = os.path.dirname(__file__)
DATABASE_URL = os.getenv("DATABASE_URL", "").strip()
APP_VERSION = "5.2.4"
APP_RELEASE_NAME = "PROJECT_CENTER_WORKFLOW_SAFE"
APP_ENV = os.getenv("APP_ENV", os.getenv("ENVIRONMENT", "TEST")).strip().upper() or "TEST"
BUILD_ID = os.getenv("RENDER_GIT_COMMIT", os.getenv("BUILD_ID", "zip-5.2.4"))[:12]

app = FastAPI(title="ASTORIE Business Risk Hub", version=APP_VERSION)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/static", StaticFiles(directory=os.path.join(BASE_DIR, "static")), name="static")
templates = Jinja2Templates(directory=os.path.join(BASE_DIR, "templates"))

@app.middleware("http")
async def add_release_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-ASTORIE-BRH-Version"] = APP_VERSION
    response.headers["X-ASTORIE-BRH-Release"] = APP_RELEASE_NAME
    response.headers["X-ASTORIE-BRH-Environment"] = APP_ENV
    # HTML a JS/CSS assety při testování nesmí zůstat zamrzlé v prohlížeči.
    if request.url.path == "/" or request.url.path.startswith("/static/"):
        response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"
    return response



def _connect():
    if not DATABASE_URL:
        return None
    return psycopg2.connect(DATABASE_URL)


def init_db() -> bool:
    conn = _connect()
    if not conn:
        return False
    try:
        with conn, conn.cursor() as cur:
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS clients (
                    id SERIAL PRIMARY KEY,
                    ico TEXT,
                    name TEXT NOT NULL,
                    legal_form TEXT,
                    address TEXT,
                    data_box TEXT,
                    contact_person TEXT,
                    contact_email TEXT,
                    contact_phone TEXT,
                    website TEXT,
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                    UNIQUE(ico)
                );
                """
            )
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS inquiries (
                    id SERIAL PRIMARY KEY,
                    client_id INTEGER REFERENCES clients(id),
                    title TEXT NOT NULL,
                    status TEXT NOT NULL DEFAULT 'rozpracováno',
                    adviser_email TEXT,
                    adviser_name TEXT,
                    activity_code TEXT,
                    activity_name TEXT,
                    insurance_start TEXT,
                    insurance_period TEXT,
                    turnover TEXT,
                    employees TEXT,
                    territory TEXT,
                    export_info TEXT,
                    selected_insurers JSONB DEFAULT '[]'::jsonb,
                    additional_requirements JSONB DEFAULT '[]'::jsonb,
                    risks JSONB DEFAULT '[]'::jsonb,
                    full_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                );
                """
            )

            # Bezpečná migrace pro existující databáze ze starších MVP verzí.
            # Pokud tabulka inquiries už existovala, CREATE TABLE IF NOT EXISTS ji nezmění,
            # proto všechny nové sloupce doplňujeme samostatně.
            inquiry_migrations = [
                "ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS client_id INTEGER REFERENCES clients(id);",
                "ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS title TEXT;",
                "ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'rozpracováno';",
                "ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS adviser_email TEXT;",
                "ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS adviser_name TEXT;",
                "ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS activity_code TEXT;",
                "ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS activity_name TEXT;",
                "ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS insurance_start TEXT;",
                "ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS insurance_period TEXT;",
                "ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS turnover TEXT;",
                "ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS employees TEXT;",
                "ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS territory TEXT;",
                "ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS export_info TEXT;",
                "ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS selected_insurers JSONB DEFAULT '[]'::jsonb;",
                "ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS additional_requirements JSONB DEFAULT '[]'::jsonb;",
                "ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS risks JSONB DEFAULT '[]'::jsonb;",
                "ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS full_payload JSONB NOT NULL DEFAULT '{}'::jsonb;",
                "ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();",
                "ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();",
                "ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;",
                "ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS deleted_by TEXT;",
            ]
            for stmt in inquiry_migrations:
                cur.execute(stmt)
            cur.execute("UPDATE inquiries SET title = COALESCE(NULLIF(title,''), 'Poptávka – klient') WHERE title IS NULL OR title='';")
            cur.execute("UPDATE inquiries SET status = COALESCE(NULLIF(status,''), 'rozpracováno') WHERE status IS NULL OR status='';")
            cur.execute(
                """
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
                """
            )
            cur.execute(
                """
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
                """
            )
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS audit_log (
                    id SERIAL PRIMARY KEY,
                    entity_type TEXT NOT NULL,
                    entity_id INTEGER,
                    action TEXT NOT NULL,
                    actor_email TEXT,
                    detail JSONB DEFAULT '{}'::jsonb,
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                );
                """
            )
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS catalog_settings (
                    key TEXT PRIMARY KEY,
                    value JSONB NOT NULL,
                    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                );
                """
            )
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS feedback_suggestions (
                    id SERIAL PRIMARY KEY,
                    type TEXT,
                    area TEXT,
                    priority TEXT,
                    title TEXT NOT NULL,
                    detail TEXT NOT NULL,
                    status TEXT NOT NULL DEFAULT 'nový',
                    actor_email TEXT,
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                );
                """
            )
            # ASTORIE Projektové centrum – samostatný interní Trello-like modul.
            # Nedotýká se obchodních případů ani pojistných workflow tabulek.
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS dev_projects (
                    id SERIAL PRIMARY KEY,
                    title TEXT NOT NULL,
                    description TEXT DEFAULT '',
                    owner_name TEXT DEFAULT '',
                    owner_email TEXT DEFAULT '',
                    status TEXT NOT NULL DEFAULT 'Aktivní',
                    priority TEXT NOT NULL DEFAULT 'Standardní',
                    module_area TEXT DEFAULT '',
                    start_date TEXT DEFAULT '',
                    due_date TEXT DEFAULT '',
                    version_target TEXT DEFAULT '',
                    tags JSONB DEFAULT '[]'::jsonb,
                    archived BOOLEAN NOT NULL DEFAULT FALSE,
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                );
                """
            )
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS dev_tasks (
                    id SERIAL PRIMARY KEY,
                    project_id INTEGER REFERENCES dev_projects(id) ON DELETE CASCADE,
                    title TEXT NOT NULL,
                    description TEXT DEFAULT '',
                    column_key TEXT NOT NULL DEFAULT 'napady',
                    priority TEXT NOT NULL DEFAULT 'Standardní',
                    assignee_name TEXT DEFAULT '',
                    assignee_email TEXT DEFAULT '',
                    reporter_name TEXT DEFAULT '',
                    due_date TEXT DEFAULT '',
                    checklist JSONB DEFAULT '[]'::jsonb,
                    attachments JSONB DEFAULT '[]'::jsonb,
                    sort_order INTEGER DEFAULT 0,
                    archived BOOLEAN NOT NULL DEFAULT FALSE,
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                );
                """
            )
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS dev_comments (
                    id SERIAL PRIMARY KEY,
                    task_id INTEGER REFERENCES dev_tasks(id) ON DELETE CASCADE,
                    author_name TEXT DEFAULT '',
                    author_email TEXT DEFAULT '',
                    text TEXT NOT NULL,
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                );
                """
            )
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS dev_activity (
                    id SERIAL PRIMARY KEY,
                    entity_type TEXT NOT NULL,
                    entity_id INTEGER,
                    action TEXT NOT NULL,
                    actor_email TEXT DEFAULT '',
                    detail JSONB DEFAULT '{}'::jsonb,
                    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
                );
                """
            )
            for key, filename in [
                ('activities', 'activities.json'),
                ('risks', 'risks.json'),
                ('insurers', 'insurers.json'),
                ('advisers', 'advisers.json'),
                ('requirementTypes', 'requirement_types.json'),
                ('coverageDictionary', 'coverage_dictionary.json'),
                ('policyReferences', 'policy_references.json'),
                ('riskModel', 'risk_model.json'),
                ('textTemplates', 'text_templates.json'),
                ('attachmentTypes', 'attachment_types.json'),
                ('liabilityRisks', 'liability_risks.json'),
                ('liabilityAgreements', 'liability_agreements.json'),
                ('users', 'users.json'),
                ('modulePermissions', 'module_permissions.json'),
                ('roleProfiles', 'role_profiles.json'),
            ]:
                cur.execute("SELECT 1 FROM catalog_settings WHERE key=%s", (key,))
                if not cur.fetchone():
                    cur.execute(
                        "INSERT INTO catalog_settings (key, value) VALUES (%s, %s::jsonb)",
                        (key, json.dumps(load_json(filename))),
                    )
        return True
    finally:
        conn.close()


@app.on_event("startup")
def startup_event():
    try:
        init_db()
    except Exception as exc:
        print(f"DB init skipped/failed: {exc}")


def load_json(filename: str) -> Any:
    with open(os.path.join(BASE_DIR, "data", filename), "r", encoding="utf-8") as f:
        return json.load(f)


@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request, "app_version": APP_VERSION, "app_release_name": APP_RELEASE_NAME, "app_env": APP_ENV, "build_id": BUILD_ID})

@app.head("/")
def home_head():
    return JSONResponse(content={})


@app.get("/health")
def health():
    ok = False
    try:
        ok = init_db()
    except Exception:
        ok = False
    return {"ok": True, "database_connected": ok, "version": APP_VERSION, "name": f"Business Risk Hub {APP_VERSION} - {APP_RELEASE_NAME}", "environment": APP_ENV, "build_id": BUILD_ID}



@app.get("/version")
def version():
    return {
        "ok": True,
        "version": APP_VERSION,
        "name": f"Business Risk Hub {APP_VERSION} - {APP_RELEASE_NAME}",
        "environment": APP_ENV,
        "build_id": BUILD_ID,
        "database_configured": bool(DATABASE_URL),
    }


def get_catalogs() -> Dict[str, Any]:
    fallback = {
        "activities": load_json("activities.json"),
        "risks": load_json("risks.json"),
        "insurers": load_json("insurers.json"),
        "advisers": load_json("advisers.json"),
        "requirementTypes": load_json("requirement_types.json"),
        "coverageDictionary": load_json("coverage_dictionary.json"),
        "policyReferences": load_json("policy_references.json"),
        "riskModel": load_json("risk_model.json"),
        "textTemplates": load_json("text_templates.json"),
        "liabilityRisks": load_json("liability_risks.json"),
        "liabilityAgreements": load_json("liability_agreements.json"),
        "attachmentTypes": load_json("attachment_types.json"),
    }
    conn = _connect()
    if not conn:
        return fallback
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("SELECT key, value FROM catalog_settings")
            rows = cur.fetchall()
            for row in rows:
                fallback[row["key"]] = row["value"]
            return fallback
    except Exception as exc:
        print(f"Catalog DB fallback: {exc}")
        return fallback
    finally:
        conn.close()


@app.get("/api/catalog")
def catalog():
    return get_catalogs()


@app.get("/api/admin/catalogs")
def admin_catalogs():
    return {"ok": True, "catalogs": get_catalogs()}


@app.post("/api/admin/catalogs")
async def save_admin_catalogs(request: Request):
    payload = await request.json()
    conn = _connect()
    if not conn:
        raise HTTPException(status_code=503, detail="Databáze není připojena.")
    allowed = {"insurers", "advisers", "requirementTypes", "riskModel", "activities", "risks", "coverageDictionary", "policyReferences", "textTemplates", "attachmentTypes", "liabilityRisks", "liabilityAgreements", "users", "modulePermissions", "roleProfiles"}
    try:
        with conn, conn.cursor() as cur:
            for key in allowed:
                if key in payload:
                    cur.execute(
                        """
                        INSERT INTO catalog_settings (key, value, updated_at)
                        VALUES (%s, %s::jsonb, NOW())
                        ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value, updated_at=NOW()
                        """,
                        (key, json.dumps(payload[key])),
                    )
            cur.execute(
                "INSERT INTO audit_log (entity_type, action, actor_email, detail) VALUES (%s,%s,%s,%s::jsonb)",
                ("catalog", "update", payload.get("actor_email") or "", json.dumps({"keys": list(payload.keys())})),
            )
        return {"ok": True, "message": "Admin číselníky byly uloženy do databáze."}
    finally:
        conn.close()


@app.get("/api/ares/{ico}")
async def ares(ico: str):
    ico_clean = "".join(ch for ch in ico if ch.isdigit())
    if len(ico_clean) != 8:
        raise HTTPException(status_code=400, detail="IČO musí mít 8 číslic.")
    url = f"https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/{ico_clean}"
    try:
        async with httpx.AsyncClient(timeout=12) as client:
            r = await client.get(url)
        if r.status_code == 404:
            raise HTTPException(status_code=404, detail="Subjekt nebyl v ARES nalezen.")
        r.raise_for_status()
        data = r.json()
        sidlo = data.get("sidlo") or {}
        adresa = sidlo.get("textovaAdresa") or ""
        return {
            "ico": data.get("ico") or ico_clean,
            "name": data.get("obchodniJmeno") or "",
            "legal_form": str(data.get("pravniForma") or ""),
            "address": adresa,
            "data_box": data.get("datovaSchranka") or "",
        }
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"ARES není dostupný: {exc}")


def upsert_client(cur, client: Dict[str, Any]) -> int:
    ico = (client.get("ico") or "").strip()
    name = (client.get("name") or "Bez názvu klienta").strip()
    values = {
        "ico": ico or None,
        "name": name,
        "legal_form": client.get("legal_form") or "",
        "address": client.get("address") or "",
        "data_box": client.get("data_box") or "",
        "contact_person": client.get("contact_person") or "",
        "contact_email": client.get("contact_email") or "",
        "contact_phone": client.get("contact_phone") or "",
        "website": client.get("website") or "",
    }
    if ico:
        cur.execute(
            """
            INSERT INTO clients (ico, name, legal_form, address, data_box, contact_person, contact_email, contact_phone, website)
            VALUES (%(ico)s, %(name)s, %(legal_form)s, %(address)s, %(data_box)s, %(contact_person)s, %(contact_email)s, %(contact_phone)s, %(website)s)
            ON CONFLICT (ico) DO UPDATE SET
              name=EXCLUDED.name,
              legal_form=EXCLUDED.legal_form,
              address=EXCLUDED.address,
              data_box=EXCLUDED.data_box,
              contact_person=EXCLUDED.contact_person,
              contact_email=EXCLUDED.contact_email,
              contact_phone=EXCLUDED.contact_phone,
              website=EXCLUDED.website,
              updated_at=NOW()
            RETURNING id;
            """,
            values,
        )
    else:
        cur.execute(
            """
            INSERT INTO clients (name, legal_form, address, data_box, contact_person, contact_email, contact_phone, website)
            VALUES (%(name)s, %(legal_form)s, %(address)s, %(data_box)s, %(contact_person)s, %(contact_email)s, %(contact_phone)s, %(website)s)
            RETURNING id;
            """,
            values,
        )
    return cur.fetchone()[0]


@app.get("/api/clients")
def list_clients(q: str = ""):
    conn = _connect()
    if not conn:
        return {"ok": True, "db": False, "items": []}
    try:
        init_db()
        term = (q or "").strip()
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            if term:
                like = f"%{term}%"
                cur.execute(
                    """
                    SELECT id, ico, name, legal_form, address, data_box, contact_person, contact_email, contact_phone, website, updated_at
                    FROM clients
                    WHERE COALESCE(ico,'') ILIKE %s OR COALESCE(name,'') ILIKE %s
                    ORDER BY updated_at DESC NULLS LAST, id DESC
                    LIMIT 50
                    """,
                    (like, like),
                )
            else:
                cur.execute(
                    """
                    SELECT id, ico, name, legal_form, address, data_box, contact_person, contact_email, contact_phone, website, updated_at
                    FROM clients
                    ORDER BY updated_at DESC NULLS LAST, id DESC
                    LIMIT 50
                    """
                )
            rows = cur.fetchall()
            for row in rows:
                if row.get("updated_at"):
                    row["updated_at"] = row["updated_at"].isoformat()
            return {"ok": True, "db": True, "items": rows}
    except Exception as exc:
        print(f"List clients failed: {exc}")
        return {"ok": False, "db": True, "items": [], "message": f"Klienty se nepodařilo načíst: {exc}"}
    finally:
        conn.close()


@app.get("/api/clients/{client_id}")
def get_client(client_id: int):
    conn = _connect()
    if not conn:
        raise HTTPException(status_code=503, detail="Databáze není připojena.")
    try:
        init_db()
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(
                """
                SELECT id, ico, name, legal_form, address, data_box, contact_person, contact_email, contact_phone, website
                FROM clients WHERE id=%s
                """,
                (client_id,),
            )
            row = cur.fetchone()
            if not row:
                raise HTTPException(status_code=404, detail="Klient nebyl nalezen.")
            return {"ok": True, "item": row}
    finally:
        conn.close()


@app.post("/api/inquiries")
async def save_inquiry(request: Request):
    payload = await request.json()
    conn = _connect()
    if not conn:
        # fallback so UI is still usable if DB is not connected
        return {"ok": True, "db": False, "id": None, "message": "Databáze není připojena. Data jsou pouze v prohlížeči."}
    try:
        with conn, conn.cursor() as cur:
            client_id = upsert_client(cur, payload.get("client") or {})
            inquiry_id = payload.get("id")
            title = payload.get("title") or f"Poptávka – {(payload.get('client') or {}).get('name') or 'klient'}"
            data = {
                "client_id": client_id,
                "title": title,
                "status": payload.get("status") or "rozpracováno",
                "adviser_email": (payload.get("adviser") or {}).get("email") or "",
                "adviser_name": (payload.get("adviser") or {}).get("name") or "",
                "activity_code": (payload.get("activity") or {}).get("code") or "",
                "activity_name": (payload.get("activity") or {}).get("name") or "",
                "insurance_start": (payload.get("questionnaire") or {}).get("insurance_start") or "",
                "insurance_period": (payload.get("questionnaire") or {}).get("insurance_period") or "",
                "turnover": (payload.get("questionnaire") or {}).get("turnover") or "",
                "employees": (payload.get("questionnaire") or {}).get("employees") or "",
                "territory": (payload.get("questionnaire") or {}).get("territory") or "",
                "export_info": (payload.get("questionnaire") or {}).get("export_info") or "",
                "selected_insurers": json.dumps(payload.get("selected_insurers") or []),
                "additional_requirements": json.dumps(payload.get("additional_requirements") or []),
                "risks": json.dumps(payload.get("risks") or []),
                "full_payload": json.dumps(payload),
            }
            if inquiry_id:
                data["id"] = inquiry_id
                cur.execute(
                    """
                    UPDATE inquiries SET
                      client_id=%(client_id)s, title=%(title)s, status=%(status)s,
                      adviser_email=%(adviser_email)s, adviser_name=%(adviser_name)s,
                      activity_code=%(activity_code)s, activity_name=%(activity_name)s,
                      insurance_start=%(insurance_start)s, insurance_period=%(insurance_period)s,
                      turnover=%(turnover)s, employees=%(employees)s, territory=%(territory)s, export_info=%(export_info)s,
                      selected_insurers=%(selected_insurers)s::jsonb,
                      additional_requirements=%(additional_requirements)s::jsonb,
                      risks=%(risks)s::jsonb,
                      full_payload=%(full_payload)s::jsonb,
                      updated_at=NOW()
                    WHERE id=%(id)s
                    RETURNING id;
                    """,
                    data,
                )
                row = cur.fetchone()
                if not row:
                    raise HTTPException(status_code=404, detail="Poptávka nebyla nalezena.")
                saved_id = row[0]
                action = "update"
            else:
                cur.execute(
                    """
                    INSERT INTO inquiries (
                      client_id, title, status, adviser_email, adviser_name, activity_code, activity_name,
                      insurance_start, insurance_period, turnover, employees, territory, export_info,
                      selected_insurers, additional_requirements, risks, full_payload
                    ) VALUES (
                      %(client_id)s, %(title)s, %(status)s, %(adviser_email)s, %(adviser_name)s, %(activity_code)s, %(activity_name)s,
                      %(insurance_start)s, %(insurance_period)s, %(turnover)s, %(employees)s, %(territory)s, %(export_info)s,
                      %(selected_insurers)s::jsonb, %(additional_requirements)s::jsonb, %(risks)s::jsonb, %(full_payload)s::jsonb
                    ) RETURNING id;
                    """,
                    data,
                )
                saved_id = cur.fetchone()[0]
                action = "create"
            cur.execute(
                "INSERT INTO audit_log (entity_type, entity_id, action, actor_email, detail) VALUES (%s,%s,%s,%s,%s::jsonb)",
                ("inquiry", saved_id, action, data["adviser_email"], json.dumps({"title": title, "client_id": client_id})),
            )
        return {"ok": True, "db": True, "id": saved_id, "message": "Poptávka byla uložena do databáze."}
    finally:
        conn.close()


@app.get("/api/inquiries")
def list_inquiries():
    conn = _connect()
    if not conn:
        return {"ok": True, "db": False, "items": []}
    try:
        # Zajistí doplnění sloupců i u databáze vytvořené starší verzí aplikace.
        init_db()
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            # DŮLEŽITÉ: počet nabídek nepočítáme SQL funkcemi jsonb_object_length.
            # Na některých PostgreSQL/typových kombinacích na Renderu tato funkce padá.
            # Proto načteme payload a bezpečně dopočítáme počty v Pythonu.
            cur.execute(
                """
                SELECT
                    i.id,
                    COALESCE(NULLIF(i.title,''), 'Poptávka – klient') AS title,
                    COALESCE(NULLIF(i.status,''), 'rozpracováno') AS status,
                    COALESCE(i.activity_name, i.full_payload->'activity'->>'name', '') AS activity_name,
                    COALESCE(i.activity_code, i.full_payload->'activity'->>'code', '') AS activity_code,
                    COALESCE(i.adviser_name, i.full_payload->'adviser'->>'name', '') AS adviser_name,
                    COALESCE(i.adviser_email, i.full_payload->'adviser'->>'email', '') AS adviser_email,
                    i.created_at,
                    i.updated_at,
                    COALESCE(c.ico, i.full_payload->'client'->>'ico', '') AS ico,
                    COALESCE(c.name, i.full_payload->'client'->>'name', '') AS client_name,
                    i.selected_insurers,
                    i.full_payload,
                    COALESCE(i.full_payload->'report'->>'client_selected_offer', '') AS client_selected_offer
                FROM inquiries i
                LEFT JOIN clients c ON c.id = i.client_id
                WHERE i.deleted_at IS NULL
                ORDER BY i.updated_at DESC NULLS LAST, i.id DESC
                LIMIT 500;
                """
            )
            rows = cur.fetchall()
            items = []
            for r in rows:
                payload = r.get("full_payload") or {}
                if isinstance(payload, str):
                    try:
                        payload = json.loads(payload)
                    except Exception:
                        payload = {}
                if not isinstance(payload, dict):
                    payload = {}

                offers = payload.get("offers") or {}
                if isinstance(offers, dict):
                    offer_count = len(offers)
                elif isinstance(offers, list):
                    offer_count = len(offers)
                else:
                    offer_count = 0

                selected = r.get("selected_insurers")
                if isinstance(selected, str):
                    try:
                        selected = json.loads(selected)
                    except Exception:
                        selected = []
                if isinstance(selected, list):
                    selected_count = len(selected)
                else:
                    selected_count = 0

                item = dict(r)
                item.pop("full_payload", None)
                item.pop("selected_insurers", None)
                item["offer_count"] = offer_count
                item["selected_insurer_count"] = selected_count
                for k in ("created_at", "updated_at"):
                    if item.get(k):
                        item[k] = item[k].isoformat()
                items.append(item)
            return {"ok": True, "db": True, "items": items}
    except Exception as exc:
        print(f"List inquiries failed: {exc}")
        return {"ok": False, "db": True, "items": [], "message": f"Nepodařilo se načíst obchodní případy: {exc}"}
    finally:
        conn.close()


@app.get("/api/inquiries/{inquiry_id}")
def get_inquiry(inquiry_id: int):
    conn = _connect()
    if not conn:
        raise HTTPException(status_code=503, detail="Databáze není připojena.")
    try:
        init_db()
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("""
                SELECT i.*, c.ico, c.name AS client_name, c.legal_form, c.address, c.data_box,
                       c.contact_person, c.contact_email, c.contact_phone, c.website
                FROM inquiries i
                LEFT JOIN clients c ON c.id = i.client_id
                WHERE i.id=%s AND i.deleted_at IS NULL
            """, (inquiry_id,))
            row = cur.fetchone()
            if not row:
                raise HTTPException(status_code=404, detail="Poptávka nebyla nalezena.")
            item = row.get("full_payload") or {}
            if isinstance(item, str):
                try:
                    item = json.loads(item)
                except Exception:
                    item = {}
            if not isinstance(item, dict):
                item = {}
            item["id"] = row.get("id")
            item["status"] = row.get("status") or item.get("status") or "rozpracováno"
            item.setdefault("title", row.get("title") or "")
            item.setdefault("adviser", {"name": row.get("adviser_name") or "", "email": row.get("adviser_email") or ""})
            item.setdefault("activity", {"code": row.get("activity_code") or "", "name": row.get("activity_name") or ""})
            if not item.get("client"):
                item["client"] = {
                    "ico": row.get("ico") or "", "name": row.get("client_name") or "",
                    "legal_form": row.get("legal_form") or "", "address": row.get("address") or "",
                    "data_box": row.get("data_box") or "", "contact_person": row.get("contact_person") or "",
                    "contact_email": row.get("contact_email") or "", "contact_phone": row.get("contact_phone") or "",
                    "website": row.get("website") or "",
                }
            return {"ok": True, "item": item}
    finally:
        conn.close()

@app.post("/api/inquiries/{inquiry_id}/delete")
async def delete_inquiry(inquiry_id: int, request: Request):
    payload = await request.json()
    actor_email = (payload.get("actor_email") or "").strip().lower()
    actor_role = (payload.get("actor_role") or "").strip().lower()
    conn = _connect()
    if not conn:
        return {"ok": True, "db": False, "message": "Databáze není připojena. Poptávku lze odstranit jen lokálně v prohlížeči."}
    try:
        init_db()
        with conn, conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("SELECT id, adviser_email, title FROM inquiries WHERE id=%s AND deleted_at IS NULL", (inquiry_id,))
            row = cur.fetchone()
            if not row:
                raise HTTPException(status_code=404, detail="Poptávka nebyla nalezena nebo už byla odstraněna.")
            owner_email = (row.get("adviser_email") or "").strip().lower()
            if actor_role != "admin" and actor_email and owner_email and actor_email != owner_email:
                raise HTTPException(status_code=403, detail="Poradce může odstranit pouze vlastní poptávku.")
            cur.execute("UPDATE inquiries SET deleted_at=NOW(), deleted_by=%s, updated_at=NOW() WHERE id=%s", (actor_email, inquiry_id))
            cur.execute(
                "INSERT INTO audit_log (entity_type, entity_id, action, actor_email, detail) VALUES (%s,%s,%s,%s,%s::jsonb)",
                ("inquiry", inquiry_id, "soft_delete", actor_email, json.dumps({"title": row.get("title") or ""})),
            )
        return {"ok": True, "db": True, "message": "Poptávka byla odstraněna z aktivního přehledu."}
    finally:
        conn.close()


@app.post("/api/suggestions")
async def save_suggestion(request: Request):
    payload = await request.json()
    title = (payload.get("title") or "").strip()
    detail = (payload.get("detail") or "").strip()
    if not title or not detail:
        raise HTTPException(status_code=400, detail="Doplňte název a popis námětu.")
    conn = _connect()
    if not conn:
        return {"ok": True, "db": False, "message": "Databáze není připojena. Námět nebyl trvale uložen."}
    try:
        with conn, conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO feedback_suggestions (type, area, priority, title, detail, actor_email)
                VALUES (%s,%s,%s,%s,%s,%s)
                RETURNING id;
                """,
                (
                    payload.get("type") or "Jiné",
                    payload.get("area") or "",
                    payload.get("priority") or "běžné",
                    title,
                    detail,
                    payload.get("actor_email") or "",
                ),
            )
            saved_id = cur.fetchone()[0]
            cur.execute(
                "INSERT INTO audit_log (entity_type, entity_id, action, actor_email, detail) VALUES (%s,%s,%s,%s,%s::jsonb)",
                ("suggestion", saved_id, "create", payload.get("actor_email") or "", json.dumps({"title": title})),
            )
        return {"ok": True, "db": True, "id": saved_id, "message": "Námět byl uložen do databáze."}
    finally:
        conn.close()


@app.get("/api/suggestions")
def list_suggestions():
    conn = _connect()
    if not conn:
        return {"ok": True, "db": False, "items": []}
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(
                """
                SELECT id, type, area, priority, title, detail, status, actor_email, created_at
                FROM feedback_suggestions
                ORDER BY created_at DESC
                LIMIT 100;
                """
            )
            rows = cur.fetchall()
            for r in rows:
                if r.get("created_at"):
                    r["created_at"] = r["created_at"].isoformat()
            return {"ok": True, "db": True, "items": rows}
    finally:
        conn.close()


# -----------------------------------------------------------------------------
# ASTORIE Projektové centrum – Trello-like interní řízení vývoje a projektů
# Bezpečně odděleno od obchodních případů Business Risk Hubu.
# -----------------------------------------------------------------------------
PROJECT_COLUMNS = [
    {"key": "napady", "title": "Nápady"},
    {"key": "ke_schvaleni", "title": "Ke schválení"},
    {"key": "zadani", "title": "Zadání"},
    {"key": "vyvoj", "title": "Vývoj"},
    {"key": "testovani", "title": "Testování"},
    {"key": "nasazeni", "title": "Nasazení"},
    {"key": "hotovo", "title": "Hotovo"},
]


def _seed_project_center():
    return {
        "columns": PROJECT_COLUMNS,
        "projects": [
            {"id": 1, "title": "Modul Odpovědnost", "description": "Rozvoj odpovědnostního modulu v Business Risk Hubu.", "owner_name": "Dagmar Nekudová", "status": "Aktivní", "priority": "Kritická", "module_area": "Business Risk Hub", "version_target": "5.x", "due_date": "", "tags": ["HUB", "odpovědnost"]},
            {"id": 2, "title": "Modul Majetek", "description": "Příprava dalšího pojišťovacího modulu.", "owner_name": "", "status": "Příprava", "priority": "Vysoká", "module_area": "Business Risk Hub", "version_target": "6.x", "due_date": "", "tags": ["HUB", "majetek"]},
        ],
        "tasks": [
            {"id": 1, "project_id": 1, "title": "Stabilizovat karty 8, 9 a 11", "description": "Ukládání, porovnání a klientský výstup.", "column_key": "testovani", "priority": "Kritická", "assignee_name": "Vývoj", "due_date": ""},
            {"id": 2, "project_id": 2, "title": "Připravit zadání majetkového modulu", "description": "Rozsah polí, rizika, podklady a výstupy.", "column_key": "zadani", "priority": "Vysoká", "assignee_name": "Backoffice", "due_date": ""},
        ],
        "comments": [],
        "activity": [],
        "db": False,
    }


@app.get("/api/project-center")
def project_center_data():
    conn = _connect()
    if not conn:
        data = _seed_project_center(); data["ok"] = True; return data
    try:
        init_db()
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("SELECT * FROM dev_projects WHERE archived=FALSE ORDER BY updated_at DESC, id DESC")
            projects = cur.fetchall()
            cur.execute("SELECT * FROM dev_tasks WHERE archived=FALSE ORDER BY sort_order ASC, updated_at DESC, id DESC")
            tasks = cur.fetchall()
            cur.execute("SELECT * FROM dev_comments ORDER BY created_at ASC LIMIT 1000")
            comments = cur.fetchall()
            cur.execute("SELECT * FROM dev_activity ORDER BY created_at DESC LIMIT 80")
            activity = cur.fetchall()
            for coll in (projects, tasks, comments, activity):
                for row in coll:
                    for k in ("created_at", "updated_at"):
                        if row.get(k): row[k] = row[k].isoformat()
            return {"ok": True, "db": True, "columns": PROJECT_COLUMNS, "projects": projects, "tasks": tasks, "comments": comments, "activity": activity}
    finally:
        conn.close()


@app.post("/api/project-center/projects")
async def save_project_center_project(request: Request):
    payload = await request.json()
    title = (payload.get("title") or "").strip()
    if not title:
        raise HTTPException(status_code=400, detail="Doplňte název projektu.")
    conn = _connect()
    if not conn:
        return {"ok": True, "db": False, "message": "Databáze není připojena. Projekt nebyl trvale uložen."}
    try:
        init_db()
        with conn, conn.cursor() as cur:
            data = {
                "id": payload.get("id"), "title": title, "description": payload.get("description") or "",
                "owner_name": payload.get("owner_name") or "", "owner_email": payload.get("owner_email") or "",
                "status": payload.get("status") or "Aktivní", "priority": payload.get("priority") or "Standardní",
                "module_area": payload.get("module_area") or "", "start_date": payload.get("start_date") or "",
                "due_date": payload.get("due_date") or "", "version_target": payload.get("version_target") or "",
                "tags": json.dumps(payload.get("tags") or []), "actor_email": payload.get("actor_email") or ""
            }
            if data["id"]:
                cur.execute("""
                    UPDATE dev_projects SET title=%(title)s, description=%(description)s, owner_name=%(owner_name)s,
                    owner_email=%(owner_email)s, status=%(status)s, priority=%(priority)s, module_area=%(module_area)s,
                    start_date=%(start_date)s, due_date=%(due_date)s, version_target=%(version_target)s,
                    tags=%(tags)s::jsonb, updated_at=NOW() WHERE id=%(id)s RETURNING id
                """, data)
                row = cur.fetchone(); action = "update"
                if not row: raise HTTPException(status_code=404, detail="Projekt nebyl nalezen.")
                saved_id = row[0]
            else:
                cur.execute("""
                    INSERT INTO dev_projects (title, description, owner_name, owner_email, status, priority, module_area, start_date, due_date, version_target, tags)
                    VALUES (%(title)s,%(description)s,%(owner_name)s,%(owner_email)s,%(status)s,%(priority)s,%(module_area)s,%(start_date)s,%(due_date)s,%(version_target)s,%(tags)s::jsonb)
                    RETURNING id
                """, data)
                saved_id = cur.fetchone()[0]; action = "create"
            cur.execute("INSERT INTO dev_activity (entity_type, entity_id, action, actor_email, detail) VALUES (%s,%s,%s,%s,%s::jsonb)", ("project", saved_id, action, data["actor_email"], json.dumps({"title": title})))
        return {"ok": True, "db": True, "id": saved_id, "message": "Projekt byl uložen."}
    finally:
        conn.close()


@app.post("/api/project-center/tasks")
async def save_project_center_task(request: Request):
    payload = await request.json()
    title = (payload.get("title") or "").strip()
    if not title:
        raise HTTPException(status_code=400, detail="Doplňte název úkolu.")
    conn = _connect()
    if not conn:
        return {"ok": True, "db": False, "message": "Databáze není připojena. Úkol nebyl trvale uložen."}
    try:
        init_db()
        with conn, conn.cursor() as cur:
            data = {
                "id": payload.get("id"), "project_id": payload.get("project_id"), "title": title,
                "description": payload.get("description") or "", "column_key": payload.get("column_key") or "napady",
                "priority": payload.get("priority") or "Standardní", "assignee_name": payload.get("assignee_name") or "",
                "assignee_email": payload.get("assignee_email") or "", "reporter_name": payload.get("reporter_name") or "",
                "due_date": payload.get("due_date") or "", "checklist": json.dumps(payload.get("checklist") or []),
                "attachments": json.dumps(payload.get("attachments") or []), "sort_order": int(payload.get("sort_order") or 0),
                "actor_email": payload.get("actor_email") or ""
            }
            if data["id"]:
                cur.execute("""
                    UPDATE dev_tasks SET project_id=%(project_id)s, title=%(title)s, description=%(description)s,
                    column_key=%(column_key)s, priority=%(priority)s, assignee_name=%(assignee_name)s,
                    assignee_email=%(assignee_email)s, reporter_name=%(reporter_name)s, due_date=%(due_date)s,
                    checklist=%(checklist)s::jsonb, attachments=%(attachments)s::jsonb, sort_order=%(sort_order)s,
                    updated_at=NOW() WHERE id=%(id)s RETURNING id
                """, data)
                row=cur.fetchone(); action="update"
                if not row: raise HTTPException(status_code=404, detail="Úkol nebyl nalezen.")
                saved_id=row[0]
            else:
                cur.execute("""
                    INSERT INTO dev_tasks (project_id,title,description,column_key,priority,assignee_name,assignee_email,reporter_name,due_date,checklist,attachments,sort_order)
                    VALUES (%(project_id)s,%(title)s,%(description)s,%(column_key)s,%(priority)s,%(assignee_name)s,%(assignee_email)s,%(reporter_name)s,%(due_date)s,%(checklist)s::jsonb,%(attachments)s::jsonb,%(sort_order)s) RETURNING id
                """, data)
                saved_id=cur.fetchone()[0]; action="create"
            cur.execute("INSERT INTO dev_activity (entity_type, entity_id, action, actor_email, detail) VALUES (%s,%s,%s,%s,%s::jsonb)", ("task", saved_id, action, data["actor_email"], json.dumps({"title": title, "column": data["column_key"]})))
        return {"ok": True, "db": True, "id": saved_id, "message": "Úkol byl uložen."}
    finally:
        conn.close()


@app.post("/api/project-center/tasks/{task_id}/move")
async def move_project_center_task(task_id: int, request: Request):
    payload = await request.json()
    column_key = payload.get("column_key") or "napady"
    conn = _connect()
    if not conn:
        return {"ok": True, "db": False, "message": "Databáze není připojena. Přesun není trvale uložen."}
    try:
        init_db()
        with conn, conn.cursor() as cur:
            cur.execute("UPDATE dev_tasks SET column_key=%s, updated_at=NOW() WHERE id=%s RETURNING id", (column_key, task_id))
            if not cur.fetchone(): raise HTTPException(status_code=404, detail="Úkol nebyl nalezen.")
            cur.execute("INSERT INTO dev_activity (entity_type, entity_id, action, actor_email, detail) VALUES (%s,%s,%s,%s,%s::jsonb)", ("task", task_id, "move", payload.get("actor_email") or "", json.dumps({"column_key": column_key})))
        return {"ok": True, "db": True, "message": "Úkol byl přesunut."}
    finally:
        conn.close()


@app.post("/api/project-center/comments")
async def save_project_center_comment(request: Request):
    payload = await request.json()
    text = (payload.get("text") or "").strip()
    if not text:
        raise HTTPException(status_code=400, detail="Komentář je prázdný.")
    conn = _connect()
    if not conn:
        return {"ok": True, "db": False, "message": "Databáze není připojena. Komentář nebyl trvale uložen."}
    try:
        init_db()
        with conn, conn.cursor() as cur:
            cur.execute("INSERT INTO dev_comments (task_id, author_name, author_email, text) VALUES (%s,%s,%s,%s) RETURNING id", (payload.get("task_id"), payload.get("author_name") or "", payload.get("author_email") or "", text))
            saved_id=cur.fetchone()[0]
            cur.execute("INSERT INTO dev_activity (entity_type, entity_id, action, actor_email, detail) VALUES (%s,%s,%s,%s,%s::jsonb)", ("task", payload.get("task_id"), "comment", payload.get("author_email") or "", json.dumps({"comment_id": saved_id})))
        return {"ok": True, "db": True, "id": saved_id, "message": "Komentář byl uložen."}
    finally:
        conn.close()
