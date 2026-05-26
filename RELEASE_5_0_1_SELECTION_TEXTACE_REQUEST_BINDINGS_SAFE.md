# Business Risk Hub 5.0.2 – Textace Visibility Status Colors SAFE

## Opravy
- Karta 7 generuje poptávky pouze pro pojišťovny skutečně zaškrtnuté v kartě 5.
- Sjednoceny kódy KOOP/koop, GČP/gcp, ČPP/cpp, aby se checkbox a poptávka nerozcházely.
- Produkční Textace nyní reálně vkládá text do poptávky / nabídky / klientského výstupu aktivního případu.
- V každé poptávce je volné pole poradce pro doplnění požadavků.
- Tisk poptávky obsahuje údaje poradce a vložené textace.
- Bez změny databázového schématu.

Kontrola po nasazení:
- /static/js/app.js?v=502
- /static/css/style.css?v=502

Build: 2026-05-26 13:07:26
