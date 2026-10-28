# C03_DOM - Prowadzenie krok po kroku

## Praca zespołu
W parze:

- A zaczyna reguły
- B interfejs

W trójce:

- C pisze próby i adapter danych. 

**Najpierw uzgodnijcie wejście i wynik funkcji, aby pracować równolegle**. 

Po pierwszym działającym przyroście (commicie) zamieńcie role; każdy pisze kod i przegląda zmianę partnera. 

Krótkie gałęzie w istniejącym repo GitHub, małe commity, przegląd i integracja po jednym zachowaniu. 

Nie czekajcie z połączeniem do końca. 

Zakończcie jedną obserwacją z prób i jednym usprawnieniem pracy.


## 1. HTML i kontrolki
- Zbudujcie:
    -  `form`
    - `input name=title`
    -  `select` priorytetu
    -  filtr
    -  listę zgłoszeń
    -  komunikat role=status
- Podłączcie `app.js` przez atrybut `defer`

**Sprawdźcie:** W konsoli selektory zwracają elementy. `Null` oznacza zły selektor lub złą kolejność.

## 2. Dane przed widokiem
Ręcznie utwórzcie dwa rekordy o tym samym tytule i różnych id. Uzgodnijcie addTicket i changeStatus.

**Sprawdźcie:** Reguły działają w konsoli bez czytania dokumentu.

Przed następnym krokiem partner wyjaśnia, skąd pochodzą dane i co może je zmienić. Jeśli wynik odbiega, zatrzymajcie się na najmniejszym wywołaniu; czytajcie pierwszy błąd w Console, nie ostatni skutek.

## 3. Pierwszy render
Wyczyśćcie tylko listę. Dla każdego rekordu utwórzcie li i ustawcie tekst przez textContent.

**Sprawdźcie:** Ponowne renderowanie nie podwaja liczby wierszy. Tekst <b>ABC</b> pozostaje tekstem.

Przed następnym krokiem partner wyjaśnia, skąd pochodzą dane i co może je zmienić. Jeśli wynik odbiega, zatrzymajcie się na najmniejszym wywołaniu; czytajcie pierwszy błąd w Console, nie ostatni skutek.

## 4. Dodawanie
W submit najpierw preventDefault, potem odczyt, walidacja i nowy stan. Czyśćcie pole tylko po sukcesie.

**Sprawdźcie:** Spacje i tytuł dwuznakowy nie dodają rekordu; Enter działa.

Przed następnym krokiem partner wyjaśnia, skąd pochodzą dane i co może je zmienić. Jeśli wynik odbiega, zatrzymajcie się na najmniejszym wywołaniu; czytajcie pierwszy błąd w Console, nie ostatni skutek.

## 5. Status po ID
Dla każdego wiersza dodajcie kontrolkę zmiany statusu. Handler pamięta ID danego rekordu.

**Sprawdźcie:** Zmiana drugiego z równych tytułów nie zmienia pierwszego.

Przed następnym krokiem partner wyjaśnia, skąd pochodzą dane i co może je zmienić. Jeśli wynik odbiega, zatrzymajcie się na najmniejszym wywołaniu; czytajcie pierwszy błąd w Console, nie ostatni skutek.

## 6. Filtr i licznik
Wyliczcie visible w renderze. Dodajcie informację o pustym wyniku i liczniku.

**Sprawdźcie:** Filtr done, dodanie new, powrót all: nowe zgłoszenie nadal istnieje.

Przed następnym krokiem partner wyjaśnia, skąd pochodzą dane i co może je zmienić. Jeśli wynik odbiega, zatrzymajcie się na najmniejszym wywołaniu; czytajcie pierwszy błąd w Console, nie ostatni skutek.

## 7. Klawiatura i integracja
Przejdźcie Tab przez cały formularz. Po zmianie statusu sprawdźcie fokus i komunikat. Zamieńcie role.

**Sprawdźcie:** Nie ma pułapki klawiaturowej; UI i stan zgadzają się.

Przed następnym krokiem partner wyjaśnia, skąd pochodzą dane i co może je zmienić. Jeśli wynik odbiega, zatrzymajcie się na najmniejszym wywołaniu; czytajcie pierwszy błąd w Console, nie ostatni skutek.

## Naprawa i porządkowanie
Przypisanie tickets = tickets.filter(...) w obsłudze filtra bezpowrotnie usuwa dane. Filtr ma tworzyć tylko widok. Najpierw odtwórzcie błąd, potem naprawcie i powtórzcie to samo wejście.

Wydzielcie createTicketRow(ticket) z renderu i powtórzcie te same próby. Refaktoryzacja zachowuje wynik, więc wykonajcie próby przed i po zmianie.

## Końcowa próba zespołu
- tytuły długości 2,3,80,81 po trim
- dwa takie same tytuły
-  wszystkie statusy
-  pusty filtr
-  tekst HTML
- Enter
- odświeżenie
- 1000/1001 zgłoszeń w próbie domeny
