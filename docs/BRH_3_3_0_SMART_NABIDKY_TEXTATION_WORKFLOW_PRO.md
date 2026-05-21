# Business Risk Hub 3.3.0 – Smart Nabídky & Textation Workflow PRO

Tato verze navazuje na poslední funkční produkční základ 3.2.0 a doplňuje skutečný workflow engine pro práci s poptávkami, textacemi a nabídkami pojišťoven.

## Zásady

- Jeden obchodní případ = jeden CASE_ID.
- Nabídky vycházejí z požadavků klienta.
- Poradce neopisuje shodné údaje do každé pojišťovny.
- Interní metodické poznámky se nepropíší do poptávek ani nabídek.
- Do poptávky se propisuje pouze „Specifikace / doplnění pro pojišťovnu“ a vybrané textace.

## Smart nabídky

Nabídky se automaticky předvyplní z karty pro pojištění:
- počátek pojištění,
- pojistné období,
- frekvence placení,
- územní rozsah,
- preferovaná spoluúčast,
- požadované limity rizik.

Při nastavení stavu **splněno** se doplní limit a spoluúčast z poptávky.

## Textace workflow

Textace lze vložit do aktivního případu a určit jejich použití:
- do poptávky pojišťovně,
- do nabídky,
- do klientského výstupu.

## DB
Doplněné migrace jsou nedestruktivní.
