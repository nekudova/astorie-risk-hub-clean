# Business Risk Hub 4.6.1 – Click Restore SAFE

## Účel
Stabilizace po chybě 4.6.0, kde po kliknutí na workflow karty mizel obsah.

## Opraveno
- odstraněn rozbitý advisor/tab controller,
- odstraněno vkládání karty poradce mimo původní renderer,
- opraveny assety z `?v=461` na `?v=461`,
- zachován původní workflow renderer.

## Bezpečnost
- bez DB migrace,
- bez změny API,
- bez změny CASE_ID,
- bez zásahu do uložených obchodních případů.

## Po nasazení
V logu musí být:
- `/static/js/app.js?v=461`
- `/static/css/style.css?v=461`

Build: 2026-05-25 08:41:21
