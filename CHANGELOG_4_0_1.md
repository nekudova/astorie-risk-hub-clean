# Business Risk Hub 4.0.1 – Platform Identity & Release Control

## Účel
Hotfix release identity, aby bylo po nasazení jednoznačně vidět, která verze skutečně běží.

## Změny
- APP_VERSION sjednoceno na 4.0.1.
- APP_RELEASE_NAME sjednoceno na Platform Identity & Release Control.
- Header ukazuje verzi, prostředí a build id.
- `/version` a `/health` vrací stejnou centrální verzi.
- Static assety mají cache-busting přes verzi a no-cache hlavičky.
- Jeden ZIP pro TEST i PROD.
- Prostředí se rozlišuje přes `APP_ENV=TEST` nebo `APP_ENV=PROD`.

## Bezpečnost
- Žádná destruktivní DB migrace.
- Zachována stávající workflow logika.
- Zachovány Admin, Textace, Dokumenty, CASE_ID, nabídky a poptávky.
