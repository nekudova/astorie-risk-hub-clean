# Business Risk Hub 2.2.0 – Offer Engine Foundation FULL

## Cíl
Zavést profesionální Offer Engine, kde nabídka není volný text, ale strukturovaná entita:

CASE → OFFER → OFFER_RISKS

## Zachováno
- Admin
- dokumenty
- textace
- workflow 2.1.0
- UI ASTORIE
- dashboard/sidebar
- Core Data Foundation 2.0.0

## Přidáno
- `BRH220` runtime engine
- nový panel v sekci Nabídky
- editor nabídky podle rizik
- validace nabídky
- porovnání z offer_risks
- ruční doporučení poradcem
- zákaz automatického doporučení
- sync do BRH2 core bridge, pokud je dostupný

## Konzolová kontrola
- `BRH220.version`
- `BRH220.listOffers()`
- `BRH220.validateOffers()`
- `BRH220.seedOfferFromRequest()`
- `BRH220.renderComparison()`
