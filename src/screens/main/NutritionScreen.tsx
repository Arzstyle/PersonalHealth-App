import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Animated, Image, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
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
    Search,
    X,
    Check,
    Coffee,
    Sun,
    Sunset,
    Cookie,
    Edit,
    Trash2,
} from 'lucide-react-native';
import nutritionData from '../../data/nutrition.json';
import { generateMealPlanAI } from '../../services/ai';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserProfile } from '../../context/UserProfileContext';
import { useUI } from '../../context/UIContext';

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
    const { t, language } = useUI();

    // Get gender-based calorie limits with fallback
    const gender: Gender = profile.gender === 'female' ? 'female' : 'male';

    // State
    const [currentDate, setCurrentDate] = useState(new Date());
    const [mealsData, setMealsData] = useState<Record<string, Meal[]>>(INITIAL_MEALS);
    const [isGenerating, setIsGenerating] = useState(false);
    const [dietGoal, setDietGoal] = useState<DietGoal>('standard');

    const [showAddModal, setShowAddModal] = useState(false);
    const [showGuideModal, setShowGuideModal] = useState(false);
    const [showActionModal, setShowActionModal] = useState(false);
    const [selectedFoodAction, setSelectedFoodAction] = useState<{ mealType: string; food: Meal } | null>(null);
    const [selectedMealType, setSelectedMealType] = useState<string>('breakfast');

    // Get current calorie limit based on gender and goal
    // Get current calorie limit based on gender and goal
    const currentLimit = useMemo(() => {
        // Prioritize profile calculated calories if available and not guest default (2000)
        // Assuming 2000 is default guest, if it differs significantly or is set by calculations
        if (profile.dailyCalories && profile.dailyCalories !== 2000) {
            return {
                min: Math.round(profile.dailyCalories - 200),
                max: Math.round(profile.dailyCalories + 200),
                label: `${Math.round(profile.dailyCalories)}`,
                desc: language === 'id' ? "Target harian personal" : "Personal daily target"
            };
        }
        return CALORIE_LIMITS[gender][dietGoal];
    }, [profile.dailyCalories, gender, dietGoal, language]);

    // Animation Values
    const spinValue = useRef(new Animated.Value(0)).current;

    // Load Data on Focus
    useFocusEffect(
        useCallback(() => {
            loadDietPlan();
        }, [])
    );

    // Initial Load
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
        return date.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
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
                Alert.alert(t('common.success'), t('meal.success'));
            }
        } catch (e) {
            Alert.alert(t('common.error'), t('meal.error'));
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
    // Action Modal Handlers
    const openActionModal = (mealType: string, food: Meal) => {
        setSelectedFoodAction({ mealType, food });
        setShowActionModal(true);
    };

    const handleUpdateMeal = () => {
        if (!selectedFoodAction) return;
        setShowActionModal(false);
        (navigation as any).navigate('Search', {
            mealType: selectedFoodAction.mealType,
            isReplacing: true,
            replaceId: selectedFoodAction.food.id
        });
    };

    const handleDeleteMeal = () => {
        if (!selectedFoodAction) return;
        removeMeal(selectedFoodAction.mealType, selectedFoodAction.food.id);
        setShowActionModal(false);
    };

    // Remove meal from plan
    const removeMeal = async (mealType: string, id: number) => {
        const updatedCategory = mealsData[mealType].filter(meal => meal.id !== id);
        const newData = { ...mealsData, [mealType]: updatedCategory };
        saveDietPlan(newData);
    };

    // Open Add Modal for specific meal type
    const openAddModal = (mealType: string) => {
        setSelectedMealType(mealType);
        setShowAddModal(true);
    };

    // Theme Helpers
    const getCategoryStyle = (type: string) => {
        switch (type) {
            case 'breakfast': return { icon: Zap, color: 'text-amber-500', bg: 'bg-amber-100', border: 'border-amber-200', label: t('meal.breakfast') };
            case 'lunch': return { icon: BatteryMedium, color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-200', label: t('meal.lunch') };
            case 'dinner': return { icon: Moon, color: 'text-indigo-600', bg: 'bg-indigo-100', border: 'border-indigo-200', label: t('meal.dinner') };
            default: return { icon: Disc, color: 'text-pink-600', bg: 'bg-pink-100', border: 'border-pink-200', label: t('meal.snacks') };
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
        { id: 'low-cal', label: t('meal.low_cal'), sub: t('meal.lose_fat'), color: 'orange' },
        { id: 'standard', label: t('meal.standard'), sub: t('meal.maintain'), color: 'blue' },
        { id: 'bulking', label: t('meal.bulking'), sub: t('meal.build_muscle'), color: 'emerald' },
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
                            <Text className="text-4xl font-black text-white">{t('meal.title')}</Text>
                            <Text className="text-slate-400 font-medium">{t('meal.subtitle')}</Text>
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
                            <Text className="text-lg font-bold text-white">{t('meal.summary')}</Text>
                        </View>
                        <View className="bg-white/5 px-3 py-1 border border-white/5" style={{ borderRadius: 999 }}>
                            <Text className="text-xs font-bold text-slate-400">Target: {currentLimit.label} kcal</Text>
                        </View>
                    </View>

                    <View className="flex-row flex-wrap justify-between gap-y-4">
                        {[
                            { l: t('nutrition.calories'), v: totalStats.calories, u: t('common.kcal'), c: '#f97316', bg: 'bg-orange-500/10' },
                            { l: t('nutrition.protein'), v: totalStats.protein, u: t('common.g'), c: '#3b82f6', bg: 'bg-blue-500/10' },
                            { l: t('nutrition.carbs'), v: totalStats.carbs, u: t('common.g'), c: '#10b981', bg: 'bg-emerald-500/10' },
                            { l: t('nutrition.fat'), v: totalStats.fat, u: t('common.g'), c: '#eab308', bg: 'bg-yellow-500/10' },
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
                    <Text className="text-white font-bold text-lg mb-4 ml-2">{t('meal.select_target')}</Text>
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
                                                {isGenerating ? t('meal.processing') : t('meal.ai_ready')}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text className="text-xl font-black text-white">
                                        {isGenerating ? t('meal.generating') : t('meal.ai_generate')}
                                    </Text>
                                    <Text className="text-xs text-slate-400 mt-1 max-w-[150px]">
                                        {t('meal.ai_desc')}
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

                {/* Manual Compose Button */}
                <View className="mx-6 mb-8">
                    <TouchableOpacity
                        onPress={() => setShowGuideModal(true)}
                        className="bg-slate-900/60 border border-white/5 p-5 flex-row justify-between items-center"
                        style={{ borderRadius: 40 }}
                    >
                        <View>
                            <View className="flex-row items-center gap-2 mb-2">
                                <View className="p-1.5 bg-emerald-500/10 rounded-full">
                                    <PenTool size={14} color="#10b981" />
                                </View>
                                <Text className="text-emerald-400 font-bold text-xs bg-emerald-500/10 px-2 py-0.5 rounded-full">{t('meal.manual')}</Text>
                            </View>
                            <Text className="text-lg font-bold text-white">{t('meal.manual_compose')}</Text>
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
                                            <Text className="text-xs text-slate-400">{meals.length} {t('meal.items')} • {Math.round(totalCal)} {t('common.kcal')}</Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => openAddModal(mealType)}
                                        className="p-3 bg-cyan-500/20 rounded-full border border-cyan-500/30"
                                    >
                                        <Plus size={20} color="#22d3ee" />
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

                                                    <TouchableOpacity onPress={() => openActionModal(mealType, food)}>
                                                        <MoreHorizontal size={20} color="#475569" />
                                                    </TouchableOpacity>
                                                </View>
                                            );
                                        })}
                                    </View>
                                ) : (
                                    <View className="h-28 border-2 border-dashed border-white/10 items-center justify-center bg-white/5" style={{ borderRadius: 40 }}>
                                        <Text className="text-slate-500 text-xs text-center">{t('meal.no_food')}{'\n'}{t('meal.click_ai')}</Text>
                                    </View>
                                )}
                            </View>
                        );
                    })}
                </View>

            </ScrollView>

            {/* Add Food Modal - First Popup */}
            <Modal
                visible={showAddModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowAddModal(false)}
            >
                <View className="flex-1 bg-black/80 justify-center items-center px-6">
                    <View className="bg-[#0a101f] border border-cyan-500/30 rounded-3xl p-6 w-full max-w-[340px] shadow-2xl">
                        {/* Header */}
                        <View className="flex-row items-center justify-between mb-6">
                            <View className="flex-row items-center gap-3">
                                <View className="w-12 h-12 bg-cyan-500/20 rounded-2xl items-center justify-center border border-cyan-500/30">
                                    {selectedMealType === 'breakfast' && <Coffee size={24} color="#22d3ee" />}
                                    {selectedMealType === 'lunch' && <Sun size={24} color="#22d3ee" />}
                                    {selectedMealType === 'dinner' && <Sunset size={24} color="#22d3ee" />}
                                    {selectedMealType === 'snacks' && <Cookie size={24} color="#22d3ee" />}
                                </View>
                                <View>
                                    <Text className="text-white font-black text-lg">{t('nutrition.add_meal')}</Text>
                                    <Text className="text-cyan-400 text-xs font-bold uppercase tracking-widest">
                                        {selectedMealType === 'breakfast' && t('meal.breakfast')}
                                        {selectedMealType === 'lunch' && t('meal.lunch')}
                                        {selectedMealType === 'dinner' && t('meal.dinner')}
                                        {selectedMealType === 'snacks' && t('meal.snacks')}
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={() => setShowAddModal(false)}
                                className="p-2 bg-white/10 rounded-full"
                            >
                                <X size={20} color="#94a3b8" />
                            </TouchableOpacity>
                        </View>

                        {/* Question */}
                        <View className="bg-slate-800/50 p-5 rounded-2xl border border-white/5 mb-6">
                            <Text className="text-white font-bold text-center text-base mb-2">
                                {language === 'id' ? 'Ingin menyusun secara manual?' : 'Want to compose manually?'}
                            </Text>
                            <Text className="text-slate-400 text-xs text-center">
                                {language === 'id'
                                    ? 'Cari makanan favoritmu dan tambahkan ke rencana makan.'
                                    : 'Search your favorite food and add it to your meal plan.'}
                            </Text>
                        </View>

                        {/* Action Button */}
                        <TouchableOpacity
                            onPress={() => {
                                setShowAddModal(false);
                                // Navigate to Search screen with mealType
                                (navigation as any).navigate('Search', { mealType: selectedMealType });
                            }}
                            className="bg-cyan-600 py-4 rounded-2xl flex-row items-center justify-center gap-3 shadow-lg shadow-cyan-500/30"
                        >
                            <Search size={20} color="white" />
                            <Text className="text-white font-black text-sm uppercase tracking-widest">
                                {language === 'id' ? 'Cari Makanan' : 'Search Food'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Guide Modal for Manual Compose */}
            <Modal
                visible={showGuideModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowGuideModal(false)}
            >
                <View className="flex-1 bg-black/80 justify-center items-center px-6">
                    <View className="bg-[#0a101f] border border-emerald-500/30 rounded-3xl p-6 w-full max-w-[340px] shadow-2xl">
                        {/* Header */}
                        <View className="flex-row items-center justify-between mb-6">
                            <View className="flex-row items-center gap-3">
                                <View className="w-12 h-12 bg-emerald-500/20 rounded-2xl items-center justify-center border border-emerald-500/30">
                                    <PenTool size={24} color="#10b981" />
                                </View>
                                <View>
                                    <Text className="text-white font-black text-lg">{t('meal.manual_compose')}</Text>
                                    <Text className="text-emerald-400 text-xs font-bold uppercase tracking-widest">
                                        {language === 'id' ? 'PETUNJUK' : 'GUIDE'}
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={() => setShowGuideModal(false)}
                                className="p-2 bg-white/10 rounded-full"
                            >
                                <X size={20} color="#94a3b8" />
                            </TouchableOpacity>
                        </View>

                        {/* Instruction Content */}
                        <View className="bg-slate-800/50 p-5 rounded-2xl border border-white/5 mb-6">
                            <Text className="text-white font-bold text-center text-base mb-3">
                                {language === 'id'
                                    ? 'Cara Menyusun Rencana Makan Manual'
                                    : 'How to Compose Meal Plan Manually'}
                            </Text>
                            <Text className="text-slate-400 text-sm text-center leading-6">
                                {language === 'id'
                                    ? 'Untuk menambahkan makanan secara manual, tekan tombol + di samping setiap kategori makanan (Sarapan, Makan Siang, Makan Malam, atau Camilan). Kemudian cari dan pilih makanan yang Anda inginkan.'
                                    : 'To add food manually, tap the + button next to each meal category (Breakfast, Lunch, Dinner, or Snacks). Then search and select the food you want.'}
                            </Text>
                        </View>

                        {/* Steps */}
                        <View className="gap-3 mb-6">
                            <View className="flex-row items-center gap-3">
                                <View className="w-8 h-8 bg-cyan-500/20 rounded-full items-center justify-center border border-cyan-500/30">
                                    <Text className="text-cyan-400 font-black">1</Text>
                                </View>
                                <Text className="text-slate-300 text-sm flex-1">
                                    {language === 'id' ? 'Tekan tombol + biru di samping kategori' : 'Tap the blue + button next to category'}
                                </Text>
                            </View>
                            <View className="flex-row items-center gap-3">
                                <View className="w-8 h-8 bg-cyan-500/20 rounded-full items-center justify-center border border-cyan-500/30">
                                    <Text className="text-cyan-400 font-black">2</Text>
                                </View>
                                <Text className="text-slate-300 text-sm flex-1">
                                    {language === 'id' ? 'Cari makanan yang Anda inginkan' : 'Search for the food you want'}
                                </Text>
                            </View>
                            <View className="flex-row items-center gap-3">
                                <View className="w-8 h-8 bg-cyan-500/20 rounded-full items-center justify-center border border-cyan-500/30">
                                    <Text className="text-cyan-400 font-black">3</Text>
                                </View>
                                <Text className="text-slate-300 text-sm flex-1">
                                    {language === 'id' ? 'Tekan + untuk menambahkan ke rencana' : 'Tap + to add to your plan'}
                                </Text>
                            </View>
                        </View>

                        {/* Close Button */}
                        <TouchableOpacity
                            onPress={() => setShowGuideModal(false)}
                            className="bg-emerald-600 py-4 rounded-2xl flex-row items-center justify-center gap-3 shadow-lg shadow-emerald-500/30"
                        >
                            <Check size={20} color="white" />
                            <Text className="text-white font-black text-sm uppercase tracking-widest">
                                {language === 'id' ? 'Mengerti' : 'Got It'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Action Modal for Update/Delete */}
            <Modal
                visible={showActionModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowActionModal(false)}
            >
                <View className="flex-1 bg-black/80 justify-center items-center px-6">
                    <View className="bg-[#0a101f] border border-slate-700/50 rounded-3xl p-6 w-full max-w-[340px] shadow-2xl">
                        {/* Header */}
                        <View className="flex-row items-center justify-between mb-6">
                            <View className="flex-row items-center gap-3">
                                <View className="w-12 h-12 bg-slate-800 rounded-2xl items-center justify-center border border-white/10">
                                    <Utensils size={24} color="#94a3b8" />
                                </View>
                                <View>
                                    <Text className="text-white font-black text-lg">
                                        {language === 'id' ? 'Atur Makanan' : 'Manage Meal'}
                                    </Text>
                                    <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest max-w-[200px]" numberOfLines={1}>
                                        {selectedFoodAction?.food.name}
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={() => setShowActionModal(false)}
                                className="p-2 bg-white/10 rounded-full"
                            >
                                <X size={20} color="#94a3b8" />
                            </TouchableOpacity>
                        </View>

                        {/* Actions */}
                        <View className="gap-3">
                            <TouchableOpacity
                                onPress={handleUpdateMeal}
                                className="bg-cyan-600/10 border border-cyan-500/30 p-4 rounded-2xl flex-row items-center justify-between group active:bg-cyan-600/20"
                            >
                                <View className="flex-row items-center gap-3">
                                    <View className="p-2 bg-cyan-500/20 rounded-xl">
                                        <Edit size={20} color="#22d3ee" />
                                    </View>
                                    <View>
                                        <Text className="text-white font-bold text-base">
                                            {language === 'id' ? 'Ganti Makanan' : 'Replace Meal'}
                                        </Text>
                                        <Text className="text-slate-400 text-xs">
                                            {language === 'id' ? 'Cari pengganti baru' : 'Find a substitute'}
                                        </Text>
                                    </View>
                                </View>
                                <ArrowRight size={20} color="#22d3ee" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleDeleteMeal}
                                className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl flex-row items-center justify-between active:bg-red-500/20"
                            >
                                <View className="flex-row items-center gap-3">
                                    <View className="p-2 bg-red-500/20 rounded-xl">
                                        <Trash2 size={20} color="#f87171" />
                                    </View>
                                    <View>
                                        <Text className="text-white font-bold text-base">
                                            {language === 'id' ? 'Hapus Makanan' : 'Delete Meal'}
                                        </Text>
                                        <Text className="text-slate-400 text-xs">
                                            {language === 'id' ? 'Hapus dari daftar' : 'Remove from list'}
                                        </Text>
                                    </View>
                                </View>
                                <View className="w-8 h-8 bg-red-500/10 rounded-full items-center justify-center">
                                    <X size={16} color="#f87171" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};
