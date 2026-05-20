# Business Risk Hub 2.6.0 – Auth Layer Rebuild Stable

## Cíl
Vrátit funkční vstup do aplikace a nahradit nouzové frontend hacky z verzí 2.5.1/2.5.2 stabilní auth vrstvou.

## Co tato verze dělá
- vychází ze stabilní větve 2.5.0,
- odstraňuje problematický emergency shell/autologin hack,
- zavádí `BRH260Auth`,
- sjednocuje session do `BRH260_SESSION`,
- zachovává kompatibilitu se starými session klíči,
- chrání moduly před zobrazením na login stránce,
- opravuje login tlačítko, Enter i submit formuláře,
- podporuje admin/poradce role,
- nezasahuje do databáze obchodních případů.

## Testovací přístupy
- Admin: `admin@astorie.local` / `Astorie2026!`
- Poradce: `poradce@astorie.local` / `Poradce2026!`

## Konzolová diagnostika
- `BRH260Auth.version`
- `BRH260Auth.readSession()`
- `BRH260Auth.clearSession()`
- `BRH260Auth.restoreSession()`
- `BRH260Auth.detectLoginScreen()`
- `BRH260Auth.detectAppShell()`

## Důležité
Tato verze je stabilizační a nedestruktivní. Databázová migrace není nutná.
