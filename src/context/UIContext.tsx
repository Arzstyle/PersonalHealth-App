import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Language = 'en' | 'id';
type Theme = 'dark' | 'light';

interface UIContextType {
    language: Language;
    theme: Theme;
    setLanguage: (lang: Language) => void;
    toggleTheme: () => void;
    t: (key: string) => string;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

// Comprehensive translation dictionary
const translations: Record<Language, Record<string, string>> = {
    en: {
        // Login Screen
        'login.title': 'System Access',
        'login.subtitle': 'Authenticate to synchronize your neural profile.',
        'login.register_title': 'Create Profile',
        'login.register_subtitle': 'Register new account to start your journey.',
        'login.email': 'Email Address',
        'login.password': 'Password',
        'login.confirm_password': 'Confirm Password',
        'login.login_button': 'Initiate Session',
        'login.register_button': 'Create Account',
        'login.new_user': 'New User?',
        'login.create_profile': 'Create Profile',
        'login.have_account': 'Already have account?',
        'login.login_link': 'Login',
        'login.or_continue': 'Or continue with',
        'login.google': 'Continue with Google',
        'login.guest': 'Continue as Guest',
        'login.secure': 'Secure Encrypted Protocol',

        // Success/Error Modals
        'modal.register_success': 'Registration Successful!',
        'modal.register_saved': 'Your account has been saved to Firebase',
        'modal.register_hint': 'Please login with the email and password you registered to continue.',
        'modal.login_now': 'Login Now',
        'modal.login_success': 'Login Successful!',
        'modal.welcome_back': 'Welcome back!',
        'modal.login_hint': 'Continue to fill in your personal data so we can provide accurate nutrition recommendations.',
        'modal.fill_data': 'Fill Personal Data',
        'modal.understand': 'Understand',
        'modal.error_login': 'Login Failed',
        'modal.error_register': 'Registration Failed',

        // Hub/Home Screen
        'hub.hello': 'Hello',
        'hub.guest_mode': 'GUEST MODE',
        'hub.system_online': 'SYSTEM ONLINE',
        'hub.today': 'Today',
        'hub.quick_actions': 'Quick Actions',
        'hub.search': 'Search Food',
        'hub.meal_plan': 'Meal Plan',
        'hub.nutrition': 'Nutrition',
        'hub.profile': 'Profile',

        // Identity/Profile Screen
        'profile.title': 'Identity',
        'profile.settings': 'Settings',
        'profile.stats': 'Vital Statistics',
        'profile.targets': 'Daily Target',
        'profile.protocols': 'Nutritional Protocols',
        'profile.verified': 'Verified',
        'profile.online': 'Online',
        'profile.joined': 'Joined',
        'profile.edit': 'Edit Profile',
        'profile.edit_protocols': 'Edit Protocols',
        'profile.restrictions': 'Restrictions',
        'profile.allergies': 'Allergies',
        'profile.none': 'None',
        'profile.logout': 'Logout',
        'profile.logout_confirm': 'Are you sure you want to logout?',
        'profile.logout_yes': 'Yes, Logout',
        'profile.logout_no': 'No',
        'profile.save': 'Save Profile',
        'profile.save_data': 'Save Data',
        'profile.display_name': 'Display Name',

        // Stats
        'stats.weight': 'Weight',
        'stats.height': 'Height',
        'stats.age': 'Age',
        'stats.bmi': 'BMI',
        'stats.gender': 'Gender',
        'stats.years': 'years',
        'stats.male': 'MALE',
        'stats.female': 'FEMALE',

        // Nutrition Screen
        'nutrition.title': 'Nutrition',
        'nutrition.daily_intake': 'Daily Intake',
        'nutrition.remaining': 'Remaining',
        'nutrition.consumed': 'Consumed',
        'nutrition.target': 'Target',
        'nutrition.calories': 'Calories',
        'nutrition.protein': 'Protein',
        'nutrition.carbs': 'Carbs',
        'nutrition.fat': 'Fat',
        'nutrition.add_meal': 'Add Meal',
        'nutrition.log': 'Food Log',

        // Search Screen
        'search.title': 'Search',
        'search.placeholder': 'Search food...',
        'search.results': 'Results',
        'search.no_results': 'No results found',
        'search.ai_powered': 'AI Powered',

        // Meal Plan Screen
        'meal.title': 'Meal Plan',
        'meal.subtitle': 'Plan your nutrition.',
        'meal.breakfast': 'Breakfast',
        'meal.lunch': 'Lunch',
        'meal.dinner': 'Dinner',
        'meal.snack': 'Snack',
        'meal.snacks': 'Snacks',
        'meal.summary': 'Summary',
        'meal.select_target': 'Select Target',
        'meal.low_cal': 'Low Cal',
        'meal.lose_fat': 'Lose fat',
        'meal.standard': 'Standard',
        'meal.maintain': 'Maintain',
        'meal.bulking': 'Bulking',
        'meal.build_muscle': 'Build muscle',
        'meal.ai_ready': 'AI READY',
        'meal.processing': 'PROCESSING...',
        'meal.ai_generate': 'AI Auto-Generate',
        'meal.generating': 'Generating...',
        'meal.ai_desc': 'Let AI compose your complete daily menu.',
        'meal.manual': 'Manual',
        'meal.manual_compose': 'Manual Compose',
        'meal.items': 'Items',
        'meal.no_food': 'No food yet.',
        'meal.click_ai': 'Click AI Generate to auto-fill.',
        'meal.success': 'Meal plan generated successfully!',
        'meal.error': 'Failed to generate meal plan',
        'meal.coming_soon': 'Manual search feature coming soon!',
        'meal.generate': 'Generate Plan',
        'meal.regenerate': 'Regenerate',

        // Body Metrics Screen
        'metrics.title': 'Body Metrics',
        'metrics.subtitle': 'Tell us about yourself to personalize your experience',
        'metrics.continue': 'Continue',
        'metrics.skip': 'Skip for now',

        // Common
        'common.edit': 'Edit',
        'common.save': 'Save',
        'common.cancel': 'Cancel',
        'common.close': 'Close',
        'common.next': 'Next',
        'common.back': 'Back',
        'common.loading': 'Loading...',
        'common.error': 'Error',
        'common.success': 'Success',
        'common.kcal': 'kcal',
        'common.g': 'g',
        'common.cm': 'cm',
        'common.kg': 'kg',
    },
    id: {
        // Login Screen
        'login.title': 'Akses Sistem',
        'login.subtitle': 'Autentikasi untuk menyinkronkan profil neural Anda.',
        'login.register_title': 'Buat Profil',
        'login.register_subtitle': 'Daftarkan akun baru untuk memulai perjalanan Anda.',
        'login.email': 'Alamat Email',
        'login.password': 'Kata Sandi',
        'login.confirm_password': 'Konfirmasi Kata Sandi',
        'login.login_button': 'Mulai Sesi',
        'login.register_button': 'Buat Akun',
        'login.new_user': 'Pengguna Baru?',
        'login.create_profile': 'Buat Profil',
        'login.have_account': 'Sudah punya akun?',
        'login.login_link': 'Masuk',
        'login.or_continue': 'Atau lanjutkan dengan',
        'login.google': 'Lanjutkan dengan Google',
        'login.guest': 'Lanjutkan sebagai Tamu',
        'login.secure': 'Protokol Enkripsi Aman',

        // Success/Error Modals
        'modal.register_success': 'Registrasi Berhasil!',
        'modal.register_saved': 'Akun Anda telah tersimpan di Firebase',
        'modal.register_hint': 'Silakan login dengan email dan password yang sudah didaftarkan untuk melanjutkan.',
        'modal.login_now': 'Login Sekarang',
        'modal.login_success': 'Login Berhasil!',
        'modal.welcome_back': 'Selamat datang kembali!',
        'modal.login_hint': 'Lanjutkan untuk mengisi data personal Anda agar kami dapat memberikan rekomendasi nutrisi yang tepat.',
        'modal.fill_data': 'Isi Data Personal',
        'modal.understand': 'Mengerti',
        'modal.error_login': 'Login Gagal',
        'modal.error_register': 'Registrasi Gagal',

        // Hub/Home Screen
        'hub.hello': 'Halo',
        'hub.guest_mode': 'MODE TAMU',
        'hub.system_online': 'SISTEM ONLINE',
        'hub.today': 'Hari Ini',
        'hub.quick_actions': 'Aksi Cepat',
        'hub.search': 'Cari Makanan',
        'hub.meal_plan': 'Rencana Makan',
        'hub.nutrition': 'Nutrisi',
        'hub.profile': 'Profil',

        // Identity/Profile Screen
        'profile.title': 'Identitas',
        'profile.settings': 'Pengaturan',
        'profile.stats': 'Statistik Vital',
        'profile.targets': 'Target Harian',
        'profile.protocols': 'Protokol Nutrisi',
        'profile.verified': 'Terverifikasi',
        'profile.online': 'Online',
        'profile.joined': 'Bergabung',
        'profile.edit': 'Edit Profil',
        'profile.edit_protocols': 'Edit Protokol',
        'profile.restrictions': 'Batasan',
        'profile.allergies': 'Alergi',
        'profile.none': 'Tidak ada',
        'profile.logout': 'Keluar',
        'profile.logout_confirm': 'Apakah Anda yakin ingin keluar?',
        'profile.logout_yes': 'Ya, Keluar',
        'profile.logout_no': 'Tidak',
        'profile.save': 'Simpan Profil',
        'profile.save_data': 'Simpan Data',
        'profile.display_name': 'Nama Tampilan',

        // Stats
        'stats.weight': 'Berat',
        'stats.height': 'Tinggi',
        'stats.age': 'Umur',
        'stats.bmi': 'IMT',
        'stats.gender': 'Jenis Kelamin',
        'stats.years': 'tahun',
        'stats.male': 'PRIA',
        'stats.female': 'WANITA',

        // Nutrition Screen
        'nutrition.title': 'Nutrisi',
        'nutrition.daily_intake': 'Asupan Harian',
        'nutrition.remaining': 'Tersisa',
        'nutrition.consumed': 'Dikonsumsi',
        'nutrition.target': 'Target',
        'nutrition.calories': 'Kalori',
        'nutrition.protein': 'Protein',
        'nutrition.carbs': 'Karbohidrat',
        'nutrition.fat': 'Lemak',
        'nutrition.add_meal': 'Tambah Makanan',
        'nutrition.log': 'Log Makanan',

        // Search Screen
        'search.title': 'Pencarian',
        'search.placeholder': 'Cari makanan...',
        'search.results': 'Hasil',
        'search.no_results': 'Tidak ada hasil',
        'search.ai_powered': 'Didukung AI',

        // Meal Plan Screen
        'meal.title': 'Rencana Makan',
        'meal.subtitle': 'Rencanakan nutrisimu.',
        'meal.breakfast': 'Sarapan',
        'meal.lunch': 'Makan Siang',
        'meal.dinner': 'Makan Malam',
        'meal.snack': 'Camilan',
        'meal.snacks': 'Camilan',
        'meal.summary': 'Ringkasan',
        'meal.select_target': 'Pilih Target',
        'meal.low_cal': 'Low Cal',
        'meal.lose_fat': 'Turunkan lemak',
        'meal.standard': 'Standard',
        'meal.maintain': 'Pertahankan',
        'meal.bulking': 'Bulking',
        'meal.build_muscle': 'Bangun otot',
        'meal.ai_ready': 'AI SIAP',
        'meal.processing': 'MEMPROSES...',
        'meal.ai_generate': 'AI Auto-Generate',
        'meal.generating': 'Membuat...',
        'meal.ai_desc': 'Biarkan AI menyusun menu harian lengkap.',
        'meal.manual': 'Manual',
        'meal.manual_compose': 'Susun Manual',
        'meal.items': 'Item',
        'meal.no_food': 'Belum ada makanan.',
        'meal.click_ai': 'Klik AI Generate untuk isi otomatis.',
        'meal.success': 'Rencana makan berhasil dibuat!',
        'meal.error': 'Gagal membuat rencana makan',
        'meal.coming_soon': 'Fitur manual search akan segera hadir!',
        'meal.generate': 'Buat Rencana',
        'meal.regenerate': 'Buat Ulang',

        // Body Metrics Screen
        'metrics.title': 'Metrik Tubuh',
        'metrics.subtitle': 'Beritahu kami tentang diri Anda untuk personalisasi pengalaman',
        'metrics.continue': 'Lanjutkan',
        'metrics.skip': 'Lewati dulu',

        // Common
        'common.edit': 'Ubah',
        'common.save': 'Simpan',
        'common.cancel': 'Batal',
        'common.close': 'Tutup',
        'common.next': 'Lanjut',
        'common.back': 'Kembali',
        'common.loading': 'Memuat...',
        'common.error': 'Error',
        'common.success': 'Berhasil',
        'common.kcal': 'kkal',
        'common.g': 'g',
        'common.cm': 'cm',
        'common.kg': 'kg',
    }
};

export const UIProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguageState] = useState<Language>('en'); // Default to English
    const [theme, setThemeState] = useState<Theme>('dark');

    // Load persisted language on mount
    useEffect(() => {
        const loadLanguage = async () => {
            try {
                const savedLang = await AsyncStorage.getItem('ui_language');
                if (savedLang === 'en' || savedLang === 'id') {
                    setLanguageState(savedLang);
                }
            } catch (error) {
                console.error('Failed to load language preference:', error);
            }
        };
        loadLanguage();
    }, []);

    const setLanguage = async (lang: Language) => {
        setLanguageState(lang);
        await AsyncStorage.setItem('ui_language', lang);
    };

    const toggleTheme = () => {
        setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const t = (key: string): string => {
        return translations[language][key] || key;
    };

    return (
        <UIContext.Provider value={{ language, theme, setLanguage, toggleTheme, t }}>
            {children}
        </UIContext.Provider>
    );
};

export const useUI = () => {
    const context = useContext(UIContext);
    if (!context) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
};
