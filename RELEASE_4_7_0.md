# Business Risk Hub 4.9.4 – Professional Cards Integration SAFE

## Hlavní změna
Karta poradce je integrována přímo do původního `renderWorkspace()` rendereru. Nejde o DOM hack ani nový globální click controller.

## Opraveno / doplněno
- přidána záložka `0. Karta poradce`,
- karta poradce má vlastní formulář,
- ASTORIE a.s. + IČO 48293776,
- zachován původní tab engine,
- přidán bezpečný `tabAttachments()` renderer,
- deduplikace vybraných pojišťoven ve workflow,
- verze aplikace 4.9.4,
- assety generované přes template jako `v=494`.

## Bezpečnost
- bez DB migrace,
- bez změny API endpointů,
- bez změny CASE_ID,
- bez globálních click listenerů,
- bez přepisování Pojišťovny / Nabídky / Porovnání / Kontrola.

Build: 2026-05-25 08:47:27
