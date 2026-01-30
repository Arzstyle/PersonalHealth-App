# Session 14 Assignment - Optimization & Debugging Report
## Personal Health Mobile

**Oleh:** Muhamad Akbar Rizky Saputra 
**Tanggal:** 30 Januari 2026  
**Project:** PersonalHealth-App  

---

## List Optimization (yang sudah diterapkan/dikerjakan):

1. **Menggunakan `useMemo` untuk kalkulasi kalori harian**  
   Di `MetabolicProfileScreen.tsx` untuk menghitung daily calories berdasarkan BMR dan activity level, mencegah re-calculation yang tidak perlu.
   ```typescript
   const dailyCalories = useMemo(() => {
       // Kalkulasi BMR dan TDEE
   }, [profile]);
   ```

2. **Memakai `useMemo` untuk agregasi data meal**  
   Di `NutritionScreen.tsx` untuk menghitung total stats semua meal (allMeals, totalStats), agar tidak dihitung ulang setiap render.
   ```typescript
   const allMeals = useMemo(() => Object.values(mealsData).flat(), [mealsData]);
   const totalStats = useMemo(() => /* kalkulasi total */, [allMeals]);
   ```

3. **Memakai `useCallback` untuk handler search**  
   Di `SearchScreen.tsx` untuk memoize fungsi `handleSearch()` agar tidak re-create setiap render.
   ```typescript
   const handleSearch = useCallback(async () => {
       // logic search
   }, [searchQuery]);
   ```

4. **Memakai `React.memo` pada reusable component**  
   Di `Button.tsx` untuk mencegah re-render button yang props-nya tidak berubah.
   ```typescript
   export const Button = memo(({ title, variant, ...props }) => {
       // render button
   });
   ```

5. **Error Handling dengan try-catch untuk API calls**  
   Di `SearchScreen.tsx` menggunakan try-catch untuk menangkap error saat AI search dan menampilkan pesan error yang user-friendly.
   ```typescript
   try {
       const result = await generateAIContent(prompt);
   } catch (err) {
       console.error("Error during AI search:", err);
       setError(err?.message || "Search Failed");
   }
   ```

---

## List Testing/Debugging:

- **Console.log** untuk monitoring Firebase Auth state changes di `AuthContext.tsx`
- **Metro Bundler** untuk menampilkan real-time error saat development
- **Expo DevTools** untuk monitoring request dan state aplikasi
- Error handling dengan **Alert** untuk notifikasi user saat terjadi kesalahan

---

## Catatan Debugging:

- Error log tersimpan di console Metro Bundler
- Firebase Auth menggunakan `onAuthStateChanged` listener untuk track user state

---

## Files yang dimodifikasi untuk optimization:

| File | Teknik | Tujuan |
|------|--------|--------|
| `MetabolicProfileScreen.tsx` | `useMemo` | Memoize kalkulasi kalori |
| `NutritionScreen.tsx` | `useMemo` | Memoize agregasi meal data |
| `SearchScreen.tsx` | `useCallback` | Memoize search handler |
| `Button.tsx` | `React.memo` | Prevent unnecessary re-renders |
| `AuthContext.tsx` | `console.log` | Debug auth state |

---

**Link GitHub:** [Tambahkan link repository Anda]
