
# 🛡️ SentinelFocus: Privacy-First Deep Work Assistant

**SentinelFocus**, bilgisayar kameranızı kullanarak çalışma verimliliğinizi optimize eden, duruşunuzu düzelten ve gizliliğinizi koruyan **Edge-AI** tabanlı bir masaüstü/web asistanıdır. En önemli özelliği; tüm görüntü işleme süreçlerinin **sunucuya gitmeden, tamamen tarayıcınızda (client-side)** gerçekleşmesidir.

---

## 🚀 Temel Özellikler

### 1. 🧘 Duruş (Posture) Takibi

Kambur durduğunuzda veya ergonomik olmayan bir pozisyona geçtiğinizde sizi uyarır. Boyun ve sırt ağrılarını engellemek için gerçek zamanlı iskelet analizi yapar.

### 2. 📱 Odak Dağıtıcı Tespiti (Phone Detection)

Çalışma sırasında elinizde bir akıllı telefon veya tablet tespit edilirse, "Odak modundan çıkıyorsun!" uyarısı gönderir ve odak sürenizi duraklatır.

### 3. 👤 Gizlilik Kalkanı (Privacy Shield)

Arka planda (odanın kapısında veya arkanızda) yetkisiz bir kişi belirdiğinde;

* Ekranı otomatik olarak bulanıklaştırır (Blur).
* Gelen bildirimleri gizler.
* Hassas verileri koruma altına alır.

### 4. 👀 Göz Yorgunluğu ve Mola Hatırlatıcı

Göz kırpma sıklığınızı ve ekrana olan mesafenizi ölçerek 20-20-20 kuralına göre mola vermenizi önerir.

---

## 🏗️ Teknik Mimari

Proje, düşük gecikme süresi ve yüksek gizlilik için **Edge Computing** prensiplerine dayanır:

* **Core AI:** `TensorFlow.js`
* **Modeller:**
* **PoseNet / MoveNet:** Duruş ve iskelet takibi için.
* **COCO-SSD:** Telefon ve nesne algılama için.
* **Face-api.js:** Göz yorgunluğu ve yüz analizi için.


* **Frontend:** Next.js & Tailwind CSS
* **Local Storage:** `IndexedDB` (Kullanıcının sadece anonimleşmiş verimlilik istatistiklerini tutmak için).
* **Worker:** `Web Workers` (Görüntü işleme yükünü ana thread'den ayırmak için).

---

## 🛠️ Kurulum ve Çalıştırma

```bash
# Repoyu klonlayın
git clone https://github.com/kullaniciadiniz/sentinel-focus.git

# Bağımlılıkları yükleyin
npm install

# Modelleri indirin ve yerel dizine alın
npm run download-models

# Uygulamayı başlatın
npm run dev

```

---

## 📊 Nasıl Çalışır? (Mantıksal Akış)

1. **Görüntü Yakalama:** Tarayıcı üzerinden `getUserMedia` ile düşük çözünürlüklü (performans için) stream alınır.
2. **Paralel İşleme:** Alınan frame'ler 3 ayrı modele gönderilir:
* *Model A (Pose):* Omuz ve kulak hizasını kontrol et.
* *Model B (Object):* `cell phone` sınıfını %70 güvenle ara.
* *Model C (Face):* Odada birden fazla `human face` var mı kontrol et.


3. **Aksiyon Tetikleme:** Eğer anomali tespit edilirse (Örn: `person_count > 1`), CSS `backdrop-filter: blur(20px)` sınıfı aktif edilir.

---

## 🛡️ Gizlilik Beyanı

SentinelFocus **asla**:

* Görüntüleri bir sunucuya yüklemez.
* Kameranızı izinsiz açmaz.
* Verilerinizi üçüncü taraf analiz araçlarıyla paylaşmaz.
Her şey sizin cihazınızda başlar ve sizin cihazınızda biter.

---

## 📈 Gelecek Planları (Roadmap)

* [ ] Spotify entegrasyonu (Odak dağıldığında müziği değiştirme).
* [ ] VS Code Eklentisi (Kod yazma hızına göre odak analizi).
* [ ] Electron.js ile native masaüstü uygulamasına geçiş.

---

## 🤝 Katkıda Bulunun

Vizyonumuza ortak olmak isterseniz, lütfen bir `Issue` açın veya `Pull Request` gönderin. Özellikle model optimizasyonu konularındaki katkılarınızı bekliyoruz!

