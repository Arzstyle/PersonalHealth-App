import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

interface AuthError {
    title: string;
    message: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    authError: AuthError | null;
    clearError: () => void;
    login: (email: string, pass: string) => Promise<void>;
    register: (email: string, pass: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [authError, setAuthError] = useState<AuthError | null>(null);

    useEffect(() => {
        console.log('[Auth] Setting up onAuthStateChanged listener');
        const unsubscribe = onAuthStateChanged(auth, (usr) => {
            console.log('[Auth] User state changed:', usr ? usr.email : 'Logged out');
            setUser(usr);
            setIsLoading(false);
        });
        return unsubscribe;
    }, []);

    const clearError = () => {
        setAuthError(null);
    };

    const login = async (email: string, pass: string) => {
        try {
            console.log('[Auth] Attempting login for:', email);
            await signInWithEmailAndPassword(auth, email, pass);
            console.log('[Auth] Login successful');
        } catch (error: any) {
            console.error('[Auth] Login failed:', error.message);

            let msg = "Gagal login. Cek email dan password.";
            if (error.code === 'auth/invalid-credential') msg = "Email atau password salah.";
            if (error.code === 'auth/user-not-found') msg = "Akun tidak ditemukan.";
            if (error.code === 'auth/wrong-password') msg = "Password salah.";
            if (error.code === 'auth/invalid-email') msg = "Format email tidak valid.";

            setAuthError({ title: "Login Gagal", message: msg });
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
            if (error.code === 'auth/email-already-in-use') msg = "Email sudah terdaftar. Silakan gunakan email lain atau login dengan email ini.";
            if (error.code === 'auth/weak-password') msg = "Password terlalu lemah (minimal 6 karakter).";
            if (error.code === 'auth/invalid-email') msg = "Format email tidak valid.";

            setAuthError({ title: "Registrasi Gagal", message: msg });
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
            setAuthError({ title: "Error", message: "Gagal logout." });
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, authError, clearError, login, register, logout }}>
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
