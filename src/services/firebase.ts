import { initializeApp } from "firebase/app";
// @ts-ignore -- getReactNativePersistence is available in newer versions but types might be lagging or strict
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

// Firebase configuration from app.config.js -> .env
const firebaseConfig = {
    apiKey: Constants.expoConfig?.extra?.firebaseApiKey,
    authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain,
    projectId: Constants.expoConfig?.extra?.firebaseProjectId,
    storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket,
    messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId,
    appId: Constants.expoConfig?.extra?.firebaseAppId
};

// Debug Log to verify config loading
console.log('[Firebase] Config check:', {
    apiKeyExists: !!firebaseConfig.apiKey,
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication with Persistence
// Use initializeAuth for React Native to ensure persistence works
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});
