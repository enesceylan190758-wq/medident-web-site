// Website privacy / KVKK notices — conservative, factual, not a lawyer-certified document.
// Do not invent VERBIS numbers, DPO names, or clinical-record retention periods.
import { site } from "./site.mjs";

const updated = "24 Temmuz 2026";
const updatedEn = "24 July 2026";
const updatedDe = "24. Juli 2026";

function disclaimer(lang) {
  if (lang === "en") {
    return `<p class="legal-note"><em>This page is a general website notice. It is not legal advice. Clinic patient files and health data may be subject to additional rules. For full compliance, have a qualified lawyer review and customise this text.</em></p>`;
  }
  if (lang === "de") {
    return `<p class="legal-note"><em>Diese Seite ist ein allgemeiner Website-Hinweis und keine Rechtsberatung. Patientenakten und Gesundheitsdaten können zusätzlichen Regeln unterliegen. Lassen Sie den Text bei Bedarf von einer Fachperson prüfen und anpassen.</em></p>`;
  }
  return `<p class="legal-note"><em>Bu sayfa web sitesi için genel bilgilendirme niteliğindedir; hukuki danışmanlık değildir. Klinik hasta dosyaları ve sağlık verileri ek mevzuata tabi olabilir. Tam uyum için metni bir avukatın gözden geçirip kurumunuza özel hale getirmesini öneririz.</em></p>`;
}

/** KVKK aydınlatma (TR primary) + EN/DE summary aligned with same facts. */
export function kvkkHtml(lang) {
  if (lang === "en") {
    return `${disclaimer("en")}
<h2>1. Who we are</h2>
<p><strong>${site.brand}</strong> (“we”) operates this website. Contact: <a href="mailto:${site.email}">${site.email}</a>, ${site.phone}, ${site.address}.</p>
<h2>2. What data we collect via the website</h2>
<p>Depending on how you contact us, we may process:</p>
<ul>
<li>Identity and contact details (name, phone, email)</li>
<li>Message content and treatment interest you write in forms</li>
<li>Photos or files you voluntarily send (e.g. WhatsApp / email)</li>
<li>Technical data such as IP address, browser type, and cookie/analytics identifiers when you browse the site</li>
</ul>
<p>We do <strong>not</strong> ask for national ID numbers or full medical records through the public website form. Clinical records, if any, are handled in the treatment process under separate health-data rules.</p>
<h2>3. Why we use the data</h2>
<ul>
<li>To answer your enquiry and offer a free pre-assessment / quote</li>
<li>To coordinate appointments, travel or treatment-related communication you request</li>
<li>To operate, secure and improve the website (including basic analytics)</li>
<li>Where required, to meet legal obligations</li>
</ul>
<h2>4. Cookies, analytics and ads tools</h2>
<p>This site may use <strong>Google Tag Manager</strong> and a <strong>Meta (Facebook) Pixel</strong> for measurement and marketing performance. These tools can set cookies or similar technologies and send technical/usage data to Google and/or Meta. You can limit this via your browser settings and platform privacy controls.</p>
<h2>5. Who may receive data</h2>
<p>We do not sell your contact details. Data may be shared only as needed with:</p>
<ul>
<li>Infrastructure providers (e.g. website hosting)</li>
<li>Form / CRM tools used to receive enquiries (if enabled)</li>
<li>Messaging platforms you choose to contact us on (e.g. WhatsApp / Meta)</li>
<li>Analytics / advertising technology providers as above</li>
<li>Authorities when legally required</li>
</ul>
<h2>6. Retention</h2>
<p>Enquiry data is kept only as long as needed for the purpose above or until you ask us to delete it, unless a longer period is required by law. Exact clinical-archive periods are not defined on this website page.</p>
<h2>7. Your rights</h2>
<p>Depending on applicable law (including Turkish KVKK for relevant persons), you may request access, correction, deletion, or information about processing. Contact <a href="mailto:${site.email}">${site.email}</a>. We may need to verify your identity before acting.</p>
<p>Last updated: ${updatedEn}</p>
<p>Related: <a href="/en/gizlilik/">Privacy Policy</a></p>`;
  }

  if (lang === "de") {
    return `${disclaimer("de")}
<h2>1. Verantwortlicher (Website)</h2>
<p><strong>${site.brand}</strong> betreibt diese Website. Kontakt: <a href="mailto:${site.email}">${site.email}</a>, ${site.phone}, ${site.address}.</p>
<h2>2. Welche Daten wir über die Website erheben</h2>
<ul>
<li>Name, Telefon, E-Mail</li>
<li>Nachrichteninhalt / Behandlungsinteresse im Formular</li>
<li>Fotos oder Dateien, die Sie freiwillig senden (z. B. WhatsApp / E-Mail)</li>
<li>Technische Daten (IP, Browser, Cookie-/Analysekennungen) beim Besuch der Seite</li>
</ul>
<p>Über das öffentliche Website-Formular verlangen wir keine Ausweisnummer und keine vollständige Krankenakte. Klinische Unterlagen unterliegen ggf. gesonderten Gesundheitsdaten-Regeln.</p>
<h2>3. Zwecke</h2>
<ul>
<li>Beantwortung Ihrer Anfrage und unverbindliche Vorabeinschätzung / Angebot</li>
<li>Termin- und Reisekommunikation, soweit von Ihnen gewünscht</li>
<li>Betrieb, Sicherheit und Verbesserung der Website (inkl. Analyse)</li>
<li>Erfüllung gesetzlicher Pflichten, soweit erforderlich</li>
</ul>
<h2>4. Cookies, Analyse und Werbung</h2>
<p>Die Website kann <strong>Google Tag Manager</strong> und ein <strong>Meta (Facebook) Pixel</strong> nutzen. Dabei können Cookies gesetzt und Nutzungsdaten an Google und/oder Meta übermittelt werden. Sie können dies über Browser- und Plattformeinstellungen einschränken.</p>
<h2>5. Empfänger</h2>
<p>Wir verkaufen Ihre Kontaktdaten nicht. Weitergabe nur soweit nötig an Hosting, Formular-/CRM-Dienste (falls aktiv), Messaging-Dienste Ihrer Wahl (z. B. WhatsApp), Analyse-/Werbeanbieter sowie Behörden bei gesetzlicher Pflicht.</p>
<h2>6. Speicherdauer</h2>
<p>Anfragedaten nur so lange wie für den Zweck nötig oder bis zu Ihrem Löschwunsch, sofern kein längeres gesetzliches Erfordernis besteht. Klinische Archivfristen werden hier nicht festgelegt.</p>
<h2>7. Rechte</h2>
<p>Je nach anwendbarem Recht (inkl. türkischem KVKK für betroffene Personen) können Sie Auskunft, Berichtigung, Löschung oder Informationen zur Verarbeitung verlangen: <a href="mailto:${site.email}">${site.email}</a>. Eine Identitätsprüfung kann erforderlich sein.</p>
<p>Stand: ${updatedDe}</p>
<p>Siehe auch: <a href="/de/gizlilik/">Datenschutz</a></p>`;
  }

  // TR — KVKK tarzı aydınlatma (genel, ihtiyatlı)
  return `${disclaimer("tr")}
<h2>1. Veri sorumlusu</h2>
<p>Bu web sitesi kapsamında kişisel verilerinizin işlenmesinden <strong>${site.brand}</strong> sorumludur.</p>
<ul>
<li>Adres: ${site.address}</li>
<li>E-posta: <a href="mailto:${site.email}">${site.email}</a></li>
<li>Telefon: ${site.phone}</li>
</ul>
<h2>2. Hangi verileri işleriz?</h2>
<p>Web sitesi, iletişim formu, e-posta veya WhatsApp üzerinden bizimle iletişime geçtiğinizde; ad-soyad, telefon, e-posta, mesaj içeriği, ilgilendiğiniz tedavi bilgisi ve gönüllü olarak gönderdiğiniz fotoğraf/dosyalar işlenebilir. Siteyi ziyaretinizde IP adresi, tarayıcı bilgisi ve çerez/analiz tanımlayıcıları gibi teknik veriler de oluşabilir.</p>
<p>Kamuya açık web formunda T.C. kimlik numarası veya tam sağlık dosyası talep edilmez. Klinik hasta kayıtları varsa bunlar ayrı sağlık mevzuatı çerçevesinde yönetilir; bu sayfa yalnızca web sitesi iletişim süreçlerini açıklar.</p>
<h2>3. Amaçlar</h2>
<ul>
<li>Talebinize dönüş yapmak, ön değerlendirme / teklif hazırlamak</li>
<li>Randevu ve (talep ederseniz) seyahat/tedavi koordinasyonu</li>
<li>Web sitesinin işletilmesi, güvenliği ve iyileştirilmesi</li>
<li>Yasal yükümlülüklerin yerine getirilmesi (gerektiğinde)</li>
</ul>
<h2>4. Hukuki sebepler (genel)</h2>
<p>İşleme; talebinizin yerine getirilmesi, meşru menfaatlerimiz (işletme iletişimi ve site güvenliği) ve ilgili mevzuattaki diğer hukuki sebepler çerçevesinde yürütülür. Sağlık verisi niteliğindeki içerikleri yalnızca sizin paylaşımınız ve tedavi sürecinin gereği ölçüsünde ele alırız.</p>
<h2>5. Çerezler, analitik ve reklam araçları</h2>
<p>Sitede <strong>Google Tag Manager</strong> ve <strong>Meta (Facebook) Pixel</strong> kullanılabilir. Bu araçlar çerez veya benzeri teknolojilerle kullanım verisi toplayabilir ve Google / Meta’ya aktarabilir. Tarayıcı ayarlarınızdan çerezleri sınırlayabilirsiniz.</p>
<h2>6. Aktarım / alıcılar</h2>
<p>İletişim bilgilerinizi satmayız. Veriler yalnızca gerekli olduğu ölçüde; barındırma (hosting), form/CRM altyapısı (kullanılıyorsa), sizin tercih ettiğiniz mesajlaşma kanalları (ör. WhatsApp), analitik/reklam teknoloji sağlayıcıları ve kanunen zorunlu hallerde yetkili kurumlarla paylaşılabilir.</p>
<h2>7. Saklama</h2>
<p>İletişim taleplerine ilişkin veriler, amaç için gerekli süre boyunca veya silme talebinize kadar saklanır; kanunen daha uzun süre gerekmedikçe tutulmaz. Klinik arşiv süreleri bu web sayfasında tanımlanmamıştır.</p>
<h2>8. KVKK kapsamındaki haklarınız</h2>
<p>6698 sayılı Kanun’un 11. maddesi kapsamında; verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, amaca uygun kullanılıp kullanılmadığını öğrenme, eksik/yanlışlığın düzeltilmesini isteme, silinmesini/yok edilmesini talep etme ve kanunda sayılan diğer haklarınızı kullanabilirsiniz. Başvurularınız için: <a href="mailto:${site.email}">${site.email}</a>. Kimlik doğrulaması istenebilir.</p>
<p>Son güncelleme: ${updated}</p>
<p>İlgili: <a href="/gizlilik/">Gizlilik Politikası</a></p>`;
}

/** Privacy policy — website-focused; complements KVKK page. */
export function privacyHtml(lang) {
  if (lang === "en") {
    return `${disclaimer("en")}
<h2>1. Scope</h2>
<p>This Privacy Policy explains how <strong>${site.brand}</strong> handles information collected through <a href="${site.domain}">${site.domain.replace("https://", "")}</a> and related online contact channels (forms, email, WhatsApp).</p>
<h2>2. Data we collect</h2>
<ul>
<li>Information you submit (name, phone, email, message, optional photos)</li>
<li>Technical/usage data via cookies and similar tools</li>
</ul>
<h2>3. How we use it</h2>
<p>To reply to you, prepare a preliminary assessment or quote, coordinate care you request, keep the site secure, and understand aggregate traffic. We do not sell your personal contact list.</p>
<h2>4. Cookies &amp; third-party tools</h2>
<p>We may use Google Tag Manager and Meta Pixel. These providers process data under their own terms/policies. Browser controls can reduce cookies; some site features may still work without marketing cookies.</p>
<h2>5. International visitors</h2>
<p>If you contact us from outside Türkiye, your message will be received and handled in Türkiye. Messaging and analytics providers may process data in other countries according to their systems.</p>
<h2>6. Security</h2>
<p>We take reasonable technical and organisational measures. No online transmission is 100% secure.</p>
<h2>7. Children</h2>
<p>The public website is aimed at adults arranging dental care. Do not submit children’s data unless you are a parent/guardian doing so for an enquiry.</p>
<h2>8. Contact &amp; requests</h2>
<p>Questions or deletion/access requests: <a href="mailto:${site.email}">${site.email}</a> · ${site.phone} · ${site.address}</p>
<p>Turkish data-subject notice: <a href="/en/kvkk/">KVKK / Privacy notice</a></p>
<p>Last updated: ${updatedEn}</p>`;
  }

  if (lang === "de") {
    return `${disclaimer("de")}
<h2>1. Geltungsbereich</h2>
<p>Diese Erklärung beschreibt, wie <strong>${site.brand}</strong> Informationen über <a href="${site.domain}">${site.domain.replace("https://", "")}</a> und Online-Kontaktwege (Formular, E-Mail, WhatsApp) verarbeitet.</p>
<h2>2. Erhobene Daten</h2>
<ul>
<li>Von Ihnen übermittelte Angaben (Name, Telefon, E-Mail, Nachricht, optionale Fotos)</li>
<li>Technische Nutzungsdaten über Cookies und ähnliche Tools</li>
</ul>
<h2>3. Zwecke</h2>
<p>Antwort auf Ihre Anfrage, Vorabeinschätzung/Angebot, gewünschte Behandlungs-/Reisekoordination, Sicherheit der Website und aggregierte Reichweitenanalyse. Wir verkaufen keine Kontaktlisten.</p>
<h2>4. Cookies &amp; Drittanbieter</h2>
<p>Es können Google Tag Manager und Meta Pixel eingesetzt werden. Diese Anbieter verarbeiten Daten nach eigenen Bedingungen. Browser-Einstellungen können Cookies einschränken.</p>
<h2>5. Internationale Besucher</h2>
<p>Anfragen aus dem Ausland werden in der Türkei entgegengenommen. Messaging- und Analyseanbieter können Daten in anderen Ländern verarbeiten.</p>
<h2>6. Sicherheit</h2>
<p>Wir treffen angemessene technische und organisatorische Maßnahmen. Eine absolute Sicherheit bei Online-Übertragung gibt es nicht.</p>
<h2>7. Kinder</h2>
<p>Die Website richtet sich an Erwachsene. Kinderdaten nur als Eltern/Erziehungsberechtigte im Rahmen einer Anfrage übermitteln.</p>
<h2>8. Kontakt</h2>
<p><a href="mailto:${site.email}">${site.email}</a> · ${site.phone} · ${site.address}</p>
<p>Türkische Betroffeneninformation: <a href="/de/kvkk/">KVKK-Hinweis</a></p>
<p>Stand: ${updatedDe}</p>`;
  }

  return `${disclaimer("tr")}
<h2>1. Kapsam</h2>
<p>Bu Gizlilik Politikası, <strong>${site.brand}</strong>’ın <a href="${site.domain}">medidentistanbul.com</a> web sitesi ve online iletişim kanalları (form, e-posta, WhatsApp) üzerinden elde ettiği bilgilere ilişkindir.</p>
<h2>2. Toplanan bilgiler</h2>
<ul>
<li>Sizin ilettiğiniz ad, telefon, e-posta, mesaj ve isteğe bağlı fotoğraflar</li>
<li>Çerezler ve benzeri araçlarla oluşan teknik kullanım verileri</li>
</ul>
<h2>3. Kullanım amaçları</h2>
<p>Talebinize yanıt vermek, ön değerlendirme/teklif hazırlamak, istediğiniz ölçüde randevu-koordinasyon sağlamak, site güvenliğini korumak ve toplu trafik analizidir. İletişim listelerinizi satmayız.</p>
<h2>4. Çerezler ve üçüncü taraf araçlar</h2>
<p>Sitede Google Tag Manager ve Meta Pixel kullanılabilir. Bu sağlayıcılar kendi politikalarına göre veri işleyebilir. Tarayıcı ayarlarıyla çerezleri sınırlayabilirsiniz.</p>
<h2>5. Yurt dışı ziyaretçiler</h2>
<p>Türkiye dışından gelen mesajlar Türkiye’deki klinik iletişim sürecinde ele alınır. Mesajlaşma ve analitik sağlayıcıları kendi sistemleri uyarınca başka ülkelerde veri işleyebilir.</p>
<h2>6. Güvenlik</h2>
<p>Makul teknik ve idari önlemler alınır; internet üzerinden iletimde %100 güvenlik garanti edilemez.</p>
<h2>7. Çocuklar</h2>
<p>Kamuya açık site, yetişkinlerin diş tedavisi talepleri içindir. Çocuk verisi yalnızca veli/vasi sıfatıyla bir başvuru için gönderilmelidir.</p>
<h2>8. İletişim</h2>
<p><a href="mailto:${site.email}">${site.email}</a> · ${site.phone} · ${site.address}</p>
<p>KVKK aydınlatma metni: <a href="/kvkk/">KVKK</a></p>
<p>Son güncelleme: ${updated}</p>`;
}
