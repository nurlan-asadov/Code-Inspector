# Code-Inspector
Code Inspector by Asadov

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
