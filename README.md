# ASTORIE Business Risk Hub – MVP 0.58.1

WOW oprava po 0.47 – stabilní ARES. Zachováno DB, ARES, admin, nabídky, porovnání, zpráva a PDF.


## Oprava 0.48
Tato verze je bezpečná opravná verze po 0.47. Vrací funkční vazby ARES/DB/JS z poslední stabilní větve a nemění databázovou strukturu.


## MVP 0.58.1
- Odpovědnost není defaultně zahrnuta.
- Katalogové položky odpovědnosti se zapínají checkboxem, nemažou se.
- Nová poptávka začíná čistěji bez předvybraných hodnot.
- Území, frekvence placení, inkaso a další volby mají prázdnou předvolbu / výběr.
- Poradce může odstranit vlastní poptávku z aktivního přehledu; v DB jde o bezpečné soft-delete.
- Dashboard je zjednodušený na pracovní kroky poradce.


## MVP 0.58.1
- Čitelné názvy parametrů odpovědnosti bez uřezávání textu.
- Katalogové položky nejsou editovatelné názvem, poradce je pouze zahrnuje/nezařazuje.
- Ručně přidané položky lze smazat nebo duplikovat.
- Zachováno: ARES, DB, Admin, Nabídky, Porovnání, Zpráva a PDF.


## MVP 0.58.1
- poradenský kokpit obchodního případu
- jasný doporučený další krok
- přehled Poptávka → Nabídky → Porovnání → Zpráva
- zachován stabilní základ 0.51 (ARES, DB, Admin, nabídky, porovnání, PDF, odpovědnost)


## MVP 0.58.1
- obchodní případ jako řídicí centrum práce poradce
- přehlednější vazba Poptávka → Nabídky → Porovnání → Zpráva
- stavové počty v levém menu
- zachován ARES, DB, Admin, odpovědnost, nabídky, porovnání a PDF


## MVP 0.58.1
- profesionální kokpit poradce
- kompaktní workflow obchodního případu
- jasný doporučený další krok
- klientský režim (vizuální přepnutí)
- zachován funkční základ 0.51/0.54: ARES, DB, Admin, odpovědnost, nabídky, porovnání, PDF


## MVP 0.58.1
UX cleanup: jeden pracovní panel obchodního případu, kompaktní workflow, odstranění duplicitních dashboard bloků. Backend/DB beze změny.


## MVP 0.58.1 – Underwriting foundation
- Viditelně přidané moduly v aplikaci: Dokumenty, Textace, Kontrola případu.
- Přidané admin základy pro správu dokumentů, textací a checklistů.
- Zachováno: ARES, DB, Admin, odpovědnost, nabídky, porovnání, zpráva/PDF.
- Bez změny databázové struktury.


## MVP 0.59 – Rizikový model + underwriting intelligence
- Přidána viditelná sekce Rizikový model.
- Přidán admin základ pro správu rizikových modelů.
- Připraveny vazby: riziko → dokument → článek VPP/ZPP/DPP → textace → checklist.
- Zachováno: ARES, DB, Admin, odpovědnost, nabídky, porovnání, PDF.
- Bez změny databázové struktury.


## MVP 0.60 – Professional Underwriting Workspace
- Sticky underwriting cockpit.
- Pravý underwriting panel.
- Kompaktní workflow timeline.
- Zachováno ARES, DB, Admin, odpovědnost, nabídky, porovnání, PDF.


## MVP 0.61 – Nabídkový workspace + rychlé porovnání
- Přidán pracovní nabídkový workspace.
- Rychlé vložení nabídek v tabulkovém režimu.
- Pracovní kontrola: cena, limit, spoluúčast, výluky, hodnocení, poznámka.
- Přidán helper panel pro porovnání.
- Zachováno: ARES, DB, Admin, odpovědnost, původní nabídky, porovnání, PDF.
- Bez změny databázové struktury.


## MVP 0.62 – Funkční knihovna textací + pilotní režim poradce
- Knihovna textací je nyní skutečně použitelná: vyhledávání, kategorie, tagy, detail, kopírování, vložení do poznámek.
- Přidána první vzorová sada textací pro odpovědnost, převzaté věci, výrobek, čisté finanční škody, FVE a drony.
- Přidán pilotní checklist pro předání vybranému poradci.
- Beze změny databázové struktury; lokální úpravy textací jsou dočasně ukládány v prohlížeči.
- Zachováno: ARES, DB, Admin, odpovědnost, nabídky, porovnání, PDF.


## MVP 0.63 – Profesionální editor textací + ukládání
- Nahrazeno prompt okno profesionálním editorem přímo v aplikaci.
- Textace má název, kategorii, typ použití, tagy a vlastní text.
- Textace lze přidat, upravit, smazat, zkopírovat a vložit do poznámek.
- Pracovní poznámky se lokálně ukládají v prohlížeči.
- Beze změny DB.


## MVP 0.64 – Funkční admin textací + okamžité zobrazení
- Opraveno: nová textace se po uložení okamžitě zobrazí v knihovně.
- Opraveno: po uložení se vyčistí filtry, aby textace nebyla skrytá.
- Doplněna funkční admin správa textací: seznam, hledání, filtrování, detail, úprava, smazání.
- Admin tlačítko „+ Přidat textaci“ otevírá profesionální editor.
- Beze změny databázové struktury; ukládání textací zůstává lokální v prohlížeči jako bezpečný mezikrok.
- Zachováno: ARES, DB, Admin, odpovědnost, nabídky, porovnání, PDF.


## MVP 0.65 – Oprava viditelnosti textací + funkční filtr
- Sjednocení localStorage klíčů textací.
- Nová textace se po uložení okamžitě zobrazí a otevře v detailu.
- Filtry se po uložení vyčistí, aby textace nebyla skrytá.
- Knihovna migruje starší lokální textace z předchozích verzí.
- Beze změny DB.


## MVP 0.66 – Stabilní uložené textace + pevný seznam
- Přidán samostatný blok Moje uložené textace.
- Uložená textace se zobrazuje bez ohledu na filtry.
- Sjednocené úložiště napříč staršími verzemi.
- Po uložení se textace otevře v detailu a zvýrazní v seznamu.
- Beze změny DB.


## MVP 0.68 – Moje textace + centrální databáze
- Rozdělení na Moje textace a Centrální databáze textací.
- Centrální textace poradce nemůže mazat ani upravovat.
- Vlastní textace lze upravit, smazat a navrhnout do centrální databáze.
- Odstraněn duplicitní spodní seznam textací.
- Filtry pracují nad oběma seznamy.


## MVP 0.69 – Přehlednější knihovna textací
- Přidán přepínač Moje textace / Centrální databáze / Návrhy ke schválení.
- Odstraněn pocit dlouhých bloků pod sebou.
- Nová textace se ukládá do záložky Moje textace.
- Návrh do centrální databáze se zobrazí v samostatné záložce.


## MVP 0.70 – Aktivní obchodní případ + profi workflow
- Sticky pracovní panel aktivního obchodního případu.
- Workflow stav: rozpracování, sběr podkladů, poptávka, nabídky, porovnání, zpráva, uzavřeno.
- Dokumentový workspace: evidence dokumentů aktivního případu.
- Živý checklist: ukládání zaškrtnutí a přepočet připravenosti.
- Dashboard doporučuje další krok podle stavu případu.
- Beze změny DB; zachováno ARES, Admin, odpovědnost, nabídky, porovnání, PDF.


## MVP 0.71 – Klientský výstup + doporučení poradce
- Přidán profesionální klientský výstup v sekci Zpráva.
- Poradce doplní doporučení a upozornění, systém připraví čistý klientský náhled.
- Dashboard obsahuje režim pro klienta.
- Výstup lze zkopírovat pro e-mail/dokument.
- Zachováno ARES, DB, Admin, odpovědnost, nabídky, porovnání, PDF a workflow 0.70.


## MVP 0.72 – Profesionální nabídkový workspace
- Nový intuitivní editor nabídky: quick mode + expert mode.
- Nabídky jako profesionální karty pojišťoven.
- Možnost upravit, kopírovat, smazat a označit doporučenou nabídku.
- Souhrn nabídek a upozornění na chybějící cenu/limit/výluky.
- Makléřská porovnávací matice v sekci Porovnání.
- Bez duplicity starého nabídkového workspace.
- Zachováno ARES, DB, Admin, odpovědnost, textace, dokumenty, PDF, klientský výstup.

## MVP 0.73 – Unified Offer Workflow
- Stabilizační release nabídkového workflow.
- Sjednocen jeden zdroj pravdy pro nabídky.
- Potlačeny staré demo/legacy porovnávací bloky.
- Porovnání používá pouze aktuální nabídky z unified store.
- Počítadla v aktivním případu se berou ze stejného zdroje.
- Klientský výstup bere nabídky ze stejného unified store.
- Zachováno ARES, DB, Admin, odpovědnost, textace, dokumenty, PDF a klientský výstup.


## MVP 0.74 – Case Engine Refactor
- Zaveden centrální Case Store pro aktivní obchodní případ.
- Nabídky jsou ukládány do case.offers[].
- Dokumenty jsou ukládány do case.documents[].
- Porovnání se počítá výhradně z case.offers[].
- Dashboard/command center používá stejný zdroj dat.
- Klientský výstup používá stejný zdroj dat.
- Přidána migrace historických nabídek z legacy localStorage klíčů.
- Zachováno ARES, DB, Admin, odpovědnost, textace, dokumenty, PDF, klientský výstup.


## MVP 0.75 – DB-first Case Bridge
- Opraveno načítání historických nabídek z DB/state.offers.
- Nový Case Engine umí převést původní objekt nabídek podle pojišťoven do case.offers[] bez zničení DB dat.
- Souhrn, počítadla, porovnání a klientský výstup čtou stejné nabídky jako původní modul Nabídky.
- state.offers už není destruktivně přepisován polem.
- Technický Case Engine panel je skrytý v běžném poradenském UX.

## MVP 0.76 – Professional Advisor Cockpit
- Hloubková stabilizace workflow bez destruktivního zásahu do DB.
- Přidán pracovní kokpit poradce: co má udělat teď, stav klienta, nabídky, podklady, připravenost.
- Silnější bridge mezi DB nabídkami, Case Engine a localStorage.
- Nabídky se načítají z více zdrojů: DB state.offers objekt, case store, legacy stores a nouzově i aktuálně vykreslené DB karty.
- Porovnání a klientský výstup používají stejný profesionální offer reader.
- Potlačení technických/duplicitních bloků v poradenském UX.
- Zachováno: ARES, DB, Admin, odpovědnost, textace, dokumenty, PDF, klientský výstup.


## MVP 0.77 – Active Case Data Fix
- Opraveno falešné násobení nabídek: zrušeno přimíchávání všech starých localStorage dat a DOM fallbacku.
- Nabídky se čtou pouze z aktivně načtené DB poptávky + ručních úprav uložených pod konkrétním DB ID.
- Opraveno uložení úprav nabídky, doporučená varianta a tlačítka klientského výstupu.


# Business Risk Hub 1.0 – Core Stabilization

## Co tato verze řeší
- Jednotný aktivní obchodní případ jako hlavní zdroj pravdy.
- Izolace nabídek podle konkrétního DB ID.
- Zrušení nežádoucího míchání starých localStorage / fallback dat do aktivní poptávky.
- Jednotný rebuild po každé změně.
- Opravené napojení: nabídky → porovnání → zpráva.
- Klientský výstup oddělený od interní analytiky.
- Zachování stávajících modulů bez destruktivního zásahu.

## Kontrolní test po nasazení
1. V hlavičce se zobrazí `Business Risk Hub 1.0 · Core Stabilization`.
2. Načíst DB poptávku.
3. Počet nabídek musí odpovídat pouze této poptávce.
4. Upravit nabídku a uložit.
5. Porovnání musí převzít změnu.
6. Zpráva musí převzít doporučenou variantu.


## Business Risk Hub 1.0.1 – Case Identity + Risk Mapping Fix
- Oprava aktivního klienta ve všech modulech.
- Oprava mapování riziko + limit v nabídkách.


## Business Risk Hub 1.0.2
- Žádné automatické doporučení pojišťovny.
- Deduplicitní výpis limitů.
- Oprava rozpadlého risk preview layoutu.


## Business Risk Hub 2.0.0 – Core Data Foundation
Zachovává admin, dokumenty, textace a UI. Přidává nový datový model, SQL migraci, risk modely a runtime bridge.

## Business Risk Hub 2.1.0 – Workflow Engine FULL

Toto je opravená plná verze. Obsahuje celou aplikaci ze základu 2.0.0 a přidává workflow engine.
Předchozí krátký ZIP byl pouze specifikační balíček, nikoli plnohodnotná verze k nasazení.

## Business Risk Hub 2.2.0 – Offer Engine Foundation FULL

Plná navazující verze nad 2.1.0. Přidává profesionální Offer Engine:
- strukturované nabídky,
- offer_risks,
- validaci,
- porovnání podle rizik,
- ruční doporučení poradcem.
