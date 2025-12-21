# AISA — AI Customer Service Pariwisata Kabupaten Sidoarjo 🌏🤖

**AISA** adalah **AI Customer Service berbasis web** dengan **avatar perempuan 2D interaktif** yang dikembangkan untuk **Dinas Pariwisata Kabupaten Sidoarjo**.  
Aplikasi ini bertujuan memberikan **informasi lengkap, akurat, dan ramah** mengenai pariwisata Sidoarjo kepada masyarakat dan wisatawan.

---

## 🎯 Tujuan Aplikasi
- Menjadi **front-office digital** Dinas Pariwisata Sidoarjo
- Menyampaikan informasi wisata secara cepat dan konsisten
- Mendukung program **Smart Tourism & Transformasi Digital**
- Mengurangi beban pertanyaan manual petugas

---

## 👩‍💼 Tentang AISA
- **Nama AI:** AISA  
- **Peran:** Asisten Informasi Pariwisata Resmi  
- **Karakter:** Ramah, informatif, netral, profesional  
- **Bahasa:** Bahasa Indonesia (formal ringan)  
- **Avatar:** Perempuan 2D (Lottie Animation)

AISA **tidak memberikan opini pribadi** dan **tidak menggantikan peran pejabat atau petugas**, melainkan membantu masyarakat mendapatkan informasi.

---

## 🗺️ Cakupan Informasi
AISA mampu menjelaskan:

### ✅ Pariwisata Kabupaten Sidoarjo
- Wisata alam
- Wisata budaya
- Wisata religi
- Wisata kuliner
- Event & festival daerah

### ✅ Wisata per Kecamatan
- Informasi destinasi wisata di setiap kecamatan
- Deskripsi singkat & keunikan lokal
- Akses & rekomendasi kunjungan

### ✅ Informasi Umum
- Lokasi & potensi wisata
- Jam operasional (jika tersedia)
- Edukasi budaya & sejarah Sidoarjo
- Arahkan ke Dinas Pariwisata bila perlu konfirmasi resmi

---

## 🧠 Knowledge Base
Aplikasi ini menggunakan **Knowledge Base berbentuk CSV** yang berisi:
- Kecamatan
- Nama wisata
- Jenis wisata
- Deskripsi
- Alamat
- Catatan tambahan

Knowledge base dapat dikembangkan menjadi:
- Vector Database (RAG)
- Integrasi CMS pariwisata
- Dashboard admin

---

## 🧩 Arsitektur Sistem
```

Frontend (Web)

* React + Vite
* Lottie Avatar 2D
* Web Speech API
  │
  ▼
  Backend (FastAPI)
* WebSocket Real-time
* AI Prompt & Logic
* Knowledge Base CSV
  │
  ▼
  AI Engine
* NLP & Reasoning
* Contextual Response

````

---

## 🖥️ Teknologi yang Digunakan

### Frontend
- React
- Vite
- Lottie-react
- Web Speech API

### Backend
- Python FastAPI
- WebSocket
- CSV-based Knowledge Base

### AI
- LLM (Cloud / Local)
- System Prompt khusus Dinas Pariwisata

---

## 🚀 Cara Menjalankan Aplikasi

### 1️⃣ Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
````

### 2️⃣ Frontend

```bash
cd frontend
npm install
npm run dev
```

Akses aplikasi di:

```
http://localhost:5173
```

---

## 🔐 Etika & Batasan AI

AISA **TIDAK BOLEH**:

* Memberikan data sensitif
* Memberikan keputusan kebijakan
* Mengatasnamakan pejabat pemerintah

AISA **BOLEH**:

* Memberikan informasi publik
* Edukasi pariwisata
* Mengarahkan ke kanal resmi Dinas Pariwisata

---

## 📈 Rencana Pengembangan

* Integrasi peta wisata interaktif
* Multibahasa (EN / ID)
* Mode suara untuk lansia & disabilitas
* Dashboard admin pariwisata
* Integrasi event kalender daerah

---

## 🏛️ Penggunaan Resmi

Aplikasi ini dirancang untuk:

* Demo internal Dinas Pariwisata
* Pilot project Smart City
* Presentasi pimpinan daerah
* Pengembangan layanan publik digital

---

## 📄 Lisensi

Proyek ini menggunakan lisensi **MIT**
Bebas digunakan dan dikembangkan dengan tetap menghormati etika pelayanan publik.

---

## 🤝 Kontribusi

Kontribusi terbuka untuk:

* Pengayaan data wisata
* Peningkatan UI/UX
* Optimasi AI & knowledge base

Silakan buat **Pull Request** atau **Issue**.

---

## ✨ Penutup

**AISA** adalah langkah nyata menuju **Pariwisata Sidoarjo yang cerdas, ramah, dan inklusif** melalui teknologi AI.

> *“Teknologi melayani, budaya tetap utama.”*

---
