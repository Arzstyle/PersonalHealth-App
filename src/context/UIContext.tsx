import React, { createContext, useContext, useState, ReactNode } from 'react';
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

// Simple translation dictionary
const translations: Record<Language, Record<string, string>> = {
    en: {
        'profile.title': 'Identity',
        'profile.settings': 'Settings',
        'profile.stats': 'Vital Stats',
        'profile.targets': 'Target Operations',
        'profile.protocols': 'Nutritional Protocols',
        'stats.weight': 'Weight',
        'stats.height': 'Height',
        'stats.age': 'Age',
        'stats.bmi': 'BMI',
        'common.edit': 'Edit',
        'common.save': 'Save',
    },
    id: {
        'profile.title': 'Identitas',
        'profile.settings': 'Pengaturan',
        'profile.stats': 'Statistik Vital',
        'profile.targets': 'Operasi Target',
        'profile.protocols': 'Protokol Nutrisi',
        'stats.weight': 'Berat',
        'stats.height': 'Tinggi',
        'stats.age': 'Umur',
        'stats.bmi': 'IMT',
        'common.edit': 'Ubah',
        'common.save': 'Simpan',
    }
};

export const UIProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguageState] = useState<Language>('id'); // Default to ID as per user locale hints
    const [theme, setThemeState] = useState<Theme>('dark');

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

    // Load persisted settings on mount could be added here

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
