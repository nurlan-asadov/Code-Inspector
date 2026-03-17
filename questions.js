window.QUESTION_BANK = [
  {
    id: "q001",
    title: "Legacy user lookup in admin report",
    language: "PHP",
    code: `<?php
$db = new PDO($dsn, $user, $pass);
$id = $_GET['id'] ?? '0';
$query = "SELECT id, username, email FROM users WHERE id = " . $id;
$stmt = $db->query($query);
$account = $stmt->fetch(PDO::FETCH_ASSOC);

if ($account) {
    echo json_encode($account);
}`,
    isVulnerable: true,
    vulnerabilityType: "SQL Injection",
    explanation: "User-controlled input from $_GET['id'] is concatenated directly into the SQL statement. The critical line is the WHERE clause built with string concatenation, which lets an attacker alter the query structure instead of supplying only a numeric identifier.",
    remediation: "Use a prepared statement with a bound integer parameter and validate the expected format before querying.",
    hints: [
      "Look at how external input reaches the database layer.",
      "The query structure changes based on raw user input.",
      "The concatenated id value in the WHERE clause enables SQL Injection."
    ],
    difficulty: "easy"
  },
  {
    id: "q002",
    title: "Search endpoint with ORM filter",
    language: "Python",
    code: `@app.get("/users")
def users():
    username = request.args.get("username", "")
    records = db.session.execute(
        text("SELECT id, username FROM users WHERE username = :username"),
        {"username": username}
    )
    return jsonify([dict(row._mapping) for row in records])`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "The database call uses a parameterized placeholder and passes the untrusted value separately. The code may still need authorization context, but there is no obvious injection sink in this snippet.",
    remediation: "Keep using bound parameters and add any required access control around the endpoint.",
    hints: [
      "Check whether user input changes SQL syntax or is passed as data.",
      "The placeholder syntax matters here.",
      "This is parameterized and looks safe from obvious SQL Injection."
    ],
    difficulty: "easy"
  },
  {
    id: "q003",
    title: "Order history filter in Express",
    language: "Node.js",
    code: `app.get("/orders", async (req, res) => {
  const status = req.query.status || "pending";
  const sql = "SELECT id, total, status FROM orders WHERE status = '" + status + "'";
  const [rows] = await pool.query(sql);
  res.json(rows);
});`,
    isVulnerable: true,
    vulnerabilityType: "SQL Injection",
    explanation: "The status parameter is inserted into the SQL string between quotes. The vulnerable part is the string-built WHERE clause, which lets crafted input break out of the string literal and alter the query.",
    remediation: "Use parameterized queries like pool.execute with placeholders and restrict status to an allowed list.",
    hints: [
      "A quoted string can still be dangerous if user input is inserted directly.",
      "The SQL statement is composed before execution.",
      "Direct interpolation of req.query.status causes SQL Injection."
    ],
    difficulty: "easy"
  },
  {
    id: "q004",
    title: "Prepared statement with dynamic sort",
    language: "Java",
    code: `String sort = request.getParameter("sort");
Set<String> allowed = Set.of("created_at", "username");
String orderBy = allowed.contains(sort) ? sort : "created_at";

PreparedStatement ps = conn.prepareStatement(
    "SELECT id, username FROM users ORDER BY " + orderBy + " DESC"
);
ResultSet rs = ps.executeQuery();`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "Although the ORDER BY column name is concatenated, the value is restricted to a fixed allowlist before use. That validation prevents attacker-controlled SQL syntax from reaching the query in this snippet.",
    remediation: "Keep the explicit allowlist and default path. Document why concatenation is safe here.",
    hints: [
      "Not every concatenated SQL fragment is automatically exploitable.",
      "Check whether the dynamic part is constrained to known-safe values.",
      "The allowlist on sort makes this safe from obvious SQL Injection."
    ],
    difficulty: "medium"
  },
  {
    id: "q005",
    title: "Product search with LIKE clause",
    language: "PHP",
    code: `<?php
$term = $_GET['q'] ?? '';
$stmt = $db->prepare("SELECT name, price FROM products WHERE name LIKE '%$term%'");
$stmt->execute();
$results = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($results);`,
    isVulnerable: true,
    vulnerabilityType: "SQL Injection",
    explanation: "The code uses prepare, but the attacker-controlled term is still interpolated into the SQL string before preparation. The dangerous part is the LIKE clause containing raw input, so the statement is not truly parameterized.",
    remediation: "Use a placeholder in the LIKE expression and bind a value such as '%' . $term . '%'.",
    hints: [
      "A prepared statement is only helpful if the user input is bound, not concatenated first.",
      "Look closely at the LIKE pattern construction.",
      "The raw term inside the SQL string makes this SQL Injection."
    ],
    difficulty: "medium"
  },
  {
    id: "q006",
    title: "Comment renderer in admin preview",
    language: "JavaScript",
    code: `function renderPreview(comment) {
  const target = document.getElementById("preview");
  target.innerHTML = "<p class='comment'>" + comment + "</p>";
}`,
    isVulnerable: true,
    vulnerabilityType: "XSS",
    explanation: "Untrusted comment content is written directly into innerHTML. The important line is the DOM sink that interprets attacker-controlled markup as HTML, which can execute scripts or event handlers in the page context.",
    remediation: "Render untrusted content with textContent or sanitize it with a robust HTML sanitizer before insertion.",
    hints: [
      "Focus on browser-side sinks that interpret markup.",
      "Not all DOM assignment methods behave the same way.",
      "Writing raw user input into innerHTML creates XSS."
    ],
    difficulty: "easy"
  },
  {
    id: "q007",
    title: "Template escape in Flask profile page",
    language: "Python",
    code: `@app.get("/profile")
def profile():
    bio = request.args.get("bio", "")
    return render_template("profile.html", bio=bio)

# profile.html
<div class="bio">{{ bio }}</div>`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "The template uses normal variable output, which is auto-escaped by default in common Flask/Jinja configurations. The snippet does not show an unsafe bypass such as marking the input safe or injecting it into a script context.",
    remediation: "Retain template auto-escaping and avoid disabling it unless the content is sanitized first.",
    hints: [
      "Server-side rendering is not always XSS if escaping stays enabled.",
      "Check whether the template output bypasses escaping.",
      "Standard Jinja variable rendering here is safe from obvious XSS."
    ],
    difficulty: "medium"
  },
  {
    id: "q008",
    title: "Support ticket body on confirmation page",
    language: "Node.js",
    code: `app.post("/ticket", (req, res) => {
  const message = req.body.message || "";
  res.send("<h2>Ticket received</h2><div>" + message + "</div>");
});`,
    isVulnerable: true,
    vulnerabilityType: "XSS",
    explanation: "The response body reflects attacker-controlled message content directly into HTML. The dangerous area is the concatenated string passed to res.send, which causes the browser to interpret arbitrary markup from the request.",
    remediation: "Escape the output with the templating engine or send the content as text rather than raw HTML.",
    hints: [
      "Trace how request body content is returned to the browser.",
      "The issue is in reflected output, not database access.",
      "Directly embedding message into HTML leads to XSS."
    ],
    difficulty: "easy"
  },
  {
    id: "q009",
    title: "Audit banner built with safe text nodes",
    language: "JavaScript",
    code: `const banner = document.createElement("div");
banner.className = "status-banner";
banner.textContent = reportMessage;
document.body.appendChild(banner);`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "The snippet uses textContent, which treats the value as literal text instead of HTML. Even if reportMessage contains angle brackets or scripts, they are displayed rather than executed.",
    remediation: "Continue using textContent or equivalent safe DOM APIs for untrusted strings.",
    hints: [
      "The sink method matters more than the variable name.",
      "Compare this API with innerHTML.",
      "textContent makes this safe from obvious XSS."
    ],
    difficulty: "easy"
  },
  {
    id: "q010",
    title: "React SSR output with dangerous HTML",
    language: "JavaScript",
    code: `export default function Note({ content }) {
  return (
    <section
      className="note"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}`,
    isVulnerable: true,
    vulnerabilityType: "XSS",
    explanation: "The component explicitly bypasses React's normal escaping and injects raw HTML. The key element is dangerouslySetInnerHTML fed directly from content, which creates a straightforward XSS sink if the data is attacker-controlled.",
    remediation: "Avoid dangerouslySetInnerHTML for untrusted content or sanitize the HTML with a vetted sanitizer before rendering.",
    hints: [
      "This framework usually escapes output by default unless you opt out.",
      "The dangerous API name is intentionally descriptive.",
      "dangerouslySetInnerHTML with raw content enables XSS."
    ],
    difficulty: "medium"
  },
  {
    id: "q011",
    title: "Stored markdown preview with sanitizer",
    language: "Node.js",
    code: `const dirty = marked.parse(req.body.markdown || "");
const clean = DOMPurify.sanitize(dirty, { USE_PROFILES: { html: true } });
res.render("preview", { html: clean });`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "The application converts markdown to HTML and then sanitizes the result before rendering. The relevant control is the sanitizer layer applied before the content reaches the template.",
    remediation: "Keep the sanitizer updated and review the allowed HTML profile if requirements change.",
    hints: [
      "HTML rendering can be acceptable if a proper mitigation exists.",
      "There is an explicit security control before output.",
      "Sanitization before rendering makes this safe from obvious XSS."
    ],
    difficulty: "medium"
  },
  {
    id: "q012",
    title: "Profile email change without anti-CSRF token",
    language: "PHP",
    code: `<?php
session_start();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $stmt = $db->prepare("UPDATE users SET email = ? WHERE id = ?");
    $stmt->execute([$email, $_SESSION['user_id']]);
    echo "updated";
}`,
    isVulnerable: true,
    vulnerabilityType: "CSRF",
    explanation: "The state-changing POST request relies only on the user's session and does not verify a CSRF token or equivalent request origin control. The missing defense is the lack of per-request anti-CSRF validation before updating account data.",
    remediation: "Require a CSRF token or same-site defense on state-changing actions and verify it server-side.",
    hints: [
      "The database update itself is not the primary issue here.",
      "Think about what browser behavior sends automatically.",
      "A session-backed POST without CSRF protection is vulnerable to CSRF."
    ],
    difficulty: "easy"
  },
  {
    id: "q013",
    title: "Funds transfer with double-submit token",
    language: "Python",
    code: `@app.post("/transfer")
def transfer():
    form_token = request.form.get("csrf_token")
    cookie_token = request.cookies.get("csrf_token")
    if not form_token or form_token != cookie_token:
        abort(403)

    do_transfer(session["user_id"], request.form["amount"])
    return {"ok": True}`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "The handler checks a CSRF token before performing the state-changing action. While the implementation details still matter in a full review, this snippet shows an explicit anti-CSRF verification step rather than relying only on the session cookie.",
    remediation: "Keep token generation unpredictable and pair this with SameSite cookies where possible.",
    hints: [
      "Look for a control that ties the request to the legitimate user flow.",
      "There is a request-specific check before the transfer.",
      "The token validation makes this safe from obvious CSRF."
    ],
    difficulty: "medium"
  },
  {
    id: "q014",
    title: "Delete project endpoint using GET",
    language: "Node.js",
    code: `app.get("/projects/delete/:id", requireLogin, async (req, res) => {
  await db.execute("DELETE FROM projects WHERE id = ?", [req.params.id]);
  res.redirect("/projects");
});`,
    isVulnerable: true,
    vulnerabilityType: "CSRF",
    explanation: "A destructive action is exposed through a GET request and relies only on the authenticated session. The risky part is that a browser can be induced to request this URL cross-site without user intent, making the deletion CSRF-prone.",
    remediation: "Use POST or DELETE for state changes and require CSRF validation before executing them.",
    hints: [
      "Review the HTTP method and whether the browser can trigger it automatically.",
      "Deleting state over GET is a red flag.",
      "This action is vulnerable to CSRF because it is a session-backed GET deletion."
    ],
    difficulty: "easy"
  },
  {
    id: "q015",
    title: "Admin role toggle guarded by origin check only",
    language: "Java",
    code: `String origin = request.getHeader("Origin");
if (origin != null && origin.equals("https://portal.example.com")) {
    userService.setAdmin(request.getParameter("user"), true);
    response.getWriter().write("ok");
}`,
    isVulnerable: true,
    vulnerabilityType: "CSRF",
    explanation: "The state-changing action depends on a header check that is not a robust CSRF defense by itself. The code lacks a verified anti-CSRF token or stronger request integrity mechanism, so the action is still exposed if browser and proxy behavior do not provide the expected header semantics.",
    remediation: "Use a proper CSRF token tied to the user session and treat Origin or Referer checks only as supplemental controls.",
    hints: [
      "A header check can help, but it is not the strongest control shown here.",
      "There is no per-request secret tied to the user session.",
      "Missing CSRF token validation makes this vulnerable to CSRF."
    ],
    difficulty: "hard"
  },
  {
    id: "q016",
    title: "Billing address update with framework middleware",
    language: "JavaScript",
    code: `router.post("/billing/address", ensureAuthenticated, csrfProtection, async (req, res) => {
  await accountService.updateAddress(req.user.id, req.body.address);
  res.json({ saved: true });
});`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "The route includes dedicated CSRF protection middleware before the state-changing update runs. Based on the snippet, there is an explicit anti-CSRF control rather than a bare session-based POST.",
    remediation: "Keep the middleware enabled for all authenticated state-changing routes and test for accidental bypasses.",
    hints: [
      "Look at the middleware stack, not only the route body.",
      "A dedicated request-integrity control is present here.",
      "csrfProtection indicates this is safe from obvious CSRF."
    ],
    difficulty: "easy"
  },
  {
    id: "q017",
    title: "Invoice viewer by direct object id",
    language: "Python",
    code: `@app.get("/invoices/<int:invoice_id>")
@login_required
def invoice(invoice_id):
    invoice = Invoice.query.get_or_404(invoice_id)
    return render_template("invoice.html", invoice=invoice)`,
    isVulnerable: true,
    vulnerabilityType: "IDOR",
    explanation: "The handler fetches the invoice only by the supplied object id and does not verify that the logged-in user is allowed to access it. The missing check is object-level authorization after the lookup.",
    remediation: "Scope the query to the current user or enforce an ownership or permission check before rendering the invoice.",
    hints: [
      "Authentication alone does not imply authorization to every record.",
      "See whether the object lookup is tied to the current user.",
      "Missing ownership validation on invoice_id creates an IDOR."
    ],
    difficulty: "easy"
  },
  {
    id: "q018",
    title: "Message fetch scoped to current account",
    language: "PHP",
    code: `<?php
session_start();
$messageId = (int) ($_GET['id'] ?? 0);
$stmt = $db->prepare("SELECT id, body FROM messages WHERE id = ? AND user_id = ?");
$stmt->execute([$messageId, $_SESSION['user_id']]);
$message = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$message) {
    http_response_code(404);
    exit;
}
echo json_encode($message);`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "The query scopes the requested message to both the message id and the current user's id. That object-level authorization check prevents straightforward record swapping by changing the id parameter.",
    remediation: "Keep the ownership filter at the data-access layer and log denied access attempts if needed.",
    hints: [
      "Check whether object access is constrained to the session user.",
      "The query uses more than the requested id.",
      "This includes an ownership check and is safe from obvious IDOR."
    ],
    difficulty: "easy"
  },
  {
    id: "q019",
    title: "Download report using accountId parameter",
    language: "Node.js",
    code: `app.get("/reports/download", requireAuth, async (req, res) => {
  const accountId = req.query.accountId;
  const report = await reportStore.findLatest(accountId);
  res.download(report.path);
});`,
    isVulnerable: true,
    vulnerabilityType: "IDOR",
    explanation: "The route trusts the caller-supplied accountId and uses it to fetch another account's report without checking ownership. The key flaw is direct object access based solely on a user-controlled identifier.",
    remediation: "Derive the account from the authenticated session or verify the user is authorized for the requested accountId before retrieving the report.",
    hints: [
      "The risk is about who is allowed to access a record, not code execution.",
      "User input selects which account resource is returned.",
      "Unverified accountId access makes this an IDOR."
    ],
    difficulty: "medium"
  },
  {
    id: "q020",
    title: "Admin-only document preview",
    language: "Java",
    code: `long docId = Long.parseLong(request.getParameter("docId"));
Document doc = documentService.find(docId);

if (!request.isUserInRole("ADMIN")) {
    response.sendError(403);
    return;
}

renderDocument(response, doc);`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "The snippet enforces an authorization gate before returning the document. While finer-grained authorization may still be needed in a full application, the code shown is not a clear IDOR because access is restricted to an admin role.",
    remediation: "Retain the authorization check and validate whether admin scope is appropriate for the document class.",
    hints: [
      "Determine whether the object access is actually unrestricted.",
      "There is an explicit role check before rendering.",
      "This snippet is not obviously vulnerable to IDOR because authorization is enforced."
    ],
    difficulty: "medium"
  },
  {
    id: "q021",
    title: "User API key reset by profile id",
    language: "Ruby",
    code: `post "/api-keys/reset" do
  authenticate!
  profile = Profile.find(params[:profile_id])
  profile.rotate_api_key!
  json ok: true
end`,
    isVulnerable: true,
    vulnerabilityType: "IDOR",
    explanation: "The endpoint performs a sensitive action on a profile selected by a user-controlled profile_id without showing any ownership or permission check. The important issue is direct reference to another user's object for a privileged operation.",
    remediation: "Restrict the lookup to the current user's profile or enforce explicit authorization before rotating the key.",
    hints: [
      "This is a sensitive action on a user-owned resource.",
      "Authentication is present, but what about ownership validation?",
      "Profile.find(params[:profile_id]) without authorization causes IDOR."
    ],
    difficulty: "medium"
  },
  {
    id: "q022",
    title: "Ping diagnostic endpoint",
    language: "PHP",
    code: `<?php
$host = $_GET['host'] ?? '127.0.0.1';
$output = shell_exec("ping -c 1 " . $host);
echo "<pre>" . htmlspecialchars($output, ENT_QUOTES, 'UTF-8') . "</pre>";`,
    isVulnerable: true,
    vulnerabilityType: "Command Injection",
    explanation: "Escaping the output does not protect the command execution itself. The vulnerable part is the shell command string built with raw user input, which can let an attacker append shell metacharacters or additional commands.",
    remediation: "Avoid shell invocation where possible, or use a safe API with strict allowlisting and argument separation.",
    hints: [
      "Output encoding is not relevant to the core issue here.",
      "The risk happens before the response is rendered.",
      "Raw host input inside shell_exec causes Command Injection."
    ],
    difficulty: "easy"
  },
  {
    id: "q023",
    title: "Thumbnail generation with ProcessBuilder",
    language: "Java",
    code: `String file = request.getParameter("file");
ProcessBuilder pb = new ProcessBuilder("convert", file, "-resize", "150x150", "thumb.png");
Process process = pb.start();`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "The code invokes the command through ProcessBuilder with separated arguments rather than composing a shell string. The snippet may still need path validation, but it does not show an obvious shell metacharacter injection path.",
    remediation: "Validate the file path and keep using APIs that avoid shell parsing.",
    hints: [
      "Different process execution APIs have different injection surfaces.",
      "Check whether a shell interprets the input string.",
      "Separated ProcessBuilder arguments make this safe from obvious Command Injection."
    ],
    difficulty: "medium"
  },
  {
    id: "q024",
    title: "Log archive export command",
    language: "Python",
    code: `@app.post("/export")
def export_logs():
    day = request.form["day"]
    os.system(f"tar -czf /tmp/export.tgz /var/log/app/{day}")
    return send_file("/tmp/export.tgz")`,
    isVulnerable: true,
    vulnerabilityType: "Command Injection",
    explanation: "The day parameter is interpolated directly into a shell command. The critical issue is the os.system call, which sends a shell-parsed string containing attacker-controlled input.",
    remediation: "Use subprocess with a list of arguments and validate day against a strict pattern or predefined archive names.",
    hints: [
      "Look for shell-parsed string execution.",
      "String interpolation into command text is the problem.",
      "os.system with user-controlled day is Command Injection."
    ],
    difficulty: "medium"
  },
  {
    id: "q025",
    title: "Network tools wrapper with escaped argument",
    language: "PHP",
    code: `<?php
$host = $_POST['host'] ?? '';
$safeHost = escapeshellarg($host);
$result = shell_exec("/usr/bin/dig +short " . $safeHost);
echo nl2br(htmlspecialchars($result, ENT_QUOTES, 'UTF-8'));`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "The untrusted argument is wrapped with escapeshellarg before being appended to the command. That makes it a single shell argument rather than executable syntax, so this snippet does not show an obvious command injection path.",
    remediation: "Prefer non-shell APIs when possible, but if shell usage is necessary, keep strict argument escaping and input validation.",
    hints: [
      "A shell call is not automatically exploitable if the input is handled safely.",
      "Check whether the user input stays a single argument.",
      "escapeshellarg mitigates obvious Command Injection here."
    ],
    difficulty: "hard"
  },
  {
    id: "q026",
    title: "Backup restore helper",
    language: "Node.js",
    code: `app.post("/restore", requireAdmin, (req, res) => {
  const archive = req.body.archive;
  exec("unzip /srv/backups/" + archive + " -d /srv/restore", (err) => {
    if (err) return res.status(500).send("failed");
    res.send("ok");
  });
});`,
    isVulnerable: true,
    vulnerabilityType: "Command Injection",
    explanation: "The archive name is concatenated into a shell command passed to exec. The dangerous line is the shell-invoked string execution, which permits command chaining if archive contains shell metacharacters.",
    remediation: "Use execFile or spawn with fixed arguments and validate the archive name against an allowlist of expected filenames.",
    hints: [
      "The privileged admin context does not remove the bug.",
      "The API choice here invokes a shell.",
      "Concatenating archive into exec makes this Command Injection."
    ],
    difficulty: "medium"
  },
  {
    id: "q027",
    title: "Webhook tester fetching arbitrary URL",
    language: "Python",
    code: `@app.post("/webhook/test")
def webhook_test():
    target = request.json["url"]
    response = requests.get(target, timeout=3)
    return {"status": response.status_code, "body": response.text[:80]}`,
    isVulnerable: true,
    vulnerabilityType: "SSRF",
    explanation: "The server makes a backend HTTP request to a fully attacker-controlled URL. The critical behavior is direct outbound fetching without allowlisting or internal network restrictions, enabling access to internal services or metadata endpoints.",
    remediation: "Restrict outbound requests to an allowlist of approved hosts or proxy them through a controlled service that blocks internal addresses.",
    hints: [
      "The danger is the server contacting somewhere on behalf of the attacker.",
      "Focus on outbound network access initiated from user input.",
      "Fetching a user-supplied URL directly creates SSRF."
    ],
    difficulty: "easy"
  },
  {
    id: "q028",
    title: "Avatar downloader restricted to CDN",
    language: "Node.js",
    code: `app.post("/avatar/import", async (req, res) => {
  const remote = new URL(req.body.url);
  if (remote.protocol !== "https:" || remote.hostname !== "images.examplecdn.com") {
    return res.status(400).json({ error: "unsupported host" });
  }

  const image = await fetch(remote.toString());
  res.sendStatus(image.ok ? 204 : 502);
});`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "The code validates both protocol and hostname against a fixed expected CDN before fetching. Based on the snippet, user input cannot arbitrarily steer the backend to internal or attacker-chosen destinations.",
    remediation: "Retain strict host validation and also consider DNS rebinding and redirect handling in the full implementation.",
    hints: [
      "A URL fetch is not automatically SSRF if destination control is constrained.",
      "Check whether the code allows arbitrary hosts.",
      "The fixed hostname check makes this safe from obvious SSRF."
    ],
    difficulty: "medium"
  },
  {
    id: "q029",
    title: "PDF renderer pulls remote asset",
    language: "Java",
    code: `String logoUrl = request.getParameter("logo");
byte[] logo = new URL(logoUrl).openStream().readAllBytes();
pdfService.renderInvoice(response.getOutputStream(), logo);`,
    isVulnerable: true,
    vulnerabilityType: "SSRF",
    explanation: "The server retrieves a URL supplied by the client and reads the response directly. The important line is the backend URL fetch without validation, which allows probing or retrieving internal network resources.",
    remediation: "Allow only approved asset hosts or replace remote fetching with pre-stored assets selected by identifier.",
    hints: [
      "This is a server-side request triggered by client input.",
      "The application becomes a network pivot if destinations are unrestricted.",
      "new URL(logoUrl).openStream() on user input is SSRF."
    ],
    difficulty: "easy"
  },
  {
    id: "q030",
    title: "Health check proxy with RFC1918 block",
    language: "Python",
    code: `def is_private(hostname):
    ip = ipaddress.ip_address(socket.gethostbyname(hostname))
    return ip.is_private or ip.is_loopback or ip.is_link_local

@app.get("/probe")
def probe():
    url = urllib.parse.urlparse(request.args["url"])
    if url.scheme not in {"http", "https"} or is_private(url.hostname):
        abort(400)
    return requests.get(request.args["url"], timeout=2).text`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "The route validates the scheme and rejects loopback and private addresses before sending the request. Full SSRF hardening can be more nuanced, but this snippet shows a concrete mitigation rather than an obvious unrestricted fetch.",
    remediation: "Keep host validation tight, disable redirects if needed, and resolve DNS carefully in production.",
    hints: [
      "There is a guard around destination selection.",
      "The code tries to prevent internal address access.",
      "This is not obviously SSRF because it blocks private and loopback targets."
    ],
    difficulty: "hard"
  },
  {
    id: "q031",
    title: "Webhook preview follows URL from config form",
    language: "PHP",
    code: `<?php
$target = $_POST['callback_url'] ?? '';
$body = file_get_contents($target);
echo substr($body, 0, 200);`,
    isVulnerable: true,
    vulnerabilityType: "SSRF",
    explanation: "The application uses file_get_contents on a user-supplied URL, causing the server to fetch arbitrary remote resources. The relevant issue is unrestricted backend retrieval initiated from external input.",
    remediation: "Disable URL wrappers for this use case or validate against an allowlist of approved callback hosts and protocols.",
    hints: [
      "The risk comes from what the server can reach, not what the browser can reach.",
      "The input controls a network-capable file retrieval call.",
      "file_get_contents on attacker-controlled URLs enables SSRF."
    ],
    difficulty: "medium"
  },
  {
    id: "q032",
    title: "Theme asset download from user path",
    language: "Node.js",
    code: `app.get("/download", (req, res) => {
  const file = req.query.file;
  const target = path.join("/var/www/assets", file);
  res.sendFile(target);
});`,
    isVulnerable: true,
    vulnerabilityType: "Path Traversal",
    explanation: "Joining a base path with untrusted file input does not stop traversal sequences by itself. The important issue is that the attacker controls the path segment used to build the file system target, potentially escaping the intended directory.",
    remediation: "Normalize and validate the resolved path stays within the allowed base directory, or map file identifiers to fixed server-side paths.",
    hints: [
      "A base directory is present, but that alone may not be enough.",
      "Think about dot-dot slash sequences and path normalization.",
      "Unvalidated file input in path.join creates Path Traversal risk."
    ],
    difficulty: "easy"
  },
  {
    id: "q033",
    title: "Document reader with canonical path check",
    language: "Java",
    code: `File base = new File("/srv/docs");
File requested = new File(base, request.getParameter("name"));

String basePath = base.getCanonicalPath();
String requestedPath = requested.getCanonicalPath();
if (!requestedPath.startsWith(basePath + File.separator)) {
    response.sendError(400);
    return;
}

Files.copy(requested.toPath(), response.getOutputStream());`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "The code resolves canonical paths and rejects any request that escapes the expected base directory. That check addresses common traversal attempts before file access occurs.",
    remediation: "Keep canonical-path validation in place and consider allowlisting filenames for high-risk directories.",
    hints: [
      "Look for whether the final resolved path is verified, not just concatenated.",
      "Canonicalization is being used defensively here.",
      "The startsWith check on canonical paths makes this safe from obvious Path Traversal."
    ],
    difficulty: "medium"
  },
  {
    id: "q034",
    title: "Profile export archive viewer",
    language: "Python",
    code: `@app.get("/archive")
def archive():
    name = request.args.get("name", "welcome.txt")
    with open(f"/opt/exports/{name}", "rb") as handle:
        return Response(handle.read(), mimetype="application/octet-stream")`,
    isVulnerable: true,
    vulnerabilityType: "Path Traversal",
    explanation: "The requested filename is interpolated directly into a filesystem path. The critical line is the open call built from user input, allowing traversal sequences to reach files outside /opt/exports.",
    remediation: "Use safe path resolution and verify the final path remains under the export directory, or use an allowlist of generated archive names.",
    hints: [
      "This is a filesystem access issue rather than a database problem.",
      "The f-string path assembly does not constrain directory movement.",
      "Directly opening /opt/exports/{name} enables Path Traversal."
    ],
    difficulty: "easy"
  },
  {
    id: "q035",
    title: "Image path lookup by generated identifier",
    language: "PHP",
    code: `<?php
$map = [
    'hero' => '/srv/site/images/hero.jpg',
    'logo' => '/srv/site/images/logo.svg'
];
$name = $_GET['name'] ?? 'logo';
if (!array_key_exists($name, $map)) {
    http_response_code(404);
    exit;
}
readfile($map[$name]);`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "The request does not directly control the filesystem path. Instead it selects from a fixed map of known server-side file locations, which prevents arbitrary traversal based on the snippet shown.",
    remediation: "Continue using identifier-to-path mapping for public assets instead of raw path input.",
    hints: [
      "The user controls a key, not a raw filename.",
      "Check whether external input becomes a path directly or only selects a fixed value.",
      "This fixed map approach is safe from obvious Path Traversal."
    ],
    difficulty: "easy"
  },
  {
    id: "q036",
    title: "Log viewer strips ../ once",
    language: "Node.js",
    code: `app.get("/logs/view", (req, res) => {
  const cleaned = (req.query.name || "").replace("../", "");
  const file = "/var/log/app/" + cleaned;
  res.sendFile(file);
});`,
    isVulnerable: true,
    vulnerabilityType: "Path Traversal",
    explanation: "The sanitization only removes one literal '../' occurrence and is easy to bypass with alternative traversal patterns or repeated sequences. The vulnerable behavior is still direct path construction from attacker input.",
    remediation: "Resolve the canonical path and verify it remains inside the allowed directory instead of applying ad hoc string replacements.",
    hints: [
      "One string replacement is rarely enough for path safety.",
      "Consider encoded, repeated, or variant traversal payloads.",
      "Naive replace('../', '') leaves this vulnerable to Path Traversal."
    ],
    difficulty: "hard"
  },
  {
    id: "q037",
    title: "Admin login compares plaintext hash badly",
    language: "Python",
    code: `@app.post("/admin/login")
def admin_login():
    if request.form["username"] == "admin" and request.form["password"] == "admin123":
        session["admin"] = True
        return redirect("/admin")
    return "denied", 401`,
    isVulnerable: true,
    vulnerabilityType: "Authentication flaws",
    explanation: "The application uses hard-coded default credentials in the authentication logic. The critical problem is the static credential check itself, which is weak and easily guessable rather than relying on managed user records and secure password storage.",
    remediation: "Use proper user accounts with hashed passwords, remove hard-coded credentials, and enforce strong password policy and MFA where appropriate.",
    hints: [
      "The flaw is in how identity is verified, not in session handling afterward.",
      "Look at the credential source and strength.",
      "Hard-coded default admin credentials are an Authentication flaw."
    ],
    difficulty: "easy"
  },
  {
    id: "q038",
    title: "Login with bcrypt verification",
    language: "Node.js",
    code: `app.post("/login", async (req, res) => {
  const user = await users.findByEmail(req.body.email);
  if (!user) return res.status(401).send("invalid");

  const ok = await bcrypt.compare(req.body.password, user.passwordHash);
  if (!ok) return res.status(401).send("invalid");

  req.session.userId = user.id;
  res.redirect("/dashboard");
});`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "The snippet uses a stored password hash and verifies the submitted password with bcrypt before creating the session. There is no obvious authentication bypass or weak credential pattern in the code shown.",
    remediation: "Keep the password hashing strong and pair it with rate limiting and MFA if the risk profile requires it.",
    hints: [
      "Check whether the password check follows a standard secure pattern.",
      "This uses a dedicated password hashing function.",
      "bcrypt-based verification here is safe from obvious Authentication flaws."
    ],
    difficulty: "easy"
  },
  {
    id: "q039",
    title: "Password reset token derived from email",
    language: "PHP",
    code: `<?php
$email = strtolower(trim($_POST['email'] ?? ''));
$token = md5($email);
$resetLink = "https://app.example/reset?token=" . $token;
mail($email, "Reset your password", $resetLink);`,
    isVulnerable: true,
    vulnerabilityType: "Authentication flaws",
    explanation: "The reset token is deterministically derived from a predictable user value. The critical weakness is the token generation logic, which allows attackers to compute or guess valid reset links for known email addresses.",
    remediation: "Generate cryptographically random one-time reset tokens, store them server-side with expiry, and invalidate them after use.",
    hints: [
      "The issue is in credential recovery logic.",
      "A reset token must be unpredictable, not derived from public data.",
      "Using md5(email) for password resets is an Authentication flaw."
    ],
    difficulty: "medium"
  },
  {
    id: "q040",
    title: "OTP challenge with expiry and attempt limit",
    language: "Java",
    code: `OtpRecord otp = otpStore.findForUser(user.getId());
if (otp == null || otp.isExpired() || otp.getAttempts() >= 5) {
    response.sendError(401);
    return;
}

if (!MessageDigest.isEqual(otp.getCode().getBytes(UTF_8), inputCode.getBytes(UTF_8))) {
    otpStore.incrementAttempts(user.getId());
    response.sendError(401);
    return;
}

completeLogin(user);`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "The OTP flow enforces expiry and an attempt limit before completing login. While not a complete auth design review, the snippet does not expose an obvious authentication bypass or predictable-secret issue.",
    remediation: "Retain expiry and throttling, and ensure OTP values are generated with a secure random source.",
    hints: [
      "Look for brute-force or bypass gaps in the login challenge flow.",
      "There are controls for both age and number of tries.",
      "This is safe from obvious Authentication flaws."
    ],
    difficulty: "medium"
  },
  {
    id: "q041",
    title: "Temporary magic login parameter",
    language: "Node.js",
    code: `app.get("/login", async (req, res) => {
  if (req.query.debug === "letmein") {
    req.session.userId = 1;
    return res.redirect("/dashboard");
  }
  res.render("login");
});`,
    isVulnerable: true,
    vulnerabilityType: "Authentication flaws",
    explanation: "The route contains a hidden backdoor that creates an authenticated session when a known query parameter value is supplied. The vulnerable logic is the debug shortcut that bypasses normal identity verification entirely.",
    remediation: "Remove the debug bypass, audit for similar feature flags in production code, and require standard authentication for all login paths.",
    hints: [
      "This is a direct bypass, not just weak password storage.",
      "A query parameter should not be enough to log a user in.",
      "The debug shortcut is an Authentication flaw."
    ],
    difficulty: "easy"
  },
  {
    id: "q042",
    title: "Session cookie missing security attributes",
    language: "PHP",
    code: `<?php
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'secure' => false,
    'httponly' => false,
    'samesite' => 'Lax'
]);
session_start();`,
    isVulnerable: true,
    vulnerabilityType: "Session management flaws",
    explanation: "The session cookie is configured without Secure and HttpOnly. The important part is the cookie configuration itself, which increases exposure to transport interception on non-TLS paths and client-side script access if an XSS occurs.",
    remediation: "Set Secure and HttpOnly on session cookies and ensure the application is served strictly over HTTPS.",
    hints: [
      "The problem is how the session token is protected in the browser.",
      "Cookie attributes are the main signal here.",
      "Missing Secure and HttpOnly makes this a Session management flaw."
    ],
    difficulty: "easy"
  },
  {
    id: "q043",
    title: "Session rotation after login",
    language: "Python",
    code: `@app.post("/login")
def login():
    user = authenticate(request.form["email"], request.form["password"])
    if not user:
        abort(401)

    session.clear()
    session["user_id"] = user.id
    session["csrf_seed"] = secrets.token_hex(16)
    return redirect("/dashboard")`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "The login flow clears the existing session before establishing the authenticated session state. That behavior helps prevent session fixation by replacing prior attacker-influenced session context.",
    remediation: "Continue rotating session state on authentication changes and set strong cookie attributes at the framework level.",
    hints: [
      "Look at what happens to existing session state during login.",
      "A fixation-resistant flow usually refreshes or clears prior context.",
      "This is safe from obvious Session management flaws."
    ],
    difficulty: "medium"
  },
  {
    id: "q044",
    title: "Remember-me token reused forever",
    language: "Java",
    code: `Cookie cookie = new Cookie("remember_me", user.getUsername());
cookie.setHttpOnly(true);
cookie.setMaxAge(60 * 60 * 24 * 365);
response.addCookie(cookie);`,
    isVulnerable: true,
    vulnerabilityType: "Session management flaws",
    explanation: "The remember-me value is just the username, which is predictable and not a secure authentication token. The important issue is that the application treats an easily guessable identifier as a persistent login credential.",
    remediation: "Use a random, server-side tracked remember-me token with rotation, revocation, and device binding or risk-based checks.",
    hints: [
      "Persistent login tokens must be secret, not just unique-looking.",
      "The cookie value here is not an actual credential.",
      "Using the username as a remember-me token is a Session management flaw."
    ],
    difficulty: "medium"
  },
  {
    id: "q045",
    title: "Session id accepted from URL parameter",
    language: "Node.js",
    code: `app.use((req, res, next) => {
  if (req.query.sid) {
    req.sessionID = req.query.sid;
  }
  next();
});`,
    isVulnerable: true,
    vulnerabilityType: "Session management flaws",
    explanation: "The middleware allows the client to set the session identifier through a URL parameter. The critical flaw is attacker control over the session token, which creates session fixation and token leakage risks.",
    remediation: "Never accept session identifiers from URLs; rely on secure cookies and regenerate the session id after authentication.",
    hints: [
      "A session token should not be chosen by the client this way.",
      "Think about fixation and token exposure in links and logs.",
      "Accepting sid from the URL is a Session management flaw."
    ],
    difficulty: "easy"
  },
  {
    id: "q046",
    title: "Secure session cookie configuration",
    language: "Node.js",
    code: `app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 1000 * 60 * 30
  }
}));`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "The session middleware configures the cookie with HttpOnly and Secure and avoids unnecessary empty session creation. The snippet does not show an obvious session management weakness.",
    remediation: "Keep the secret strong and rotate it appropriately for operational requirements.",
    hints: [
      "Review the cookie attributes and middleware defaults.",
      "This configuration follows standard secure session handling patterns.",
      "The session setup is safe from obvious Session management flaws."
    ],
    difficulty: "easy"
  },
  {
    id: "q047",
    title: "XML invoice import with external entities enabled",
    language: "Java",
    code: `DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
DocumentBuilder builder = factory.newDocumentBuilder();
Document doc = builder.parse(request.getInputStream());
String customer = doc.getElementsByTagName("customer").item(0).getTextContent();`,
    isVulnerable: true,
    vulnerabilityType: "XXE",
    explanation: "The XML parser is created with default settings and no protections against external entities. The critical issue is the parser configuration, which may allow attacker-supplied XML to resolve external entities or local files during parsing.",
    remediation: "Disable DTDs and external entities explicitly and use secure parser features before parsing untrusted XML.",
    hints: [
      "The danger is in how XML is parsed, not in the later field extraction.",
      "Look for secure parser feature configuration.",
      "Parsing untrusted XML with default settings creates XXE risk."
    ],
    difficulty: "easy"
  },
  {
    id: "q048",
    title: "SAX parser hardened against DTDs",
    language: "Python",
    code: `parser = etree.XMLParser(resolve_entities=False, no_network=True)
document = etree.fromstring(request.data, parser=parser)
return {"name": document.findtext("name")}`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "The parser configuration disables entity resolution and network access before handling the XML. Based on the snippet, the common XXE vectors are intentionally blocked.",
    remediation: "Keep secure XML parser settings centralized and avoid weaker parser defaults elsewhere in the codebase.",
    hints: [
      "Focus on parser options rather than the XML structure.",
      "The secure configuration is explicitly visible here.",
      "resolve_entities=False and no_network=True make this safe from obvious XXE."
    ],
    difficulty: "medium"
  },
  {
    id: "q049",
    title: "XML upload using libxml defaults",
    language: "PHP",
    code: `<?php
$xml = file_get_contents($_FILES['doc']['tmp_name']);
$dom = new DOMDocument();
$dom->loadXML($xml, LIBXML_NOENT | LIBXML_DTDLOAD);
echo $dom->getElementsByTagName('title')->item(0)->textContent;`,
    isVulnerable: true,
    vulnerabilityType: "XXE",
    explanation: "The parser explicitly enables entity expansion and DTD loading for attacker-supplied XML. The important lines are the LIBXML_NOENT and LIBXML_DTDLOAD flags, which reintroduce external entity resolution behavior.",
    remediation: "Remove entity expansion flags and parse untrusted XML with secure options that disable DTD and external entity processing.",
    hints: [
      "The parser flags matter a lot here.",
      "Some XML options trade convenience for unsafe entity handling.",
      "LIBXML_NOENT | LIBXML_DTDLOAD makes this vulnerable to XXE."
    ],
    difficulty: "easy"
  },
  {
    id: "q050",
    title: "Purchase order parser with secure features",
    language: "Java",
    code: `SAXParserFactory factory = SAXParserFactory.newInstance();
factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
factory.setFeature("http://xml.org/sax/features/external-general-entities", false);
factory.setFeature("http://xml.org/sax/features/external-parameter-entities", false);

SAXParser parser = factory.newSAXParser();
parser.parse(request.getInputStream(), handler);`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "The parser disables DOCTYPE declarations and external entity resolution before parsing the request body. Those hardening features address the usual XXE attack path in this snippet.",
    remediation: "Use this hardened parser configuration consistently wherever untrusted XML is processed.",
    hints: [
      "This is another parser-configuration question.",
      "The code is explicitly disabling dangerous XML features.",
      "This is safe from obvious XXE."
    ],
    difficulty: "medium"
  },
  {
    id: "q051",
    title: "SOAP metadata fetch from user XML",
    language: "Python",
    code: `xml = request.data
parser = etree.XMLParser(load_dtd=True, resolve_entities=True)
doc = etree.fromstring(xml, parser)
return {"service": doc.findtext("service")}`,
    isVulnerable: true,
    vulnerabilityType: "XXE",
    explanation: "The XML parser is configured to load DTDs and resolve entities on attacker-controlled input. The key problem is enabling external entity processing, which can lead to file disclosure or network interaction during parsing.",
    remediation: "Disable DTD loading and entity resolution when parsing untrusted XML, or switch to a hardened XML parsing wrapper.",
    hints: [
      "Untrusted XML plus entity resolution is the dangerous combination.",
      "The parser options are the deciding factor.",
      "load_dtd=True and resolve_entities=True create XXE."
    ],
    difficulty: "easy"
  },
  {
    id: "q052",
    title: "Parameterized account balance lookup",
    language: "Python",
    code: `@app.get("/balance")
def balance():
    account_id = request.args.get("account_id", type=int)
    row = db.session.execute(
        text("SELECT balance FROM accounts WHERE id = :account_id"),
        {"account_id": account_id}
    ).first()
    return {"balance": row.balance if row else None}`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "The query uses a bound parameter for the account identifier, so the supplied value is treated as data and not executable SQL. This snippet alone does not show an obvious vulnerability category from the supported list.",
    remediation: "Keep parameterization in place and add authorization checks if account data should be restricted by user.",
    hints: [
      "The snippet may look database-related, but focus on whether the query is safely constructed.",
      "The ORM call separates SQL text from data.",
      "This is safe from obvious SQL Injection in the code shown."
    ],
    difficulty: "medium"
  },
  {
    id: "q053",
    title: "Admin notes panel escapes before output",
    language: "PHP",
    code: `<?php
$note = $_POST['note'] ?? '';
echo "<section class='note'>" . htmlspecialchars($note, ENT_QUOTES, 'UTF-8') . "</section>";`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "The note content is escaped with htmlspecialchars before being inserted into the HTML response. That output encoding prevents the browser from interpreting attacker-supplied markup as active HTML or script in this context.",
    remediation: "Keep context-appropriate output encoding and avoid mixing user input into JavaScript contexts without separate escaping rules.",
    hints: [
      "This is about reflected output, but check for a mitigation.",
      "The function used here changes special characters into safe entities.",
      "htmlspecialchars makes this safe from obvious XSS."
    ],
    difficulty: "easy"
  },
  {
    id: "q054",
    title: "Directory listing selected by canned name",
    language: "Python",
    code: `ALLOWED_EXPORTS = {
    "daily": "/srv/reports/daily.csv",
    "weekly": "/srv/reports/weekly.csv",
    "monthly": "/srv/reports/monthly.csv",
}

@app.get("/exports")
def exports():
    selected = request.args.get("name", "daily")
    path = ALLOWED_EXPORTS.get(selected)
    if not path:
        abort(404)
    return send_file(path)`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "The client selects from a predefined identifier map rather than supplying an arbitrary filesystem path. That design avoids direct path traversal in the code shown.",
    remediation: "Continue exposing server files through fixed identifiers rather than raw path parameters.",
    hints: [
      "A user-controlled selection is not the same as a user-controlled path.",
      "The map limits the possible file targets.",
      "This is safe from obvious Path Traversal."
    ],
    difficulty: "medium"
  },
  {
    id: "q055",
    title: "State-changing admin action protected by CSRF token and role check",
    language: "Java",
    code: `if (!request.isUserInRole("ADMIN")) {
    response.sendError(403);
    return;
}

String submitted = request.getParameter("csrf");
String expected = (String) request.getSession().getAttribute("csrf");
if (submitted == null || !submitted.equals(expected)) {
    response.sendError(403);
    return;
}

featureService.disableFeature(request.getParameter("flag"));`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "The action requires both an admin role and a CSRF token check before mutating state. Based on the snippet, the common CSRF issue is addressed rather than left unprotected.",
    remediation: "Preserve both the authorization gate and the token validation for sensitive admin actions.",
    hints: [
      "This is a privileged state change, but check the defenses before assuming a bug.",
      "The request is verified against a session-bound token.",
      "This is safe from obvious CSRF."
    ],
    difficulty: "medium"
  },
  {
    id: "q056",
    title: "Search API with integer cast before lookup",
    language: "PHP",
    code: `<?php
$userId = (int) ($_GET['user_id'] ?? 0);
$stmt = $db->prepare("SELECT id, username, role FROM users WHERE id = ?");
$stmt->execute([$userId]);
echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "The input is cast to an integer and passed to a prepared statement with a bound placeholder. In this snippet there is no obvious injection or client-controlled query structure.",
    remediation: "Keep parameterized queries in place and add authorization checks if this user data should be scoped.",
    hints: [
      "The query uses a placeholder instead of building SQL syntax with input.",
      "Type handling and parameter binding both matter here.",
      "This snippet is safe from obvious SQL Injection."
    ],
    difficulty: "easy"
  },
  {
    id: "q057",
    title: "Comment publish flow with textContent preview",
    language: "JavaScript",
    code: `function publishComment(comment) {
  const list = document.getElementById("comments");
  const item = document.createElement("li");
  item.className = "comment";
  item.textContent = comment;
  list.appendChild(item);
}`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "The comment is rendered with textContent, so the browser treats the input as text rather than HTML. This avoids the obvious DOM XSS sink shown in unsafe innerHTML patterns.",
    remediation: "Keep using safe DOM APIs for untrusted content and avoid switching to raw HTML insertion.",
    hints: [
      "The browser sink determines whether markup is interpreted or displayed literally.",
      "Compare textContent with innerHTML.",
      "This is safe from obvious XSS."
    ],
    difficulty: "easy"
  },
  {
    id: "q058",
    title: "Project notes update via GET action link",
    language: "Node.js",
    code: `app.get("/profile/toggle-2fa", requireAuth, async (req, res) => {
  await users.updateTwoFactor(req.user.id, req.query.enabled === "1");
  res.redirect("/profile");
});`,
    isVulnerable: true,
    vulnerabilityType: "CSRF",
    explanation: "A state-changing account action is exposed through a GET request and depends on the authenticated session only. A third-party page could cause the browser to hit the URL without the user's intent.",
    remediation: "Move the action to POST and require CSRF protection before changing the setting.",
    hints: [
      "The problem is not SQL or output encoding.",
      "Look at the HTTP method used for a state change.",
      "This is vulnerable to CSRF."
    ],
    difficulty: "easy"
  },
  {
    id: "q059",
    title: "Export selection through fixed allowlist",
    language: "Python",
    code: `EXPORT_MAP = {
    "users": "/srv/reports/users.csv",
    "billing": "/srv/reports/billing.csv",
}

@app.get("/report")
def report():
    name = request.args.get("name", "users")
    path = EXPORT_MAP.get(name)
    if not path:
        abort(404)
    return send_file(path)`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "The request selects from a fixed server-side map rather than controlling an arbitrary path. That design avoids direct path traversal in the snippet shown.",
    remediation: "Keep file access routed through fixed identifiers instead of raw path input.",
    hints: [
      "The user controls a key, not a filesystem path.",
      "The server decides the actual file locations.",
      "This is safe from obvious Path Traversal."
    ],
    difficulty: "easy"
  },
  {
    id: "q060",
    title: "JWT verification skipped for debug header",
    language: "Node.js",
    code: `app.use((req, res, next) => {
  if (req.headers["x-debug-user"]) {
    req.user = { id: Number(req.headers["x-debug-user"]), role: "admin" };
    return next();
  }
  verifyJwt(req, res, next);
});`,
    isVulnerable: true,
    vulnerabilityType: "Authentication flaws",
    explanation: "The middleware trusts a client-supplied debug header to create an authenticated user context. That bypasses real identity verification and creates a direct authentication shortcut.",
    remediation: "Remove the debug bypass and always build authenticated identity from verified tokens or server-side sessions only.",
    hints: [
      "The flaw is a direct trust boundary failure in auth logic.",
      "A client-controlled header should not create an authenticated identity.",
      "This is an Authentication flaw."
    ],
    difficulty: "hard"
  },
  {
    id: "q061",
    title: "Webhook callback validation after redirect only",
    language: "Python",
    code: `@app.post("/callback/test")
def callback_test():
    target = request.json["url"]
    response = requests.get(target, timeout=3, allow_redirects=True)
    if response.url.startswith("https://hooks.example.com/"):
        return {"ok": True}
    abort(400)`,
    isVulnerable: true,
    vulnerabilityType: "SSRF",
    explanation: "The code performs the outbound request before deciding whether the final URL is acceptable. That still lets an attacker trigger backend requests to arbitrary or internal destinations first.",
    remediation: "Validate and allowlist the destination before the request is sent, and restrict redirects or revalidate each hop.",
    hints: [
      "Destination validation happens too late.",
      "The network request is already made before the check.",
      "This remains vulnerable to SSRF."
    ],
    difficulty: "hard"
  },
  {
    id: "q062",
    title: "Archive extractor rejects traversal after normalize",
    language: "Node.js",
    code: `app.get("/download", (req, res) => {
  const base = path.resolve("/srv/public");
  const target = path.resolve(base, req.query.file || "");
  if (!target.startsWith(base + path.sep)) {
    return res.sendStatus(400);
  }
  res.sendFile(target);
});`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "The code resolves the final path and ensures it stays inside the allowed base directory before serving the file. That mitigates straightforward traversal attempts.",
    remediation: "Keep canonical or resolved path validation in place and prefer allowlisted files for high-risk paths.",
    hints: [
      "Normalization and final-path validation matter more than raw string replacement.",
      "The resolved path must remain under the base directory.",
      "This is safe from obvious Path Traversal."
    ],
    difficulty: "hard"
  },
  {
    id: "q063",
    title: "Remember-me token derived from timestamp and username",
    language: "Java",
    code: `String token = user.getUsername() + ":" + System.currentTimeMillis();
Cookie cookie = new Cookie("remember_me", token);
cookie.setHttpOnly(true);
cookie.setSecure(true);
response.addCookie(cookie);`,
    isVulnerable: true,
    vulnerabilityType: "Session management flaws",
    explanation: "The remember-me token is predictable because it is built from public or guessable values rather than secure randomness. That makes the persistent session token unsuitable as an authentication credential.",
    remediation: "Use a cryptographically random server-tracked remember-me token with rotation and revocation.",
    hints: [
      "A token can still be weak even if Secure and HttpOnly are set.",
      "Look at how the token value itself is generated.",
      "This is a Session management flaw."
    ],
    difficulty: "hard"
  },
  {
    id: "q064",
    title: "XML parser disallows DOCTYPE but leaves entity expansion on",
    language: "Java",
    code: `DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
factory.setExpandEntityReferences(true);
DocumentBuilder builder = factory.newDocumentBuilder();
Document doc = builder.parse(request.getInputStream());`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "Disallowing DOCTYPE declarations blocks the classic external-entity attack path in this snippet. Entity expansion is less relevant if untrusted DTD declarations cannot be introduced in the first place.",
    remediation: "Keep DOCTYPE disabled and also disable external entities explicitly for defense in depth.",
    hints: [
      "Consider what XXE needs before entity expansion matters.",
      "If untrusted DOCTYPE is blocked, the classic payload path is reduced.",
      "This is not obviously vulnerable to XXE."
    ],
    difficulty: "hard"
  },
  {
    id: "q065",
    title: "Admin console shell wrapper with allowlisted action but raw target",
    language: "PHP",
    code: `<?php
$action = $_POST['action'] ?? 'status';
$target = $_POST['target'] ?? '';
$allowed = ['status', 'reload'];
if (!in_array($action, $allowed, true)) {
    http_response_code(400);
    exit;
}
echo shell_exec("/usr/local/bin/adminctl " . $action . " " . $target);`,
    isVulnerable: true,
    vulnerabilityType: "Command Injection",
    explanation: "The action is allowlisted, but the raw target argument is still concatenated directly into a shell command. That leaves an attacker-controlled shell injection point in the command string.",
    remediation: "Escape or separate the target argument safely, or switch to a non-shell API with fixed arguments.",
    hints: [
      "One allowlisted parameter does not automatically secure the whole command.",
      "The remaining raw argument is still dangerous.",
      "This is Command Injection."
    ],
    difficulty: "hard"
  },
  {
    id: "q066",
    title: "Role-based document fetch with scoped repository method",
    language: "Python",
    code: `@app.get("/docs/<int:doc_id>")
@login_required
def docs(doc_id):
    doc = repo.find_accessible_document(current_user.id, doc_id)
    if not doc:
        abort(404)
    return render_template("doc.html", doc=doc)`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "The repository method appears to scope the requested object by both the user and the document id. Based on the code shown, object-level authorization is built into the fetch path rather than omitted.",
    remediation: "Keep authorization in the data access layer and test it against privilege-boundary cases.",
    hints: [
      "Focus on whether access is scoped during lookup.",
      "The repository method name is a strong signal here.",
      "This is safe from obvious IDOR."
    ],
    difficulty: "hard"
  },
  {
    id: "q067",
    title: "Profile avatar update with CSRF middleware",
    language: "Node.js",
    code: `router.post("/profile/avatar", ensureAuthenticated, csrfProtection, async (req, res) => {
  await profileService.updateAvatar(req.user.id, req.body.avatarUrl);
  res.json({ saved: true });
});`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "The state-changing route includes CSRF protection middleware before updating account data. Based on the snippet, the common session-backed CSRF issue is already mitigated.",
    remediation: "Keep CSRF protection enabled on all authenticated state-changing routes and pair it with strict cookie policy.",
    hints: [
      "The important control is visible before the route body executes.",
      "Look for a framework-level mitigation in the middleware stack.",
      "This is safe from obvious CSRF."
    ],
    difficulty: "easy"
  },
  {
    id: "q068",
    title: "SQL lookup using bound search term",
    language: "Java",
    code: `String email = request.getParameter("email");
PreparedStatement ps = conn.prepareStatement(
    "SELECT id, email, status FROM customers WHERE email = ?"
);
ps.setString(1, email);
ResultSet rs = ps.executeQuery();`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "The query uses a prepared statement with a bound parameter instead of concatenating the email into SQL syntax. This prevents straightforward SQL Injection in the code shown.",
    remediation: "Keep using bound parameters and add any needed authorization around the returned customer data.",
    hints: [
      "The query shape stays fixed and the value is sent separately.",
      "Prepared statements matter only when binding is actually used.",
      "This is safe from obvious SQL Injection."
    ],
    difficulty: "easy"
  },
  {
    id: "q069",
    title: "Support reply rendered with encoded output",
    language: "PHP",
    code: `<?php
$reply = $_POST['reply'] ?? '';
echo "<div class='reply'>" . htmlspecialchars($reply, ENT_QUOTES, 'UTF-8') . "</div>";`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "The reply text is encoded before being inserted into the HTML response. That prevents the browser from treating attacker-controlled markup as executable content in this context.",
    remediation: "Continue applying context-appropriate output encoding whenever untrusted content is rendered into HTML.",
    hints: [
      "This is an output context question rather than a database one.",
      "A mitigation is applied immediately before the response is built.",
      "This is safe from obvious XSS."
    ],
    difficulty: "easy"
  },
  {
    id: "q070",
    title: "Image proxy validates final host but not initial host",
    language: "Node.js",
    code: `app.get("/image/fetch", async (req, res) => {
  const response = await fetch(req.query.url, { redirect: "follow" });
  const finalUrl = new URL(response.url);
  if (finalUrl.hostname !== "cdn.example.com") {
    return res.sendStatus(400);
  }
  res.type("image/png").send(await response.arrayBuffer());
});`,
    isVulnerable: true,
    vulnerabilityType: "SSRF",
    explanation: "The server makes the outbound request before validating that the final URL is an approved host. That still allows attacker-controlled requests to reach arbitrary destinations before the check happens.",
    remediation: "Validate and allowlist the destination before sending the request, and restrict or revalidate redirects.",
    hints: [
      "The outbound request timing matters here.",
      "Host validation that happens after the request is too late.",
      "This is vulnerable to SSRF."
    ],
    difficulty: "hard"
  },
  {
    id: "q071",
    title: "File preview strips ../ but leaves encoded traversal",
    language: "Python",
    code: `@app.get("/preview")
def preview():
    name = request.args.get("name", "").replace("../", "")
    with open("/srv/previews/" + name, "rb") as handle:
        return Response(handle.read(), mimetype="application/octet-stream")`,
    isVulnerable: true,
    vulnerabilityType: "Path Traversal",
    explanation: "The code relies on naive string replacement and still builds the file path directly from user input. Encoded, repeated, or alternative traversal patterns can still bypass the simplistic filter.",
    remediation: "Resolve the final path canonically and reject any request that escapes the intended preview directory.",
    hints: [
      "A single string replacement is rarely enough for path safety.",
      "The file path is still assembled directly from external input.",
      "This is vulnerable to Path Traversal."
    ],
    difficulty: "hard"
  },
  {
    id: "q072",
    title: "Session token regenerated after privilege change",
    language: "PHP",
    code: `<?php
session_start();
$_SESSION['user_id'] = $user['id'];
$_SESSION['role'] = $user['role'];
session_regenerate_id(true);
echo json_encode(['ok' => true]);`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "The code regenerates the session identifier after establishing authenticated session state. That is a good defense against session fixation in the flow shown.",
    remediation: "Keep regenerating session ids on authentication or privilege changes and retain strong cookie flags.",
    hints: [
      "Look at how the session token is handled after login.",
      "A strong fixation defense usually rotates session identifiers.",
      "This is safe from obvious Session management flaws."
    ],
    difficulty: "easy"
  },
  {
    id: "q073",
    title: "XML upload with secure parser but unsafe fallback branch",
    language: "Python",
    code: `if request.args.get("legacy") == "1":
    doc = etree.fromstring(request.data)
else:
    parser = etree.XMLParser(resolve_entities=False, no_network=True)
    doc = etree.fromstring(request.data, parser=parser)
return {"name": doc.findtext("name")}`,
    isVulnerable: true,
    vulnerabilityType: "XXE",
    explanation: "Although the non-legacy path uses a hardened parser, the legacy branch falls back to an unsafe parser configuration for attacker-controlled XML. An attacker only needs the reachable weak path.",
    remediation: "Use the hardened parser in every branch and remove legacy parsing behavior that bypasses secure settings.",
    hints: [
      "One safe branch does not fix another unsafe branch.",
      "Check whether every code path uses the hardened parser.",
      "This remains vulnerable to XXE."
    ],
    difficulty: "hard"
  },
  {
    id: "q074",
    title: "Reflected status message encoded before output",
    language: "PHP",
    code: `<?php
$status = $_GET['status'] ?? 'ok';
echo "<div class='status'>" . htmlspecialchars($status, ENT_QUOTES, 'UTF-8') . "</div>";`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "The reflected parameter is encoded before being inserted into HTML. That prevents the browser from interpreting attacker input as active markup in this response context.",
    remediation: "Keep using context-appropriate output encoding for untrusted values rendered into HTML.",
    hints: [
      "Focus on the output sink and whether any mitigation is applied.",
      "The key behavior happens right before rendering.",
      "This is safe from obvious XSS."
    ],
    difficulty: "easy"
  },
  {
    id: "q075",
    title: "Comment export restricted by ownership query",
    language: "Python",
    code: `@app.get("/comments/<int:comment_id>")
@login_required
def comment(comment_id):
    record = Comment.query.filter_by(id=comment_id, user_id=current_user.id).first_or_404()
    return jsonify(record.to_dict())`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "The lookup scopes the requested comment by both id and the authenticated user's id. That prevents straightforward horizontal access by changing the identifier.",
    remediation: "Keep ownership checks tied to the data-access path instead of relying on UI controls.",
    hints: [
      "Check whether the object lookup is bound to the current user.",
      "Authentication plus ownership is stronger than authentication alone.",
      "This is safe from obvious IDOR."
    ],
    difficulty: "easy"
  },
  {
    id: "q076",
    title: "Search term passed to parameterized query builder",
    language: "Node.js",
    code: `app.get("/search", async (req, res) => {
  const term = req.query.term || "";
  const rows = await knex("products")
    .select("id", "name")
    .where("name", "like", "%" + term + "%");
  res.json(rows);
});`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "The query builder still parameterizes the value even though the LIKE pattern is assembled in application code. The attacker input is treated as data, not raw SQL syntax.",
    remediation: "Keep using query builders or prepared statements and validate expensive wildcard searches if needed.",
    hints: [
      "This looks dynamic, but the database API matters.",
      "The query builder is not concatenating SQL text directly.",
      "This is safe from obvious SQL Injection."
    ],
    difficulty: "easy"
  },
  {
    id: "q077",
    title: "Password reset link uses secure random token",
    language: "Node.js",
    code: `app.post("/forgot", async (req, res) => {
  const token = crypto.randomBytes(32).toString("hex");
  await resetStore.save(req.body.email, hashToken(token), Date.now() + 3600000);
  await mailer.send(req.body.email, \`https://app/reset?token=\${token}\`);
  res.sendStatus(204);
});`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "The reset flow uses a cryptographically random token and stores only a hashed server-side representation with an expiry. That avoids predictable reset tokens in the snippet shown.",
    remediation: "Keep reset tokens random, expiring, single-use, and bound to a server-side record.",
    hints: [
      "Look at how the reset credential is generated and stored.",
      "Predictability is the main concern in this kind of flow.",
      "This is safe from obvious Authentication flaws."
    ],
    difficulty: "easy"
  },
  {
    id: "q078",
    title: "File access driven by explicit asset map",
    language: "JavaScript",
    code: `const assets = {
  handbook: "/srv/docs/handbook.pdf",
  policy: "/srv/docs/policy.pdf"
};

app.get("/asset", (req, res) => {
  const target = assets[req.query.name];
  if (!target) return res.sendStatus(404);
  res.sendFile(target);
});`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "The request chooses from a fixed server-side map rather than controlling a filesystem path directly. That avoids raw traversal input in the code shown.",
    remediation: "Continue exposing fixed identifiers instead of accepting arbitrary filenames from the client.",
    hints: [
      "The path is not coming straight from the request.",
      "A static server-side map is often a safe pattern.",
      "This is safe from obvious Path Traversal."
    ],
    difficulty: "easy"
  },
  {
    id: "q079",
    title: "Session cookie configured with secure flags",
    language: "PHP",
    code: `<?php
session_set_cookie_params([
  'secure' => true,
  'httponly' => true,
  'samesite' => 'Strict'
]);
session_start();`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "The session cookie uses Secure, HttpOnly, and SameSite attributes. The snippet does not show an obvious cookie protection or fixation flaw.",
    remediation: "Keep strong cookie attributes enabled and rotate the session id on authentication changes.",
    hints: [
      "Cookie attributes are the main clue here.",
      "Strong browser protections are already configured.",
      "This is safe from obvious Session management flaws."
    ],
    difficulty: "easy"
  },
  {
    id: "q080",
    title: "XXE-safe parser wrapper reused consistently",
    language: "Python",
    code: `def parse_safe_xml(data):
    parser = etree.XMLParser(resolve_entities=False, no_network=True)
    return etree.fromstring(data, parser=parser)

@app.post("/import")
def import_xml():
    doc = parse_safe_xml(request.data)
    return {"title": doc.findtext("title")}`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "The untrusted XML is parsed through a helper that consistently disables entity resolution and network access. That blocks the common XXE path in this snippet.",
    remediation: "Centralize hardened parser behavior like this so unsafe defaults are not used in other routes.",
    hints: [
      "A reusable secure helper can be a positive sign.",
      "Check the parser flags inside the helper.",
      "This is safe from obvious XXE."
    ],
    difficulty: "easy"
  },
  {
    id: "q081",
    title: "CSV import shell wrapper trusts filename extension only",
    language: "Node.js",
    code: `app.post("/import", requireAdmin, (req, res) => {
  const file = req.body.file;
  if (!file.endsWith(".csv")) {
    return res.sendStatus(400);
  }
  exec("python3 /srv/tools/import_csv.py " + file, () => res.sendStatus(204));
});`,
    isVulnerable: true,
    vulnerabilityType: "Command Injection",
    explanation: "The code checks only the filename suffix and still concatenates the raw value into a shell command. A matching extension does not stop metacharacters or command chaining.",
    remediation: "Use an argument-separated process API and validate the filename against a strict allowlist or server-side upload id.",
    hints: [
      "The extension check is not the real sink.",
      "The shell command is still built with untrusted input.",
      "This is Command Injection."
    ],
    difficulty: "hard"
  },
  {
    id: "q082",
    title: "Legacy XML path keeps external entities enabled",
    language: "PHP",
    code: `<?php
libxml_disable_entity_loader(false);
$xml = file_get_contents('php://input');
$dom = new DOMDocument();
$dom->loadXML($xml);
echo $dom->getElementsByTagName('name')->item(0)->nodeValue;`,
    isVulnerable: true,
    vulnerabilityType: "XXE",
    explanation: "The code parses attacker-controlled XML on a legacy path with entity loading enabled and without secure parser restrictions. That leaves the parser open to XML external entity abuse.",
    remediation: "Disable external entities and DTD processing for all untrusted XML parsing paths, not only the modern one.",
    hints: [
      "The risk comes from parser behavior, not the final node access.",
      "Look for secure XML configuration and whether it is missing.",
      "This is vulnerable to XXE."
    ],
    difficulty: "hard"
  },
  {
    id: "q083",
    title: "Invoice renderer fetches remote template from user URL",
    language: "Java",
    code: `String templateUrl = request.getParameter("template");
String template = new String(new URL(templateUrl).openStream().readAllBytes(), StandardCharsets.UTF_8);
invoiceService.render(template, response.getOutputStream());`,
    isVulnerable: true,
    vulnerabilityType: "SSRF",
    explanation: "The backend retrieves a remote resource directly from a user-supplied URL before rendering the invoice. That gives the attacker control over server-side outbound requests.",
    remediation: "Replace remote URL input with a fixed template identifier or allowlist the template host before any request is sent.",
    hints: [
      "The server is fetching attacker-controlled content over the network.",
      "Look for a backend request controlled by client input.",
      "This is vulnerable to SSRF."
    ],
    difficulty: "hard"
  },
  {
    id: "q084",
    title: "Account role read uses client-supplied user id",
    language: "Node.js",
    code: `app.get("/api/role", requireAuth, async (req, res) => {
  const role = await roles.getForUser(req.query.userId);
  res.json({ role });
});`,
    isVulnerable: true,
    vulnerabilityType: "IDOR",
    explanation: "The route uses a client-supplied user id to fetch another account's role data without showing any ownership or authorization check. Authentication alone does not make the object access safe.",
    remediation: "Use req.user.id for self-access or verify the caller is authorized to view the requested user's role.",
    hints: [
      "The object selector comes directly from the request.",
      "There is no visible ownership or role check around the lookup.",
      "This is an IDOR."
    ],
    difficulty: "hard"
  },
  {
    id: "q085",
    title: "Profile bio preview passes sanitized markdown",
    language: "JavaScript",
    code: `app.post("/preview", (req, res) => {
  const dirty = marked.parse(req.body.markdown || "");
  const clean = DOMPurify.sanitize(dirty);
  res.send(clean);
});`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "The route sanitizes the generated HTML before returning it to the client. That addresses the obvious HTML injection path that would otherwise lead to XSS.",
    remediation: "Keep the sanitizer updated and review any future changes to the allowed tags or attributes.",
    hints: [
      "Rendering HTML is not automatically unsafe if there is a real mitigation.",
      "Check whether the content is sanitized before output.",
      "This is safe from obvious XSS."
    ],
    difficulty: "easy"
  },
  {
    id: "q086",
    title: "Internal report download trusts org id parameter",
    language: "Python",
    code: `@app.get("/reports/latest")
@login_required
def latest():
    report = report_store.latest_for_org(request.args["org_id"])
    return send_file(report.path)`,
    isVulnerable: true,
    vulnerabilityType: "IDOR",
    explanation: "The caller controls which organization report is loaded, and the snippet shows no authorization check tying that organization id to the logged-in user. That exposes direct object access across tenants.",
    remediation: "Resolve organization context from the authenticated session or enforce a membership check before loading the report.",
    hints: [
      "This is about who may access a resource, not injection.",
      "A multi-tenant org id must not be trusted from the request alone.",
      "This is an IDOR."
    ],
    difficulty: "hard"
  },
  {
    id: "q087",
    title: "CLI health check uses safe subprocess arguments",
    language: "Python",
    code: `@app.post("/ping")
def ping():
    host = request.form["host"]
    subprocess.run(["/bin/ping", "-c", "1", host], check=True)
    return {"ok": True}`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "The process is spawned with a fixed executable and argument list instead of a shell-parsed string. That avoids the obvious command injection path shown by os.system or shell string concatenation.",
    remediation: "Keep using argument-separated process APIs and add allowlisting if only known hosts should be reachable.",
    hints: [
      "The API shape matters for command safety.",
      "A shell is not parsing this command string.",
      "This is safe from obvious Command Injection."
    ],
    difficulty: "easy"
  },
  {
    id: "q088",
    title: "Auth middleware trusts unsigned JWT in fallback branch",
    language: "JavaScript",
    code: `function auth(req, res, next) {
  if (req.cookies.debug_jwt) {
    req.user = JSON.parse(Buffer.from(req.cookies.debug_jwt.split(".")[1], "base64").toString());
    return next();
  }
  verifyJwt(req, res, next);
}`,
    isVulnerable: true,
    vulnerabilityType: "Authentication flaws",
    explanation: "The fallback branch decodes user identity from a client-controlled token without verifying the signature. That creates a full authentication bypass through a crafted cookie.",
    remediation: "Remove the debug branch and always verify token integrity and claims before trusting any JWT payload.",
    hints: [
      "The issue is not session storage, it is identity trust.",
      "A decoded token is not the same as a verified token.",
      "This is an Authentication flaw."
    ],
    difficulty: "hard"
  },
  {
    id: "q089",
    title: "API key rotation checks current owner scope",
    language: "Java",
    code: `long keyId = Long.parseLong(request.getParameter("id"));
ApiKey key = apiKeyService.findForOwner(keyId, currentUser.getId());
if (key == null) {
    response.sendError(404);
    return;
}
apiKeyService.rotate(key);`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "The key lookup is scoped to the current owner before the rotation occurs. That addresses the obvious direct object reference risk shown by raw id-based sensitive operations.",
    remediation: "Keep ownership checks close to the service method that performs the sensitive action.",
    hints: [
      "The sensitive action is only safe if the object lookup is scoped correctly.",
      "Ownership is enforced before rotation happens.",
      "This is safe from obvious IDOR."
    ],
    difficulty: "easy"
  },
  {
    id: "q090",
    title: "Search endpoint builds ORDER BY from raw request",
    language: "Python",
    code: `@app.get("/audit")
def audit():
    sort = request.args.get("sort", "created_at")
    sql = f"SELECT id, action, created_at FROM audit_log ORDER BY {sort} DESC"
    rows = db.session.execute(text(sql))
    return jsonify([dict(r._mapping) for r in rows])`,
    isVulnerable: true,
    vulnerabilityType: "SQL Injection",
    explanation: "The ORDER BY clause is assembled directly from user input without an allowlist. Even when no string literal is involved, attacker-controlled SQL syntax can still alter the query.",
    remediation: "Restrict sortable columns to a fixed allowlist and choose the SQL fragment server-side before executing the query.",
    hints: [
      "Not all injection happens inside quoted strings.",
      "The raw column expression is still SQL syntax.",
      "This is SQL Injection."
    ],
    difficulty: "hard"
  },
  {
    id: "q091",
    title: "Contact form echoes sanitized subject text",
    language: "Node.js",
    code: `app.post("/contact", (req, res) => {
  const subject = escapeHtml(req.body.subject || "");
  res.send(\`<p>Message queued: \${subject}</p>\`);
});`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "The subject is encoded before it is embedded into the HTML response. That prevents a direct reflected XSS issue in the snippet shown.",
    remediation: "Continue encoding untrusted data in the right output context and avoid reintroducing raw HTML rendering later.",
    hints: [
      "The user input is reflected, but inspect whether it is encoded first.",
      "A proper output-encoding helper is used before response generation.",
      "This is safe from obvious XSS."
    ],
    difficulty: "easy"
  },
  {
    id: "q092",
    title: "Avatar import blocks internal IPs before fetch",
    language: "Python",
    code: `@app.post("/avatar/import")
def avatar_import():
    url = urllib.parse.urlparse(request.json["url"])
    if url.scheme not in {"http", "https"} or is_private(url.hostname):
        abort(400)
    data = requests.get(request.json["url"], timeout=2).content
    return {"size": len(data)}`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "The code checks both the scheme and whether the hostname resolves to a private destination before making the outbound request. That removes the obvious unrestricted SSRF path.",
    remediation: "Keep validating destination hosts before the request and review redirect handling for defense in depth.",
    hints: [
      "The destination is inspected before the server requests it.",
      "Private-address blocking is the main control here.",
      "This is safe from obvious SSRF."
    ],
    difficulty: "easy"
  },
  {
    id: "q093",
    title: "Support export trusts path segment after basename",
    language: "PHP",
    code: `<?php
$name = basename($_GET['file'] ?? 'default.txt');
readfile('/srv/exports/' . $name);`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "Using basename removes directory components from the supplied filename, which blocks straightforward traversal sequences in the path shown. The snippet may still need a stronger allowlist, but it is not an obvious traversal sink as written.",
    remediation: "Prefer fixed identifier maps or allowlists for downloadable files, even if basename is already reducing traversal risk.",
    hints: [
      "A filesystem path is involved, but inspect whether path components are normalized first.",
      "basename strips directory traversal segments from the final file name.",
      "This is not obviously vulnerable to Path Traversal."
    ],
    difficulty: "hard"
  },
  {
    id: "q094",
    title: "XML import branch enables networked schema fetch",
    language: "Java",
    code: `SchemaFactory factory = SchemaFactory.newInstance(XMLConstants.W3C_XML_SCHEMA_NS_URI);
Schema schema = factory.newSchema(new URL(request.getParameter("schema")).openStream());
Validator validator = schema.newValidator();
validator.validate(new StreamSource(request.getInputStream()));`,
    isVulnerable: true,
    vulnerabilityType: "SSRF",
    explanation: "The application retrieves the schema from a user-supplied URL before validating the XML. That creates a backend network request controlled by the client and can be abused as SSRF.",
    remediation: "Do not fetch schemas from user-controlled URLs; use fixed local schemas or a strict server-side allowlist.",
    hints: [
      "The issue is the server contacting an attacker-chosen destination.",
      "The schema source is not fixed by the application.",
      "This is vulnerable to SSRF."
    ],
    difficulty: "hard"
  },
  {
    id: "q095",
    title: "State change protected by synchronizer token",
    language: "Java",
    code: `String submitted = request.getParameter("csrf");
String expected = csrfService.getForSession(request.getSession(false));
if (submitted == null || !submitted.equals(expected)) {
    response.sendError(403);
    return;
}
profileService.updatePhone(currentUser.getId(), request.getParameter("phone"));`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "The handler verifies a session-bound CSRF token before making the state change. That is the right control to prevent cross-site request forgery on authenticated actions.",
    remediation: "Keep CSRF validation close to the mutation point and rotate tokens appropriately with session lifecycle changes.",
    hints: [
      "There is a request-integrity check before the update occurs.",
      "A session-bound token is being compared.",
      "This is safe from obvious CSRF."
    ],
    difficulty: "easy"
  },
  {
    id: "q096",
    title: "Template helper marks user HTML as trusted",
    language: "Python",
    code: `@app.get("/preview")
def preview():
    content = request.args.get("content", "")
    return render_template("preview.html", content=Markup(content))`,
    isVulnerable: true,
    vulnerabilityType: "XSS",
    explanation: "The code explicitly marks attacker-controlled content as trusted HTML before rendering the template. That bypasses the normal escaping behavior and creates a direct XSS path.",
    remediation: "Do not mark untrusted content safe. Render it normally with auto-escaping or sanitize it first with a vetted HTML sanitizer.",
    hints: [
      "The vulnerability comes from bypassing a framework safety feature.",
      "A helper is telling the template engine to trust the content.",
      "This is XSS."
    ],
    difficulty: "hard"
  },
  {
    id: "q097",
    title: "Audit export rotates session after admin login",
    language: "Node.js",
    code: `app.post("/admin/login", async (req, res) => {
  const user = await verifyAdmin(req.body.username, req.body.password);
  if (!user) return res.sendStatus(401);
  req.session.regenerate(() => {
    req.session.userId = user.id;
    req.session.role = "admin";
    res.redirect("/admin");
  });
});`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "The session is regenerated when the privileged login succeeds, which is a strong defense against session fixation. The snippet does not expose an obvious session management flaw.",
    remediation: "Keep regenerating the session on authentication and privilege changes and maintain strong cookie settings.",
    hints: [
      "Look for whether the session identifier changes after login.",
      "Regeneration is a positive signal in auth flows.",
      "This is safe from obvious Session management flaws."
    ],
    difficulty: "easy"
  },
  {
    id: "q098",
    title: "Admin query allowlists projection but concatenates filter",
    language: "Java",
    code: `String column = Set.of("id", "email").contains(request.getParameter("col"))
    ? request.getParameter("col")
    : "id";
String filter = request.getParameter("filter");
String sql = "SELECT " + column + " FROM users WHERE email LIKE '%" + filter + "%'";
Statement st = conn.createStatement();
ResultSet rs = st.executeQuery(sql);`,
    isVulnerable: true,
    vulnerabilityType: "SQL Injection",
    explanation: "The projection column is allowlisted, but the raw filter value is still concatenated into the WHERE clause. That leaves a user-controlled SQL injection point even though one dynamic fragment is validated.",
    remediation: "Keep the allowlisted column selection and parameterize the filter value separately from the query text.",
    hints: [
      "One validated fragment does not make the whole query safe.",
      "The remaining raw value still reaches executable SQL syntax.",
      "This is SQL Injection."
    ],
    difficulty: "hard"
  },
  {
    id: "q099",
    title: "Passwordless login link uses HMAC-signed token",
    language: "Python",
    code: `token = serializer.dumps({"user_id": user.id}, salt="magic-link")
link = url_for("magic_login", token=token, _external=True)
send_email(user.email, link)`,
    isVulnerable: false,
    vulnerabilityType: "Safe / No obvious vulnerability",
    explanation: "The magic link token is created through a signing serializer rather than by concatenating public values directly. Based on the snippet, the login link is not obviously predictable or unsigned.",
    remediation: "Keep the token signed and expiring, and invalidate it after successful use.",
    hints: [
      "The key issue is whether the login token can be forged or predicted.",
      "A signing serializer is a positive sign here.",
      "This is safe from obvious Authentication flaws."
    ],
    difficulty: "easy"
  },
  {
    id: "q100",
    title: "Bulk user export authorizes route but not tenant scope",
    language: "Node.js",
    code: `app.get("/admin/export", requireAdmin, async (req, res) => {
  const rows = await db.query("SELECT email, role FROM users WHERE tenant_id = " + req.query.tenantId);
  res.json(rows);
});`,
    isVulnerable: true,
    vulnerabilityType: "SQL Injection",
    explanation: "Even though the route requires admin access, the tenant id is concatenated directly into the SQL query. Authorization does not remove the injection bug, and a malicious admin or compromised session could still alter the query.",
    remediation: "Parameterize the tenant id and separately verify the caller is allowed to export data for that tenant.",
    hints: [
      "Privileged routes can still have injection bugs.",
      "The tenant selector is still raw SQL input.",
      "This is SQL Injection."
    ],
    difficulty: "hard"
  }
];
