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
