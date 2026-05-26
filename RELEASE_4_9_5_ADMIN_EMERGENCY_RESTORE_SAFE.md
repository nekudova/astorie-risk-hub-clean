# Business Risk Hub 5.0.0 – Data Bindings Production Modules SAFE

## Co je opraveno
- Vrácen Admin na stabilní bázi 5.0.0.
- Zrušeno poškození z 5.0.0, kde ostatní admin sekce spadly do prázdného fallbacku.
- Ostatní admin sekce zůstávají plnohodnotné přes původní editor.
- Upravené pouze tři problematické části:
  - Uživatelé,
  - Dokumenty,
  - Textace.

## Zachováno
- Smart nabídky z 5.0.0.
- Původní editory pojišťoven, příloh, rizik odpovědnosti, ujednání odpovědnosti, import/export.
- Bez DB migrace.
- Bez mazání dat.

## Kontrola po nasazení
V logu musí být:
- `/static/js/app.js?v=500`
- `/static/css/style.css?v=500`

Build: 2026-05-26 07:12:10
