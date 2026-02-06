import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { useUserProfile } from '../../context/UserProfileContext';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { User, Activity, Calendar, ArrowRight, RefreshCcw } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'WelcomeBack'>;

export const WelcomeBackScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const { profile, setGuestProfile } = useUserProfile();
    const { user } = useAuth();
    const { t, language } = useUI();
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting(language === 'id' ? 'Selamat Pagi' : 'Good Morning');
        else if (hour < 18) setGreeting(language === 'id' ? 'Selamat Siang' : 'Good Afternoon');
        else setGreeting(language === 'id' ? 'Selamat Malam' : 'Good Evening');
    }, [language]);

    const handleContinue = () => {
        navigation.replace('Main');
    };

    const handleNewData = () => {
        // Here we could reset profile if needed, or just overwrite in BodyMetrics
        // For safety, let's keep the core ID but reset metrics? 
        // Or just let BodyMetrics overwrite.
        navigation.replace('BodyMetrics');
    };

    return (
        <SafeAreaView className="flex-1 bg-ai-bg">
            <StatusBar barStyle="light-content" />

            {/* Background Elements */}
            <View className="absolute inset-0 opacity-10">
                <LinearGradient
                    colors={['transparent', '#00ff88', 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ flex: 1 }}
                />
            </View>

            <View className="flex-1 px-6 justify-center">
                {/* Header */}
                <View className="items-center mb-10">
                    <View className="w-20 h-20 rounded-full bg-ai-green/10 items-center justify-center border border-ai-green/30 mb-6 shadow-lg shadow-ai-green/20">
                        <User size={40} color="#00ff88" />
                    </View>
                    <Text className="text-ai-green text-sm font-bold uppercase tracking-widest mb-2">
                        {greeting}
                    </Text>
                    <Text className="text-white text-3xl font-black text-center">
                        {profile.name || user?.displayName || 'User'}!
                    </Text>
                    <Text className="text-slate-400 text-center mt-2 max-w-[280px]">
                        {language === 'id'
                            ? 'Kami menemukan data kesehatan Anda sebelumnya. Ingin melanjutkannya?'
                            : 'We found your previous health data. Would you like to continue?'}
                    </Text>
                </View>

                {/* Data Card */}
                <View className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 mb-10">
                    <View className="flex-row justify-between mb-6">
                        <View>
                            <Text className="text-slate-500 text-xs font-bold uppercase mb-1">{t('profile.weight')}</Text>
                            <Text className="text-white text-2xl font-black">{profile.weight} kg</Text>
                        </View>
                        <View className="items-end">
                            <Text className="text-slate-500 text-xs font-bold uppercase mb-1">{t('profile.height')}</Text>
                            <Text className="text-white text-2xl font-black">{profile.height} cm</Text>
                        </View>
                    </View>

                    <View className="w-full h-[1px] bg-white/10 mb-6" />

                    <View className="flex-row gap-4">
                        <View className="flex-1 bg-white/5 p-3 rounded-2xl border border-white/5 flex-row items-center gap-3">
                            <Activity size={20} color="#f97316" />
                            <View>
                                <Text className="text-slate-400 text-[10px] font-bold uppercase">Calorie Goal</Text>
                                <Text className="text-white font-bold">{Math.round(profile.dailyCalories)} kcal</Text>
                            </View>
                        </View>
                        <View className="flex-1 bg-white/5 p-3 rounded-2xl border border-white/5 flex-row items-center gap-3">
                            <Calendar size={20} color="#22d3ee" />
                            <View>
                                <Text className="text-slate-400 text-[10px] font-bold uppercase">Age</Text>
                                <Text className="text-white font-bold">{profile.age} y.o</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Actions */}
                <View className="gap-4">
                    <TouchableOpacity
                        onPress={handleContinue}
                        className="bg-ai-green w-full py-4 rounded-2xl flex-row items-center justify-center shadow-lg shadow-ai-green/20"
                    >
                        <Text className="text-black font-black text-sm uppercase tracking-widest mr-2">
                            {language === 'id' ? 'Lanjutkan' : 'Continue'}
                        </Text>
                        <ArrowRight size={20} color="black" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleNewData}
                        className="bg-transparent border border-white/10 w-full py-4 rounded-2xl flex-row items-center justify-center"
                    >
                        <RefreshCcw size={18} color="#94a3b8" className="mr-2" />
                        <Text className="text-slate-400 font-bold text-sm uppercase tracking-widest">
                            {language === 'id' ? 'Buat Data Baru' : 'Create New Data'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};
