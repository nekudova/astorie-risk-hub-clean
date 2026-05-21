# Business Risk Hub 2.9.1a – Recovery Build

## Účel
Oprava stavu, kdy verze 2.9.1 zobrazila pouze levé menu přes celou šířku a pracovní plocha nebyla použitelná.

## Opraveno
- `#appView` je znovu dvousloupcový pracovní layout.
- Levý sidebar zůstává vlevo, pracovní obsah je vpravo.
- Modul Klienti / Pojišťovny / Poptávky se znovu bezpečně renderuje.
- Admin, Dokumenty, Textace, DB a migrace nejsou smazané ani destruktivně změněné.
- Staré demo workflow/comparison rooty zůstávají potlačené tak, aby nevznikaly duplicitní vývojové obrazovky.

## Nasazení
Nasadit jako výměnu ZIPu na Renderu. Pokud Render stále ukazuje starý stav, spustit redeploy s vyčištěním cache.
