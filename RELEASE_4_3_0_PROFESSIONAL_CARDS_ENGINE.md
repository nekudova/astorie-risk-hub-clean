# Business Risk Hub 4.3.0 – Professional Cards Engine

## Účel
Profesionální rozšíření pracovního prostoru o karty:
- karta poradce / zpracovatele,
- profesionální karta klienta,
- karta pro pojištění.

## Hlavní změny
- Karta poradce se bere automaticky z přihlášení / aktuálního uživatele.
- Karta klienta je oddělena od odborných pojistných údajů.
- Doplněna sekce kontaktních osob pro jednání o pojistné smlouvě:
  - příjmení a jméno,
  - e-mail,
  - telefon,
  - oblast pojištění.
- Karta pro pojištění obsahuje:
  - typ a kód činnosti,
  - územní rozsah,
  - pojistné období,
  - počátek pojištění,
  - frekvenci placení,
  - obrat,
  - zaměstnance,
  - export / zahraničí,
  - provozovny,
  - činnosti,
  - škodní průběh.

## Bezpečnost
- Bez DB migrace.
- Bez změny schématu DB.
- Bez zásahu do uložených obchodních případů.
- Bez zásahu do modulu odpovědnosti, poptávek a porovnání.
- Data se ukládají do existujícího case JSON modelu.

Build: 2026-05-25 05:26:45
