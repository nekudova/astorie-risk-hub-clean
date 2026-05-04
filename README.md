# ASTORIE Business Risk Hub – MVP 0.44

Bezpečná verze navazující na 0.43.

## Hlavní změna
- přidán jasný kontext **Aktivní poptávka**,
- menu Nabídky / Porovnání / Zpráva / AI vždy pracuje s aktuální poptávkou,
- pokud není poptávka založená nebo načtená, aplikace poradce vrátí do Poptávky,
- po načtení nebo uložení poptávky je jasně vidět, s čím poradce pracuje.

## Zachováno
- DB,
- ARES,
- Moje poptávky,
- Admin,
- Nabídky,
- Porovnání,
- Zpráva/PDF,
- dosavadní datové struktury.

Render nastavení:
- Build: `pip install -r requirements.txt`
- Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
