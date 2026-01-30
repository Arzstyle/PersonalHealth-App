import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { Activity, TrendingDown, TrendingUp, Target, CheckCircle, Armchair, Zap, Cpu } from 'lucide-react-native';
import { calculateDailyCalories } from '../../utils/calculations';
import { useUserProfile } from '../../context/UserProfileContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'MetabolicProfile'>;
type RouteProps = RouteProp<RootStackParamList, 'MetabolicProfile'>;

// Activity Level Options
const ACTIVITY_OPTIONS = [
    { id: 'sedentary', label: 'LOW', icon: Armchair },
    { id: 'moderate', label: 'MED', icon: Activity },
    { id: 'active', label: 'HIGH', icon: Zap },
] as const;

// Goal Options
const GOAL_OPTIONS = [
    { id: 'lose', label: 'LOSS', icon: TrendingDown, color: '#4ade80' },
    { id: 'maintain', label: 'GAIN', icon: TrendingUp, color: '#facc15' },
    { id: 'gain', label: 'BUILD', icon: Target, color: '#60a5fa' },
] as const;

export const MetabolicProfileScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<RouteProps>();
    const { setProfile } = useUserProfile();

    const { height, weight, age, gender } = route.params;

    const [activityLevel, setActivityLevel] = useState<'sedentary' | 'moderate' | 'active'>('moderate');
    const [goal, setGoal] = useState<'lose' | 'maintain' | 'gain'>('lose');

    const dailyCalories = useMemo(() => {
        return calculateDailyCalories(weight, height, age, gender, activityLevel, goal);
    }, [weight, height, age, gender, activityLevel, goal]);

    const handleBack = () => {
        navigation.goBack();
    };

    const handleFinish = async () => {
        await setProfile({
            name: 'User',
            isGuest: false,
            height,
            weight,
            age,
            gender,
            activityLevel: activityLevel === 'sedentary' ? 'sedentary' : activityLevel === 'moderate' ? 'moderate' : 'active',
            goal,
            dailyCalories: dailyCalories,
            dietaryRestrictions: [],
            allergies: [],
        });

        navigation.reset({
            index: 0,
            routes: [{ name: 'Main' }],
        });
    };

    return (
        <SafeAreaView className="flex-1 bg-[#02050a]">
            <LinearGradient
                colors={['#0f172a', '#020617', '#000000']}
                locations={[0, 0.4, 1]}
                style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
            />

            <View className="flex-1 px-6">
                {/* Progress Indicator */}
                <View className="flex-row justify-center gap-2 pt-2 pb-4">
                    <View className="w-16 h-1 bg-ai-green rounded-full" />
                    <View className="w-16 h-1 bg-ai-green rounded-full" />
                </View>

                {/* Header - Compact */}
                <View className="items-center mb-4">
                    <View className="w-12 h-12 bg-ai-green/20 rounded-xl items-center justify-center mb-2 border border-ai-green/30">
                        <Activity size={22} color="#4ade80" />
                    </View>
                    <Text className="text-white text-2xl font-black">Metabolic Profile</Text>
                    <Text className="text-slate-400 text-xs">We calculate your BMR & TDEE based on this.</Text>
                </View>

                {/* Activity Level */}
                <View className="mb-4">
                    <Text className="text-slate-500 text-[10px] font-bold uppercase mb-2 ml-1">ACTIVITY LEVEL</Text>
                    <View className="flex-row gap-2">
                        {ACTIVITY_OPTIONS.map((option) => {
                            const isSelected = activityLevel === option.id;
                            const IconComponent = option.icon;
                            return (
                                <TouchableOpacity
                                    key={option.id}
                                    onPress={() => setActivityLevel(option.id as any)}
                                    className={`flex-1 items-center py-4 rounded-xl border ${isSelected
                                        ? 'bg-ai-green/20 border-ai-green'
                                        : 'bg-slate-900/80 border-white/10'
                                        }`}
                                >
                                    <View className="relative">
                                        <IconComponent size={22} color={isSelected ? '#4ade80' : '#64748b'} />
                                        {isSelected && (
                                            <View className="absolute -top-1 -right-1 bg-ai-green rounded-full p-0.5">
                                                <CheckCircle size={8} color="#000" />
                                            </View>
                                        )}
                                    </View>
                                    <Text className={`mt-1.5 font-bold text-xs ${isSelected ? 'text-ai-green' : 'text-slate-400'}`}>
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Primary Goal */}
                <View className="mb-4">
                    <Text className="text-slate-500 text-[10px] font-bold uppercase mb-2 ml-1">PRIMARY GOAL</Text>
                    <View className="flex-row gap-2">
                        {GOAL_OPTIONS.map((option) => {
                            const isSelected = goal === option.id;
                            const IconComponent = option.icon;
                            return (
                                <TouchableOpacity
                                    key={option.id}
                                    onPress={() => setGoal(option.id as any)}
                                    className={`flex-1 items-center py-4 rounded-xl border ${isSelected
                                        ? 'border-2'
                                        : 'bg-slate-900/80 border-white/10'
                                        }`}
                                    style={isSelected ? {
                                        backgroundColor: `${option.color}15`,
                                        borderColor: option.color
                                    } : {}}
                                >
                                    <View className="relative">
                                        <IconComponent size={22} color={isSelected ? option.color : '#64748b'} />
                                        {isSelected && (
                                            <View className="absolute -top-1 -right-1 rounded-full p-0.5" style={{ backgroundColor: option.color }}>
                                                <CheckCircle size={8} color="#000" />
                                            </View>
                                        )}
                                    </View>
                                    <Text className={`mt-1.5 font-bold text-xs`} style={{ color: isSelected ? option.color : '#94a3b8' }}>
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Daily Calorie Target - Compact */}
                <View className="bg-slate-900/80 border border-white/10 rounded-xl p-4 mb-4">
                    <View className="flex-row items-center">
                        <View className="w-10 h-10 bg-ai-green/20 rounded-lg items-center justify-center mr-3 border border-ai-green/30">
                            <Cpu size={18} color="#4ade80" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-ai-green text-[9px] font-bold uppercase">DAILY CALORIE TARGET</Text>
                            <Text className="text-slate-400 text-[9px]">Based on Activity & Goal</Text>
                        </View>
                        <View className="flex-row items-baseline">
                            <Text className="text-white text-3xl font-black">{dailyCalories}</Text>
                            <Text className="text-slate-400 text-xs font-bold ml-1">kcal</Text>
                        </View>
                    </View>
                </View>

                {/* Spacer */}
                <View className="flex-1" />

                {/* Action Buttons - Fixed at bottom */}
                <View className="flex-row gap-2 mb-4">
                    <TouchableOpacity
                        onPress={handleBack}
                        className="px-5 py-3 rounded-xl bg-slate-800 border border-white/10"
                    >
                        <Text className="text-slate-300 font-bold text-sm">Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleFinish}
                        className="flex-1 flex-row items-center justify-center py-3 rounded-xl bg-ai-green"
                    >
                        <CheckCircle size={16} color="#000" />
                        <Text className="text-black font-bold text-sm ml-2">Calculate & Finish</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};
