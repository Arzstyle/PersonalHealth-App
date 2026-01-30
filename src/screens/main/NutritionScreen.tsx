import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Animated, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Plus,
    Sparkles,
    BrainCircuit,
    Utensils,
    Flame,
    MoreHorizontal,
    PenTool,
    CheckCircle,
    Circle,
    ArrowRight,
    Bot,
    Cpu,
    Zap,
    Scan,
    Binary,
    BatteryMedium,
    Disc,
    Egg,
    Fish,
    Wheat,
    Leaf,
    Drumstick,
    Beef,
    Moon,
} from 'lucide-react-native';
import nutritionData from '../../data/nutrition.json';
import { generateMealPlanAI } from '../../services/ai';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserProfile } from '../../context/UserProfileContext';

// Types
interface Meal {
    id: number;
    name: string;
    portion?: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    completed?: boolean;
    image?: string;
}

const INITIAL_MEALS: Record<string, Meal[]> = {
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
};

// Gender-based Calorie Limits
type DietGoal = 'low-cal' | 'standard' | 'bulking';
type Gender = 'male' | 'female';

interface CalorieLimit {
    min: number;
    max: number;
    label: string;
    desc: string;
}

const CALORIE_LIMITS: Record<Gender, Record<DietGoal, CalorieLimit>> = {
    male: {
        "low-cal": { min: 1500, max: 1900, label: "1500-1900", desc: "Defisit kalori untuk penurunan berat badan" },
        "standard": { min: 2200, max: 2700, label: "2200-2700", desc: "Maintenance untuk keseimbangan energi" },
        "bulking": { min: 2700, max: 3300, label: "2700-3300", desc: "Surplus kalori untuk massa otot" },
    },
    female: {
        "low-cal": { min: 1200, max: 1600, label: "1200-1600", desc: "Defisit kalori untuk penurunan berat badan" },
        "standard": { min: 1800, max: 2200, label: "1800-2200", desc: "Maintenance untuk keseimbangan energi" },
        "bulking": { min: 2200, max: 2800, label: "2200-2800", desc: "Surplus kalori untuk massa otot" },
    }
};

const { width } = Dimensions.get('window');

export const NutritionScreen = () => {
    const navigation = useNavigation();
    const { profile } = useUserProfile();

    // Get gender-based calorie limits with fallback
    const gender: Gender = profile.gender === 'female' ? 'female' : 'male';

    // State
    const [currentDate, setCurrentDate] = useState(new Date());
    const [mealsData, setMealsData] = useState<Record<string, Meal[]>>(INITIAL_MEALS);
    const [isGenerating, setIsGenerating] = useState(false);
    const [dietGoal, setDietGoal] = useState<DietGoal>('standard');

    // Get current calorie limit based on gender and goal
    const currentLimit = CALORIE_LIMITS[gender][dietGoal];

    // Animation Values
    const spinValue = useRef(new Animated.Value(0)).current;

    // Load Data
    useEffect(() => {
        loadDietPlan();
    }, []);

    const loadDietPlan = async () => {
        try {
            const saved = await AsyncStorage.getItem('dietPlan');
            if (saved) {
                setMealsData(JSON.parse(saved));
            }
        } catch (e) {
            console.error(e);
        }
    };

    const saveDietPlan = async (newData: Record<string, Meal[]>) => {
        try {
            await AsyncStorage.setItem('dietPlan', JSON.stringify(newData));
            setMealsData(newData);
        } catch (e) {
            console.error(e);
        }
    };

    // Derived Stats
    const allMeals = useMemo(() => Object.values(mealsData).flat(), [mealsData]);
    const totalStats = useMemo(() =>
        allMeals.reduce((acc, item) => ({
            calories: acc.calories + item.calories,
            protein: acc.protein + item.protein,
            carbs: acc.carbs + item.carbs,
            fat: acc.fat + item.fat,
        }), { calories: 0, protein: 0, carbs: 0, fat: 0 }),
        [allMeals]);

    // Helpers
    const changeDate = (days: number) => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + days);
        setCurrentDate(newDate);
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
        });
    };

    const handleAiGenerate = async () => {
        setIsGenerating(true);
        // Start Spin Animation
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            })
        ).start();

        try {
            const targetCalories = (currentLimit.min + currentLimit.max) / 2;
            const plan = await generateMealPlanAI(targetCalories, dietGoal, []);

            if (plan) {
                const newPlan = {
                    breakfast: plan.breakfast.map((m: any, i: number) => ({ ...m, id: Date.now() + i, completed: false })),
                    lunch: plan.lunch.map((m: any, i: number) => ({ ...m, id: Date.now() + 100 + i, completed: false })),
                    dinner: plan.dinner.map((m: any, i: number) => ({ ...m, id: Date.now() + 200 + i, completed: false })),
                    snacks: plan.snack ? plan.snack.map((m: any, i: number) => ({ ...m, id: Date.now() + 300 + i, completed: false })) : [],
                };
                await saveDietPlan(newPlan);
                Alert.alert("Success", "Meal plan generated successfully!");
            }
        } catch (e) {
            Alert.alert("Error", "Failed to generate meal plan");
        } finally {
            setIsGenerating(false);
            spinValue.setValue(0);
        }
    };

    const toggleMealCompletion = (mealType: string, id: number) => {
        const updatedCategory = mealsData[mealType].map(meal =>
            meal.id === id ? { ...meal, completed: !meal.completed } : meal
        );
        const newData = { ...mealsData, [mealType]: updatedCategory };
        saveDietPlan(newData);
    };

    const removeMeal = (mealType: string, id: number) => {
        const updatedCategory = mealsData[mealType].filter(meal => meal.id !== id);
        const newData = { ...mealsData, [mealType]: updatedCategory };
        saveDietPlan(newData);
    };

    // Theme Helpers
    const getCategoryStyle = (type: string) => {
        switch (type) {
            case 'breakfast': return { icon: Zap, color: 'text-amber-500', bg: 'bg-amber-100', border: 'border-amber-200', label: 'Sarapan' };
            case 'lunch': return { icon: BatteryMedium, color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-200', label: 'Makan Siang' };
            case 'dinner': return { icon: Moon, color: 'text-indigo-600', bg: 'bg-indigo-100', border: 'border-indigo-200', label: 'Makan Malam' };
            default: return { icon: Disc, color: 'text-pink-600', bg: 'bg-pink-100', border: 'border-pink-200', label: 'Camilan' };
        }
    };

    const getFoodTheme = (name: string) => {
        const n = name.toLowerCase();
        if (n.match(/ayam|chicken|bebek|drumstick/)) return { icon: Drumstick, color: '#ea580c', bg: 'bg-orange-50' };
        if (n.match(/daging|sapi|beef|burger|steak|rendang/)) return { icon: Beef, color: '#dc2626', bg: 'bg-red-50' };
        if (n.match(/ikan|fish|lele|gurame|seafood|udang/)) return { icon: Fish, color: '#2563eb', bg: 'bg-blue-50' };
        if (n.match(/telur|egg/)) return { icon: Egg, color: '#d97706', bg: 'bg-amber-50' };
        if (n.match(/sayur|salad|brokoli|bayam|pecel|gado|kangkung|capcay/)) return { icon: Leaf, color: '#059669', bg: 'bg-emerald-50' };
        if (n.match(/nasi|rice|bubur|lontong|roti|bread/)) return { icon: Wheat, color: '#475569', bg: 'bg-slate-50' };
        return { icon: Utensils, color: '#475569', bg: 'bg-slate-50' };
    };

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    const goals = [
        { id: 'low-cal', label: 'Low Cal', sub: 'Lose fat', color: 'orange' },
        { id: 'standard', label: 'Standard', sub: 'Maintain', color: 'blue' },
        { id: 'bulking', label: 'Bulking', sub: 'Build muscle', color: 'emerald' },
    ];

    return (
        <SafeAreaView className="flex-1 bg-[#02050a]" edges={['top']}>
            {/* Background Gradient & Texture */}
            <LinearGradient
                colors={['#0f172a', '#020617', '#000000']}
                locations={[0, 0.4, 1]}
                style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
            />

            {/* Background Grid Pattern */}
            <View className="absolute inset-0 opacity-20 pointer-events-none">
                <View className="absolute top-[10%] left-0 w-full h-[1px] bg-cyan-500/10" />
                <View className="absolute top-[30%] left-0 w-full h-[1px] bg-cyan-500/10" />
                <View className="absolute top-[50%] left-0 w-full h-[1px] bg-cyan-500/10" />
                <View className="absolute top-[70%] left-0 w-full h-[1px] bg-cyan-500/10" />
                <View className="absolute left-[20%] top-0 h-full w-[1px] bg-cyan-500/10" />
                <View className="absolute left-[50%] top-0 h-full w-[1px] bg-cyan-500/10" />
                <View className="absolute left-[80%] top-0 h-full w-[1px] bg-cyan-500/10" />
                <View className="absolute -top-20 -right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
                <View className="absolute -bottom-20 -left-20 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Header */}
                <View className="px-6 pt-4 mb-6">
                    <View className="flex-row items-center justify-between mb-4">
                        <View>
                            <Text className="text-4xl font-black text-white">Meal Plan</Text>
                            <Text className="text-slate-400 font-medium">Rencanakan nutrisimu.</Text>
                        </View>
                        <View className="w-12 h-12 bg-cyan-500/10 items-center justify-center border border-cyan-500/30" style={{ borderRadius: 24 }}>
                            <BrainCircuit size={28} color="#22d3ee" />
                        </View>
                    </View>

                    {/* Date Navigation */}
                    <View className="flex-row items-center justify-between bg-slate-900/50 p-2 border border-white/5 backdrop-blur-md" style={{ borderRadius: 40 }}>
                        <TouchableOpacity onPress={() => changeDate(-1)} className="p-3 bg-white/5" style={{ borderRadius: 999 }}>
                            <ChevronLeft size={20} color="#94a3b8" />
                        </TouchableOpacity>
                        <View className="flex-row items-center gap-2">
                            <CalendarIcon size={16} color="#22d3ee" />
                            <Text className="font-bold text-white">{formatDate(currentDate)}</Text>
                        </View>
                        <TouchableOpacity onPress={() => changeDate(1)} className="p-3 bg-white/5" style={{ borderRadius: 999 }}>
                            <ChevronRight size={20} color="#94a3b8" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Summary Card */}
                <View className="mx-6 mb-8 bg-slate-900/40 p-6 border border-white/5 backdrop-blur-sm" style={{ borderRadius: 48 }}>
                    <View className="flex-row justify-between items-center mb-6">
                        <View className="flex-row items-center gap-2">
                            <View className="p-2 bg-orange-500/10" style={{ borderRadius: 20 }}>
                                <Flame size={20} color="#f97316" fill="#f97316" />
                            </View>
                            <Text className="text-lg font-bold text-white">Ringkasan</Text>
                        </View>
                        <View className="bg-white/5 px-3 py-1 border border-white/5" style={{ borderRadius: 999 }}>
                            <Text className="text-xs font-bold text-slate-400">Target: {currentLimit.label} kcal</Text>
                        </View>
                    </View>

                    <View className="flex-row flex-wrap justify-between gap-y-4">
                        {[
                            { l: 'Kalori', v: totalStats.calories, u: 'kcal', c: '#f97316', bg: 'bg-orange-500/10' },
                            { l: 'Protein', v: totalStats.protein, u: 'g', c: '#3b82f6', bg: 'bg-blue-500/10' },
                            { l: 'Karbo', v: totalStats.carbs, u: 'g', c: '#10b981', bg: 'bg-emerald-500/10' },
                            { l: 'Lemak', v: totalStats.fat, u: 'g', c: '#eab308', bg: 'bg-yellow-500/10' },
                        ].map((stat, i) => (
                            <View key={i} className={`w-[48%] p-4 ${stat.bg} mb-2 border border-white/5`} style={{ borderRadius: 32 }}>
                                <Text className="text-xs font-bold text-slate-400 uppercase mb-1">{stat.l}</Text>
                                <Text className="text-2xl font-black text-white" style={{ color: stat.c }}>{Math.round(stat.v)}</Text>
                                <Text className="text-xs text-slate-500 font-medium">{stat.u}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Goal Selector */}
                <View className="mx-6 mb-6">
                    <Text className="text-white font-bold text-lg mb-4 ml-2">Pilih Target</Text>
                    <View className="flex-row justify-between gap-2">
                        {goals.map((g) => {
                            const isActive = dietGoal === g.id;
                            return (
                                <TouchableOpacity
                                    key={g.id}
                                    onPress={() => setDietGoal(g.id as any)}
                                    className={`flex-1 p-4 border ${isActive ? `bg-${g.color}-500/20 border-${g.color}-500` : 'bg-slate-900/40 border-white/5'}`}
                                    style={{ borderRadius: 32 }}
                                >
                                    <Text className={`font-bold text-center ${isActive ? 'text-white' : 'text-slate-400'}`}>{g.label}</Text>
                                    <Text className={`text-[10px] text-center mt-1 ${isActive ? 'text-white/80' : 'text-slate-600'}`}>{g.sub}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* AI Generator Button */}
                <View className="mx-6 mb-8">
                    <TouchableOpacity
                        onPress={handleAiGenerate}
                        disabled={isGenerating}
                        className="w-full relative overflow-hidden shadow-lg shadow-cyan-500/20"
                        style={{ borderRadius: 48 }}
                    >
                        <LinearGradient
                            colors={isGenerating ? ['#f97316', '#ea580c'] : ['#06b6d4', '#2563eb']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            className="p-[1px]"
                            style={{ borderRadius: 48 }}
                        >
                            <View className="bg-[#0f172a] p-6 flex-row items-center justify-between" style={{ borderRadius: 47 }}>
                                <View>
                                    <View className="flex-row items-center gap-2 mb-2">
                                        <View className={`px-2 py-1 rounded-full ${isGenerating ? 'bg-orange-500/20' : 'bg-cyan-500/20'}`}>
                                            <Text className={`text-[10px] font-bold ${isGenerating ? 'text-orange-400' : 'text-cyan-400'}`}>
                                                {isGenerating ? 'PROCESSING...' : 'AI READY'}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text className="text-xl font-black text-white">
                                        {isGenerating ? 'Generating...' : 'AI Auto-Generate'}
                                    </Text>
                                    <Text className="text-xs text-slate-400 mt-1 max-w-[150px]">
                                        Biarkan AI menyusun menu harian lengkap.
                                    </Text>
                                </View>

                                <View className="w-16 h-16 items-center justify-center">
                                    <Animated.View style={{ transform: [{ rotate: spin }] }}>
                                        {isGenerating ? (
                                            <Cpu size={32} color="#ea580c" />
                                        ) : (
                                            <Sparkles size={32} color="#22d3ee" />
                                        )}
                                    </Animated.View>
                                </View>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* Manual Manual Button */}
                <View className="mx-6 mb-8">
                    <TouchableOpacity
                        onPress={() => Alert.alert("Coming Soon", "Fitur manual search akan segera hadir!")}
                        className="bg-slate-900/60 border border-white/5 p-5 flex-row justify-between items-center"
                        style={{ borderRadius: 40 }}
                    >
                        <View>
                            <View className="flex-row items-center gap-2 mb-2">
                                <View className="p-1.5 bg-emerald-500/10 rounded-full">
                                    <PenTool size={14} color="#10b981" />
                                </View>
                                <Text className="text-emerald-400 font-bold text-xs bg-emerald-500/10 px-2 py-0.5 rounded-full">Manual</Text>
                            </View>
                            <Text className="text-lg font-bold text-white">Susun Manual</Text>
                        </View>
                        <View className="w-10 h-10 bg-white/5 rounded-full items-center justify-center">
                            <ArrowRight size={20} color="#10b981" />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Meal Lists */}
                <View className="px-6 gap-6">
                    {['breakfast', 'lunch', 'dinner', 'snacks'].map((mealType) => {
                        const style = getCategoryStyle(mealType);
                        const CategoryIcon = style.icon;
                        const meals = mealsData[mealType];
                        const totalCal = meals.reduce((acc, curr) => acc + curr.calories, 0);

                        // Dark mode adaption for category styles
                        const darkBg = style.bg.replace('bg-', 'bg-').replace('-100', '-500/10');
                        const darkBorder = style.border.replace('border-', 'border-').replace('-200', '-500/20');

                        return (
                            <View key={mealType} className="bg-slate-900/40 p-5 border border-white/5 backdrop-blur-sm" style={{ borderRadius: 48 }}>
                                <View className="flex-row justify-between items-center mb-4">
                                    <View className="flex-row items-center gap-3">
                                        <View className={`p-4 ${darkBg} border ${darkBorder}`} style={{ borderRadius: 28 }}>
                                            <CategoryIcon size={24} className={style.color} />
                                        </View>
                                        <View>
                                            <Text className="font-bold text-lg text-white">{style.label}</Text>
                                            <Text className="text-xs text-slate-400">{meals.length} Items • {Math.round(totalCal)} kcal</Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity className="p-3 bg-white/5 rounded-full">
                                        <Plus size={20} color="#94a3b8" />
                                    </TouchableOpacity>
                                </View>

                                {meals.length > 0 ? (
                                    <View className="gap-3">
                                        {meals.map((food) => {
                                            const theme = getFoodTheme(food.name);
                                            const FoodIcon = theme.icon;

                                            // Dark mode theme
                                            const itemBg = food.completed ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-slate-800/50 border-white/5';
                                            const iconBg = theme.bg.replace('bg-', 'bg-').replace('-50', '-500/20');

                                            return (
                                                <View key={food.id} className={`p-4 border flex-row items-center gap-4 ${itemBg}`} style={{ borderRadius: 32 }}>
                                                    <TouchableOpacity onPress={() => toggleMealCompletion(mealType, food.id)}>
                                                        {food.completed ? (
                                                            <CheckCircle size={24} color="#10b981" />
                                                        ) : (
                                                            <Circle size={24} color="#475569" />
                                                        )}
                                                    </TouchableOpacity>

                                                    <View className={`w-12 h-12 items-center justify-center ${iconBg}`} style={{ borderRadius: 20 }}>
                                                        <FoodIcon size={20} color={theme.color} />
                                                    </View>

                                                    <View className="flex-1">
                                                        <Text className={`font-bold text-sm ${food.completed ? 'text-slate-500 line-through' : 'text-white'}`}>
                                                            {food.name}
                                                        </Text>
                                                        <View className="flex-row items-center gap-2 mt-1">
                                                            <Text className="text-[10px] font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-lg">
                                                                {Math.round(food.calories)} kcal
                                                            </Text>
                                                            <Text className="text-[10px] text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-lg">
                                                                {food.protein}g P
                                                            </Text>
                                                        </View>
                                                    </View>

                                                    <TouchableOpacity onPress={() => removeMeal(mealType, food.id)}>
                                                        <MoreHorizontal size={20} color="#475569" />
                                                    </TouchableOpacity>
                                                </View>
                                            );
                                        })}
                                    </View>
                                ) : (
                                    <View className="h-28 border-2 border-dashed border-white/10 items-center justify-center bg-white/5" style={{ borderRadius: 40 }}>
                                        <Text className="text-slate-500 text-xs text-center">Belum ada makanan.{'\n'}Klik AI Generate untuk isi otomatis.</Text>
                                    </View>
                                )}
                            </View>
                        );
                    })}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};
