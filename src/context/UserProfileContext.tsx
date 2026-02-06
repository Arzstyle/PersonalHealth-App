import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
export interface UserProfile {
    name: string;
    isGuest: boolean;
    dailyCalories: number;
    height: number;
    weight: number;
    age: number;
    gender: 'male' | 'female';
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'athlete';
    goal: 'lose' | 'maintain' | 'gain';
    dietaryRestrictions: string[];
    allergies: string[];
}

// Guest Defaults
export const GUEST_PROFILE: UserProfile = {
    name: 'Guest',
    isGuest: true,
    dailyCalories: 2000,
    height: 0,
    weight: 0,
    age: 0,
    gender: 'male',
    activityLevel: 'moderate',
    goal: 'maintain',
    dietaryRestrictions: [],
    allergies: [],
};

// Context Type
interface UserProfileContextType {
    profile: UserProfile;
    setProfile: (profile: UserProfile) => void;
    setGuestProfile: () => void;
    updateProfile: (updates: Partial<UserProfile>) => void;
    syncAuthProfile: (user: any) => Promise<void>;
    hasValidProfile: () => boolean;
    isLoaded: boolean;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

const STORAGE_KEY = 'user_profile';

export const UserProfileProvider = ({ children }: { children: ReactNode }) => {
    const [profile, setProfileState] = useState<UserProfile>(GUEST_PROFILE);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load profile from storage on mount
    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const saved = await AsyncStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                setProfileState({ ...GUEST_PROFILE, ...parsed });
            }
        } catch (e) {
            console.error('Failed to load user profile:', e);
        } finally {
            setIsLoaded(true);
        }
    };

    const setProfile = async (newProfile: UserProfile) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
            setProfileState(newProfile);
        } catch (e) {
            console.error('Failed to save user profile:', e);
        }
    };

    const setGuestProfile = async () => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(GUEST_PROFILE));
            setProfileState(GUEST_PROFILE);
        } catch (e) {
            console.error('Failed to set guest profile:', e);
        }
    };

    const updateProfile = async (updates: Partial<UserProfile>) => {
        const newProfile = { ...profile, ...updates, isGuest: false };
        await setProfile(newProfile);
    };

    const syncAuthProfile = async (user: any) => {
        if (!user) return;

        try {
            const updates: Partial<UserProfile> = {};
            if (user.displayName) updates.name = user.displayName;
            // Add other logical syncs if needed

            if (Object.keys(updates).length > 0) {
                // Only update if differ to avoid loops? 
                // For now just trust updateProfile handles state 
                console.log('[UserProfile] Syncing with Auth data');
                await updateProfile(updates);
            }
        } catch (e) {
            console.error('Failed to sync auth profile:', e);
        }
    };

    const hasValidProfile = () => {
        return !profile.isGuest && profile.height > 0 && profile.weight > 0;
    };

    return (
        <UserProfileContext.Provider value={{ profile, setProfile, setGuestProfile, updateProfile, isLoaded, syncAuthProfile, hasValidProfile }}>
            {children}
        </UserProfileContext.Provider>
    );
};

export const useUserProfile = () => {
    const context = useContext(UserProfileContext);
    if (!context) {
        throw new Error('useUserProfile must be used within a UserProfileProvider');
    }
    return context;
};

