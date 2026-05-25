# Business Risk Hub 4.6.1 – Emergency Layout SAFE

## Účel
Okamžitá stabilizace po chybné verzi 4.6.1, kde se karta poradce vykreslovala mimo pracovní prostor a blokovala/rozbíjela zobrazení dalších karet.

## Co tato verze dělá
- vrací layout na stabilní workflow základ,
- odstraňuje rozbitý 4.6.1 tab-controller,
- odstraňuje chybné vkládání karty poradce mimo pracovní prostor,
- zachovává stávající funkční moduly,
- nastavuje assety na `v=461`.

## Co záměrně nedělá
- nepřidává novou kartu poradce,
- nemění DB,
- nemění API,
- nemění CASE_ID,
- nepřepisuje renderer nabídek.

## Nasazení
Po nasazení v logu ověřit:
- `/static/js/app.js?v=461`
- `/static/css/style.css?v=461`

Build: 2026-05-25 08:14:04
