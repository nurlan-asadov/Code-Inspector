
# Code Inspector by Asadov

**Code Inspector by Asadov** brauzerdə lokal işləyən, oyun hissi verən statik kod analizi təlim tətbiqidir. Layihənin məqsədi istifadəçiyə real veb tətbiq kod parçaları üzərində zəiflik tanıma bacarığını inkişaf etdirməkdir.

İstifadəçi hər oyunda 10 round oynayır, hər round-da bir kod parçasını analiz edir və bunun:
- zəiflikli olub-olmadığını,
- əgər zəiflik varsa növünü,
- istəyə bağlı olaraq səbəbini

müəyyən edir.

## Layihənin məqsədi

Bu tətbiq klassik test və ya sadə quiz formatından fərqli olaraq mini-game hissi vermək üçün hazırlanıb. Məqsəd real pentest və secure code review düşüncə tərzinə yaxın bir təcrübə yaratmaqdır.

## Əsas xüsusiyyətlər

- Tamamilə frontend əsaslıdır, backend tələb etmir
- Tam lokal işləyir
- Single-page web application quruluşundadır
- 10 round-luq təsadüfi oyun sessiyası yaradır
- Eyni sessiyada eyni sualı təkrarlamır
- Ayrı `questions.js` faylında saxlanılan geniş sual bankından istifadə edir
- Hazırda `100` ssenari/sual mövcuddur
- Azərbaycan dili, Türk dili və İngilis dili dəstəyi var
- 2 cavab rejimi var:
  - Variantlı rejim
  - Variantsız input rejimi
- Çətinlik filtri var:
  - Asan
  - Orta
  - Çətin
  - Qarışıq
- İpucu sistemi var və istifadə edildikcə xal azaldır
- Cavabdan sonra feedback ekranında:
  - düzgün analiz nəticəsi,
  - kateqoriya,
  - round xalı,
  - zəifliyin yaranma səbəbi,
  - remediation izahı,
  - CWE / CVSS / OWASP məlumatları,
  - təhlükəli və düzəldilmiş kodun müqayisəsi
  göstərilir

## Dəstəklənən zəiflik kateqoriyaları

- SQL Injection
- XSS
- CSRF
- IDOR
- Command Injection
- SSRF
- Path Traversal
- Authentication flaws
- Session management flaws
- XXE
- Safe / No obvious vulnerability

## Oyun axını

1. Welcome ekranında dil seçilir
2. Setup ekranında cavab rejimi və çətinlik seçilir
3. Oyun başlayır və 10 fərqli round təqdim olunur
4. Hər round üçün istifadəçi analiz göndərir
5. Feedback ekranında düzgün cavab və izah göstərilir
6. 10 round tamamlandıqdan sonra nəticə ekranı açılır


## Lokal olaraq necə işə salınır


Terminalda layihə qovluğunda aşağıdakı əmri işlət:

```bash
python3 -m http.server 8080
```

Sonra brauzerdə aç:

```text
http://localhost:8080
```

## Tətbiqin texniki yanaşması

- Sual bankı oyun məntiqindən ayrıdır
- Hər yeni sessiyada suallar random seçilir
- Hər sessiyada yalnız 10 unikal sual göstərilir
- Yeni sual əlavə etmək üçün əsasən yalnız `questions.js` faylını genişləndirmək kifayətdir
- Lokalizasiya mətni əsasən `app.js` içində idarə olunur


## Kimlər üçün uyğundur

- Pentest öyrənənlər
- Secure code review məşqi edənlər
- Web application security üzrə pattern recognition bacarığını artırmaq istəyənlər
- Təlim, demo və workshop məqsədli lokal təhlükəsizlik layihələri hazırlayanlar

## Gələcəkdə genişləndirmə üçün ideyalar

- Daha çox sual və kateqoriya əlavə etmək
- Sual-spesifik remediation code nümunələrini artırmaq
- Syntax highlighting əlavə etmək
- Combo / streak sistemi qurmaq
- Səs effektləri və daha inkişaf etmiş oyun animasiyaları əlavə etmək
- Statistik nəticələri export etmək

## Qeyd

Bu layihə təlim və tanıma məqsədlidir. Buradakı nümunələr real dünyadakı zəiflik pattern-lərini öyrənmək üçün hazırlanıb və təhlükəsizlik düşüncə tərzini gücləndirməyə yönəlib.



ENGLISH

Code Inspector by Asadov is a browser-based, locally running static code analysis training application designed with a gamified experience. The goal of the project is to help users develop vulnerability recognition skills by analyzing real-world web application code snippets.

In each game session, the user plays 10 rounds. In every round, they analyze a code snippet and determine:

whether it is vulnerable or not,

if vulnerable, the type of vulnerability,

optionally, the underlying cause.

Project Objective

Unlike traditional tests or simple quiz formats, this application is designed to provide a mini-game experience. The aim is to simulate a mindset closer to real penetration testing and secure code review practices.

Key Features

Fully frontend-based, no backend required

Runs entirely locally

Built as a single-page web application

Generates a random 10-round game session

Prevents repeating the same question within a session

Uses an extensive question bank stored in a separate questions.js file

Currently includes 100 scenarios/questions

Supports Azerbaijani, Turkish, and English languages

Two answer modes:

Multiple-choice mode

Free input (non-multiple-choice) mode

Difficulty filtering:

Easy

Medium

Hard

Mixed

Hint system (reduces score when used)

After each answer, the feedback screen shows:

correct analysis result

category

round score

root cause of the vulnerability

remediation explanation

CWE / CVSS / OWASP references

comparison between vulnerable and fixed code

Supported Vulnerability Categories

SQL Injection

XSS

CSRF

IDOR

Command Injection

SSRF

Path Traversal

Authentication flaws

Session management flaws

XXE

Safe / No obvious vulnerability

Game Flow

Select language on the welcome screen

Choose answer mode and difficulty on the setup screen

Start the game with 10 unique rounds

Submit analysis for each round

View correct answer and explanation in the feedback screen

After completing all 10 rounds, the results screen is displayed

How to Run Locally

Run the following command in the project directory:

python3 -m http.server 8080

Then open in your browser:

http://localhost:8080
Technical Approach

The question bank is separated from the game logic

Questions are randomly selected for each new session

Only 10 unique questions are shown per session

Adding new questions mainly requires extending the questions.js file

Localization is primarily managed within app.js

Target Audience

People learning penetration testing

Those practicing secure code review

Individuals aiming to improve pattern recognition in web application security

Developers creating local security training, demos, or workshops

Future Improvement Ideas

Add more questions and categories

Expand question-specific remediation code examples

Implement syntax highlighting

Introduce combo / streak system

Add sound effects and more advanced game animations

Export statistical results

Note

This project is intended for training and educational purposes. The examples provided are designed to teach real-world vulnerability patterns and strengthen security-oriented thinking.
