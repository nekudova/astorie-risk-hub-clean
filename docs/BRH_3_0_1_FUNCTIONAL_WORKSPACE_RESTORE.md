Business Risk Hub 3.0.1 – Functional Workspace Restore

Cíl verze:
- zachovat nový Case Workspace vizuál z 3.0.0,
- vrátit provozní funkce, které v 3.0.0 nebyly dotažené,
- nepoškodit DB, Admin, Dokumenty ani Textace.

Opravy:
- doplněno načítání klientů z DB přes /api/clients,
- doplněn výběr klienta z DB do karty obchodního případu,
- doplněno tlačítko ARES přímo u IČO,
- zpřesněno ukládání obchodního případu,
- zlepšeno načítání obchodních případů a chybové hlášky,
- opraveno parsování full_payload u existujících záznamů,
- Admin modul je zobrazený a obsahuje číselník pojišťoven,
- zachována dokumentová knihovna a textace,
- nabídky zůstávají v jedné společné tabulce podle rizik.

DB:
- žádná destruktivní migrace,
- pouze využití existujících tabulek clients, inquiries, catalog_settings a audit_log.
