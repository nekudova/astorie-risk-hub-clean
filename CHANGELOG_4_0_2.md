# Business Risk Hub 4.0.2 – Release Identity Fix & Visible Build Check

## Účel
Oprava skutečného zobrazení verze po nasazení. Předchozí balík obsahoval části 4.0.2, ale hlavní zdroj verze v aplikaci zůstal na předchozí hodnotě.

## Opraveno
- APP_VERSION v `app/main.py` je 4.0.2.
- Frontend `app/static/js/app.js` má VERSION 4.0.2.
- `/version` a `/health` vrací 4.0.2.
- `VERSION.txt`, changelog a manifest jsou sjednocené na 4.0.2.
- Pokud není nastaveno APP_ENV, aplikace zobrazí TEST místo UNSET.

## Bezpečnost
- DB beze změn.
- Žádné destruktivní migrace.
- Workflow, CASE data, dokumenty a textace beze změn.
