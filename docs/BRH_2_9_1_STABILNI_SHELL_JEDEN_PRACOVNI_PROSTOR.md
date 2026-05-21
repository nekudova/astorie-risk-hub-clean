# Business Risk Hub 2.9.1 – Stabilní shell + jeden pracovní prostor

Tato verze stabilizuje aplikaci nad větví 2.9.0. Cílem není přidávat další demo funkce, ale sjednotit pracovní plochu tak, aby poradce neviděl duplicitní vývojové bloky z verzí 2.1–2.9.

## Zachováno

- FastAPI backend
- PostgreSQL / Neon napojení
- stávající DB inicializace a migrace
- Admin
- dokumentový modul
- textace včetně moje / centrální / návrhy ke schválení
- nabídky
- porovnání
- klientský výstup
- ASTORIE branding

## Stabilizační zásady

- Jeden aktivní obchodní případ je zdroj pravdy.
- UI nezobrazuje více vývojových verzí najednou.
- Porovnání nevychází z demo dat.
- Doporučení nevybírá aplikace automaticky; potvrzuje jej poradce.
- Databáze se nemaže ani neresetuje.

## Další doporučená fáze

Business Risk Hub 2.9.2 – skutečné propojení aktivního obchodního případu s nabídkami, riziky a porovnáním bez lokálních fallbacků.
