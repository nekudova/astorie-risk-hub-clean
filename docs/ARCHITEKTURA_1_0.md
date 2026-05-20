# ASTORIE Business Risk Hub 1.0 – Core Stabilization

## Cíl
Verze 1.0 stabilizuje aplikaci okolo jednoho aktivního obchodního případu.

## Princip
- aktivní případ = jediný zdroj pravdy pro UI,
- nabídky se nečtou ze starých globálních zásobníků,
- editace nabídky se ukládá pod konkrétní DB ID,
- po každé změně proběhne přepočet: statistiky → porovnání → zpráva → UI,
- interní analýza a klientský výstup jsou oddělené vrstvy.

## Zachováno
ARES, DB načítání, nabídky, porovnání, zpráva, textace, dokumenty, admin sekce.
