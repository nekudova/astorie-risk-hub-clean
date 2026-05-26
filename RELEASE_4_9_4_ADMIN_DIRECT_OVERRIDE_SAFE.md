# Business Risk Hub 4.9.4 – Admin Direct Override SAFE

## Proč vznikla tato verze
Verze 4.9.3 měla správně zvýšenou verzi, ale admin patch nebyl přímo napojený na skutečný `renderAdmin()` a `adminPanel()`. Proto se v aplikaci zobrazoval starý Admin.

## Opravy
- Přímé přepsání `renderAdmin()`.
- Přímé přepsání `adminPanel()`.
- Vrácena profesionální sekce Textace.
- Vrácena Admin sekce Dokumenty.
- Opravené zobrazení Uživatelů a rolí.
- Přidána karta Dokumenty mezi admin záložky.
- Zachováno: 4.9.2 Smart Offers / Porovnání.

## Nasazení
Po nasazení musí log ukazovat:
- `/static/js/app.js?v=494`
- `/static/css/style.css?v=494`

Build: 2026-05-26 06:34:38
