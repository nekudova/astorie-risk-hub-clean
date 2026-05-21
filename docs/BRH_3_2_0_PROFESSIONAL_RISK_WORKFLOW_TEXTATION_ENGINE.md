# Business Risk Hub 3.2.0 – Professional Risk Workflow & Textation Engine

Stabilizačně-provozní verze nad 3.1.0. Cílem je odstranit zbytečné opisování, zpřehlednit katalog rizik a konečně zapojit textace do práce poradce v konkrétním obchodním případu.

## Klíčové změny

- Katalog rizik odpovědnosti je zobrazen jako profesionální sada karet s interní metodikou.
- Interní metodika se nepropisuje do poptávek, nabídek ani klientských výstupů.
- Pole „Poznámka“ bylo provozně nahrazeno polem „Specifikace / doplnění pro pojišťovnu“.
- Texty v tabulkách nejsou schované v krátkých inputech; používají se zvětšitelné textové oblasti.
- Doplněno hromadné odebrání všech rizik odpovědnosti i všech zvláštních ujednání.
- Textace lze přiřadit do aktivního CASE a označit použití: poptávka, nabídka, klientský výstup.
- Poptávka pro pojišťovnu obsahuje jen externí specifikace a přiřazené textace pro poptávku.
- V nabídkové tabulce se společné údaje propisují automaticky.
- Při přepnutí rizika na „splněno“ se automaticky doplní limit a spoluúčast z požadavku klienta.

## Bezpečnost dat

Verze neprovádí destruktivní změny databáze. Zůstává zachován princip jeden obchodní případ = jeden CASE_ID.
