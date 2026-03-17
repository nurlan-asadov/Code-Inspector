(function () {
  const TOTAL_ROUNDS = 10;
  const BASE_POINTS = 40;
  const TYPE_POINTS = 35;
  const REASONING_POINTS = 15;
  const HINT_PENALTY = 10;
  const SAFE_TYPE = "Safe / No obvious vulnerability";
  const LETTERS = ["A", "B", "C", "D"];

  const VULN_TYPES = [
    "SQL Injection",
    "XSS",
    "CSRF",
    "IDOR",
    "Command Injection",
    "SSRF",
    "Path Traversal",
    "Authentication flaws",
    "Session management flaws",
    "XXE",
    SAFE_TYPE
  ];

  const state = {
    locale: "az",
    answerMode: "choice",
    difficultyFilter: "mixed",
    sessionQuestions: [],
    currentIndex: 0,
    score: 0,
    correctAnswers: 0,
    answeredRounds: [],
    hintIndex: 0,
    usedHints: 0,
    lastRound: null,
    currentOptions: []
  };

  const LOCALES = {
    az: {
      appSubtitle: "Statik Kod Analizi Oyunu",
      eyebrow: "Pentest Təlim Terminalı",
      topbarStatus: "Lokal Offline Simulyasiya",
      bankStatus: "Ssenari Bankı",
      welcome: "Xoş Gəldin",
      welcomeTitle: "Pentest instinkti ilə kod analizi təlimi.",
      welcomeLead: "Kodu analiz et, real zəiflikləri tap və false positive-lərdən yayın.",
      continue: "Başla",
      missionBrief: "Missiya",
      heroTitle: "Real veb kodu üzərində nümunə tanıma bacarığını gücləndir.",
      heroLead: "Kod parçalarını təcrübə keçən pentester kimi analiz et. Bəzilərində zəiflik var, bəziləri təhlükəsizdir, bəziləri isə bilərəkdən aldadıcı qurulub. Hər sessiyada böyük bankdan 10 unikal round seçilir.",
      rounds: "Roundlar",
      roundsStrong: "Hər missiyada 10 round",
      roundsText: "Hər missiyada tam 10 round var.",
      bank: "Sual Bankı",
      bankStrong: "100+ Ssenari",
      bankText: "Əsas veb zəiflik kateqoriyaları üzrə təkrar istifadə oluna bilən ssenarilər.",
      hints: "Hint Sistemi",
      hintsStrong: "Mərhələli İpucu",
      hintsText: "Hər hint daha spesifik olur və xalı azaldır.",
      languageSelect: "Dil Seçimi",
      answerMode: "Cavab Rejimi",
      difficultyFilter: "Çətinlik Filtri",
      mixed: "Qarışıq",
      multipleChoice: "Junior - Variantlı",
      freeInput: "Senior - Variantsız",
      signalMix: "Siqnal Qarışığı",
      signalMixText: "Təhlükəsiz + Tələ + Hücum",
      languages: "Dillər",
      scoring: "Xal Sistemi",
      terminalTitle: "missiya",
      terminalLine1: "Sual bankını yüklə",
      terminalLine2: "Təhlükəsiz və zəif kod nümunələrini qarışdır",
      terminalLine3: "10 round-luq təlim ardıcıllığını qur",
      startMission: "Yeni Missiyaya Başla",
      scoreCorrectVerdict: "Doğru zəiflik var / yoxdur qərarı",
      scoreCorrectType: "Doğru zəiflik növü",
      scoreReason: "Məntiqli izah bonusu",
      scoreHint: "İstifadə olunan hər hint",
      gameSection: "Kod Analizi",
      roundIntel: "Round məlumatı: {difficulty} çətinlikdə {language} kod parçası.",
      codeReview: "Kod Yoxlaması",
      targetSource: "Hədəf Mənbə Kodu",
      requestHint: "Hint İstə",
      noMoreHints: "Başqa Hint Yoxdur",
      hintCount: "Hint {used}/{total}",
      answerLabel: "1. Ən doğru cavabı seç",
      verdictLabel: "1. Bu snippet-də zəiflik var?",
      manualTypeLabel: "2. Zəiflik növünü yaz",
      manualTypePlaceholder: "Məsələn: XSS, cross site scripting, təhlükəsiz",
      reasoningLabelChoice: "2. İstəyə bağlı izah",
      reasoningLabelInput: "3. İstəyə bağlı izah",
      reasoningPlaceholder: "Kodda vacib olan hissəni qısa izah et.",
      submitAnalysis: "Analizi Göndər",
      round: "Round",
      score: "Xal",
      difficulty: "Çətinlik",
      feedbackTag: "Round Nəticəsi",
      verified: "Təsdiqləndi",
      mismatch: "Uyğunsuzluq",
      analysisConfirmed: "Analiz Doğrudur",
      analysisIncorrect: "Analiz Səhvdir",
      roundScore: "Round xalı: {score}",
      correctAnswer: "Doğru Cavab",
      roundScoreShort: "Round Xalı",
      whyItMatters: "Niyə Vacibdir",
      remediation: "Remediasiya",
      originalCode: "Analiz Edilən Kod",
      fixedCode: "Düzəldilmiş Versiya",
      category: "Kateqoriya",
      nextRound: "Növbəti Round",
      finalReport: "Final Hesabata Bax",
      missionReport: "Missiya Hesabatı",
      sessionComplete: "Sessiya Bitdi",
      resultsLead: "10 round üzrə yekun nəticən.",
      totalScore: "Ümumi Xal",
      correctAnswers: "Doğru Cavablar",
      wrongAnswers: "Səhv Cavablar",
      accuracy: "Dəqiqlik",
      categoryBreakdown: "Kateqoriya Üzrə Nəticə",
      restart: "Oyunu Yenidən Başlat",
      backHome: "Ana Səhifəyə Qayıt",
      selectAnswerAlert: "Cavablardan birini seç.",
      selectVerdictAlert: "Zəiflik var və ya zəiflik yoxdur seç.",
      smallBankAlert: "10 round üçün sual bankı yetərli deyil.",
      filterSmallAlert: "Seçilən çətinlik üçün 10 sual yoxdur.",
      difficulty_easy: "Asan",
      difficulty_medium: "Orta",
      difficulty_hard: "Çətin",
      verdict_vulnerable: "Zəiflik var",
      verdict_safe: "Zəiflik yoxdur",
      remediationCode: "Düzgün Kod Nümunəsi",
      analysisNotes: "Analiz Qeydləri",
      originalCodeMini: "Analiz Edilən Kod",
      fixedCodeMini: "Düzəldilmiş Versiya",
      safeRoundText: "Bu round üçün aydın zəiflik yoxdur. Düzəliş kodu göstərilmir.",
      diffHighlights: "Fərq Nöqtələri",
      diff1: "İstifadəçi nəzarətində olan input təhlükəsiz formada bağlanır, escape edilir və ya allowlist ilə məhdudlaşdırılır.",
      diff2: "Təhlükəli sink və ya icra yolu daha təhlükəsiz API ilə əvəz olunur.",
      diff3: "Authorization, token və ya parser guard yoxlamaları server tərəfində əlavə olunur.",
      resultsSummaryStrong: "Yaxşı analiz intizamı var. Real exploit yollarını səs-küydən ayırd edə bildin.",
      resultsSummarySolid: "Pattern recognition yaxşıdır. Amma bəzi sərhəd hallarda trust-boundary analizi daha dəqiq olmalıdır.",
      resultsSummaryMid: "Ümumi zəiflikləri tutursan, amma subtle safe-vs-vulnerable fərqlərində hələ boşluq qalır.",
      resultsSummaryLow: "Input axınına, sink davranışına və authorization yoxlamalarına daha çox fokuslan.",
      rank1: "Exploit Hunter",
      rank2: "Code Analyst",
      rank3: "Junior Tester",
      rank4: "Trainee"
    },
    tr: {
      appSubtitle: "Statik Kod Analizi Oyunu",
      eyebrow: "Pentest Eğitim Terminali",
      topbarStatus: "Yerel Offline Simülasyon",
      bankStatus: "Senaryo Bankası",
      welcome: "Hoş Geldin",
      welcomeTitle: "Pentest içgüdüsüyle kod analizi eğitimi.",
      welcomeLead: "Kodu analiz et, gerçek zafiyetleri bul ve false positive'lerden kaçın.",
      continue: "Başla",
      missionBrief: "Görev Brifi",
      heroTitle: "Gerçek web kodu üzerinde pattern recognition yeteneğini geliştir.",
      heroLead: "Kod parçalarını eğitimdeki bir pentester gibi analiz et. Bazıları zafiyetli, bazıları güvenli, bazıları ise bilerek yanıltıcı. Her oturum büyük bankadan 10 benzersiz round seçer.",
      rounds: "Roundlar",
      roundsStrong: "Görev başına 10 round",
      roundsText: "Her görevde tam 10 round vardır.",
      bank: "Soru Bankası",
      bankStrong: "100+ Senaryo",
      bankText: "Temel web vulnerability kategorilerine yayılmış tekrar kullanılabilir senaryolar.",
      hints: "Hint Sistemi",
      hintsStrong: "Aşamalı İpucu",
      hintsText: "Her hint daha spesifik olur ve puanı düşürür.",
      languageSelect: "Dil Seçimi",
      answerMode: "Cevap Modu",
      difficultyFilter: "Zorluk Filtresi",
      mixed: "Karışık",
      multipleChoice: "Junior - Seçenekli",
      freeInput: "Senior - Serbest",
      signalMix: "Sinyal Karışımı",
      signalMixText: "Güvenli + Tuzak + Exploit",
      languages: "Diller",
      scoring: "Puan Sistemi",
      terminalTitle: "görev",
      terminalLine1: "Soru bankasını yükle",
      terminalLine2: "Güvenli ve zafiyetli kod örneklerini karıştır",
      terminalLine3: "10 round'luk eğitim akışını hazırla",
      startMission: "Yeni Göreve Başla",
      scoreCorrectVerdict: "Doğru vulnerable / safe kararı",
      scoreCorrectType: "Doğru vulnerability türü",
      scoreReason: "Anlamlı açıklama bonusu",
      scoreHint: "Kullanılan her hint",
      gameSection: "Kod Analizi",
      roundIntel: "Round bilgisi: {difficulty} zorlukta {language} kod parçası.",
      codeReview: "Kod İncelemesi",
      targetSource: "Hedef Kaynak Kod",
      requestHint: "Hint İste",
      noMoreHints: "Başka Hint Yok",
      hintCount: "Hint {used}/{total}",
      answerLabel: "1. En doğru cevabı seç",
      verdictLabel: "1. Bu snippet zafiyetli mi?",
      manualTypeLabel: "2. Vulnerability türünü yaz",
      manualTypePlaceholder: "Örnek: XSS, cross site scripting, güvenli",
      reasoningLabelChoice: "2. İsteğe bağlı açıklama",
      reasoningLabelInput: "3. İsteğe bağlı açıklama",
      reasoningPlaceholder: "Kodda önemli olan kısmı kısaca açıkla.",
      submitAnalysis: "Analizi Gönder",
      round: "Round",
      score: "Puan",
      difficulty: "Zorluk",
      feedbackTag: "Round Sonucu",
      verified: "Doğrulandı",
      mismatch: "Uyumsuz",
      analysisConfirmed: "Analiz Doğru",
      analysisIncorrect: "Analiz Yanlış",
      roundScore: "Round puanı: {score}",
      correctAnswer: "Doğru Cevap",
      roundScoreShort: "Round Puanı",
      whyItMatters: "Neden Önemli",
      remediation: "Düzeltme",
      originalCode: "İncelenen Kod",
      fixedCode: "Düzeltilmiş Versiyon",
      category: "Kategori",
      nextRound: "Sonraki Round",
      finalReport: "Final Raporunu Gör",
      missionReport: "Görev Raporu",
      sessionComplete: "Oturum Tamamlandı",
      resultsLead: "10 round boyunca nihai performansın.",
      totalScore: "Toplam Puan",
      correctAnswers: "Doğru Cevaplar",
      wrongAnswers: "Yanlış Cevaplar",
      accuracy: "Doğruluk",
      categoryBreakdown: "Kategori Dağılımı",
      restart: "Oyunu Yeniden Başlat",
      backHome: "Ana Sayfaya Dön",
      selectAnswerAlert: "Seçeneklerden birini seç.",
      selectVerdictAlert: "Vulnerable veya not vulnerable seç.",
      smallBankAlert: "10 round başlatmak için soru bankası yeterli değil.",
      filterSmallAlert: "Seçilen zorluk için 10 soru yok.",
      difficulty_easy: "Kolay",
      difficulty_medium: "Orta",
      difficulty_hard: "Zor",
      verdict_vulnerable: "Zafiyetli",
      verdict_safe: "Zafiyetli değil",
      remediationCode: "Doğru Kod Örneği",
      analysisNotes: "Analiz Notları",
      originalCodeMini: "İncelenen Kod",
      fixedCodeMini: "Düzeltilmiş Versiyon",
      safeRoundText: "Bu round için belirgin bir vulnerability yok. Düzeltme kodu gösterilmiyor.",
      diffHighlights: "Fark Noktaları",
      diff1: "Kullanıcı girdisi güvenli biçimde bağlanır veya escape edilir.",
      diff2: "Tehlikeli sink ya da execution yolu güvenli API ile değiştirilir.",
      diff3: "Authorization, token veya parser guard kontrolleri eklenir.",
      resultsSummaryStrong: "İnceleme disiplinin güçlü. Gerçek exploit yollarını gürültüden ayırabildin.",
      resultsSummarySolid: "Pattern recognition iyi. Ancak bazı sınır durumlarında trust-boundary analizi daha keskin olmalı.",
      resultsSummaryMid: "Yaygın açıkları yakalıyorsun ama subtle safe-vs-vulnerable ayrımında boşluklar var.",
      resultsSummaryLow: "Input akışına, sink davranışına ve authorization kontrollerine daha fazla odaklan.",
      rank1: "Exploit Hunter",
      rank2: "Code Analyst",
      rank3: "Junior Tester",
      rank4: "Trainee"
    },
    en: {
      appSubtitle: "Static Code Analysis Game",
      eyebrow: "Pentest Training Terminal",
      topbarStatus: "Offline Local Simulation",
      bankStatus: "Scenario Bank",
      welcome: "Welcome",
      welcomeTitle: "Code review training with pentest instincts.",
      welcomeLead: "Review code, spot real vulnerabilities, and avoid false positives.",
      continue: "Start",
      missionBrief: "Mission Brief",
      heroTitle: "Train your pattern recognition against realistic web code.",
      heroLead: "Review snippets like a pentester in training. Some are vulnerable, some are safe, and some are deliberately misleading. Each session pulls 10 unique rounds from a larger rotating bank.",
      rounds: "Rounds",
      roundsStrong: "10 rounds per mission",
      roundsText: "Each mission contains exactly 10 rounds.",
      bank: "Question Bank",
      bankStrong: "100+ Scenarios",
      bankText: "Reusable scenarios spread across core web vulnerability categories.",
      hints: "Hint System",
      hintsStrong: "Progressive Intel",
      hintsText: "Each hint gets more specific and reduces score.",
      languageSelect: "Language Select",
      answerMode: "Answer Mode",
      difficultyFilter: "Difficulty Filter",
      mixed: "Mixed",
      multipleChoice: "Junior - Multiple",
      freeInput: "Senior - Free Input",
      signalMix: "Signal Mix",
      signalMixText: "Safe + Trap + Exploit",
      languages: "Languages",
      scoring: "Scoring Model",
      terminalTitle: "mission",
      terminalLine1: "Load the question corpus",
      terminalLine2: "Mix safe and vulnerable code patterns",
      terminalLine3: "Deploy a 10-round training sequence",
      startMission: "Start New Mission",
      scoreCorrectVerdict: "Correct vulnerable / safe decision",
      scoreCorrectType: "Correct vulnerability type",
      scoreReason: "Meaningful reasoning bonus",
      scoreHint: "Per hint used",
      gameSection: "Snippet Analysis",
      roundIntel: "Round intel: {difficulty} difficulty snippet in {language}.",
      codeReview: "Code Review",
      targetSource: "Target Source",
      requestHint: "Request Hint",
      noMoreHints: "No More Hints",
      hintCount: "Hints {used}/{total}",
      answerLabel: "1. Choose the best assessment",
      verdictLabel: "1. Is this snippet vulnerable?",
      manualTypeLabel: "2. Enter the vulnerability type",
      manualTypePlaceholder: "Examples: XSS, cross site scripting, safe",
      reasoningLabelChoice: "2. Optional reasoning",
      reasoningLabelInput: "3. Optional reasoning",
      reasoningPlaceholder: "Briefly explain what matters in the code.",
      submitAnalysis: "Submit Analysis",
      round: "Round",
      score: "Score",
      difficulty: "Difficulty",
      feedbackTag: "Round Debrief",
      verified: "Verified",
      mismatch: "Mismatch",
      analysisConfirmed: "Analysis Confirmed",
      analysisIncorrect: "Analysis Incorrect",
      roundScore: "Round score: {score}",
      correctAnswer: "Correct Answer",
      roundScoreShort: "Round Score",
      whyItMatters: "Why It Matters",
      remediation: "Remediation",
      originalCode: "Analyzed Snippet",
      fixedCode: "Fixed Version",
      category: "Category",
      nextRound: "Next Round",
      finalReport: "View Final Report",
      missionReport: "Mission Report",
      sessionComplete: "Session Complete",
      resultsLead: "Your final breakdown across all 10 rounds.",
      totalScore: "Total Score",
      correctAnswers: "Correct Answers",
      wrongAnswers: "Wrong Answers",
      accuracy: "Accuracy",
      categoryBreakdown: "Category Breakdown",
      restart: "Restart Game",
      backHome: "Back To Home",
      selectAnswerAlert: "Select one of the answer options.",
      selectVerdictAlert: "Select vulnerable or not vulnerable.",
      smallBankAlert: "Question bank is too small to start a 10-round mission.",
      filterSmallAlert: "There are not enough questions for the selected difficulty.",
      difficulty_easy: "Easy",
      difficulty_medium: "Medium",
      difficulty_hard: "Hard",
      verdict_vulnerable: "Vulnerable",
      verdict_safe: "Not Vulnerable",
      remediationCode: "Correct Code Example",
      analysisNotes: "Analysis Notes",
      originalCodeMini: "Analyzed Snippet",
      fixedCodeMini: "Fixed Version",
      safeRoundText: "There is no obvious vulnerability in this round. No fixed-code panel is shown.",
      diffHighlights: "Difference Highlights",
      diff1: "User-controlled input is bound, escaped, or allowlisted safely.",
      diff2: "The dangerous sink or execution path is replaced with a safe API.",
      diff3: "Authorization, token validation, or parser guards are added.",
      resultsSummaryStrong: "Strong review discipline. You consistently separated real exploit paths from noise.",
      resultsSummarySolid: "Solid pattern recognition. A few edge cases still need sharper trust-boundary analysis.",
      resultsSummaryMid: "You are catching common flaws, but subtle safe-vs-vulnerable distinctions still need work.",
      resultsSummaryLow: "Focus on input flow, sink behavior, and authorization checks. The weak spots are still broad.",
      rank1: "Exploit Hunter",
      rank2: "Code Analyst",
      rank3: "Junior Tester",
      rank4: "Trainee"
    }
  };

  const VULN_TRANSLATIONS = {
    az: { [SAFE_TYPE]: "Təhlükəsiz / Aydın zəiflik yoxdur" },
    tr: { [SAFE_TYPE]: "Güvenli / Belirgin zafiyet yok" },
    en: { [SAFE_TYPE]: SAFE_TYPE }
  };

  const DISTRACTOR_MAP = {
    "SQL Injection": ["Command Injection", "IDOR", SAFE_TYPE, "Path Traversal"],
    "XSS": ["CSRF", SAFE_TYPE, "IDOR", "SQL Injection"],
    "CSRF": ["Authentication flaws", "Session management flaws", SAFE_TYPE, "IDOR"],
    "IDOR": ["Authentication flaws", SAFE_TYPE, "SQL Injection", "CSRF"],
    "Command Injection": ["SQL Injection", "Path Traversal", "SSRF", SAFE_TYPE],
    "SSRF": ["Path Traversal", "Command Injection", SAFE_TYPE, "XXE"],
    "Path Traversal": ["SSRF", "Command Injection", SAFE_TYPE, "IDOR"],
    "Authentication flaws": ["Session management flaws", "IDOR", SAFE_TYPE, "CSRF"],
    "Session management flaws": ["Authentication flaws", "CSRF", SAFE_TYPE, "IDOR"],
    "XXE": ["SSRF", SAFE_TYPE, "Path Traversal", "XSS"],
    [SAFE_TYPE]: ["SQL Injection", "XSS", "IDOR", "CSRF", "SSRF", "Path Traversal", "Command Injection", "Authentication flaws", "Session management flaws", "XXE"]
  };

  const TYPE_SYNONYMS = {
    "SQL Injection": ["sqli", "sql injection", "sql inj", "sql"],
    "XSS": ["xss", "cross site scripting", "cross-site scripting", "cross site script", "script injection"],
    "CSRF": ["csrf", "cross site request forgery", "cross-site request forgery", "request forgery"],
    "IDOR": ["idor", "insecure direct object reference", "broken object level authorization", "bola", "object level authorization"],
    "Command Injection": ["command injection", "os command injection", "shell injection", "rce", "command exec"],
    "SSRF": ["ssrf", "server side request forgery", "server-side request forgery", "server side request"],
    "Path Traversal": ["path traversal", "directory traversal", "file traversal", "traversal", "../"],
    "Authentication flaws": ["authentication", "authentication flaw", "auth flaw", "login bypass", "weak auth", "auth bypass", "auth", "auth flow", "authentication flow", "authentication flows"],
    "Session management flaws": ["session", "session flaw", "session fixation", "session management", "cookie flaw"],
    "XXE": ["xxe", "xml external entity", "external entity", "xml entity"],
    [SAFE_TYPE]: ["safe", "not vulnerable", "no vulnerability", "secure", "benign", "none", "no issue"]
  };

  const VULN_META = {
    "SQL Injection": { cwe: "CWE-89", cvss: "9.8 Critical", owasp: "A03 Injection" },
    "XSS": { cwe: "CWE-79", cvss: "6.1 Medium", owasp: "A03 Injection" },
    "CSRF": { cwe: "CWE-352", cvss: "8.8 High", owasp: "A01 Broken Access Control" },
    "IDOR": { cwe: "CWE-639", cvss: "8.1 High", owasp: "A01 Broken Access Control" },
    "Command Injection": { cwe: "CWE-78", cvss: "9.8 Critical", owasp: "A03 Injection" },
    "SSRF": { cwe: "CWE-918", cvss: "8.6 High", owasp: "A10 SSRF" },
    "Path Traversal": { cwe: "CWE-22", cvss: "7.5 High", owasp: "A01 Broken Access Control" },
    "Authentication flaws": { cwe: "CWE-287", cvss: "9.1 Critical", owasp: "A07 Identification and Authentication Failures" },
    "Session management flaws": { cwe: "CWE-384", cvss: "8.8 High", owasp: "A07 Identification and Authentication Failures" },
    "XXE": { cwe: "CWE-611", cvss: "8.3 High", owasp: "A05 Security Misconfiguration" }
  };

  const REMEDIATION_DETAILS = {
    "SQL Injection": "Dinamik SQL quruluşunu sabit query formasına sal, bütün xarici input-u placeholder ilə bağla və mümkün olduqda allowlist tətbiq et.",
    "XSS": "İstifadəçi kontentini HTML kimi deyil, mətn kimi render et və yalnız sanitarizasiya olunmuş hallarda HTML sink-lərinə burax.",
    "CSRF": "State-changing endpoint-lərdə session-a bağlı token yoxlaması və uyğun cookie siyasəti saxla.",
    "IDOR": "Resursu yalnız id ilə tapma; cari istifadəçi kontekstini və obyekt səviyyəli icazəni query və ya service qatında tətbiq et.",
    "Command Injection": "Shell string qurmaqdan qaç, argument-separated API istifadə et və istifadəçi input-u sərt qaydada limitlə.",
    "SSRF": "Outbound request göndərmədən əvvəl host və scheme allowlist yoxlaması et, private və loopback ünvanları blokla.",
    "Path Traversal": "Final path-i resolve/canonical et və base directory-dən kənara çıxan bütün sorğuları rədd et.",
    "Authentication flaws": "Giriş, reset və bypass axınlarında yalnız server tərəfindən yoxlanmış credential və ya token istifadə et.",
    "Session management flaws": "Session identifikatorunu rotate et, cookie flag-lərini gücləndir və predictable token-lərdən qaç.",
    "XXE": "Untrusted XML üçün DOCTYPE, external entity və network resolution-u bütün parser branch-lərində söndür.",
    [SAFE_TYPE]: "Bu snippet-də əsas məqsəd mövcud təhlükəsiz pattern-i qorumaq və onu başqa endpoint-lərdə də eyni şəkildə tətbiq etməkdir."
  };

  const LOCALIZED_EXPLANATIONS = {
    az: {
      vulnerable: {
        "SQL Injection": "Zəiflik ona görə yaranır ki, xarici input query-nin strukturuna təsir edir. Yəni istifadəçi dəyəri sadəcə data kimi yox, SQL sintaksisinin bir hissəsi kimi işlənə bilir.",
        "XSS": "Zəiflik ona görə yaranır ki, istifadəçi kontenti brauzer tərəfindən HTML və ya script kimi interpretasiya olunan sink-ə çatır. Belə olduqda attacker öz markup və ya JavaScript kodunu inject edə bilir.",
        "CSRF": "Zəiflik ona görə yaranır ki, state-changing əməliyyat yalnız istifadəçinin session-ına güvənir və request-in həqiqətən legitim UI axınından gəldiyini yoxlamır.",
        "IDOR": "Zəiflik ona görə yaranır ki, obyekt yalnız istifadəçi tərəfindən verilən id ilə tapılır və cari istifadəçinin həmin resursa icazəsi ayrıca təsdiqlənmir.",
        "Command Injection": "Zəiflik ona görə yaranır ki, istifadəçi input-u shell və ya komanda sətrinə təhlükəli formada ötürülür. Bu, əlavə əmrlərin icrasına səbəb ola bilər.",
        "SSRF": "Zəiflik ona görə yaranır ki, server attacker-ın verdiyi URL və ya host-a request göndərir. Bu, daxili servislərə və ya metadata endpoint-lərə çıxış yarada bilər.",
        "Path Traversal": "Zəiflik ona görə yaranır ki, fayl yolu istifadəçi input-u ilə qurulur və final resolved path-in icazəli qovluq daxilində qalması güclü şəkildə təsdiqlənmir.",
        "Authentication flaws": "Zəiflik ona görə yaranır ki, identifikasiya və ya login axınında etibarsız bypass, zəif token və ya client-controlled identity məntiqi mövcuddur.",
        "Session management flaws": "Zəiflik ona görə yaranır ki, session və ya remember-me token-i kifayət qədər qorunmur, rotate olunmur və ya proqnozlaşdırıla bilən formadadır.",
        "XXE": "Zəiflik ona görə yaranır ki, XML parser untrusted input üçün təhlükəli entity və ya xarici resurs resolution davranışını saxlayır."
      },
      safe: "Bu snippet-də aydın zəiflik görünmür, çünki təhlükəli sink-ə çatmadan əvvəl qoruyucu mexanizm tətbiq olunur və ya request icazəli pattern üzrə işlənir."
    },
    tr: {
      vulnerable: {
        "SQL Injection": "Zafiyet, dış girdinin sorgu yapısını etkilemesinden kaynaklanır. Yani kullanıcı verisi sadece data değil, SQL sözdiziminin parçası gibi işlenebilir.",
        "XSS": "Zafiyet, kullanıcı içeriğinin tarayıcı tarafından HTML veya script olarak yorumlanan bir sink'e ulaşmasından kaynaklanır. Böylece saldırgan kendi markup veya JavaScript kodunu inject edebilir.",
        "CSRF": "Zafiyet, state-changing işlemin yalnızca kullanıcının session'ına güvenmesinden ve isteğin gerçekten meşru akıştan gelip gelmediğini doğrulamamasından kaynaklanır.",
        "IDOR": "Zafiyet, nesnenin yalnızca kullanıcı tarafından verilen id ile bulunması ve mevcut kullanıcının o kaynağa erişim yetkisinin ayrıca doğrulanmamasından kaynaklanır.",
        "Command Injection": "Zafiyet, kullanıcı girdisinin shell veya komut satırına tehlikeli şekilde aktarılmasından kaynaklanır. Bu ek komutların çalıştırılmasına yol açabilir.",
        "SSRF": "Zafiyet, sunucunun saldırganın verdiği URL veya host'a istek göndermesinden kaynaklanır. Bu iç servislere erişim oluşturabilir.",
        "Path Traversal": "Zafiyet, dosya yolunun kullanıcı girdisiyle oluşturulmasından ve final resolved path'in izinli dizinde kaldığının güçlü biçimde doğrulanmamasından kaynaklanır.",
        "Authentication flaws": "Zafiyet, kimlik doğrulama akışında güvensiz bypass, zayıf token veya client-controlled identity mantığı bulunmasından kaynaklanır.",
        "Session management flaws": "Zafiyet, session veya remember-me token'ının yeterince korunmaması, rotate edilmemesi veya tahmin edilebilir olması nedeniyle oluşur.",
        "XXE": "Zafiyet, XML parser'ın untrusted input için tehlikeli entity veya dış kaynak çözümleme davranışını korumasından kaynaklanır."
      },
      safe: "Bu snippet'te belirgin bir zafiyet görünmüyor; çünkü tehlikeli sink'e ulaşmadan önce koruma uygulanıyor veya akış güvenli pattern ile ilerliyor."
    }
  };

  const LOCALIZED_REMEDIATION = {
    az: {
      "SQL Injection": "Fix zamanı query mətni sabit qalmalı, bütün xarici dəyərlər placeholder vasitəsilə bind edilməli və dynamic column/order kimi hissələr yalnız allowlist-dən seçilməlidir.",
      "XSS": "Fix zamanı istifadəçi kontenti HTML kimi inject edilməməli, uyğun output encoding və ya etibarlı sanitizer tətbiq olunmalı, təhlükəli sink-lər minimuma endirilməlidir.",
      "CSRF": "Fix zamanı state-changing endpoint token və ya framework qoruması ilə bağlanmalı, lazım olduqda SameSite cookie siyasəti də əlavə edilməlidir.",
      "IDOR": "Fix zamanı obyekt lookup-u cari istifadəçi və ya tenant kontekstinə bağlanmalı, icazə yoxlaması controller yox, service və ya repository qatında da təsdiqlənməlidir.",
      "Command Injection": "Fix zamanı shell string concat ləğv olunmalı, execFile/subprocess list/ProcessBuilder kimi təhlükəsiz API istifadə olunmalı və input allowlist ilə məhdudlaşdırılmalıdır.",
      "SSRF": "Fix zamanı request göndərilməzdən əvvəl host, scheme və redirect siyasəti server tərəfində yoxlanmalı, private və loopback adreslər bloklanmalıdır.",
      "Path Traversal": "Fix zamanı canonical/resolve olunmuş path yoxlanmalı və nəticə icazəli base directory xaricinə çıxırsa request rədd edilməlidir.",
      "Authentication flaws": "Fix zamanı bypass branch-lər, debug header-lər və predictible credential logic çıxarılmalı, yalnız verify olunmuş credential və token-lər qəbul edilməlidir.",
      "Session management flaws": "Fix zamanı session identifikatoru rotate edilməli, cookie flag-ləri sərtləşdirilməli və persistent token-lər random, revoke edilə bilən formaya salınmalıdır.",
      "XXE": "Fix zamanı bütün parser branch-lərində DOCTYPE, external entity və network resolution söndürülməli, legacy parsing davranışı ləğv olunmalıdır.",
      [SAFE_TYPE]: "Fix tələb olunmur, amma burada istifadə olunan təhlükəsiz pattern digər oxşar endpoint-lərdə də eyni standartla qorunmalıdır."
    },
    tr: {
      "SQL Injection": "Düzeltmede sorgu metni sabit kalmalı, tüm dış değerler placeholder ile bind edilmeli ve dynamic column/order gibi parçalar sadece allowlist'ten seçilmelidir.",
      "XSS": "Düzeltmede kullanıcı içeriği HTML olarak inject edilmemeli, uygun output encoding veya güvenilir sanitizer kullanılmalı ve tehlikeli sink'ler azaltılmalıdır.",
      "CSRF": "Düzeltmede state-changing endpoint token veya framework koruması ile korunmalı, gerekirse SameSite cookie politikası da eklenmelidir.",
      "IDOR": "Düzeltmede nesne lookup'u mevcut kullanıcı veya tenant bağlamına bağlanmalı, yetki kontrolü service/repository katmanında da doğrulanmalıdır.",
      "Command Injection": "Düzeltmede shell string birleştirme kaldırılmalı, güvenli proses API'leri kullanılmalı ve girdi allowlist ile sınırlandırılmalıdır.",
      "SSRF": "Düzeltmede istek gönderilmeden önce host, scheme ve redirect politikası kontrol edilmeli; private ve loopback adresler engellenmelidir.",
      "Path Traversal": "Düzeltmede canonical/resolve edilmiş path kontrol edilmeli ve izinli dizin dışına çıkan tüm istekler reddedilmelidir.",
      "Authentication flaws": "Düzeltmede bypass branch'leri, debug header'ları ve tahmin edilebilir kimlik doğrulama mantığı kaldırılmalıdır.",
      "Session management flaws": "Düzeltmede session id rotate edilmeli, cookie flag'leri güçlendirilmeli ve persistent token'lar random hale getirilmelidir.",
      "XXE": "Düzeltmede tüm parser branch'lerinde DOCTYPE, external entity ve network resolution kapatılmalı, legacy parsing davranışı kaldırılmalıdır.",
      [SAFE_TYPE]: "Ek bir düzeltme gerekmez; ancak burada kullanılan güvenli pattern benzer endpoint'lerde de korunmalıdır."
    }
  };

  const EXPLANATION_TAIL = {
    az: {
      vulnerable: "Burada əsas analiz nöqtəsi odur ki, istifadəçi nəzarətində olan dəyər harada etibarlı qəbul edilir və hansı sink-ə və ya qərar nöqtəsinə qədər dəyişmədən çatır.",
      safe: "Bu da göstərir ki, təkcə şübhəli görünüş kifayət deyil; real data-flow və qoruyucu mexanizm birlikdə qiymətləndirilməlidir."
    },
    tr: {
      vulnerable: "Buradaki ana analiz noktası, kullanıcı kontrollü değerin nerede güvenilir kabul edildiği ve hangi sink ya da karar noktasına kadar ulaştığıdır.",
      safe: "Bu da şunu gösterir: sadece şüpheli görünüm yetmez; gerçek data-flow ve koruyucu mekanizma birlikte değerlendirilmelidir."
    },
    en: {
      vulnerable: "The key review point is where attacker-controlled data is trusted and which sink or security decision it reaches without a strong control in between.",
      safe: "That is why the snippet should be judged by real data flow and control coverage, not by suspicious-looking syntax alone."
    }
  };

  const REMEDIATION_TAIL = {
    az: {
      vulnerable: "Düzəldilmiş nümunədə eyni biznes məntiqi saxlanır, amma input əvvəlcə məhdudlaşdırılır, sonra təhlükəsiz API və server-tərəfli yoxlama ilə işlənir.",
      safe: "Bu təhlükəsiz nümunədə əlavə kod dəyişikliyi vacib deyil; əsas məsələ eyni qoruyucu pattern-i başqa oxşar axınlarda da pozmamaqdır."
    },
    tr: {
      vulnerable: "Düzeltilmiş örnekte aynı iş mantığı korunur; ancak girdi önce sınırlandırılır, sonra güvenli API ve sunucu tarafı kontroller ile işlenir.",
      safe: "Bu güvenli örnekte ek kod değişikliği şart değildir; önemli olan aynı koruyucu pattern'i benzer akışlarda da bozmamaktır."
    },
    en: {
      vulnerable: "In the fixed example, the business flow stays the same, but untrusted input is constrained first and then handled through a safer API and server-side validation.",
      safe: "No code change is strictly necessary here; the important part is preserving the same guard pattern in similar endpoints."
    }
  };

  const REMEDIATION_SNIPPETS = {
    "SQL Injection": {
      PHP: `<?php
$id = (int) ($_GET['id'] ?? 0);
$stmt = $db->prepare("SELECT id, username, email FROM users WHERE id = ?");
$stmt->execute([$id]);
$account = $stmt->fetch(PDO::FETCH_ASSOC);`,
      "Node.js": `app.get("/orders", async (req, res) => {
  const status = req.query.status || "pending";
  const [rows] = await pool.execute(
    "SELECT id, total, status FROM orders WHERE status = ?",
    [status]
  );
  res.json(rows);
});`,
      Python: `records = db.session.execute(
    text("SELECT id, username FROM users WHERE username = :username"),
    {"username": username}
)`,
      Java: `PreparedStatement ps = conn.prepareStatement(
    "SELECT id, username FROM users WHERE id = ?"
);
ps.setLong(1, userId);
ResultSet rs = ps.executeQuery();`,
      default: `Use parameterized queries and bind untrusted input as data, not SQL syntax.`
    },
    "XSS": {
      JavaScript: `function renderPreview(comment) {
  const target = document.getElementById("preview");
  target.textContent = comment;
}`,
      "Node.js": `app.post("/ticket", (req, res) => {
  const message = escapeHtml(req.body.message || "");
  res.send(\`<h2>Ticket received</h2><div>\${message}</div>\`);
});`,
      Python: `return render_template("profile.html", bio=bio)

<!-- profile.html -->
<div class="bio">{{ bio }}</div>`,
      PHP: `echo "<section class='note'>" .
  htmlspecialchars($note, ENT_QUOTES, 'UTF-8') .
"</section>";`,
      default: `Render untrusted content as text or sanitize it before inserting into HTML.`
    },
    "CSRF": {
      PHP: `<?php
session_start();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!hash_equals($_SESSION['csrf'], $_POST['csrf'] ?? '')) {
        http_response_code(403);
        exit;
    }
    // perform state change
}`,
      "Node.js": `router.post("/billing/address", ensureAuthenticated, csrfProtection, async (req, res) => {
  await accountService.updateAddress(req.user.id, req.body.address);
  res.json({ saved: true });
});`,
      Python: `if request.form.get("csrf_token") != session.get("csrf_token"):
    abort(403)`,
      Java: `String submitted = request.getParameter("csrf");
String expected = (String) request.getSession().getAttribute("csrf");
if (submitted == null || !submitted.equals(expected)) {
    response.sendError(403);
    return;
}`,
      default: `Require a CSRF token or framework CSRF middleware for state-changing requests.`
    },
    "IDOR": {
      PHP: `$stmt = $db->prepare("SELECT id, body FROM messages WHERE id = ? AND user_id = ?");
$stmt->execute([$messageId, $_SESSION['user_id']]);`,
      "Node.js": `app.get("/reports/download", requireAuth, async (req, res) => {
  const report = await reportStore.findLatestForUser(req.user.id);
  if (!report) return res.sendStatus(404);
  res.download(report.path);
});`,
      Python: `invoice = Invoice.query.filter_by(
    id=invoice_id,
    owner_id=current_user.id
).first_or_404()`,
      Java: `Document doc = documentService.find(docId);
if (!authorizationService.canView(request.getUserPrincipal(), doc)) {
    response.sendError(403);
    return;
}`,
      default: `Enforce object-level authorization before returning or modifying a resource.`
    },
    "Command Injection": {
      PHP: `$host = $_GET['host'] ?? '127.0.0.1';
$safeHost = escapeshellarg($host);
$output = shell_exec("/usr/bin/ping -c 1 " . $safeHost);`,
      "Node.js": `execFile("unzip", [path.join("/srv/backups", archive), "-d", "/srv/restore"], (err) => {
  if (err) return res.status(500).send("failed");
  res.send("ok");
});`,
      Python: `subprocess.run(
    ["tar", "-czf", "/tmp/export.tgz", f"/var/log/app/{day}"],
    check=True
)`,
      Java: `ProcessBuilder pb = new ProcessBuilder("convert", file, "-resize", "150x150", "thumb.png");
pb.start();`,
      default: `Avoid shell-parsed command strings. Use argument-separated process APIs and validate inputs.`
    },
    "SSRF": {
      "Node.js": `const remote = new URL(req.body.url);
if (remote.protocol !== "https:" || remote.hostname !== "images.examplecdn.com") {
  return res.status(400).json({ error: "unsupported host" });
}
const image = await fetch(remote.toString());`,
      Python: `url = urllib.parse.urlparse(request.args["url"])
if url.scheme not in {"http", "https"} or is_private(url.hostname):
    abort(400)
return requests.get(request.args["url"], timeout=2).text`,
      Java: `URL parsed = new URL(logoUrl);
if (!"assets.example.com".equals(parsed.getHost())) {
    response.sendError(400);
    return;
}`,
      PHP: `$allowed = ['hooks.example.com'];
$parts = parse_url($target);
if (!in_array($parts['host'] ?? '', $allowed, true)) {
    http_response_code(400);
    exit;
}
$body = file_get_contents($target);`,
      default: `Allowlist outbound destinations and block private, loopback, and metadata addresses.`
    },
    "Path Traversal": {
      "Node.js": `const base = "/var/www/assets";
const target = path.resolve(base, req.query.file || "");
if (!target.startsWith(path.resolve(base) + path.sep)) {
  return res.sendStatus(400);
}
res.sendFile(target);`,
      Python: `base = pathlib.Path("/opt/exports").resolve()
target = (base / name).resolve()
if base not in target.parents:
    abort(400)
return send_file(target)`,
      Java: `String basePath = base.getCanonicalPath();
String requestedPath = requested.getCanonicalPath();
if (!requestedPath.startsWith(basePath + File.separator)) {
    response.sendError(400);
    return;
}`,
      PHP: `$allowed = ['hero' => '/srv/site/images/hero.jpg'];
if (!isset($allowed[$name])) {
    http_response_code(404);
    exit;
}
readfile($allowed[$name]);`,
      default: `Resolve the canonical path and verify it stays inside the allowed base directory.`
    },
    "Authentication flaws": {
      "Node.js": `const user = await users.findByEmail(req.body.email);
if (!user) return res.status(401).send("invalid");
const ok = await bcrypt.compare(req.body.password, user.passwordHash);
if (!ok) return res.status(401).send("invalid");`,
      Python: `user = authenticate(request.form["email"], request.form["password"])
if not user:
    abort(401)
session["user_id"] = user.id`,
      PHP: `$token = bin2hex(random_bytes(32));
store_reset_token($email, password_hash($token, PASSWORD_DEFAULT));`,
      Java: `if (!passwordEncoder.matches(inputPassword, user.getPasswordHash())) {
    response.sendError(401);
    return;
}`,
      default: `Use strong credential verification, remove backdoors, and generate reset tokens with secure randomness.`
    },
    "Session management flaws": {
      "Node.js": `app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: true, sameSite: "lax" }
}));`,
      Python: `session.clear()
session["user_id"] = user.id
session["csrf_seed"] = secrets.token_hex(16)`,
      PHP: `session_set_cookie_params([
  'secure' => true,
  'httponly' => true,
  'samesite' => 'Lax'
]);
session_start();`,
      Java: `Cookie cookie = new Cookie("remember_me", tokenValue);
cookie.setHttpOnly(true);
cookie.setSecure(true);
response.addCookie(cookie);`,
      default: `Protect session cookies, rotate session state after login, and never accept session ids from URLs.`
    },
    "XXE": {
      Java: `DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
factory.setFeature("http://xml.org/sax/features/external-general-entities", false);
factory.setFeature("http://xml.org/sax/features/external-parameter-entities", false);`,
      Python: `parser = etree.XMLParser(resolve_entities=False, no_network=True)
document = etree.fromstring(request.data, parser=parser)`,
      PHP: `$dom = new DOMDocument();
$dom->loadXML($xml, LIBXML_NONET);`,
      default: `Disable DTDs and external entity resolution before parsing untrusted XML.`
    },
    [SAFE_TYPE]: {
      default: `// Safe pattern example
const safePattern = true;
// Keep using parameterization, output encoding, and authorization checks consistently.`
    }
  };

  const els = {
    screens: {
      welcome: document.getElementById("welcome-screen"),
      start: document.getElementById("start-screen"),
      game: document.getElementById("game-screen"),
      feedback: document.getElementById("feedback-screen"),
      results: document.getElementById("results-screen")
    },
    questionBankCount: document.getElementById("question-bank-count"),
    continueBtn: document.getElementById("continue-btn"),
    startGameBtn: document.getElementById("start-game-btn"),
    setupHomeBtn: document.getElementById("setup-home-btn"),
    homeBtn: document.getElementById("home-btn"),
    roundLabel: document.getElementById("round-label"),
    scoreLabel: document.getElementById("score-label"),
    difficultyLabel: document.getElementById("difficulty-label"),
    progressFill: document.getElementById("progress-fill"),
    questionTitle: document.getElementById("question-title"),
    questionSubline: document.getElementById("question-subline"),
    languageBadge: document.getElementById("language-badge"),
    categoryBadge: document.getElementById("category-badge"),
    codeBlock: document.getElementById("code-block"),
    hintBtn: document.getElementById("hint-btn"),
    hintCountLabel: document.getElementById("hint-count-label"),
    hintsPanel: document.getElementById("hints-panel"),
    choiceModePanel: document.getElementById("choice-mode-panel"),
    answerOptions: document.getElementById("answer-options"),
    inputModePanel: document.getElementById("input-mode-panel"),
    manualDetailsGroup: document.getElementById("manual-details-group"),
    manualTypeInput: document.getElementById("manual-type-input"),
    manualReasoningLabel: document.getElementById("manual-reasoning-label"),
    reasoningGroup: document.getElementById("reasoning-group"),
    reasoningInput: document.getElementById("reasoning-input"),
    submitBtn: document.getElementById("submit-btn"),
    feedbackResult: document.getElementById("feedback-result"),
    feedbackScore: document.getElementById("feedback-score"),
    feedbackPill: document.getElementById("feedback-pill"),
    correctVerdict: document.getElementById("correct-verdict"),
    correctType: document.getElementById("correct-type"),
    feedbackScoreInline: document.getElementById("feedback-score-inline"),
    metaGrid: document.getElementById("vuln-meta-grid"),
    metaCwe: document.getElementById("meta-cwe"),
    metaCvss: document.getElementById("meta-cvss"),
    metaOwasp: document.getElementById("meta-owasp"),
    feedbackInfoCard: document.getElementById("feedback-info-card"),
    safeCompareCard: document.getElementById("safe-compare-card"),
    feedbackExplanation: document.getElementById("feedback-explanation"),
    feedbackRemediation: document.getElementById("feedback-remediation"),
    feedbackOriginalCode: document.getElementById("feedback-original-code"),
    feedbackRemediationCode: document.getElementById("feedback-remediation-code"),
    nextBtn: document.getElementById("next-btn"),
    finalScore: document.getElementById("final-score"),
    finalCorrect: document.getElementById("final-correct"),
    finalWrong: document.getElementById("final-wrong"),
    finalPercentage: document.getElementById("final-percentage"),
    resultsSummary: document.getElementById("results-summary"),
    resultsRank: document.getElementById("results-rank"),
    categoryBreakdown: document.getElementById("category-breakdown"),
    restartBtn: document.getElementById("restart-btn"),
    appTitle: document.getElementById("app-title"),
    eyebrow: document.querySelector(".eyebrow"),
    subtitle: document.querySelector(".subtitle"),
    welcomeTag: document.getElementById("welcome-tag"),
    welcomeTitle: document.getElementById("welcome-title"),
    welcomeLead: document.getElementById("welcome-lead"),
    topbarChips: document.querySelectorAll(".status-chip"),
    startSectionTag: document.querySelector("#start-screen .hero-copy .section-tag"),
    heroTitle: document.querySelector("#start-screen h2"),
    heroLead: document.querySelector("#start-screen .lead"),
    featureCards: document.querySelectorAll("#start-screen .feature-grid .mini-card"),
    modePanelTitle: document.getElementById("mode-panel-title"),
    difficultyPanelTitle: document.getElementById("difficulty-panel-title"),
    terminalTitle: document.getElementById("terminal-title"),
    terminalLine1: document.getElementById("terminal-line-1"),
    terminalLine2: document.getElementById("terminal-line-2"),
    terminalLine3: document.getElementById("terminal-line-3"),
    choiceModeLabel: document.getElementById("choice-mode-label"),
    inputModeLabel: document.getElementById("input-mode-label"),
    difficultyMixedLabel: document.getElementById("difficulty-mixed-label"),
    difficultyEasyLabel: document.getElementById("difficulty-easy-label"),
    difficultyMediumLabel: document.getElementById("difficulty-medium-label"),
    difficultyHardLabel: document.getElementById("difficulty-hard-label"),
    sidePanelTag: document.querySelector(".side-panel .section-tag"),
    scoreItems: document.querySelectorAll(".score-list li span"),
    scoreValues: document.querySelectorAll(".score-list li strong"),
    startRoundTag: document.querySelector("#game-screen .round-header .section-tag"),
    codeHeaderLabel: document.querySelector(".code-title-block span"),
    answerGroupLabel: document.getElementById("answer-group-label"),
    verdictGroupLabel: document.getElementById("verdict-group-label"),
    manualVulnLabel: document.getElementById("manual-vuln-label"),
    manualSafeLabel: document.getElementById("manual-safe-label"),
    manualTypeLabel: document.getElementById("manual-type-label"),
    reasoningLabel: document.getElementById("reasoning-label"),
    feedbackTag: document.querySelector("#feedback-screen .feedback-header .section-tag"),
    feedbackLabels: document.querySelectorAll("#feedback-screen .mini-label"),
    feedbackInfoTitle: document.getElementById("feedback-info-title"),
    compareLeftLabel: document.getElementById("compare-left-label"),
    compareRightLabel: document.getElementById("compare-right-label"),
    compareLeftTitle: document.getElementById("compare-left-title"),
    compareRightTitle: document.getElementById("compare-right-title"),
    resultsTag: document.querySelector("#results-screen .results-hero .section-tag"),
    resultsTitle: document.querySelector("#results-screen h2"),
    resultsCards: document.querySelectorAll("#results-screen .results-card .mini-label"),
    breakdownHeader: document.querySelector("#results-screen .code-header span")
  };

  function init() {
    els.questionBankCount.textContent = String(window.QUESTION_BANK.length);
    document.querySelectorAll('input[name="app-language"]').forEach((input) => {
      input.addEventListener("change", (event) => {
        state.locale = event.target.value;
        applyLocale();
        if (state.sessionQuestions.length) {
          renderRound();
        }
      });
    });
    document.querySelectorAll('input[name="answer-mode"]').forEach((input) => {
      input.addEventListener("change", (event) => {
        state.answerMode = event.target.value;
        syncAnswerModeUI();
        if (state.sessionQuestions.length) {
          renderRound();
        }
      });
    });
    document.querySelectorAll('input[name="difficulty-filter"]').forEach((input) => {
      input.addEventListener("change", (event) => {
        state.difficultyFilter = event.target.value;
      });
    });
    document.querySelectorAll('input[name="manual-verdict"]').forEach((input) => {
      input.addEventListener("change", updateInputModeState);
    });
    els.continueBtn.addEventListener("click", () => showScreen("start"));
    els.startGameBtn.addEventListener("click", startGame);
    els.setupHomeBtn.addEventListener("click", () => showScreen("welcome"));
    els.homeBtn.addEventListener("click", () => showScreen("welcome"));
    els.hintBtn.addEventListener("click", revealHint);
    els.submitBtn.addEventListener("click", submitAnswer);
    els.nextBtn.addEventListener("click", advanceRound);
    els.restartBtn.addEventListener("click", startGame);
    applyLocale();
    syncAnswerModeUI();
    updateInputModeState();
  }

  function t(key) {
    return LOCALES[state.locale][key];
  }

  function format(template, values) {
    return template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
  }

  function translateType(type) {
    return VULN_TRANSLATIONS[state.locale][type] || type;
  }

  function difficultyLabel(level) {
    return t(`difficulty_${level}`) || level;
  }

  function showScreen(name) {
    Object.entries(els.screens).forEach(([key, node]) => {
      node.classList.toggle("active", key === name);
    });
  }

  function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function applyLocale() {
    els.appTitle.textContent = "Code Inspector by Asadov";
    els.eyebrow.textContent = t("eyebrow");
    els.subtitle.textContent = t("appSubtitle");
    els.welcomeTag.textContent = t("welcome");
    els.welcomeTitle.textContent = t("welcomeTitle");
    els.welcomeLead.textContent = t("welcomeLead");
    els.topbarChips[0].textContent = t("topbarStatus");
    els.topbarChips[1].textContent = `${window.QUESTION_BANK.length} ${t("bankStatus")}`;
    els.startSectionTag.textContent = t("missionBrief");
    els.heroTitle.textContent = t("heroTitle");
    els.heroLead.textContent = t("heroLead");
    els.featureCards[0].querySelector(".mini-label").textContent = t("rounds");
    els.featureCards[0].querySelector("strong").textContent = t("roundsStrong");
    els.featureCards[0].querySelector("p").textContent = t("roundsText");
    els.featureCards[1].querySelector(".mini-label").textContent = t("bank");
    els.featureCards[1].querySelector("strong").textContent = t("bankStrong");
    els.featureCards[1].querySelector("p").textContent = t("bankText");
    els.featureCards[2].querySelector(".mini-label").textContent = t("hints");
    els.featureCards[2].querySelector("strong").textContent = t("hintsStrong");
    els.featureCards[2].querySelector("p").textContent = t("hintsText");
    els.modePanelTitle.textContent = t("answerMode");
    els.difficultyPanelTitle.textContent = t("difficultyFilter");
    els.terminalTitle.textContent = t("terminalTitle");
    els.terminalLine1.textContent = t("terminalLine1");
    els.terminalLine2.textContent = t("terminalLine2");
    els.terminalLine3.textContent = t("terminalLine3");
    els.choiceModeLabel.textContent = t("multipleChoice");
    els.inputModeLabel.textContent = t("freeInput");
    els.difficultyMixedLabel.textContent = t("mixed");
    els.difficultyEasyLabel.textContent = t("difficulty_easy");
    els.difficultyMediumLabel.textContent = t("difficulty_medium");
    els.difficultyHardLabel.textContent = t("difficulty_hard");
    els.continueBtn.textContent = t("continue");
    document.querySelector(".ops-card .mini-label").textContent = t("signalMix");
    document.querySelector(".ops-card strong").textContent = t("signalMixText");
    document.querySelectorAll(".ops-card")[1].querySelector(".mini-label").textContent = t("languages");
    els.sidePanelTag.textContent = t("scoring");
    els.scoreItems[0].textContent = t("scoreCorrectVerdict");
    els.scoreItems[1].textContent = t("scoreCorrectType");
    els.scoreItems[2].textContent = t("scoreReason");
    els.scoreItems[3].textContent = t("scoreHint");
    els.scoreValues[0].textContent = "+40";
    els.scoreValues[1].textContent = "+35";
    els.scoreValues[2].textContent = "+15";
    els.scoreValues[3].textContent = "-10";
    els.startGameBtn.textContent = t("startMission");
    els.setupHomeBtn.textContent = t("backHome");
    els.roundLabel.parentElement.querySelector(".hud-label").textContent = t("round");
    els.scoreLabel.parentElement.querySelector(".hud-label").textContent = t("score");
    els.difficultyLabel.parentElement.querySelector(".hud-label").textContent = t("difficulty");
    els.startRoundTag.textContent = t("gameSection");
    els.codeHeaderLabel.textContent = t("targetSource");
    els.answerGroupLabel.textContent = t("answerLabel");
    els.verdictGroupLabel.textContent = t("verdictLabel");
    els.manualVulnLabel.textContent = t("verdict_vulnerable");
    els.manualSafeLabel.textContent = t("verdict_safe");
    els.manualTypeLabel.textContent = t("manualTypeLabel");
    els.manualTypeInput.placeholder = t("manualTypePlaceholder");
    els.reasoningLabel.textContent = state.answerMode === "choice" ? t("reasoningLabelChoice") : t("reasoningLabelInput");
    els.manualReasoningLabel.textContent = t("reasoningLabelInput");
    els.manualReasoningLabel.classList.add("hidden");
    els.reasoningInput.placeholder = t("reasoningPlaceholder");
    els.homeBtn.textContent = t("backHome");
    els.submitBtn.textContent = t("submitAnalysis");
    els.feedbackTag.textContent = t("feedbackTag");
    els.feedbackLabels[0].textContent = t("correctAnswer");
    els.feedbackLabels[1].textContent = t("category");
    els.feedbackLabels[2].textContent = t("roundScoreShort");
    els.feedbackInfoCard.querySelector(".mini-label").textContent = t("analysisNotes");
    els.feedbackInfoTitle.textContent = t("whyItMatters");
    els.compareLeftLabel.textContent = t("originalCodeMini");
    els.compareRightLabel.textContent = t("fixedCodeMini");
    els.compareLeftTitle.textContent = t("originalCode");
    els.compareRightTitle.textContent = t("fixedCode");
    els.resultsTag.textContent = t("missionReport");
    els.resultsTitle.textContent = t("sessionComplete");
    if (!state.answeredRounds.length) {
      els.resultsSummary.textContent = t("resultsLead");
    }
    els.resultsCards[0].textContent = t("totalScore");
    els.resultsCards[1].textContent = t("correctAnswers");
    els.resultsCards[2].textContent = t("wrongAnswers");
    els.resultsCards[3].textContent = t("accuracy");
    els.breakdownHeader.textContent = t("categoryBreakdown");
    els.restartBtn.textContent = t("restart");
  }

  function syncAnswerModeUI() {
    const choice = state.answerMode === "choice";
    els.choiceModePanel.classList.toggle("hidden", !choice);
    els.inputModePanel.classList.toggle("hidden", choice);
    els.reasoningLabel.textContent = choice ? t("reasoningLabelChoice") : t("reasoningLabelInput");
    els.reasoningGroup.classList.toggle("hidden", !choice);
    updateInputModeState();
  }

  function updateInputModeState() {
    if (state.answerMode !== "input") {
      els.manualDetailsGroup.classList.add("hidden");
      els.manualTypeInput.disabled = true;
      els.reasoningInput.disabled = false;
      return;
    }

    const verdictInput = document.querySelector('input[name="manual-verdict"]:checked');
    const isVulnerable = verdictInput?.value === "true";
    els.manualDetailsGroup.classList.toggle("hidden", !isVulnerable);
    els.reasoningGroup.classList.toggle("hidden", !isVulnerable);
    els.manualTypeInput.disabled = !isVulnerable;
    els.reasoningInput.disabled = !isVulnerable;
    if (!isVulnerable) {
      els.manualTypeInput.value = "";
      els.reasoningInput.value = "";
    }
  }

  function startGame() {
    if (window.QUESTION_BANK.length < TOTAL_ROUNDS) {
      window.alert(t("smallBankAlert"));
      return;
    }
    const source = state.difficultyFilter === "mixed"
      ? window.QUESTION_BANK
      : window.QUESTION_BANK.filter((question) => question.difficulty === state.difficultyFilter);
    if (source.length < TOTAL_ROUNDS) {
      window.alert(t("filterSmallAlert"));
      return;
    }
    state.sessionQuestions = shuffle(source).slice(0, TOTAL_ROUNDS);
    state.currentIndex = 0;
    state.score = 0;
    state.correctAnswers = 0;
    state.answeredRounds = [];
    state.lastRound = null;
    renderRound();
    showScreen("game");
  }

  function currentQuestion() {
    return state.sessionQuestions[state.currentIndex];
  }

  function renderRound() {
    const question = currentQuestion();
    state.hintIndex = 0;
    state.usedHints = 0;
    state.currentOptions = buildAnswerOptions(question);

    els.roundLabel.textContent = `${state.currentIndex + 1} / ${TOTAL_ROUNDS}`;
    els.scoreLabel.textContent = String(state.score);
    els.difficultyLabel.textContent = difficultyLabel(question.difficulty);
    els.progressFill.style.width = `${((state.currentIndex + 1) / TOTAL_ROUNDS) * 100}%`;
    els.questionTitle.textContent = question.title;
    els.questionSubline.textContent = format(t("roundIntel"), {
      difficulty: difficultyLabel(question.difficulty),
      language: question.language
    });
    els.languageBadge.textContent = question.language;
    els.categoryBadge.textContent = t("codeReview");
    els.questionTitle.textContent = "";
    els.codeBlock.textContent = buildExpandedSource(question);
    els.reasoningInput.value = "";
    els.manualTypeInput.value = "";
    document.querySelectorAll('input[name="manual-verdict"]').forEach((input) => {
      input.checked = false;
    });
    els.hintsPanel.innerHTML = "";
    els.hintBtn.disabled = false;
    els.hintBtn.textContent = t("requestHint");
    els.hintCountLabel.textContent = format(t("hintCount"), { used: 0, total: question.hints.length });
    syncAnswerModeUI();
    updateInputModeState();
    renderAnswerOptions();
  }

  function renderAnswerOptions() {
    els.answerOptions.innerHTML = "";

    state.currentOptions.forEach((option) => {
      const label = document.createElement("label");
      label.className = "answer-card";
      label.innerHTML = `
        <input type="radio" name="answer-option" value="${option.key}">
        <span class="answer-letter">${option.letter}</span>
        <span class="answer-copy">
          <strong>${option.letter}. ${translateType(option.vulnerabilityType)}</strong>
          <span>${option.isVulnerable ? t("verdict_vulnerable") : t("verdict_safe")}</span>
        </span>
      `;
      els.answerOptions.appendChild(label);
    });
  }

  function revealHint() {
    const question = currentQuestion();
    if (state.hintIndex >= question.hints.length) {
      return;
    }

    const hintCard = document.createElement("div");
    hintCard.className = "hint-card";
    hintCard.innerHTML = `<strong>Hint ${state.hintIndex + 1}</strong><p>${question.hints[state.hintIndex]}</p>`;
    els.hintsPanel.appendChild(hintCard);
    state.hintIndex += 1;
    state.usedHints += 1;
    els.hintCountLabel.textContent = format(t("hintCount"), { used: state.hintIndex, total: question.hints.length });

    if (state.hintIndex >= question.hints.length) {
      els.hintBtn.disabled = true;
      els.hintBtn.textContent = t("noMoreHints");
    }
  }

  function submitAnswer() {
    const question = currentQuestion();
    const expectedType = question.isVulnerable ? question.vulnerabilityType : SAFE_TYPE;
    let selectedVulnerable;
    let selectedType;

    if (state.answerMode === "choice") {
      const selectedInput = document.querySelector('input[name="answer-option"]:checked');
      if (!selectedInput) {
        window.alert(t("selectAnswerAlert"));
        return;
      }
      const selectedOption = state.currentOptions.find((option) => option.key === selectedInput.value);
      selectedVulnerable = selectedOption.isVulnerable;
      selectedType = selectedOption.vulnerabilityType;
    } else {
      const verdictInput = document.querySelector('input[name="manual-verdict"]:checked');
      if (!verdictInput) {
        window.alert(t("selectVerdictAlert"));
        return;
      }
      selectedVulnerable = verdictInput.value === "true";
      if (selectedVulnerable && !els.manualTypeInput.value.trim()) {
        window.alert(t("manualTypeLabel"));
        return;
      }
      selectedType = normalizeVulnerabilityInput(els.manualTypeInput.value, selectedVulnerable);
    }

    const reasoning = els.reasoningInput.value.trim();
    const verdictCorrect = selectedVulnerable === question.isVulnerable;
    const typeCorrect = selectedType === expectedType;
    const reasoningBonus = evaluateReasoning(reasoning, question);

    let roundScore = 0;
    if (verdictCorrect) roundScore += BASE_POINTS;
    if (typeCorrect) roundScore += TYPE_POINTS;
    if (reasoningBonus) roundScore += REASONING_POINTS;
    roundScore -= state.usedHints * HINT_PENALTY;
    roundScore = Math.max(0, roundScore);
    state.score += roundScore;

    const roundCorrect = verdictCorrect && typeCorrect;
    if (roundCorrect) {
      state.correctAnswers += 1;
    }

    const result = {
      questionId: question.id,
      category: expectedType,
      roundScore,
      verdictCorrect,
      typeCorrect,
      reasoningBonus,
      roundCorrect
    };

    state.lastRound = { question, result };
    state.answeredRounds.push(result);
    renderFeedback();
    showScreen("feedback");
  }

  function normalizeVulnerabilityInput(value, selectedVulnerable) {
    const normalized = value.trim().toLowerCase().replace(/[^a-z0-9/.\-\s]+/g, " ").replace(/\s+/g, " ").trim();
    if (!normalized) {
      return selectedVulnerable ? "" : SAFE_TYPE;
    }

    for (const [type, synonyms] of Object.entries(TYPE_SYNONYMS)) {
      if (type === SAFE_TYPE) continue;
      if (synonyms.some((term) => normalized.includes(term))) {
        return type;
      }
    }

    if (TYPE_SYNONYMS[SAFE_TYPE].some((term) => normalized.includes(term))) {
      return SAFE_TYPE;
    }

    if (!selectedVulnerable) {
      return SAFE_TYPE;
    }

    return value.trim();
  }

  function evaluateReasoning(reasoning, question) {
    if (!reasoning) {
      return false;
    }

    const text = reasoning.toLowerCase();
    const tokens = question.explanation
      .toLowerCase()
      .split(/[^a-z]+/)
      .filter((token) => token.length > 5)
      .slice(0, 18);

    const typeMatches = (TYPE_SYNONYMS[question.vulnerabilityType] || []).some((term) => text.includes(term));
    const tokenHits = tokens.filter((token) => text.includes(token)).length;
    return reasoning.length >= 20 && (typeMatches || tokenHits >= 2);
  }

  function renderFeedback() {
    const { question, result } = state.lastRound;
    const expectedType = question.isVulnerable ? question.vulnerabilityType : SAFE_TYPE;
    const compareGrid = document.querySelector(".compare-grid");
    els.feedbackResult.textContent = result.roundCorrect ? t("analysisConfirmed") : t("analysisIncorrect");
    els.feedbackResult.className = result.roundCorrect ? "result-good" : "result-bad";
    els.feedbackScore.textContent = format(t("roundScore"), {
      score: `${result.roundScore} ${state.locale === "en" ? "points" : state.locale === "tr" ? "puan" : "xal"}`
    });
    els.feedbackPill.textContent = result.roundCorrect ? t("verified") : t("mismatch");
    els.feedbackPill.style.borderColor = result.roundCorrect ? "var(--line-strong)" : "rgba(255, 111, 111, 0.4)";
    els.feedbackPill.style.background = result.roundCorrect ? "rgba(102, 242, 207, 0.08)" : "rgba(255, 111, 111, 0.1)";
    els.feedbackPill.style.color = result.roundCorrect ? "var(--accent)" : "var(--danger)";
    els.correctVerdict.textContent = question.isVulnerable ? t("verdict_vulnerable") : t("verdict_safe");
    els.correctType.textContent = translateType(expectedType);
    els.feedbackScoreInline.textContent = `${result.roundScore}`;
    els.feedbackExplanation.textContent = getDetailedExplanation(question);
    els.feedbackRemediation.textContent = getDetailedRemediation(question);
    const original = buildExpandedSource(question);
    els.feedbackOriginalCode.innerHTML = renderHighlightedCode(original, null, "removed");

    if (question.isVulnerable) {
      const meta = VULN_META[question.vulnerabilityType];
      els.metaGrid.classList.remove("hidden");
      els.safeCompareCard.classList.remove("hidden");
      compareGrid.classList.remove("single-compare");
      els.metaCwe.textContent = meta?.cwe || "-";
      els.metaCvss.textContent = meta?.cvss || "-";
      els.metaOwasp.textContent = meta?.owasp || "-";
      const fixed = buildExpandedRemediation(question);
      els.feedbackOriginalCode.innerHTML = renderHighlightedCode(original, fixed, "removed");
      els.feedbackRemediationCode.innerHTML = renderCompareCode(original, fixed);
    } else {
      els.metaGrid.classList.add("hidden");
      els.safeCompareCard.classList.add("hidden");
      compareGrid.classList.add("single-compare");
      els.metaCwe.textContent = "-";
      els.metaCvss.textContent = "-";
      els.metaOwasp.textContent = "-";
      els.feedbackRemediationCode.innerHTML = "";
    }

    els.nextBtn.textContent = state.currentIndex === TOTAL_ROUNDS - 1 ? t("finalReport") : t("nextRound");
  }

  function getRemediationCode(question) {
    if (question.remediationCode) {
      return question.remediationCode;
    }
    const type = question.isVulnerable ? question.vulnerabilityType : SAFE_TYPE;
    const snippets = REMEDIATION_SNIPPETS[type] || REMEDIATION_SNIPPETS[SAFE_TYPE];
    return snippets[question.language] || snippets.default;
  }

  function getDetailedRemediation(question) {
    const type = question.isVulnerable ? question.vulnerabilityType : SAFE_TYPE;
    const detail = REMEDIATION_DETAILS[type] || "";
    if (!question.isVulnerable) {
      if (state.locale === "en") {
        return `${t("safeRoundText")} ${detail} ${REMEDIATION_TAIL.en.safe}`.trim();
      }
      return `${t("safeRoundText")} ${(LOCALIZED_REMEDIATION[state.locale] || {})[SAFE_TYPE] || detail} ${REMEDIATION_TAIL[state.locale].safe}`.trim();
    }
    if (state.locale === "en") {
      return `${question.remediation} ${detail} ${REMEDIATION_TAIL.en.vulnerable}`.trim();
    }
    return `${question.remediation} ${(LOCALIZED_REMEDIATION[state.locale] || {})[type] || detail} ${REMEDIATION_TAIL[state.locale].vulnerable}`.trim();
  }

  function getDetailedExplanation(question) {
    const type = question.isVulnerable ? question.vulnerabilityType : SAFE_TYPE;
    if (state.locale === "en") {
      return `${question.explanation} ${question.isVulnerable ? EXPLANATION_TAIL.en.vulnerable : EXPLANATION_TAIL.en.safe}`.trim();
    }
    if (!question.isVulnerable) {
      return `${LOCALIZED_EXPLANATIONS[state.locale].safe} ${EXPLANATION_TAIL[state.locale].safe}`.trim();
    }
    return `${LOCALIZED_EXPLANATIONS[state.locale].vulnerable[type] || question.explanation} ${EXPLANATION_TAIL[state.locale].vulnerable}`.trim();
  }

  function buildExpandedSource(question) {
    const wrapper = getCodeWrapper(question.language, question.title, false);
    return `${wrapper.before}\n${indentBlock(normalizeEmbeddedCode(question.code.trim(), question.language), 2)}\n${wrapper.after}`.trim();
  }

  function buildExpandedRemediation(question) {
    const wrapper = getCodeWrapper(question.language, question.title, true);
    return `${wrapper.before}\n${indentBlock(normalizeEmbeddedCode(getRemediationCode(question).trim(), question.language), 2)}\n${wrapper.after}`.trim();
  }

  function indentBlock(text, spaces) {
    const pad = " ".repeat(spaces);
    return text
      .split("\n")
      .map((line) => `${pad}${line}`)
      .join("\n");
  }

  function normalizeEmbeddedCode(text, language) {
    if (language === "PHP") {
      return text.replace(/^<\?php\s*/i, "");
    }
    return text;
  }

  function getCodeWrapper(language, title, safeMode) {
    const label = safeMode ? "Safe refactor" : title;

    if (language === "Node.js" || language === "JavaScript") {
      return {
        before: `// ${label}
const express = require("express");
const router = express.Router();
const audit = require("../lib/audit");
const requireAuth = require("../middleware/requireAuth");

router.use(requireAuth);

router.post("/analysis", async (req, res) => {
  audit.info("review start", { route: req.path, userId: req.user?.id });`,
        after: `
  return res.status(200).json({ ok: true });
});

module.exports = router;`
      };
    }

    if (language === "PHP") {
      return {
        before: `<?php
require_once __DIR__ . '/bootstrap.php';
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    exit;
}

try {`,
        after: `
} catch (Throwable $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'internal']);
}`
      };
    }

    if (language === "Python") {
      return {
        before: `from flask import request, jsonify, abort, render_template, session
from app import app, db
import logging

logger = logging.getLogger(__name__)

# ${label}`,
        after: `
logger.info("analysis complete")`
      };
    }

    if (language === "Java") {
      return {
        before: `// ${label}
@WebServlet("/analysis")
public class ReviewServlet extends HttpServlet {
  @Override
  protected void doPost(HttpServletRequest request, HttpServletResponse response)
      throws ServletException, IOException {
    response.setContentType("application/json");`,
        after: `
    response.getWriter().write("{\\"ok\\":true}");
  }
}`
      };
    }

    return { before: `// ${label}`, after: "" };
  }

  function renderCompareCode(original, updated) {
    const originalSet = new Set(original.split("\n"));
    return updated
      .split("\n")
      .map((line) => `<span class="code-line${originalSet.has(line) ? "" : " diff-added"}">${escapeHtml(line)}</span>`)
      .join("");
  }

  function renderHighlightedCode(code, updated, mode) {
    const updatedSet = new Set(updated ? updated.split("\n") : []);
    return code
      .split("\n")
      .map((line) => {
        const changed = updated ? !updatedSet.has(line) : false;
        const extraClass = changed && mode === "removed" ? " diff-removed" : "";
        return `<span class="code-line${extraClass}">${escapeHtml(line)}</span>`;
      })
      .join("");
  }

  function escapeHtml(value) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function advanceRound() {
    if (state.currentIndex === TOTAL_ROUNDS - 1) {
      renderResults();
      showScreen("results");
      return;
    }

    state.currentIndex += 1;
    renderRound();
    showScreen("game");
  }

  function renderResults() {
    const wrongAnswers = TOTAL_ROUNDS - state.correctAnswers;
    const percentage = Math.round((state.correctAnswers / TOTAL_ROUNDS) * 100);
    const rank = getRank(state.score, percentage);
    const breakdownMap = new Map();

    VULN_TYPES.forEach((type) => breakdownMap.set(type, { total: 0, correct: 0 }));
    state.answeredRounds.forEach((round) => {
      const entry = breakdownMap.get(round.category);
      entry.total += 1;
      if (round.roundCorrect) entry.correct += 1;
    });

    els.finalScore.textContent = String(state.score);
    els.finalCorrect.textContent = String(state.correctAnswers);
    els.finalWrong.textContent = String(wrongAnswers);
    els.finalPercentage.textContent = `${percentage}%`;
    els.resultsSummary.textContent = getResultsSummary(percentage);
    els.resultsRank.textContent = rank;
    els.categoryBreakdown.innerHTML = "";

    breakdownMap.forEach((value, key) => {
      if (value.total === 0) return;
      const rate = Math.round((value.correct / value.total) * 100);
      const row = document.createElement("div");
      row.className = "breakdown-row";
      row.innerHTML = `
        <div class="breakdown-head">
          <span>${translateType(key)}</span>
          <strong>${value.correct} / ${value.total}</strong>
        </div>
        <div class="breakdown-track">
          <div class="breakdown-fill" style="width: ${rate}%"></div>
        </div>
      `;
      els.categoryBreakdown.appendChild(row);
    });
  }

  function buildAnswerOptions(question) {
    const correctType = question.isVulnerable ? question.vulnerabilityType : SAFE_TYPE;
    const distractors = shuffle(DISTRACTOR_MAP[correctType]).slice(0, 3);
    return shuffle([correctType, ...distractors]).map((type, index) => ({
      key: `option-${index}`,
      letter: LETTERS[index],
      vulnerabilityType: type,
      isVulnerable: type !== SAFE_TYPE
    }));
  }

  function getRank(score, percentage) {
    if (percentage >= 90 && score >= 700) return t("rank1");
    if (percentage >= 75 && score >= 550) return t("rank2");
    if (percentage >= 55) return t("rank3");
    return t("rank4");
  }

  function getResultsSummary(percentage) {
    if (percentage >= 90) return t("resultsSummaryStrong");
    if (percentage >= 75) return t("resultsSummarySolid");
    if (percentage >= 55) return t("resultsSummaryMid");
    return t("resultsSummaryLow");
  }

  init();
})();
