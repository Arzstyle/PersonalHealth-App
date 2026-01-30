# 🏋️ Personal Health Mobile

<div align="center">

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![GROQ AI](https://img.shields.io/badge/GROQ_AI-00D4AA?style=for-the-badge&logo=openai&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Aplikasi Mobile Health & Fitness berbasis GROQ AI untuk Perencanaan Meal Plan Adaptif**

*Best Practice Research Project - Metode Penelitian*

</div>

---

## 👨‍💻 Author & Developer

<div align="center">

### Muhamad Akbar Rizky Saputra

**Mahasiswa Nusa Putra University**

Passionate di bidang **fitness**, **teknologi**, dan **health-tech development**.

Aktif di lingkungan gym dan mengembangkan solusi untuk membantu masyarakat Indonesia memahami nutrisi dengan lebih baik.

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/[username])
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/[username])
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://instagram.com/[username])

</div>

---

<div align="center">

[Demo](#demo) • [Fitur](#-fitur-utama) • [Instalasi](#-getting-started) • [Dokumentasi](#-dokumentasi-teknis)

</div>

---

## 📋 Daftar Isi

- [Author & Developer](#-author--developer)

- [Tentang Project](#-tentang-project)
- [Latar Belakang Penelitian](#-latar-belakang-penelitian)
- [Tujuan Pengembangan](#-tujuan-pengembangan)
- [Masalah yang Diselesaikan](#-masalah-yang-diselesaikan)
- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Arsitektur Sistem](#-arsitektur-sistem)
- [Getting Started](#-getting-started)
- [Struktur Project](#-struktur-project)
- [Dokumentasi Teknis](#-dokumentasi-teknis)
- [Penelitian Terkait](#-penelitian-terkait)
- [Roadmap](#-roadmap)

---

## 📖 Tentang Project

**Personal Health Mobile** adalah aplikasi mobile health dan fitness yang dikembangkan sebagai implementasi lanjutan dari penelitian berjudul:

> **"Pengembangan Aplikasi Web Berbasis GROQ AI Untuk Mengatasi Masalah Akurasi dan Personalisasi Perencanaan Secara Adaptif"**

Penelitian ini telah menjadi **best practice** dalam mata kuliah Metode Penelitian di Nusa Putra University. Aplikasi ini merupakan evolusi dan adaptasi mobile dari sistem yang telah dikembangkan sebelumnya dalam bentuk web application.

### Mengapa Mobile?

Pengembangan versi mobile ini didasari oleh kebutuhan pengguna, khususnya komunitas fitness dan gym-goers, yang membutuhkan:

1. **Akses Instan** - Kemampuan untuk mencatat asupan makanan langsung setelah makan
2. **Portabilitas** - Dapat digunakan di mana saja, terutama di gym atau restoran
3. **Offline Capability** - Database lokal untuk akses tanpa internet
4. **Quick Input** - Interface yang dioptimalkan untuk input cepat dengan satu tangan

---

## 🔬 Latar Belakang Penelitian

### Konteks Permasalahan

Di era modern ini, kesadaran masyarakat terhadap kesehatan dan fitness semakin meningkat. Namun, terdapat gap yang signifikan antara keinginan untuk hidup sehat dengan tools yang tersedia:

1. **Masyarakat awam tidak memahami kebutuhan gizi harian** - Banyak orang tidak tahu berapa kalori, protein, dan nutrisi yang mereka butuhkan setiap hari
2. **Aplikasi internasional** tidak memiliki database makanan Indonesia yang lengkap
3. **Kalkulasi nutrisi** sering tidak akurat untuk porsi makanan lokal
4. **Rekomendasi diet** bersifat generik dan tidak personalized
5. **User experience** tidak dioptimalkan untuk pengguna aktif (gym-goers)
6. **Kurangnya edukasi gizi** - Tidak ada panduan yang mudah dipahami untuk merencanakan pola makan sehat

### Solusi yang Diajukan

Penelitian ini mengusulkan pengembangan sistem berbasis **Artificial Intelligence (GROQ/Llama 3)** yang dapat:

- Memahami konteks makanan Indonesia
- Memberikan estimasi nutrisi yang lebih akurat
- Menghasilkan meal plan yang dipersonalisasi
- Beradaptasi dengan perubahan goal pengguna

### Status Penelitian

| Aspek | Status |
|-------|--------|
| Penelitian | ✅ Completed |
| Paper | ✅ Best Practice |
| Prototype Web | ✅ Completed |
| Prototype Mobile | ✅ In Development |

---

## 🎯 Tujuan Pengembangan

### A. Tujuan Umum

Menghadirkan solusi perencanaan meal plan berbasis AI yang dapat diakses melalui smartphone, dengan fokus pada kebutuhan pengguna aktif di lingkungan gym dan fitness.

### B. Tujuan Khusus

#### 1. Meningkatkan Aksesibilitas
- Mengembangkan aplikasi mobile yang ringan dan responsif
- Optimasi untuk penggunaan di berbagai kondisi (gym, outdoor, restoran)
- Support untuk offline mode dengan local database

#### 2. Personalisasi Berbasis AI
- Integrasi GROQ AI (Llama 3) untuk meal plan generation
- Kalkulasi BMR dan TDEE berdasarkan data antropometri
- Adaptasi rekomendasi berdasarkan goal (cutting, bulking, maintenance)

#### 3. Akurasi Data Nutrisi
- Database lokal dengan 500+ makanan Indonesia
- AI-powered search untuk makanan yang tidak ada di database
- Validasi dan cross-check nutrisi dari multiple sources

#### 4. User Experience Optimal
- Mobile-first design dengan gesture navigation
- Quick add feature untuk input cepat
- Dark theme untuk kenyamanan mata di berbagai kondisi

#### 5. Seamless Integration
- Firebase Authentication untuk keamanan
- Cloud sync untuk backup data
- Cross-device compatibility

---

## ⚠️ Masalah yang Diselesaikan

### Problem 1: Ketidakakuratan Database Makanan Lokal

**Deskripsi Masalah:**
Aplikasi kesehatan internasional seperti MyFitnessPal, Lifesum, atau Yazio memiliki database makanan yang didominasi oleh makanan Barat. Makanan Indonesia seperti Nasi Uduk, Rendang, Gado-gado, atau Soto seringkali tidak tersedia atau memiliki data nutrisi yang tidak akurat.

**Dampak:**
- Pengguna kesulitan mencatat asupan harian
- Estimasi kalori menjadi tidak akurat
- Tracking progress menjadi tidak reliable

**Solusi yang Diimplementasikan:**
```
┌─────────────────────────────────────────────────────────────┐
│                    HYBRID SEARCH SYSTEM                      │
├─────────────────────────────────────────────────────────────┤
│  User Input → Local Database Search (500+ Indonesian Foods) │
│       ↓                                                      │
│  Not Found? → GROQ AI Search (Global + Context Understanding)│
│       ↓                                                      │
│  AI Response → Validated Nutritional Data                    │
└─────────────────────────────────────────────────────────────┘
```

---

### Problem 2: Kurangnya Personalisasi

**Deskripsi Masalah:**
Aplikasi diet konvensional memberikan rekomendasi yang sama untuk semua pengguna, tanpa mempertimbangkan:
- Perbedaan metabolisme (BMR)
- Tingkat aktivitas fisik (TDEE)
- Goal spesifik (fat loss, muscle gain, maintenance)
- Preferensi makanan dan restricsi diet

**Dampak:**
- Rekomendasi tidak sesuai kebutuhan individu
- Progress lambat atau tidak tercapai
- User frustration dan abandonment

**Solusi yang Diimplementasikan:**

**A. Metabolic Profile System**
```typescript
// Mifflin-St Jeor Equation untuk BMR
BMR (Pria) = (10 × berat[kg]) + (6.25 × tinggi[cm]) - (5 × umur) + 5
BMR (Wanita) = (10 × berat[kg]) + (6.25 × tinggi[cm]) - (5 × umur) - 161

// TDEE Calculation
TDEE = BMR × Activity Factor
- Sedentary (1.2)
- Light (1.375)
- Moderate (1.55)
- Active (1.725)
- Very Active (1.9)
```

**B. Goal-Based Adjustment**
| Goal | Kalori Adjustment | Protein Target |
|------|-------------------|----------------|
| Cutting | TDEE - 500 kcal | 2.0g per kg body weight |
| Maintenance | TDEE | 1.6g per kg body weight |
| Bulking | TDEE + 300 kcal | 1.8g per kg body weight |

---

### Problem 3: Keterbatasan Akses di Lingkungan Gym

**Deskripsi Masalah:**
Pengguna yang aktif berolahraga di gym membutuhkan kemudahan akses:
- Tangan berkeringat, sulit mengetik panjang
- Perlu input cepat antara set latihan
- Ingin cek makanan sebelum makan di food court gym

**Dampak:**
- Pengguna malas mencatat karena prosesnya lama
- Data asupan menjadi tidak lengkap
- Tracking tidak konsisten

**Solusi yang Diimplementasikan:**
- **Quick Search** - Pencarian dengan 1-2 kata
- **Recent Foods** - Akses cepat makanan yang sering dikonsumsi
- **One-Tap Add** - Tambah makanan dengan satu ketukan
- **Big Buttons** - UI element besar untuk kemudahan tap
- **Haptic Feedback** - Konfirmasi action tanpa lihat layar

---

### Problem 4: Kurangnya Adaptabilitas

**Deskripsi Masalah:**
Goal fitness seseorang dapat berubah seiring waktu:
- Fase cutting sebelum kompetisi
- Fase bulking untuk masa otot
- Maintenance setelah mencapai target

Aplikasi konvensional tidak dapat dengan mudah beradaptasi dengan perubahan ini.

**Solusi yang Diimplementasikan:**
- **Goal Selector** - Switch goal dengan satu tap
- **Dynamic Recalculation** - Kalori dan macro otomatis terupdate
- **AI Re-generation** - Meal plan baru sesuai goal baru

---

### Problem 5: Kurangnya Pemahaman Gizi Masyarakat Awam

**Deskripsi Masalah:**
Mayoritas masyarakat Indonesia, terutama yang bukan dari background kesehatan atau fitness, tidak memiliki pemahaman yang cukup tentang:
- Kebutuhan kalori harian berdasarkan aktivitas
- Pentingnya keseimbangan makronutrien (protein, karbohidrat, lemak)
- Cara membaca dan menghitung nilai gizi makanan
- Dampak pola makan tidak seimbang terhadap kesehatan jangka panjang

**Dampak:**
- Obesitas dan masalah kesehatan akibat pola makan buruk
- Kesulitan menurunkan atau menaikkan berat badan
- Tidak ada panduan yang mudah diakses dan dipahami
- Ketergantungan pada informasi yang tidak akurat dari internet

**Solusi yang Diimplementasikan:**
- **Visual Calorie Ring** - Tampilan visual yang mudah dipahami untuk tracking kalori
- **Edukasi melalui AI** - AI memberikan penjelasan tentang makanan dan nutrisinya
- **Indonesian Food Database** - Database makanan lokal dengan informasi lengkap
- **Simple Macro Display** - Tampilan sederhana protein, carbs, fat tanpa istilah teknis berlebihan
- **Goal-based Recommendations** - Rekomendasi disesuaikan tujuan (turun berat, naik berat, maintain)

---

## ✨ Fitur Utama

### 🏠 Hub (Dashboard)

Dashboard utama yang menampilkan overview kesehatan harian dengan design modern dan informatif.

**Components:**
| Component | Fungsi |
|-----------|--------|
| Calorie Ring | Circular progress bar untuk visualisasi kalori consumed vs target |
| Macro Stats | Breakdown protein, carbs, fat dalam gram dan persentase |
| Health Stats | Widget untuk tracking water intake, steps, sleep |
| Quick Actions | Shortcut buttons ke fitur yang sering digunakan |

**Visual Design:**
- Dark gradient background dengan accent cyan/violet
- Glassmorphism cards untuk depth
- Animated progress indicators
- Grid texture untuk aesthetic modern

---

### 🔍 Food Search Engine

Sistem pencarian makanan hybrid yang menggabungkan local database dan AI.

**Search Flow:**
```
User Input: "nasi goreng"
      ↓
Step 1: Local Database Search
      → Match found: Nasi Goreng Telur (350 kcal)
      → Match found: Nasi Goreng Seafood (420 kcal)
      → Match found: Nasi Goreng Kampung (380 kcal)
      ↓
Result: Display local matches instantly

---

User Input: "quinoa salad with chicken"
      ↓
Step 1: Local Database Search
      → No match found
      ↓
Step 2: GROQ AI Search
      → AI generates nutritional estimate
      → Calories: 450, Protein: 35g, Carbs: 40g, Fat: 15g
      ↓
Result: Display AI-generated result
```

**Features:**
- Real-time search dengan debounce
- Loading state dengan skeleton animation
- AI indicator untuk non-local results
- Error handling dengan retry option

---

### 🍽️ Nutrition Planner

Sistem meal planning yang comprehensive dengan AI integration.

**Meal Categories:**
- 🌅 Breakfast (Sarapan)
- 🌞 Lunch (Makan Siang)
- 🌙 Dinner (Makan Malam)
- 🍎 Snacks (Camilan)

**AI Meal Plan Generation:**
```
Input Parameters:
- Target Calories: 2000 kcal
- Macro Split: 40% Carbs, 30% Protein, 30% Fat
- Goal: Maintenance
- Preference: Indonesian foods
- Restrictions: None

AI Output:
├── Breakfast: Nasi Uduk, Telur Dadar, Tempe Goreng (500 kcal)
├── Lunch: Ayam Bakar, Nasi Merah, Sayur Asem (600 kcal)
├── Dinner: Ikan Panggang, Capcay, Nasi Putih (550 kcal)
└── Snacks: Pisang, Greek Yogurt (350 kcal)
```

**Features:**
- Swipe-to-complete meal items
- Daily summary dengan visual charts
- Week view untuk meal planning
- Export to PDF/Share functionality

---

### 💪 Training Module

Modul latihan untuk tracking workout sessions.

**Workout Types:**
- 🏠 Home Workout
- 🏋️ Gym Workout
- 🏃 Cardio
- 🧘 Flexibility

**Features:**
- Pre-built workout templates
- Exercise library dengan instructions
- Set dan rep tracking
- Rest timer dengan notification

---

### 👤 Profile & Settings

Manajemen profil pengguna dan pengaturan aplikasi.

**Profile Data:**
- Personal info (nama, umur, gender)
- Body metrics (tinggi, berat, body fat %)
- Activity level selection
- Goal configuration

**Settings:**
- Theme (Dark/Light/Auto)
- Language (ID/EN)
- Notification preferences
- Data sync options
- Privacy settings

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React Native | 0.74+ | Mobile framework |
| Expo | SDK 51 | Development platform |
| TypeScript | 5.x | Type safety |
| NativeWind | 4.x | TailwindCSS for RN |
| React Navigation | 6.x | Navigation system |
| Expo Router | 3.x | File-based routing |

### Backend & Services

| Technology | Purpose |
|------------|---------|
| Firebase Auth | User authentication |
| Firebase Firestore | Cloud database |
| GROQ API | AI meal planning |
| AsyncStorage | Local data persistence |

### AI & ML

| Service | Model | Purpose |
|---------|-------|---------|
| GROQ | Llama 3 70B | Meal plan generation |
| GROQ | Llama 3 8B | Food search & nutrition estimation |

### Development Tools

| Tool | Purpose |
|------|---------|
| ESLint | Code linting |
| Prettier | Code formatting |
| Jest | Unit testing |
| Metro | JavaScript bundler |

---

## 🏗️ Arsitektur Sistem

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        PERSONAL HEALTH MOBILE                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │   Screens   │    │  Components │    │   Context   │         │
│  │  (Pages)    │◄──►│  (UI Parts) │◄──►│  (State)    │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
│         │                  │                  │                 │
│         ▼                  ▼                  ▼                 │
│  ┌──────────────────────────────────────────────────┐          │
│  │                    SERVICES LAYER                 │          │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐       │          │
│  │  │ Firebase │  │ GROQ AI  │  │  Local   │       │          │
│  │  │   Auth   │  │  Service │  │ Storage  │       │          │
│  │  └──────────┘  └──────────┘  └──────────┘       │          │
│  └──────────────────────────────────────────────────┘          │
│                              │                                  │
└──────────────────────────────┼──────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│                        EXTERNAL SERVICES                          │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐          │
│  │  Firebase   │    │   GROQ API  │    │  Local DB   │          │
│  │   Cloud     │    │  (Llama 3)  │    │ (nutrition) │          │
│  └─────────────┘    └─────────────┘    └─────────────┘          │
└──────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Action
     │
     ▼
┌─────────────────┐
│   UI Component  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Context/State  │ ◄── useMemo, useCallback (Optimization)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Services     │
├─────────────────┤
│ • Firebase      │
│ • GROQ AI       │
│ • AsyncStorage  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Data Response  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   UI Update     │ ◄── React.memo (Optimization)
└─────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

Sebelum memulai, pastikan komputer Anda sudah terinstall:

| Software | Minimum Version | Download |
|----------|-----------------|----------|
| Node.js | 18.0+ | [nodejs.org](https://nodejs.org) |
| npm | 9.0+ | Included with Node.js |
| Git | 2.0+ | [git-scm.com](https://git-scm.com) |
| Expo Go | Latest | App Store / Play Store |

### Installation Steps

#### Step 1: Clone Repository

```bash
git clone https://github.com/Arzstyle/PersonalHealth-App.git
cd PersonalHealth-App
```

#### Step 2: Install Dependencies

```bash
npm install
```

#### Step 3: Environment Setup

Buat file `.env` di root directory:

```env
# GROQ AI Configuration
GROQ_API_KEY=gsk_your_groq_api_key_here
GROQ_API_URL=https://api.groq.com/openai/v1/chat/completions

# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abcdef
```

#### Step 4: Run Development Server

```bash
npx expo start
```

#### Step 5: Open on Device

1. Install **Expo Go** app pada smartphone
2. Scan QR code yang muncul di terminal
3. Aplikasi akan terbuka di Expo Go

### Alternative: Run on Simulator

```bash
# iOS Simulator (macOS only)
npx expo start --ios

# Android Emulator
npx expo start --android
```

---

## 📁 Struktur Project

```
PersonalHealth-App/
│
├── 📁 assets/                    # Static assets
│   ├── 📁 images/               # App images
│   ├── 📁 fonts/                # Custom fonts
│   └── 📁 icons/                # App icons
│
├── 📁 src/                       # Source code
│   │
│   ├── 📁 components/           # Reusable components
│   │   ├── 📁 common/           # Generic components
│   │   │   ├── Button.tsx       # Custom button (React.memo optimized)
│   │   │   ├── Input.tsx        # Form inputs
│   │   │   └── Card.tsx         # Card container
│   │   │
│   │   ├── 📁 hub/              # Dashboard components
│   │   │   ├── HubHeader.tsx    # Dashboard header
│   │   │   ├── CalorieRing.tsx  # Calorie progress ring
│   │   │   ├── MacroStats.tsx   # Macro breakdown
│   │   │   └── DashboardWidgets.tsx
│   │   │
│   │   └── 📁 nutrition/        # Nutrition components
│   │       ├── FoodCard.tsx     # Food item card
│   │       └── MealSection.tsx  # Meal category section
│   │
│   ├── 📁 screens/              # Screen components
│   │   ├── 📁 main/             # Main app screens
│   │   │   ├── HubScreen.tsx    # Dashboard
│   │   │   ├── SearchScreen.tsx # Food search (useCallback optimized)
│   │   │   ├── NutritionScreen.tsx # Meal planner (useMemo optimized)
│   │   │   ├── TrainingScreen.tsx  # Workout
│   │   │   └── IdentityScreen.tsx  # Profile
│   │   │
│   │   └── 📁 onboarding/       # Auth & onboarding
│   │       ├── WelcomeScreen.tsx
│   │       ├── LoginScreen.tsx
│   │       ├── RegisterScreen.tsx
│   │       ├── BodyMetricsScreen.tsx
│   │       └── MetabolicProfileScreen.tsx (useMemo optimized)
│   │
│   ├── 📁 context/              # React Context providers
│   │   ├── AuthContext.tsx      # Authentication state
│   │   └── UserProfileContext.tsx # User profile data
│   │
│   ├── 📁 services/             # External services
│   │   ├── ai.ts                # GROQ AI integration
│   │   └── firebase.ts          # Firebase configuration
│   │
│   ├── 📁 navigation/           # Navigation setup
│   │   ├── AppNavigator.tsx     # Main navigator
│   │   └── TabNavigator.tsx     # Bottom tab navigation
│   │
│   ├── 📁 data/                 # Static data
│   │   └── nutrition.json       # Local food database (500+ items)
│   │
│   ├── 📁 hooks/                # Custom hooks
│   │   └── useDebounce.ts       # Search debounce hook
│   │
│   └── 📁 utils/                # Utility functions
│       ├── calculations.ts      # BMR, TDEE calculations
│       └── formatters.ts        # Number/date formatting
│
├── 📄 app.config.js             # Expo configuration
├── 📄 package.json              # Dependencies
├── 📄 tsconfig.json             # TypeScript config
├── 📄 tailwind.config.js        # TailwindCSS config
├── 📄 .env                      # Environment variables (gitignored)
├── 📄 .gitignore                # Git ignore rules
└── 📄 README.md                 # This file
```

---

## 📚 Dokumentasi Teknis

### Performance Optimization

Aplikasi ini mengimplementasikan berbagai teknik optimisasi React Native:

#### 1. useMemo

Digunakan untuk memoize kalkulasi yang expensive:

```typescript
// MetabolicProfileScreen.tsx
const dailyCalories = useMemo(() => {
    const bmr = calculateBMR(weight, height, age, gender);
    return bmr * activityMultiplier;
}, [weight, height, age, gender, activityMultiplier]);

// NutritionScreen.tsx
const totalStats = useMemo(() => 
    allMeals.reduce((acc, meal) => ({
        calories: acc.calories + meal.calories,
        protein: acc.protein + meal.protein,
        carbs: acc.carbs + meal.carbs,
        fat: acc.fat + meal.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 })
, [allMeals]);
```

#### 2. useCallback

Digunakan untuk memoize function handlers:

```typescript
// SearchScreen.tsx
const handleSearch = useCallback(async () => {
    // Search logic
}, [searchQuery]);
```

#### 3. React.memo

Digunakan untuk prevent unnecessary re-renders:

```typescript
// Button.tsx
export const Button = memo(({ title, variant, ...props }) => {
    // Render button
});
```

### API Integration

#### GROQ AI Service

```typescript
// services/ai.ts
export const generateAIContent = async (prompt: string) => {
    const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'llama3-70b-8192',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            max_tokens: 2048
        })
    });
    return response.json();
};
```

#### Firebase Authentication

```typescript
// context/AuthContext.tsx
useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            setUser(user);
            setIsAuthenticated(true);
        } else {
            setUser(null);
            setIsAuthenticated(false);
        }
        setLoading(false);
    });
    return unsubscribe;
}, []);
```

---

## 🔬 Penelitian Terkait

### Informasi Penelitian

| Aspek | Detail |
|-------|--------|
| Judul | Pengembangan Aplikasi Web Berbasis GROQ AI Untuk Mengatasi Masalah Akurasi dan Personalisasi Perencanaan Secara Adaptif |
| Mata Kuliah | Metode Penelitian |
| Status | ✅ Best Practice |
| Implementasi | Web App → Mobile App |

### Metodologi Penelitian

1. **Analisis Masalah**
   - Studi literatur aplikasi health existing
   - Survey kebutuhan pengguna (gym-goers)
   - Identifikasi gap dan pain points

2. **Desain Solusi**
   - Perancangan arsitektur sistem
   - Design UI/UX mobile-first
   - Pemilihan tech stack optimal

3. **Implementasi**
   - Prototype development
   - AI integration testing
   - User acceptance testing

4. **Evaluasi**
   - Performance benchmarking
   - Accuracy validation
   - User satisfaction survey

---

## 🗺️ Roadmap

### Phase 1: MVP ✅
- [x] Basic authentication
- [x] Dashboard UI
- [x] Food search (local + AI)
- [x] Meal tracking
- [x] Profile management

### Phase 2: Enhancement 🔄
- [ ] Google Sign-In
- [ ] Recipe suggestions
- [ ] Water intake tracking
- [ ] Push notifications

### Phase 3: Advanced 📋
- [ ] Social features (share meals)
- [ ] Workout video integration
- [ ] Wearable device sync
- [ ] Premium subscription
- [ ] Multi-language support

---

## 🤝 Contributing

Kontribusi sangat diterima! Untuk berkontribusi:

1. Fork repository
2. Buat branch baru (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

---

## 📄 License

MIT License - Silakan gunakan untuk pembelajaran dan pengembangan.

```
MIT License

Copyright (c) 2026 Muhamad Akbar Rizky Saputra

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software...
```

---

<div align="center">

## ⭐ Star This Repository

Jika project ini bermanfaat, berikan ⭐ untuk support pengembangan lebih lanjut!

---

**Made with ❤️ and 💪 for Indonesian Fitness Community**

*Personal Health Mobile - Your AI-Powered Health Companion*

*Membantu masyarakat Indonesia memahami gizi dan merencanakan pola makan sehat*

</div>
