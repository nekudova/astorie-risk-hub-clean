# Business Risk Hub 4.9.0 – Real Professional Cards SAFE

## Oprava proti 4.7.0
- Karta poradce má skutečný formulář a je napojená na finální `renderWorkspace()`.
- Karta klienta je přepsaná na profesionální kartu s kontaktními osobami a osobami podepisujícími dokumenty.
- Karta pro pojištění je přepsaná na profesionální underwriting kartu.
- Finální renderer je vložen až na konec JS, takže ho nepřepíší starší patch vrstvy.
- Deduplikace vybraných pojišťoven pro Nabídky / Porovnání / Doporučení.

## SAFE
- bez DB migrace,
- bez změny API,
- bez mazání CASE_ID,
- zachování Pojišťovny, Poptávky, Nabídky, Porovnání, Doporučení, Kontrola.

## Po nasazení
V logu má být:
- `/static/js/app.js?v=490`
- `/static/css/style.css?v=490`

Build: 2026-05-25 09:06:07
