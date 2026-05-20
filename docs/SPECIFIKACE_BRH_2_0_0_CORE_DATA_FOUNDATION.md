# Business Risk Hub 2.0.0 – Core Data Foundation

První fáze přestavby. Zachovává admin, dokumenty, textace a stávající UI. Přidává jednotný datový model: CLIENT → CASE → REQUEST → CASE_INSURERS → OFFERS → OFFER_RISKS → COMPARISON → CLIENT_REPORT.

## Zásady
- Jedna poptávka = jeden obchodní případ = jeden CASE_ID.
- Nabídka nesmí existovat bez CASE_ID.
- Krytí nesmí existovat bez risk_key.
- Doporučení nikdy nevzniká automaticky.
- Dokumenty a textace zůstávají jako řízené knihovny.
- Systém počítá s dalšími modely rizik.
