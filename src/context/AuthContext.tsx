import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { Alert } from 'react-native';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, pass: string) => Promise<void>;
    register: (email: string, pass: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log('[Auth] Setting up onAuthStateChanged listener');
        const unsubscribe = onAuthStateChanged(auth, (usr) => {
            console.log('[Auth] User state changed:', usr ? usr.email : 'Logged out');
            setUser(usr);
            setIsLoading(false);
        });
        return unsubscribe;
    }, []);

    const login = async (email: string, pass: string) => {
        try {
            console.log('[Auth] Attempting login for:', email);
            await signInWithEmailAndPassword(auth, email, pass);
            console.log('[Auth] Login successful');
        } catch (error: any) {
            console.error('[Auth] Login failed:', error.message);

            // Helpful error messages
            let msg = "Gagal login. Cek email dan password.";
            if (error.code === 'auth/invalid-credential') msg = "Email atau password salah.";
            if (error.code === 'auth/user-not-found') msg = "Akun tidak ditemukan.";
            if (error.code === 'auth/wrong-password') msg = "Password salah.";
            if (error.code === 'auth/invalid-email') msg = "Format email tidak valid.";

            Alert.alert("Login Gagal", msg);
            throw error;
        }
    };

    const register = async (email: string, pass: string) => {
        try {
            console.log('[Auth] Attempting registration for:', email);
            await createUserWithEmailAndPassword(auth, email, pass);
            console.log('[Auth] Registration successful');
        } catch (error: any) {
            console.error('[Auth] Registration failed:', error.message);

            let msg = "Gagal registrasi.";
            if (error.code === 'auth/email-already-in-use') msg = "Email sudah terdaftar.";
            if (error.code === 'auth/weak-password') msg = "Password terlalu lemah (min 6 karakter).";
            if (error.code === 'auth/invalid-email') msg = "Format email tidak valid.";

            Alert.alert("Registrasi Gagal", msg);
            throw error;
        }
    };

    const logout = async () => {
        try {
            console.log('[Auth] Logging out...');
            await signOut(auth);
            console.log('[Auth] Logout successful');
        } catch (error: any) {
            console.error('[Auth] Logout failed:', error);
            Alert.alert("Error", "Gagal logout.");
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
