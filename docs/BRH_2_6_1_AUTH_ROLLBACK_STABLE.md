# Business Risk Hub 2.6.1 – Auth Rollback Stable

## Problém ve 2.6.0
Verze 2.6.0 přidala druhou auth/bootstrap vrstvu `BRH260Auth`, která kolidovala s původním přihlášením a routerem aplikace. Výsledkem bylo, že login stránka zůstala viset a aplikace se nepřepnula do pracovního prostředí.

## Co tato verze opravuje
- odstranění konfliktní `BRH260Auth` vrstvy,
- odstranění zbytků emergency shell/autologin vrstev 2.5.1/2.5.2,
- zachování původního login/render flow,
- bezpečné navázání tlačítka Přihlásit, Enter a submit formuláře,
- ochrana proti zobrazování modulů na login stránce,
- žádná změna databáze.

## Diagnostika v konzoli
- `BRH261AuthRollback.version`
- `BRH261AuthRollback.isLoginVisible()`
- `BRH261AuthRollback.handleLogin()`
- `BRH261AuthRollback.fallbackSessionBridge()`

## Testovací přístup
- Admin: `admin@astorie.local` / `Astorie2026!`
- Poradce: `poradce@astorie.local` / `Poradce2026!`
