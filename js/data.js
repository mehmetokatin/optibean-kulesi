/* Kat metinleri ve kavram sözlüğü.
   Yeni bir kat açmak için: ROOMS içinde o katın type alanını "real" ya da "scen" yap,
   role, other, ch, concepts ve steps alanlarını doldur. */
const GLOSSARY = {
  "Systems analyst":"Sistem analisti: İş tarafı ile teknik tarafı birleştiren, sorunu anlayan ve kullanıcıyı dinleyen kişi.",
  "Stakeholder":"Paydaş: Sistemden etkilenen ya da sisteme etki eden herkes.",
  "Top manager":"Üst yönetim: Stratejik, uzun vadeli kararları veren kişiler.",
  "End users":"Son kullanıcı: Sistemi her gün fiilen kullanan kişi.",
  "Preliminary investigation":"Ön inceleme: Sorunu, kapsamını ve projenin değip değmeyeceğini anlamak için ilk araştırma.",
  "Economic feasibility":"Ekonomik fizibilite: Faydalar maliyetleri karşılıyor mu?",
  "Technical feasibility":"Teknik fizibilite: Donanım, yazılım ve uzmanlık var mı?",
  "Schedule feasibility":"Zaman fizibilitesi: Proje istenen sürede bitebilir mi?",
  "Operational feasibility":"Operasyonel fizibilite: Kullanıcılar sistemi gerçekten kullanacak mı?",
  "TCO":"Total Cost of Ownership: Satın alma + kurulum + eğitim + bakım + destek, toplam sahip olma maliyeti.",
  "Prototype":"Prototip: Sistemin erken, çalışan deneme modeli.",
  "Research":"Araştırma: Rakipleri, benzer sistemleri ve sektörü incelemek.",
  "Horizontal system":"Yatay sistem: Birçok sektörde kullanılabilen genel yazılım (ör. hazır satış/stok programı).",
  "Data vs information":"Veri ham gerçeklerdir (günlük satışlar); bilgi işlenip anlamlı hale gelmiş veridir (aylık kâr).",
  "Fact-finding":"İhtiyaç toplama: Kullanıcının ne yaptığını ve neye ihtiyaç duyduğunu öğrenme teknikleri.",
  "Interview":"Görüşme: Kullanıcıyla birebir konuşarak derin bilgi toplamak.",
  "Observation":"Gözlem: Kullanıcıyı iş başında izlemek; söylediği ile yaptığı farklı olabilir.",
  "Document review":"Belge inceleme: Mevcut formları, defterleri ve raporları incelemek.",
  "Questionnaire":"Anket: Çok sayıda kişiye aynı soruları sormak.",
  "Sampling":"Örnekleme: Tüm veri yerine temsil eden bir kısmını incelemek.",
  "Open-ended question":"Açık uçlu soru: Cevabı serbest; kullanıcıyı konuşturur, sorunu keşfettirir.",
  "Closed-ended question":"Kapalı uçlu soru: Kısa, net cevap ister (evet/hayır, sayı).",
  "Range-of-response question":"Ölçekli soru: Cevap bir ölçek üzerinde (1–10); karşılaştırma ve ölçüm sağlar.",
  "Listening":"Dinleme: Notlara göre analistin en değerli becerisi.",
  "DFD":"Data Flow Diagram: Verinin sistemde nereden gelip nereye gittiğini gösteren çizim.",
  "Context diagram":"Bağlam diyagramı: Tüm sistemi tek process olarak, dış varlıklarla birlikte gösteren en üst seviye DFD.",
  "External entity":"Dış varlık: Sistemin dışında olup veri veren ya da alan kişi/kurum.",
  "Process":"Süreç: Veriyi işleyip dönüştüren adım; adı fiil olur.",
  "Data store":"Veri deposu: Verinin saklandığı yer.",
  "Data flow":"Veri akışı: Verinin hareketi; adı isim olur.",
  "Leveling":"Seviyelendirme: Bir process'i alt diyagramlarda daha küçük process'lere bölmek.",
  "Balancing":"Dengeleme: Üst ve alt seviye diyagramlarda giriş/çıkış akışlarının aynı olması.",
  "Black hole":"Kara delik: Process'e veri giriyor ama hiç çıkmıyor.",
  "Gray hole":"Gri delik: Process'in girişi, çıkışını üretmeye yetmiyor.",
  "Spontaneous generation":"Kendiliğinden oluşma: Process'ten veri çıkıyor ama hiç veri girmiyor.",
  "WBS":"Work Breakdown Structure: Büyük işi yönetilebilir görevlere bölmek.",
  "Predecessor / Successor":"Önceki / sonraki görev: Bir görev başlamadan önce bitmesi gereken görev.",
  "Concurrent tasks":"Eşzamanlı görevler: Aynı anda yapılabilen görevler.",
  "Gantt chart":"Gantt şeması: Görevleri takvim üzerinde yatay çubuklarla gösterir.",
  "PERT/CPM":"Ağ diyagramı: Görevlerin bağımlılıklarını ve kritik yolu gösterir.",
  "Critical path":"Kritik yol: En uzun bağımlı görev zinciri; projenin en kısa bitiş süresini belirler.",
  "Slack":"Esneklik: Bir görevin projeyi geciktirmeden kayabileceği süre.",
  "Milestone":"Kilometre taşı: Süresi sıfır olan önemli an.",
  "Project triangle":"Proje üçgeni: Kapsam, zaman ve maliyet birbirine bağlıdır.",
  "Scope creep":"Kapsam kayması: Proje ilerlerken sürekli yeni isteklerin eklenmesi.",
  "Risk matrix":"Risk matrisi: Riskleri olasılık ve etki ile değerlendirmek.",
  "Object-oriented analysis":"Nesne yönelimli analiz: Sistemi veri ve işlemleri bir arada tutan nesneler olarak görmek.",
  "Class":"Sınıf: Nesnelerin şablonu (ör. Ürün).",
  "Object / Instance":"Nesne: Sınıftan üretilmiş somut bir tane (ör. Yaban mersini).",
  "Attribute":"Özellik: Nesnenin bilgisi (ör. fiyat).",
  "Method":"Metot: Nesnenin yapabildiği iş (ör. kanalaGöreAyır()).",
  "Cardinality":"Çokluk: İki sınıf arasındaki sayısal ilişki (1 ürün — 0..* satış).",
  "Use case diagram":"Kullanım durumu diyagramı: Sistemi kimin kullandığını ve ne yaptığını gösterir.",
  "Actor":"Aktör: Sistemi kullanan kişi ya da dış sistem.",
  "Class diagram":"Sınıf diyagramı: Sınıfları, özelliklerini, metotlarını ve ilişkilerini gösterir.",
  "Waterfall":"Şelale modeli: SDLC aşamaları sırayla, her biri bitmeden diğerine geçilmez (predictive).",
  "Agile":"Çevik yöntem: Kısa döngülerle, kullanıcı geri bildirimiyle gelişen yaklaşım (adaptive).",
  "Iteration":"Yineleme: Küçük bir sürümü yapıp, deneyip, iyileştirerek tekrar etmek."
};

const ROOMS = [
  {id:"mudur", floor:3, name:"Müdür Odası", dept:"Üst yönetim", type:"scen", ch:"Ch1–2",
   q:"Yazılım yatırımı bize değer mi?", role:"Kurucu + sistem analisti", other:"Yatırımcı ortak (üst yönetim)",
   concepts:["Systems analyst","Stakeholder","Top manager","Preliminary investigation","Economic feasibility","Technical feasibility","Schedule feasibility","Operational feasibility","TCO","Prototype","Research","Horizontal system"],
   steps:[
    {t:"Sorun", h:"Beş şube, beş WhatsApp fotoğrafı", body:`<p>OptiBean 5 şubeye büyüdü. Her şube gün sonu satışını WhatsApp'tan fotoğrafla gönderiyor. Ortağım soruyor:</p>
      <div class="quote">“Herkes yazılım kurmamızı söylüyor. Ama pahalı, çalışanların teknolojiyle arası iyi değil, kurulumu da aylar sürer. Bu iş bize değer mi?”</div>
      <p>Cümlede üç itiraz var: <b>pahalı</b>, <b>çalışanlar bilmiyor</b>, <b>aylar sürer</b>. Her biri bir fizibilite sorusu.</p>`},
    {t:"Sorduğum soru", h:"Karar vermeden önce dinlemek", body:`<div class="quote real">“Şu an en çok hangi konuda zorlanıyoruz?”</div>
      <p>Bir analist kararı analizden önce vermez. İlk adım sorunu ortağın gözünden anlamak: <span class="k">Preliminary investigation</span>.</p>`},
    {t:"Analiz", h:"Dört fizibilite sorusu", body:`<div class="scroll"><table>
      <tr><th>Soru</th><th>Benim analizim</th></tr>
      <tr><td><span class="k">Economic</span></td><td>Mevcut sistemde harcadığımız zaman, gelir ve gider. Yazılımın toplam maliyeti (<span class="k">TCO</span>: kurulum, eğitim, bakım, destek). Mevcut durumla prototip dönemini karşılaştırırım.</td></tr>
      <tr><td><span class="k">Technical</span></td><td>Şubelerde telefon, tablet ve internet var. Kurulumu deneyimli bir yazılımcı yapar.</td></tr>
      <tr><td><span class="k">Schedule</span></td><td>3 ay içinde bir <span class="k">prototype</span> geliştirilir, test edilir, etkinliğine göre kullanıma alınır.</td></tr>
      <tr><td><span class="k">Operational</span></td><td>Sistemi çalışanlara göre tasarlarız, çalışanları sisteme göre değil. Önce görüşür, gün sonunu nasıl yaptıklarını izleriz. Ekranlar birkaç dokunuşla bitmeli.</td></tr>
      </table></div>
      <div class="callout">Bunu kendi dükkânımda öğrendim: İlk uygulamam fazla detaylı olduğu için kullanımdan düştü, sadeleştirince işe yaradı.</div>`},
    {t:"Seçenekler", h:"“Hiçbir şey yapma” da bir seçenek", body:`<div class="scroll"><table>
      <tr><th>Seçenek</th><th>Kazanç</th><th>Risk</th></tr>
      <tr><td>A. Mevcut sistemle devam</td><td>Ek maliyet yok</td><td>Veri dağınık kalır, büyüdükçe kontrol zorlaşır</td></tr>
      <tr><td>B. Hazır yazılım (<span class="k">horizontal system</span>)</td><td>Hızlı, görece ucuz</td><td>Süreçlerimize tam uymayabilir</td></tr>
      <tr><td>C. Prototip: önce şubeler arası deneme, sonra büyütme</td><td>Risk küçük, çalışan geri bildirimiyle gelişir</td><td>Başta sınırlı özellik</td></tr>
      <tr><td>D. Güçlü bir yazılımcıyla özel sistem</td><td>En profesyonel, en verimli</td><td>En yüksek maliyet</td></tr>
      </table></div>
      <p style="margin-top:12px">Rakiplerin hangi sistemi, ne için kullandığını da inceleriz (<span class="k">research</span>).</p>`},
    {t:"Önerim ve ölçüm", h:"C ile başla, başarılıysa D'ye geç", body:`<p>Önce B'deki hazır çözümlerle maliyet karşılaştırması. Sonra C: prototiple başlamak. Prototip başarılı olursa D'ye geçmek.</p>
      <p><b>Başarıyı ölçerim:</b></p><ul><li>Gün sonu raporuna harcanan süre</li><li>Raporlardaki hata sayısı</li><li>Çalışanların sistemi gerçekten kullanma oranı</li></ul>`},
    {t:"Öğrendiğim", h:"Sistem kullanıcıya uymalı", body:`<p>Bir analist kararı analizden önce vermez. "Hiçbir şey yapma" da bir seçenektir. Ve en pahalı itiraz para değil, kullanılmayan sistemdir.</p>`}
   ]},
  {id:"toplanti", floor:3, name:"Toplantı Odası", dept:"Proje yönetimi", type:"scen", ch:"Ch3",
   q:"Prototip 3 aya sığar mı?", role:"Proje yöneticisi", other:"Yazılımcı, şube müdürleri, yatırımcı",
   concepts:["WBS","Predecessor / Successor","Concurrent tasks","Gantt chart","PERT/CPM","Critical path","Slack","Milestone","Project triangle","Scope creep","Risk matrix"],
   steps:[
    {t:"Sorun", h:"13 haftada bir prototip", body:`<p>Müdür odasındaki karar: Gün sonu sistemi için 3 ay (yaklaşık 13 hafta) içinde bir prototip yapılacak. Proje yöneticisi olarak işi parçalara bölüyorum (<span class="k">WBS</span>).</p>
      <div class="scroll"><table>
      <tr><th>Görev</th><th>Süre</th><th>Önce bitmesi gereken</th></tr>
      <tr><td>A. Çalışanlarla görüşme ve gözlem</td><td>2 hafta</td><td>–</td></tr>
      <tr><td>B. Rakip araştırması</td><td>1 hafta</td><td>–</td></tr>
      <tr><td>C. İhtiyaç listesini yazma</td><td>1 hafta</td><td>A, B</td></tr>
      <tr><td>D. Prototipi geliştirme</td><td>4 hafta</td><td>C</td></tr>
      <tr><td>E. Tabletleri temin etme</td><td>2 hafta</td><td>C</td></tr>
      <tr><td>F. Çalışan eğitimi</td><td>1 hafta</td><td>D, E</td></tr>
      <tr><td>G. 1 şubede deneme</td><td>2 hafta</td><td>F</td></tr>
      </table></div>`},
    {t:"Gantt", h:"Takvimde görevler", body:`<p>Mor çubuklar kritik yol, yeşiller esnek görevler, taralı kutular esneklik (<span class="k">slack</span>).</p>
      <div class="scroll"><div class="gantt" id="gantt"></div></div>`},
    {t:"Kritik yol", h:"10 hafta, 3 hafta pay", body:`<p>Bütün yolları yazıp topluyorum:</p>
      <ul><li><b>A → C → D → F → G = 2 + 1 + 4 + 1 + 2 = 10 hafta</b> (en uzun = <span class="k">critical path</span>)</li><li>B → C → D → F → G = 9 hafta</li><li>A → C → E → F → G = 8 hafta</li><li>B → C → E → F → G = 7 hafta</li></ul>
      <div class="callout">A ile B, D ile E aynı anda yürür. Tabletler 2 hafta gecikse proje etkilenmez; prototip 1 hafta gecikirse proje 1 hafta gecikir. Bu yüzden takibimi en çok D'de yoğunlaştırırım.</div>`},
    {t:"İletişim", h:"5. hafta: “Bir de sadakat programı ekleyelim”", body:`<p>Yatırımcı yeni bir özellik istiyor. Bu bir <span class="k">scope creep</span>.</p>
      <div class="quote real">“Güzel fikir. Ama şimdi eklersek ya süre uzar ya maliyet artar ya da kalite düşer. Sadakat programını 2. aşamaya yazalım. Önce gün sonu sistemini 10 haftada bitirip deneyelim, sonuçlara göre ekleyelim.”</div>
      <p>Fikri reddetmiyorum; <span class="k">project triangle</span> üzerinden etkisini açıklayıp doğru zamana taşıyorum.</p>`},
    {t:"Riskler", h:"Olasılık × etki", body:`<div class="scroll"><table>
      <tr><th>Risk</th><th>Olasılık</th><th>Etki</th><th>Önlem</th></tr>
      <tr><td>Tablet tedariki gecikir</td><td>Orta</td><td>Düşük</td><td>2 hafta slack var</td></tr>
      <tr><td>Prototip gecikir</td><td>Orta</td><td>Yüksek</td><td>Haftalık kontrol, kritik yolda</td></tr>
      <tr><td>Çalışanlar benimsemez</td><td>Orta</td><td>Yüksek</td><td>Eğitim + tek şubede deneme</td></tr>
      </table></div>`},
    {t:"Öğrendiğim", h:"Her göreve eşit dikkat verilmez", body:`<p>Proje yöneticisi kritik yola odaklanır. Yeni fikirlere "hayır" demek yerine etkisini açıklayıp doğru zamana taşır.</p>`}
   ]},
  {id:"muhasebe", floor:3, name:"Muhasebe", dept:"Finans", type:"soon", q:"Sorumlu yeni sisteme direnç gösteriyor"},
  {id:"yazilim", floor:2, name:"Yazılım Odası", dept:"IT", type:"real", ch:"Ch1, Ch6",
   q:"Uygulamam neden kullanılmadı?", role:"Ürün sahibi + geliştirici", other:"Kendim ve ileride şube çalışanları",
   concepts:["Object-oriented analysis","Class","Object / Instance","Attribute","Method","Cardinality","Use case diagram","Actor","Class diagram","Waterfall","Agile","Iteration","Prototype"],
   steps:[
    {t:"Sorun", h:"Doğru modellenmiş ama kullanılmayan bir uygulama", body:`<p>Gün sonu toplamlarını ve kâr–zararı takip etmek için OptiBean Yönetim Uygulaması'nı geliştirdim. İlk sürüm fazla karmaşıktı; deftere yazmak daha kolay geliyordu ve uygulama kullanımdan düştü.</p>`},
    {t:"Use case", h:"Kim, ne yapıyor?", body:`<pre>              ┌──────────── OptiBean Yönetim Uygulaması ────────────┐
 🧍 Mağaza ───┼──▶ ( Gün sonu satışını gir )                          │
   sahibi /   ├──▶ ( Ürün ekle / düzenle )                            │
   çalışan    ├──▶ ( Stok güncelle )                                  │
              ├──▶ ( Gider kaydet )                                   │
              ├──▶ ( Rapor görüntüle )                                │
              └──────────────────────────────────────────────────────┘</pre>
      <p style="margin-top:10px"><span class="k">Actor</span>: mağaza sahibi / çalışan. Her oval bir use case, adı fiil.</p>`},
    {t:"Sınıflar", h:"Uygulamanın nesneleri", body:`<div class="scroll"><table>
      <tr><th>Class</th><th>Attributes</th><th>Methods</th></tr>
      <tr><td>Ürün</td><td>ad, fiyat, kategori</td><td>fiyatGüncelle()</td></tr>
      <tr><td>Satış</td><td>tarih, tutar, ödeme kanalı (nakit / kart / Trendyol)</td><td>kanalaGöreAyır(), günSonuToplamı()</td></tr>
      <tr><td>Stok</td><td>miktar, minimum seviye</td><td>stokDüş()</td></tr>
      <tr><td>Gider</td><td>tarih, tutar, tür</td><td>giderEkle()</td></tr>
      <tr><td>Rapor</td><td>satış ve giderleri kullanır</td><td>kârHesapla(), aylıkRapor()</td></tr>
      </table></div>
      <div class="callout">"Yaban mersini" bir attribute değil, Ürün sınıfından bir <span class="k">object</span>. "15 Kasım kira ödemesi" de Gider sınıfından bir nesne. Bir ürünün çok satışı olabilir: <span class="k">1 — 0..*</span> (cardinality).</div>`},
    {t:"Yöntem", h:"Agile: deneyerek öğrenmek", body:`<ol><li>İlk sürümü yaptım (<span class="k">prototype</span>).</li><li>Gerçek kullanımda fazla karmaşık olduğunu gördüm (kullanıcı geri bildirimi).</li><li>Ekim 2026'da sadeleştirip yeniden kurdum: satış girişi ödeme kanalına göre gün sonu toplamına indi, raporlar otomatik oldu (<span class="k">iteration</span>).</li></ol>
      <p style="margin-top:12px"><span class="k">Waterfall</span>'da her şey baştan planlanıp tek seferde teslim edilir. Ben küçük adımlarla, kullanımdan öğrenerek ilerledim.</p>`},
    {t:"Öğrendiğim", h:"Model doğru, kullanıcı mutsuzsa sistem başarısız", body:`<p>Doğru modellenmiş bir sistem bile kullanıcıya ağır geliyorsa başarısızdır. Agile, bu hatayı erken görmemi ve düzeltmemi sağladı.</p>
      <p><b>Ölçüyorum:</b> Uygulamanın her gün kullanılıp kullanılmadığı, gün sonu girişinin süresi, gider kaydının eksiksiz olduğu gün oranı.</p>`}
   ]},
  {id:"uretim", floor:2, name:"Üretim", dept:"Üretim planlama", type:"soon", q:"Ne kadar üretmeli?"},
  {id:"depo", floor:2, name:"Depo", dept:"Stok ve tedarik", type:"soon", q:"Malzeme bitiyor, tedarikçi gecikiyor"},
  {id:"resepsiyon", floor:1, name:"Resepsiyon", dept:"Müşteri hizmetleri", type:"scen", ch:"Ch5",
   q:"Siparişim nerede?", role:"Sistem analisti", other:"Online sipariş veren müşteri",
   concepts:["DFD","Context diagram","External entity","Process","Data store","Data flow","Leveling","Balancing","Black hole","Gray hole","Spontaneous generation"],
   steps:[
    {t:"Sorun", h:"Cevapsız kalan bir telefon", body:`<p>OptiBean büyüdü; Trendyol ve telefonla günde onlarca sipariş geliyor. Bir müşteri şikâyet ediyor:</p>
      <div class="quote">“Siparişimi 2 saat önce verdim. Ne zaman geleceğini bilmiyorum. Aradım ama şube ‘kontrol edeyim’ deyip geri dönmedi.”</div>`},
    {t:"DFD", h:"Sipariş verisinin yolculuğu", body:`<p><span class="k">External entities</span>: müşteri, Trendyol, kurye · <span class="k">Data store</span>: satıcı paneli, aktif siparişler</p>
<pre>[MÜŞTERİ] ─sipariş─▶ [TRENDYOL] ─sipariş bilgisi─▶ (1. Siparişi al) ─▶ ▭ Aktif siparişler
                                                         │
                                                         ▼
                                                (2. Siparişi hazırla)
                                                         │
                                                         ▼
                              [KURYE] ◀─paket─ (3. Kuryeye teslim et)
                                 │
                            konum / durum
                                 ▼
                      (4. Teslimat durumunu takip et) ─▶ ▭ Aktif siparişler
                                 │
                                 ✖  eksik akış: sipariş durumu → müşteri
                                 ▼
                             [MÜŞTERİ]</pre>`},
    {t:"Bulgu", h:"Bir kara delik", body:`<p>4. adıma kuryeden durum bilgisi giriyor ama müşteriye hiçbir şey çıkmıyor. Müşteri aradığında da soru giriyor, cevap çıkmıyor. Bu bir <span class="k">black hole</span>.</p>
      <div class="callout">Kullanıcının şikâyeti DFD'de genelde eksik bir ok olarak görünür.</div>`},
    {t:"Çözüm", h:"Anlık ve kalıcı çözüm", body:`<p><b>Anlık (müşteri aradığında):</b> Satıcı panelinde sipariş saatine ve tahmini teslim aralığına bakarım. Kuryenin paketi alıp almadığını ve nerede olduğunu kontrol eder, gerekirse kuryeyi arayıp varış süresini sorarım. Panelin canlı desteğiyle müşteriye ulaşıp bilgiyi paylaşırım; isterse siparişi iptal ederim.</p>
      <p><b>Kalıcı (eksik oku eklemek):</b> Her aşamada durumu zamanında güncelleriz: <i>hazırlanıyor → hazırlandı → kuryeye teslim edildi → teslim edildi</i>. Müşteri bunları bildirim olarak alır ve kurye takibinden kuryeyi kendisi görür.</p>
      <div class="callout warn">Takip ekranı zaten vardı. Asıl sorun teknoloji değil, durumun zamanında güncellenmemesiydi. Bazen çözüm yeni yazılım değil, bir süreç kuralıdır.</div>`},
    {t:"Öğrendiğim", h:"Önce normal akışı çiz", body:`<p>Sorunu bulmak için önce normal akışı çizmek, sonra hangi bilginin kime ulaşmadığını aramak gerekir.</p>
      <p><b>Ölçüyorum:</b> "Siparişim nerede?" aramalarının sayısı, durumu geç güncellenen sipariş oranı, teslimat şikâyetleri.</p>`}
   ]},
  {id:"satis", floor:1, name:"Satış Katı", dept:"Şube operasyonu", type:"real", ch:"Ch1, Ch4",
   q:"Kâr–zararı neden ölçemiyordum?", role:"Kurucu + sistem analisti", other:"Gün sonunu yapan kişi (son kullanıcı)",
   concepts:["Data vs information","Operational feasibility","Fact-finding","Interview","Observation","Document review","Questionnaire","Sampling","Research","Open-ended question","Closed-ended question","Range-of-response question","Listening","End users"],
   steps:[
    {t:"Sorun", h:"Günlük kayıt doğru, aylık hesap yanlış", body:`<p>OptiBean'de gün sonunu ben yapıyordum. Günlük satışları kâğıda yazmak sorun değildi. Sorun, haftalık, aylık ve yıllık kâr–zararı çıkarmaktı: Her şeyi hesap makinesiyle tek tek topluyordum ve hata payı yükseliyordu. Giderleri her gün yazamadığım için veri eksik kalıyor, ölçümüm zayıf kalıyordu.</p>
      <div class="callout">Elimde <span class="k">data</span> (günlük satışlar) vardı, ama ihtiyacım olan <span class="k">information</span> (aylık kâr) değildi.</div>`},
    {t:"İlk deneme", h:"Fazla akıllı bir uygulama", body:`<p>İlk uygulamam fazla karmaşıktı. Kullanıcı ürküyor, kullanırken rahat hissetmiyordu; deftere yazmak daha mantıklı geliyordu. <span class="k">Operational feasibility</span> sağlanamamıştı.</p>
      <p>Ekim 2026'da yeniden kurdum: kolay arayüz, kolay takip. Satış girişi ödeme kanalına göre gün sonu toplamına indi; raporları uygulama hesaplıyor.</p>`},
    {t:"İhtiyaç toplama", h:"5 şube için nasıl dinlerdim", body:`<ol>
      <li><span class="k">Interview</span>: Gün sonunu yapan çalışanlarla birebir konuşur, süreci kendi ağızlarından dinlerim.</li>
      <li><span class="k">Observation</span>: İş başında izlerim. Nerede hata yapıyorlar, nerede güçlüler?</li>
      <li><span class="k">Document review</span>: Mevcut defterleri inceler, eksik ve fazla bilgileri not ederim.</li>
      <li><span class="k">Questionnaire</span>: Gözlemlerime göre soruları hazırlar, diğer çalışanlara anket olarak sunarım.</li>
      <li><span class="k">Sampling</span>: 2 şube ve rastgele seçilmiş 2 haftayı incelerim.</li>
      <li><span class="k">Research</span>: Rakiplerin bu süreci nasıl yönettiğine bakarım.</li></ol>`},
    {t:"Sorularım", h:"Dinle, netleştir, ölç", body:`<div class="scroll"><table>
      <tr><th>Tür</th><th>Soru</th></tr>
      <tr><td><span class="k">Open-ended</span></td><td>"Kâr–zarar hesabını ve stok takibini yaparken en çok nelerde zorlanıyorsunuz?"</td></tr>
      <tr><td><span class="k">Closed-ended</span></td><td>"Günlük stok azalımını not ediyor musunuz?" · "Giderleri analiz ediyor musunuz?" · "Raporlamaya ortalama ne kadar zaman ayırıyorsunuz?"</td></tr>
      <tr><td><span class="k">Range-of-response</span></td><td>"Şu anki gün sonu yönteminin ne kadar kolay olduğunu 1–10 arasında puanlar mısınız?"</td></tr>
      </table></div>
      <div class="callout">Ölçekli soruyu yeni sistemden sonra tekrar sorarım; iyileşmeyi böyle ölçerim.</div>`},
    {t:"Öğrendiğim", h:"Sorun kayıt tutmak değildi", body:`<div class="quote real">“Benim sorunum kayıt tutmak değil, kaydı bilgiye dönüştürmekti. En iyi sistem en çok özelliği olan değil, kullanıcının gerçekten kullandığı sistemdir.”</div>
      <p><b>Ölçüyorum:</b> Raporlamaya harcanan süre, hesap hatası sayısı, gider kaydının eksiksiz olduğu gün oranı, 1–10 kolaylık puanı.</p>`}
   ]},
  {id:"vitrin", floor:1, name:"Vitrin", dept:"Müşteri deneyimi", type:"soon", q:"Kararsız çocuk, endişeli anne"}
];
