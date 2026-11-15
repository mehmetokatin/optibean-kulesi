# OptiBean Kulesi

Mehmet Okatın'ın interaktif kişisel sitesi. 9 katlı, sarmal bir kule: her kat bir departman, her katta bir sorun ve adım adım çözümü. Katlar ACM 213 (Systems Analysis & Design) kavramlarını gerçek bir işletme üzerinde kullanır.

Her kat açıkça etiketlidir: **Gerçek vaka** (kendi deneyimim) ya da **Senaryo** ("OptiBean 5 şubeye büyürse" kurgusu).

## Dosyalar

| Dosya | İçerik |
|---|---|
| `index.html` | Sayfa iskeleti |
| `css/style.css` | Görünüm (gündüz / gece renkleri, paneller) |
| `js/data.js` | Kat metinleri ve kavram sözlüğü |
| `js/tower.js` | 3D kule ve arayüz |

Kurulum ya da derleme adımı yok. 3D için Three.js internetten yüklenir; yüklenemezse site liste görünümüyle çalışır.

## Bilgisayarda açmak

`index.html` dosyasını tarayıcıda aç. VS Code'da Live Server eklentisi varsa dosyaya sağ tıklayıp "Open with Live Server" de; kaydettikçe sayfa yenilenir.

## Yayınlamak (GitHub Pages)

1. VS Code'da bu klasörü aç, soldaki Source Control bölümünden "Publish to GitHub" ile herkese açık bir depo oluştur (örnek ad: `optibean-kulesi`).
2. GitHub'da deponun Settings > Pages bölümünde kaynak olarak `main` dalını ve `/ (root)` klasörünü seç.
3. Birkaç dakika sonra site `https://<kullanıcı-adın>.github.io/optibean-kulesi/` adresinde açılır.

Sonraki değişikliklerde commit ve sync yeterli; site kendiliğinden güncellenir.

## Yeni kat açmak

1. `js/data.js` içinde katı bul. `type` alanını `"real"` ya da `"scen"` yap; `role`, `other`, `ch`, `concepts` ve `steps` alanlarını doldur.
2. Yeni kavramlar kullandıysan aynı dosyadaki `GLOSSARY` listesine Türkçe açıklamasını ekle.
3. İç mekân için `js/tower.js` içindeki `furnish()` fonksiyonuna o kata özel mobilya ekle. Eklemezsen kat boş görünür.
