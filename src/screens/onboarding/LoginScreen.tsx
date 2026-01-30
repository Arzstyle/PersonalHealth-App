import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { Mail, Smartphone, Lock, Ghost, ShieldCheck } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { useUserProfile } from '../../context/UserProfileContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

import { useAuth } from '../../context/AuthContext';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../../services/firebase';

// Complete auth session when returning from browser
WebBrowser.maybeCompleteAuthSession();

export const LoginScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const { login } = useAuth();
    const { setGuestProfile } = useUserProfile();

    // Tab State: 'email' | 'mobile'
    const [activeTab, setActiveTab] = useState<'email' | 'mobile'>('email');

    // Form States
    const [email, setEmail] = useState('');
    const [passcode, setPasscode] = useState('');
    const [mobile, setMobile] = useState('');

    // Google Auth Request - Uses Expo auth proxy for Expo Go compatibility
    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: '738330655708-9vfd0cvjstegm4uvrb6955uifk692fj1.apps.googleusercontent.com',
    });

    // Handle Google Sign-In response
    React.useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, credential)
                .then(() => {
                    // Successfully logged in - navigate to BodyMetrics
                    navigation.replace('BodyMetrics');
                })
                .catch((error) => {
                    console.error('Firebase Auth Error:', error);
                    alert('Login gagal: ' + error.message);
                });
        }
    }, [response]);

    const handleLogin = async () => {
        try {
            await login(email, passcode);
            // Navigation handled by AuthContext state change
        } catch (e) {
            // Error managed in login()
        }
    };

    const handleGoogleLogin = async () => {
        // Opens browser with Google account picker
        await promptAsync();
        // Response handled by useEffect above
    };

    const handleGuest = () => {
        // Set guest profile defaults
        setGuestProfile();
        // Force navigation if AuthContext doesn't handle guest automatically
        navigation.replace('Main');
    };

    return (
        <SafeAreaView className="flex-1 bg-ai-bg">
            <StatusBar barStyle="light-content" />

            {/* Background Grid Elements */}
            <View className="absolute inset-0 opacity-20">
                <View className="absolute top-[30%] left-0 w-full h-[1px] bg-ai-green/20" />
                <View className="absolute top-[70%] left-0 w-full h-[1px] bg-ai-green/20" />
                <View className="absolute left-[50%] top-0 h-full w-[1px] bg-ai-green/20" />
            </View>

            <View className="flex-1 px-6 justify-center">

                {/* Header Icon */}
                <View className="items-center mb-6">
                    <View className="w-16 h-16 rounded-2xl bg-[#0a101f] border border-ai-green/30 items-center justify-center shadow-[0_0_20px_rgba(0,255,136,0.15)]">
                        <Lock size={28} color="#00ff88" />
                    </View>
                </View>

                {/* Title */}
                <View className="items-center mb-8">
                    <Text className="text-white text-3xl font-black uppercase tracking-widest text-center shadow-lg">
                        System Access
                    </Text>
                    <Text className="text-gray-400 text-xs uppercase tracking-widest text-center mt-2 font-bold max-w-[280px] leading-5">
                        Authenticate to synchronize your neural profile.
                    </Text>
                </View>

                {/* Tabs */}
                <View className="flex-row items-center border-b border-gray-800 mb-6">
                    <TouchableOpacity
                        onPress={() => setActiveTab('email')}
                        className={`flex-1 items-center pb-3 border-b-2 ${activeTab === 'email' ? 'border-ai-green' : 'border-transparent'}`}
                    >
                        <View className="flex-row items-center gap-2">
                            <Mail size={16} color={activeTab === 'email' ? '#00ff88' : '#6b7280'} />
                            <Text className={`text-sm font-bold tracking-widest uppercase ${activeTab === 'email' ? 'text-ai-green' : 'text-gray-500'}`}>
                                Email
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setActiveTab('mobile')}
                        className={`flex-1 items-center pb-3 border-b-2 ${activeTab === 'mobile' ? 'border-ai-green' : 'border-transparent'}`}
                    >
                        <View className="flex-row items-center gap-2">
                            <Smartphone size={16} color={activeTab === 'mobile' ? '#00ff88' : '#6b7280'} />
                            <Text className={`text-sm font-bold tracking-widest uppercase ${activeTab === 'mobile' ? 'text-ai-green' : 'text-gray-500'}`}>
                                Mobile
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Form Inputs */}
                {activeTab === 'email' ? (
                    <View className="space-y-4">
                        <View>
                            <Text className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2 ml-1">
                                Enter Email Address
                            </Text>
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                placeholder="user@example.com"
                                placeholderTextColor="rgba(107, 114, 128, 0.5)"
                                className="bg-[#0a101f] border border-gray-800 rounded-xl px-4 py-4 text-white font-bold tracking-wide text-base"
                            />
                        </View>
                        <View>
                            <Text className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2 ml-1">
                                Enter Passcode
                            </Text>
                            <TextInput
                                value={passcode}
                                onChangeText={setPasscode}
                                placeholder="••••••••"
                                secureTextEntry
                                placeholderTextColor="rgba(107, 114, 128, 0.5)"
                                className="bg-[#0a101f] border border-gray-800 rounded-xl px-4 py-4 text-white font-bold tracking-wide text-base"
                            />
                        </View>

                        <TouchableOpacity
                            onPress={handleLogin}
                            activeOpacity={0.8}
                            className="bg-[#00ff88] w-full py-4 rounded-xl items-center shadow-[0_0_20px_rgba(0,255,136,0.2)] mt-4"
                        >
                            <Text className="text-black font-black text-sm uppercase tracking-widest">
                                Initiate Session
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity className="items-center py-2">
                            <Text className="text-gray-400 text-xs font-medium">
                                New User? <Text className="text-white font-bold">Create Profile</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View className="space-y-4">
                        <View>
                            <Text className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2 ml-1">
                                Enter Mobile Number
                            </Text>
                            <TextInput
                                value={mobile}
                                onChangeText={setMobile}
                                placeholder="+62 812 3456 7890"
                                placeholderTextColor="rgba(107, 114, 128, 0.5)"
                                keyboardType="phone-pad"
                                className="bg-[#0a101f] border border-gray-800 rounded-xl px-4 py-4 text-white font-bold tracking-wide text-base"
                            />
                        </View>

                        <TouchableOpacity
                            onPress={handleLogin}
                            activeOpacity={0.8}
                            className="bg-[#00ff88] w-full py-4 rounded-xl items-center shadow-[0_0_20px_rgba(0,255,136,0.2)] mt-4"
                        >
                            <Text className="text-black font-black text-sm uppercase tracking-widest">
                                Transmit Code
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}


                {/* Divider */}
                <View className="flex-row items-center my-6">
                    <View className="flex-1 h-[1px] bg-gray-800" />
                    <Text className="mx-4 text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                        Or establish connection via
                    </Text>
                    <View className="flex-1 h-[1px] bg-gray-800" />
                </View>

                {/* Social Buttons */}
                <View className="space-y-3">
                    <TouchableOpacity
                        className="bg-white w-full py-4 rounded-xl flex-row items-center justify-center shadow-lg"
                        onPress={handleGoogleLogin}
                        activeOpacity={0.9}
                    >
                        <View className="mr-3">
                            <Svg width={20} height={20} viewBox="0 0 24 24">
                                <Path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <Path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <Path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <Path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </Svg>
                        </View>
                        <Text className="text-black font-bold text-xs uppercase tracking-widest">
                            Access via Google
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleGuest}
                        activeOpacity={0.8}
                        className="bg-transparent border border-gray-700 w-full py-4 rounded-xl flex-row items-center justify-center"
                    >
                        <Ghost size={18} color="white" className="mr-2" />
                        <Text className="text-white font-bold text-xs uppercase tracking-widest">
                            Continue as Guest
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <View className="items-center mt-8">
                    <View className="flex-row items-center opacity-50">
                        <ShieldCheck size={14} color="#6b7280" className="mr-2" />
                        <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                            Secure Encrypted Protocol
                        </Text>
                    </View>
                </View>

            </View>
        </SafeAreaView>
    );
};
