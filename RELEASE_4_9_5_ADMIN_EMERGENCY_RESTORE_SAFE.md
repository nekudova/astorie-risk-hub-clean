# Business Risk Hub 4.9.9 – Smart Prefill Textace Visual SAFE

## Co je opraveno
- Vrácen Admin na stabilní bázi 4.9.9.
- Zrušeno poškození z 4.9.9, kde ostatní admin sekce spadly do prázdného fallbacku.
- Ostatní admin sekce zůstávají plnohodnotné přes původní editor.
- Upravené pouze tři problematické části:
  - Uživatelé,
  - Dokumenty,
  - Textace.

## Zachováno
- Smart nabídky z 4.9.9.
- Původní editory pojišťoven, příloh, rizik odpovědnosti, ujednání odpovědnosti, import/export.
- Bez DB migrace.
- Bez mazání dat.

## Kontrola po nasazení
V logu musí být:
- `/static/js/app.js?v=499`
- `/static/css/style.css?v=499`

Build: 2026-05-26 07:12:10
