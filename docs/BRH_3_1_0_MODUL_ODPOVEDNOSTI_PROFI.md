# Business Risk Hub 3.1.0 – Modul odpovědnosti PROFI

Stabilní navázání prvního pojistného modulu na Case Workspace.

## Hlavní změny
- Přidána samostatná záložka „Modul odpovědnosti“.
- Doplněn profesionální katalog rizik odpovědnosti.
- Doplněna sada zvláštních ujednání / doložek.
- Zachována možnost přidat vlastní riziko a vlastní zvláštní ujednání.
- Rizika se zapisují do stejného `state.risks`, tedy do jednoho CASE_ID.
- Zvláštní ujednání se ukládají do `liability_agreements` ve full_payload případu.
- Poptávka pro pojišťovnu nyní obsahuje i zvláštní ujednání.

## Bezpečnost změny
- DB migrace nejsou destruktivní.
- Admin, dokumenty a textace jsou zachovány.
- Nedochází k duplicitnímu source of truth.
- Nabídky a porovnání dál vycházejí ze stejného CASE_ID.
