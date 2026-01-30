import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { Activity, Droplets, Plus, Dumbbell, ScanLine, ChevronRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useUserProfile } from '../../context/UserProfileContext';

// Helper function to calculate BMI
const calculateBMI = (weight: number, height: number): number => {
    if (height <= 0 || weight <= 0) return 0;
    const heightInMeters = height / 100;
    return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;
};

const getBMICategory = (bmi: number): { label: string; color: string } => {
    if (bmi === 0) return { label: 'Unknown', color: '#64748b' };
    if (bmi < 18.5) return { label: 'Underweight', color: '#f59e0b' };
    if (bmi < 25) return { label: 'Normal Weight ↗', color: '#8b5cf6' };
    if (bmi < 30) return { label: 'Overweight', color: '#f97316' };
    return { label: 'Obese', color: '#ef4444' };
};

export const HealthStats = () => {
    const { profile } = useUserProfile();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                delay: 200,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 6,
                tension: 40,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    // Calculate BMI from profile
    const bmi = calculateBMI(profile.weight, profile.height);
    const bmiCategory = getBMICategory(bmi);
    const bmiDisplay = profile.isGuest || bmi === 0 ? '?' : bmi.toFixed(1);

    return (
        <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }} className="flex-row gap-4 mb-6">
            {/* BMI Card */}
            <View className="flex-1 bg-[#0a101f]/90 border border-violet-500/20 rounded-3xl p-6 relative overflow-hidden shadow-2xl shadow-violet-500/5">
                <View className="absolute -right-6 -top-6 w-24 h-24 bg-violet-500/10 rounded-full blur-2xl" />

                <View className="flex-row justify-between items-start mb-4">
                    <View className="p-3 bg-violet-500/10 rounded-2xl border border-violet-500/10">
                        <Activity size={20} color="#8b5cf6" />
                    </View>
                    <View className="px-3 py-1 bg-violet-500/5 rounded-full border border-violet-500/10">
                        <Text className="text-[8px] font-bold text-violet-400 uppercase">Health Score</Text>
                    </View>
                </View>

                <Text className="text-white text-5xl font-black font-mono mb-1">
                    {bmiDisplay}
                </Text>
                <Text className="text-gray-500 text-[10px] font-bold uppercase mb-4">Body Mass Index</Text>

                <View className="bg-violet-500/10 py-1.5 px-3 rounded-xl self-start border border-violet-500/20">
                    <Text className="text-violet-300 text-[10px] font-bold">{bmiCategory.label}</Text>
                </View>
            </View>

            {/* Hydration Card */}
            <View className="flex-1 bg-[#0a101f]/90 border border-cyan-500/20 rounded-3xl p-6 relative overflow-hidden shadow-2xl shadow-cyan-500/5">
                <View className="absolute -right-6 -top-6 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl" />

                <View className="flex-row justify-between items-start mb-4">
                    <View className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/10">
                        <Droplets size={20} color="#06b6d4" />
                    </View>
                    <View className="px-3 py-1 bg-cyan-500/5 rounded-full border border-cyan-500/10">
                        <Text className="text-[8px] font-bold text-cyan-400 uppercase">Hydration</Text>
                    </View>
                </View>

                <Text className="text-white text-5xl font-black font-mono mb-1">
                    0<Text className="text-xl text-gray-500 font-bold">L</Text>
                </Text>
                <Text className="text-gray-500 text-[10px] font-bold uppercase mb-4">Goal: 2.5L</Text>

                {/* Mini Bar Chart */}
                <View className="flex-row h-8 gap-1 items-end mt-auto opacity-80">
                    {[20, 60, 40, 70, 50, 90].map((h, i) => (
                        <View key={i} className="flex-1 bg-gray-800/50 rounded-full overflow-hidden h-full justify-end border border-white/5">
                            <View style={{ height: `${h}%`, backgroundColor: '#06b6d4' }} className="rounded-full shadow-[0_0_10px_#06b6d4]" />
                        </View>
                    ))}
                </View>
            </View>
        </Animated.View>
    );
};

export const QuickActions = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const navigation = useNavigation();

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            delay: 400,
            useNativeDriver: true,
        }).start();
    }, []);

    const actions = [
        { label: 'Log Meal', desc: 'Track calories', icon: Plus, color: ['#10b981', '#14b8a6'], iconColor: '#10b981', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', tab: 'Nutrition' },
        { label: 'Workout', desc: 'Log activity', icon: Dumbbell, color: ['#3b82f6', '#4f46e5'], iconColor: '#3b82f6', bg: 'bg-blue-500/10', border: 'border-blue-500/20', tab: 'Training' },
        { label: 'AI Scan', desc: 'Analyze food', icon: ScanLine, color: ['#8b5cf6', '#a855f7'], iconColor: '#8b5cf6', bg: 'bg-violet-500/10', border: 'border-violet-500/20', tab: 'Search' },
    ];

    const handleAction = (tab: string) => {
        // Navigate to the specific tab
        (navigation as any).navigate(tab);
    };

    return (
        <Animated.View style={{ opacity: fadeAnim }} className="bg-[#0a101f]/90 border border-white/5 rounded-3xl p-8 mb-32 shadow-2xl">
            <Text className="text-white font-bold text-xl mb-6 flex-row items-center">
                Quick Actions
            </Text>

            <View className="gap-4">
                {actions.map((action, i) => (
                    <TouchableOpacity
                        key={i}
                        activeOpacity={0.7}
                        onPress={() => handleAction(action.tab)}
                        className="flex-row items-center bg-[#02050a]/50 border border-white/5 p-4 rounded-[2rem] hover:bg-white/5"
                    >
                        <View className={`w-14 h-14 rounded-2xl ${action.bg} items-center justify-center mr-5 border ${action.border} shadow-lg`}>
                            <action.icon size={26} color={action.iconColor} />
                        </View>
                        <View className="flex-1">
                            <Text className="text-white font-bold text-lg">{action.label}</Text>
                            <Text className="text-gray-500 text-xs font-medium mt-0.5">{action.desc}</Text>
                        </View>
                        <View className="w-10 h-10 bg-white/5 rounded-full items-center justify-center border border-white/5">
                            <ChevronRight size={18} color="#6b7280" />
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </Animated.View>
    );
};
