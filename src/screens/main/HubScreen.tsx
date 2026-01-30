import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { HubHeader } from '../../components/hub/HubHeader';
import { CalorieRing } from '../../components/hub/CalorieRing';
import { MacroStats } from '../../components/hub/MacroStats';
import { HealthStats, QuickActions } from '../../components/hub/DashboardWidgets';
import { useUserProfile } from '../../context/UserProfileContext';

export const HubScreen = () => {
    const { profile } = useUserProfile();

    return (
        <SafeAreaView className="flex-1 bg-[#02050a]" edges={['top']}>
            {/* Background Gradient & Texture */}
            <LinearGradient
                colors={['#0f172a', '#020617', '#000000']}
                locations={[0, 0.4, 1]}
                style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
            />

            {/* Background Grid Pattern (Simulated Texture) */}
            <View className="absolute inset-0 opacity-20 pointer-events-none">
                <View className="absolute top-[10%] left-0 w-full h-[1px] bg-cyan-500/10" />
                <View className="absolute top-[30%] left-0 w-full h-[1px] bg-cyan-500/10" />
                <View className="absolute top-[50%] left-0 w-full h-[1px] bg-cyan-500/10" />
                <View className="absolute top-[70%] left-0 w-full h-[1px] bg-cyan-500/10" />
                {/* Vertical Lines */}
                <View className="absolute left-[20%] top-0 h-full w-[1px] bg-cyan-500/10" />
                <View className="absolute left-[50%] top-0 h-full w-[1px] bg-cyan-500/10" />
                <View className="absolute left-[80%] top-0 h-full w-[1px] bg-cyan-500/10" />

                {/* Radial Glow Top Right */}
                <View className="absolute -top-20 -right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
                {/* Radial Glow Bottom Left */}
                <View className="absolute -bottom-20 -left-20 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
            </View>

            <ScrollView
                contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >
                <HubHeader />

                <View className="mb-10 mt-2">
                    <CalorieRing target={profile.dailyCalories} current={0} />
                </View>

                <MacroStats />
                <HealthStats />
                <QuickActions />
            </ScrollView>
        </SafeAreaView>
    );
};
