# OBDrive 🔧

[🇬🇧 English](#english) | [🇹🇷 Türkçe](#türkçe)

---

## English

A vehicle diagnostics system. Reads real-time data from vehicles using an ELM327 OBD-II device, analyzes fault codes, and provides AI-powered fault diagnosis.

### Features

- 🚗 Vehicle profile selection (Brand, Year, Fuel Type)
- 📊 Real-time data (RPM, Engine Temperature, Speed)
- ⚠️ OBD-II fault code reading and clearing
- 🤖 Automatic fault analysis powered by Gemini AI
- 🧪 ELM327 emulator for development and testing

### Installation

**Requirements**
- Node.js 18+
- MongoDB Atlas account
- Google Gemini API Key
- ELM327 OBD-II device (optional, can be tested with emulator)

**Steps**

1. Clone the repository
```bash
git clone https://github.com/burakaltinbicak/obddrive.git
cd obddrive
```

2. Install dashboard dependencies
```bash
cd obd-dashboard
npm install
```

3. Create `.env.local` file
```
MONGODB_URI=mongodb+srv://...
GEMINI_API_KEY=your_api_key
```

4. Start the application
```bash
npm run dev
```

**Testing with Emulator**

To test without a real ELM327 device:

```bash
cd obd-emulator
node index.js
```

The emulator runs at `127.0.0.1:35000` and generates random OBD data.

### Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB Atlas
- **AI**: Google Gemini API
- **OBD**: ELM327 protocol

---

## Türkçe

Araç diagnostik sistemi. ELM327 OBD-II cihazı ile araçlardan gerçek zamanlı veri okur, hata kodlarını analiz eder ve yapay zeka destekli arıza teşhisi yapar.

### Özellikler

- 🚗 Araç profili seçimi (Marka, Yıl, Yakıt Tipi)
- 📊 Gerçek zamanlı veri (RPM, Motor Sıcaklığı, Hız)
- ⚠️ OBD-II hata kodu okuma ve temizleme
- 🤖 Gemini AI destekli otomatik arıza analizi
- 🧪 Geliştirme için ELM327 emülatörü

### Kurulum

**Gereksinimler**
- Node.js 18+
- MongoDB Atlas hesabı
- Google Gemini API Key
- ELM327 OBD-II cihazı (opsiyonel, emülatör ile test edilebilir)

**Adımlar**

1. Repoyu klonla
```bash
git clone https://github.com/burakaltinbicak/obddrive.git
cd obddrive
```

2. Dashboard bağımlılıklarını yükle
```bash
cd obd-dashboard
npm install
```

3. `.env.local` dosyası oluştur
```
MONGODB_URI=mongodb+srv://...
GEMINI_API_KEY=your_api_key
```

4. Uygulamayı başlat
```bash
npm run dev
```

**Emülatör ile Test**

Gerçek ELM327 cihazı olmadan test etmek için:

```bash
cd obd-emulator
node index.js
```

Emülatör `127.0.0.1:35000` adresinde çalışır ve rastgele OBD verileri üretir.

### Teknolojiler

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Veritabanı**: MongoDB Atlas
- **Yapay Zeka**: Google Gemini API
- **OBD**: ELM327 protokolü

---

## License / Lisans

MIT
