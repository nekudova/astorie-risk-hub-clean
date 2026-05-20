# Business Risk Hub 2.1.0 – Workflow Engine FULL

Toto je plnohodnotný navazující balík postavený nad 2.0.0 Core Data Foundation.

## Zachováno
- Admin
- textace
- dokumentová knihovna
- současné UI
- sidebar
- branding ASTORIE
- stávající databázové základy

## Přidáno
- runtime workflow engine `BRH210`
- workflow panel v dashboardu
- evidence vybraných pojišťoven k případu
- evidence odeslání poptávky
- generování návrhu e-mailu poptávky
- doporučený další krok podle stavu případu
- audit workflow změn přes BRH2 audit, pokud je dostupný

## Konzolová kontrola
- `BRH210.version`
- `BRH210.exportWorkflow()`
- `BRH210.addCaseInsurer({insurer_name:'...', email:'...'})`
- `BRH210.generateRequestEmail(...)`
