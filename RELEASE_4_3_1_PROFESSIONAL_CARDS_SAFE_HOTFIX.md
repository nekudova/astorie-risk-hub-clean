# Business Risk Hub 4.6.0 – Advisor Professional Cards Workflow SAFE

## Účel
Oprava po verzi 4.3.0, kde přepsání hlavního renderování způsobilo nefunkční tlačítka.

## Co je opraveno
- odstraněn rizikový princip z 4.3.0,
- nepřepisuje se `renderWorkspace`,
- nepřidává se globální click listener,
- tlačítka a původní workflow zůstávají ze stabilní 4.2.2.

## Co je připraveno
- bezpečné funkce pro kartu poradce,
- bezpečné funkce pro kartu klienta,
- bezpečné funkce pro kontaktní osoby,
- bezpečné funkce pro kartu pojištění.

## Co není vynuceno
Karty nejsou násilně napojené přes přepsání hlavního workflow. To bude nutné provést až bezpečně po ověření, že se nic nerozbilo.

## DB
Bez migrace. Bez destruktivních změn.

Build: 2026-05-25 05:53:57
