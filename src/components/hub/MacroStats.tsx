import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { Cpu, Zap, Disc } from 'lucide-react-native';
import { useUserProfile } from '../../context/UserProfileContext';

export const MacroStats = () => {
    const { profile } = useUserProfile();
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            delay: 100,
            useNativeDriver: true,
        }).start();
    }, []);

    // For guests: targets are 0, for registered users calculate based on calories
    const isGuest = profile.isGuest;
    const targetCalories = profile.dailyCalories;

    // Standard macro split: 30% protein, 45% carbs, 25% fat (or 0 for guests)
    const proteinTarget = isGuest ? 0 : Math.round((targetCalories * 0.30) / 4);
    const carbsTarget = isGuest ? 0 : Math.round((targetCalories * 0.45) / 4);
    const fatTarget = isGuest ? 0 : Math.round((targetCalories * 0.25) / 9);

    const macros = [
        { label: 'PROTEIN', current: 0, target: proteinTarget, color: 'bg-blue-500', icon: Cpu, iconColor: '#3b82f6', bg: 'bg-blue-500/10' },
        { label: 'CARBS', current: 0, target: carbsTarget, color: 'bg-emerald-500', icon: Zap, iconColor: '#10b981', bg: 'bg-emerald-500/10' },
        { label: 'FAT', current: 0, target: fatTarget, color: 'bg-amber-500', icon: Disc, iconColor: '#f59e0b', bg: 'bg-amber-500/10' },
    ];

    return (
        <Animated.View style={{ opacity: fadeAnim }} className="bg-[#0a101f]/90 border border-white/5 rounded-3xl p-8 mb-6 shadow-2xl">
            <View className="flex-row justify-between items-center mb-8">
                <View>
                    <Text className="text-white text-xl font-bold flex-row items-center mb-1">
                        Daily Fuel <Cpu size={18} color="#06b6d4" className="ml-2" />
                    </Text>
                    <Text className="text-gray-500 text-xs font-medium">
                        Target: <Text className="text-white font-bold">{targetCalories}</Text> kcal
                    </Text>
                </View>
                <View className="bg-slate-800/50 px-4 py-1.5 rounded-full border border-white/10">
                    <Text className="text-gray-400 text-[10px] font-bold">{isGuest ? 'GUEST' : 'NO DATA'}</Text>
                </View>
            </View>

            <View className="space-y-7">
                {macros.map((m, i) => (
                    <View key={i}>
                        <View className="flex-row justify-between mb-2">
                            <View className="flex-row items-center gap-2">
                                <m.icon size={14} color={m.iconColor} />
                                <Text className="text-gray-400 text-[10px] font-bold uppercase">
                                    {m.label}
                                </Text>
                            </View>
                            <Text className="text-white text-xs font-mono font-bold">
                                {m.current}g <Text className="text-gray-600">/ {m.target}g</Text>
                            </Text>
                        </View>
                        {/* Progress Bar */}
                        <View className={`h-3 ${m.bg} rounded-full overflow-hidden border border-white/5`}>
                            <View
                                className={`h-full ${m.color} rounded-full shadow-[0_0_10px_currentColor]`}
                                style={{ width: `${Math.max((m.current / m.target) * 100, 5)}%`, opacity: 0.8 }}
                            />
                        </View>
                    </View>
                ))}
            </View>
        </Animated.View>
    );
};
