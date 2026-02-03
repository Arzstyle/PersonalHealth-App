# 📊 Dokumentasi Rumus & Perhitungan
## Personal Health App - Formula Reference

Dokumen ini menjelaskan secara detail rumus-rumus dan perhitungan yang digunakan dalam aplikasi Personal Health untuk menghitung kebutuhan kalori dan nutrisi pengguna.

---

## 📋 Daftar Isi

- [Basal Metabolic Rate (BMR)](#-basal-metabolic-rate-bmr)
- [Total Daily Energy Expenditure (TDEE)](#-total-daily-energy-expenditure-tdee)
- [Goal-Based Calorie Adjustment](#-goal-based-calorie-adjustment)
- [Makronutrien](#-makronutrien)
- [Body Mass Index (BMI)](#-body-mass-index-bmi)
- [Implementasi Kode](#-implementasi-kode)

---

## 🔥 Basal Metabolic Rate (BMR)

### Apa itu BMR?

**Basal Metabolic Rate (BMR)** adalah jumlah kalori minimum yang dibutuhkan tubuh untuk menjalankan fungsi dasar kehidupan saat istirahat total. Fungsi-fungsi ini meliputi:

- Pernapasan
- Sirkulasi darah
- Pengaturan suhu tubuh
- Pertumbuhan dan perbaikan sel
- Fungsi otak dan sistem saraf

### Rumus yang Digunakan: Mifflin-St Jeor Equation

Aplikasi ini menggunakan **Mifflin-St Jeor Equation** yang dianggap paling akurat untuk menghitung BMR berdasarkan penelitian modern.

#### Untuk Pria:
```
BMR = (10 × berat[kg]) + (6.25 × tinggi[cm]) - (5 × umur[tahun]) + 5
```

#### Untuk Wanita:
```
BMR = (10 × berat[kg]) + (6.25 × tinggi[cm]) - (5 × umur[tahun]) - 161
```

### Penjelasan Komponen Rumus

| Komponen | Nilai | Alasan |
|----------|-------|--------|
| **10 × berat** | Koefisien berat badan | Massa tubuh mempengaruhi metabolisme basal |
| **6.25 × tinggi** | Koefisien tinggi badan | Luas permukaan tubuh mempengaruhi pengeluaran energi |
| **5 × umur** | Koefisien usia (dikurangi) | Metabolisme melambat seiring bertambahnya usia |
| **+5 (pria) / -161 (wanita)** | Konstanta gender | Perbedaan komposisi tubuh antara pria dan wanita |

### Contoh Perhitungan

**Contoh untuk Pria:**
- Berat: 70 kg
- Tinggi: 175 cm
- Umur: 25 tahun

```
BMR = (10 × 70) + (6.25 × 175) - (5 × 25) + 5
BMR = 700 + 1093.75 - 125 + 5
BMR = 1673.75 kkal/hari
```

**Contoh untuk Wanita:**
- Berat: 55 kg
- Tinggi: 160 cm
- Umur: 25 tahun

```
BMR = (10 × 55) + (6.25 × 160) - (5 × 25) - 161
BMR = 550 + 1000 - 125 - 161
BMR = 1264 kkal/hari
```

### Mengapa Mifflin-St Jeor?

| Rumus | Akurasi | Catatan |
|-------|---------|---------|
| **Mifflin-St Jeor** | ⭐⭐⭐⭐⭐ | Paling akurat untuk populasi modern |
| Harris-Benedict | ⭐⭐⭐⭐ | Dikembangkan 1919, cenderung overestimate |
| Katch-McArdle | ⭐⭐⭐⭐ | Membutuhkan data body fat percentage |

---

## ⚡ Total Daily Energy Expenditure (TDEE)

### Apa itu TDEE?

**Total Daily Energy Expenditure (TDEE)** adalah total kalori yang dibakar tubuh dalam sehari, termasuk:

1. **BMR** - Metabolisme basal (60-70%)
2. **TEF** - Thermic Effect of Food (10%)
3. **NEAT** - Non-Exercise Activity Thermogenesis (15-20%)
4. **EAT** - Exercise Activity Thermogenesis (5-10%)

### Rumus TDEE

```
TDEE = BMR × Activity Multiplier
```

### Activity Multiplier (Faktor Aktivitas)

| Level Aktivitas | Multiplier | Deskripsi |
|-----------------|------------|-----------|
| **Sedentary** | 1.2 | Tidak berolahraga, pekerjaan duduk (kantoran) |
| **Lightly Active** | 1.375 | Olahraga ringan 1-3 hari/minggu |
| **Moderately Active** | 1.55 | Olahraga sedang 3-5 hari/minggu |
| **Very Active** | 1.725 | Olahraga berat 6-7 hari/minggu |
| **Extra Active** | 1.9 | Olahraga sangat berat + pekerjaan fisik |

### Contoh Perhitungan TDEE

Menggunakan BMR pria dari contoh sebelumnya (1673.75 kkal) dengan aktivitas **Moderately Active**:

```
TDEE = 1673.75 × 1.55
TDEE = 2594.31 kkal/hari
```

### Penjelasan Detail Activity Level

#### 🪑 Sedentary (1.2)
- Pekerjaan: Programmer, admin, customer service
- Aktivitas: Duduk hampir sepanjang hari
- Olahraga: Tidak ada atau sangat minimal

#### 🚶 Lightly Active (1.375)
- Pekerjaan: Teacher, salesperson yang banyak jalan
- Aktivitas: Jalan kaki ringan harian
- Olahraga: 1-3x seminggu (jogging ringan, yoga)

#### 🏃 Moderately Active (1.55)
- Pekerjaan: Pelayan, teknisi lapangan
- Aktivitas: Banyak bergerak sepanjang hari
- Olahraga: 3-5x seminggu (gym, futsal, berenang)

#### 🏋️ Very Active (1.725)
- Pekerjaan: Personal trainer, pekerja konstruksi
- Aktivitas: Fisik berat sepanjang hari
- Olahraga: 6-7x seminggu dengan intensitas tinggi

#### 💪 Extra Active (1.9)
- Pekerjaan: Atlet profesional, tentara aktif
- Aktivitas: Latihan ganda (pagi & sore)
- Olahraga: Multiple sessions per hari

---

## 🎯 Goal-Based Calorie Adjustment

### Prinsip Dasar

Untuk mengubah komposisi tubuh, kita perlu menciptakan **surplus** atau **deficit** kalori dari TDEE:

```
Calorie Goal = TDEE ± Adjustment
```

### Adjustment Berdasarkan Goal

| Goal | Adjustment | Hasil |
|------|------------|-------|
| **Fat Loss (Cutting)** | TDEE - 500 kkal | Deficit ~3500 kkal/minggu ≈ 0.5 kg lemak |
| **Maintenance** | TDEE + 0 | Berat badan stabil |
| **Muscle Gain (Bulking)** | TDEE + 300 kkal | Surplus untuk pertumbuhan otot |

### Penjelasan Ilmiah

#### 🔻 Cutting (Deficit 500 kkal)

```
Defisit mingguan = 500 × 7 = 3500 kkal

1 kg lemak ≈ 7700 kkal
Penurunan berat = 3500 / 7700 ≈ 0.45 kg/minggu
```

**Catatan penting:**
- Deficit tidak boleh terlalu besar (max 1000 kkal)
- Deficit besar menyebabkan kehilangan massa otot
- Deficit 500 kkal adalah "sweet spot" yang aman

#### 🔼 Bulking (Surplus 300 kkal)

```
Surplus mingguan = 300 × 7 = 2100 kkal
```

**Mengapa hanya 300 kkal?**
- Tubuh hanya bisa membangun ~250g otot/minggu secara optimal
- Surplus berlebihan akan disimpan sebagai lemak
- "Lean bulk" lebih efektif daripada "dirty bulk"

### Contoh Perhitungan Complete

**Profil:**
- Pria, 70 kg, 175 cm, 25 tahun
- Activity Level: Moderately Active
- Goal: Fat Loss

```
Step 1: Hitung BMR
BMR = (10 × 70) + (6.25 × 175) - (5 × 25) + 5 = 1673.75 kkal

Step 2: Hitung TDEE
TDEE = 1673.75 × 1.55 = 2594.31 kkal

Step 3: Terapkan Goal
Target Kalori = 2594.31 - 500 = 2094.31 kkal/hari

Pembulatan = 2100 kkal/hari
```

---

## 🥗 Makronutrien

### Apa itu Makronutrien?

Makronutrien adalah nutrisi yang dibutuhkan tubuh dalam jumlah besar:

1. **Protein** - 4 kkal/gram
2. **Karbohidrat** - 4 kkal/gram
3. **Lemak** - 9 kkal/gram

### Target Makronutrien Berdasarkan Goal

#### 🔻 Cutting (Fat Loss)

| Makro | Target | Alasan |
|-------|--------|--------|
| **Protein** | 2.0 - 2.4 g/kg | Mempertahankan massa otot saat deficit |
| **Lemak** | 0.8 - 1.0 g/kg | Minimum untuk fungsi hormonal |
| **Karbohidrat** | Sisa kalori | Energi untuk aktivitas |

#### ⚖️ Maintenance

| Makro | Target | Alasan |
|-------|--------|--------|
| **Protein** | 1.6 - 2.0 g/kg | Pemeliharaan jaringan otot |
| **Lemak** | 0.8 - 1.2 g/kg | Fungsi hormonal seimbang |
| **Karbohidrat** | Sisa kalori | Energi optimal |

#### 🔼 Bulking (Muscle Gain)

| Makro | Target | Alasan |
|-------|--------|--------|
| **Protein** | 1.6 - 2.0 g/kg | Sintesis protein otot |
| **Lemak** | 0.8 - 1.0 g/kg | Minimum untuk hormon |
| **Karbohidrat** | Sisa kalori (tinggi) | Energi untuk latihan + recovery |

### Rumus Perhitungan Makro

```typescript
// Contoh untuk Cutting dengan berat 70 kg dan target 2100 kkal

// Step 1: Hitung Protein (2.0 g/kg)
Protein = 70 × 2.0 = 140 gram
Kalori dari Protein = 140 × 4 = 560 kkal

// Step 2: Hitung Lemak (0.9 g/kg)
Lemak = 70 × 0.9 = 63 gram
Kalori dari Lemak = 63 × 9 = 567 kkal

// Step 3: Hitung Karbohidrat (sisa kalori)
Sisa Kalori = 2100 - 560 - 567 = 973 kkal
Karbohidrat = 973 / 4 = 243 gram
```

### Hasil Akhir:

| Makronutrien | Gram | Kalori | Persentase |
|--------------|------|--------|------------|
| Protein | 140g | 560 kkal | 27% |
| Lemak | 63g | 567 kkal | 27% |
| Karbohidrat | 243g | 973 kkal | 46% |
| **Total** | - | **2100 kkal** | **100%** |

---

## 📏 Body Mass Index (BMI)

### Rumus BMI

```
BMI = Berat[kg] / (Tinggi[m])²
```

### Kategori BMI (WHO Standard)

| BMI | Kategori | Status |
|-----|----------|--------|
| < 18.5 | Underweight | Berat badan kurang |
| 18.5 - 24.9 | Normal | Berat badan ideal |
| 25.0 - 29.9 | Overweight | Kelebihan berat badan |
| 30.0 - 34.9 | Obese Class I | Obesitas tingkat 1 |
| 35.0 - 39.9 | Obese Class II | Obesitas tingkat 2 |
| ≥ 40.0 | Obese Class III | Obesitas tingkat 3 |

### Kategori BMI (Asia-Pacific)

Untuk populasi Asia, WHO merekomendasikan cut-off yang lebih rendah:

| BMI | Kategori |
|-----|----------|
| < 18.5 | Underweight |
| 18.5 - 22.9 | Normal |
| 23.0 - 24.9 | Overweight (At Risk) |
| ≥ 25.0 | Obese |

### Contoh Perhitungan

**Profil:**
- Berat: 70 kg
- Tinggi: 175 cm = 1.75 m

```
BMI = 70 / (1.75)²
BMI = 70 / 3.0625
BMI = 22.86

Kategori: Normal (WHO) / Normal (Asia-Pacific)
```

### Keterbatasan BMI

⚠️ BMI tidak memperhitungkan:
- Komposisi tubuh (lemak vs otot)
- Distribusi lemak (visceral vs subcutaneous)
- Usia, gender, etnis

**Contoh limitasi:** Binaragawan dengan tinggi 175 cm dan berat 90 kg memiliki BMI 29.4 (Overweight), meskipun body fat percentage rendah.

---

## 💻 Implementasi Kode

### Fungsi Perhitungan BMR

```typescript
// src/utils/calculations.ts

export const calculateBMR = (
    weight: number,      // kg
    height: number,      // cm
    age: number,         // tahun
    gender: 'male' | 'female'
): number => {
    // Mifflin-St Jeor Equation
    const baseBMR = (10 * weight) + (6.25 * height) - (5 * age);
    
    if (gender === 'male') {
        return baseBMR + 5;
    } else {
        return baseBMR - 161;
    }
};
```

### Fungsi Perhitungan TDEE

```typescript
export type ActivityLevel = 
    | 'sedentary'      // 1.2
    | 'light'          // 1.375
    | 'moderate'       // 1.55
    | 'active'         // 1.725
    | 'very_active';   // 1.9

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
};

export const calculateTDEE = (
    bmr: number,
    activityLevel: ActivityLevel
): number => {
    return bmr * ACTIVITY_MULTIPLIERS[activityLevel];
};
```

### Fungsi Goal-Based Adjustment

```typescript
export type FitnessGoal = 'cutting' | 'maintenance' | 'bulking';

const GOAL_ADJUSTMENTS: Record<FitnessGoal, number> = {
    cutting: -500,
    maintenance: 0,
    bulking: 300
};

export const calculateTargetCalories = (
    tdee: number,
    goal: FitnessGoal
): number => {
    return tdee + GOAL_ADJUSTMENTS[goal];
};
```

### Fungsi Perhitungan Makro

```typescript
export const calculateMacros = (
    targetCalories: number,
    weight: number,
    goal: FitnessGoal
): { protein: number; fat: number; carbs: number } => {
    
    // Protein berdasarkan goal
    const proteinPerKg = goal === 'cutting' ? 2.0 : 1.8;
    const protein = weight * proteinPerKg;
    const proteinCalories = protein * 4;
    
    // Fat (konstan untuk semua goal)
    const fatPerKg = 0.9;
    const fat = weight * fatPerKg;
    const fatCalories = fat * 9;
    
    // Carbs (sisa kalori)
    const remainingCalories = targetCalories - proteinCalories - fatCalories;
    const carbs = remainingCalories / 4;
    
    return {
        protein: Math.round(protein),
        fat: Math.round(fat),
        carbs: Math.round(carbs)
    };
};
```

### Fungsi Perhitungan BMI

```typescript
export const calculateBMI = (
    weight: number,     // kg
    height: number      // cm
): number => {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
};

export const getBMICategory = (bmi: number): string => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    if (bmi < 35) return 'Obese Class I';
    if (bmi < 40) return 'Obese Class II';
    return 'Obese Class III';
};
```

### Complete Usage Example

```typescript
// Contoh penggunaan lengkap
const userProfile = {
    weight: 70,         // kg
    height: 175,        // cm
    age: 25,
    gender: 'male' as const,
    activityLevel: 'moderate' as ActivityLevel,
    goal: 'cutting' as FitnessGoal
};

// Step 1: Calculate BMR
const bmr = calculateBMR(
    userProfile.weight,
    userProfile.height,
    userProfile.age,
    userProfile.gender
);
console.log(`BMR: ${bmr} kkal`);
// Output: BMR: 1673.75 kkal

// Step 2: Calculate TDEE
const tdee = calculateTDEE(bmr, userProfile.activityLevel);
console.log(`TDEE: ${tdee} kkal`);
// Output: TDEE: 2594.31 kkal

// Step 3: Calculate Target Calories
const targetCalories = calculateTargetCalories(tdee, userProfile.goal);
console.log(`Target: ${targetCalories} kkal`);
// Output: Target: 2094.31 kkal

// Step 4: Calculate Macros
const macros = calculateMacros(
    targetCalories,
    userProfile.weight,
    userProfile.goal
);
console.log(`Protein: ${macros.protein}g`);
console.log(`Fat: ${macros.fat}g`);
console.log(`Carbs: ${macros.carbs}g`);
// Output:
// Protein: 140g
// Fat: 63g
// Carbs: 243g
```

---

## 📚 Referensi

1. **Mifflin-St Jeor Equation:**
   - Mifflin, M.D., et al. (1990). "A new predictive equation for resting energy expenditure in healthy individuals." *American Journal of Clinical Nutrition*

2. **Activity Multipliers:**
   - Food and Agriculture Organization of the United Nations (FAO). "Human energy requirements."

3. **Protein Requirements:**
   - Phillips, S.M., & Van Loon, L.J. (2011). "Dietary protein for athletes: From requirements to optimum adaptation." *Journal of Sports Sciences*

4. **BMI Classification:**
   - World Health Organization (WHO). "BMI Classification"
   - WHO Expert Consultation (2004). "Appropriate body-mass index for Asian populations"

---

<div align="center">

**Personal Health App**

*Menggunakan rumus-rumus berbasis ilmiah untuk perhitungan nutrisi yang akurat*

</div>
