import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator, FlatList, Alert, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Scan, Database, AlertCircle, Check, Loader, ChevronDown, Plus } from 'lucide-react-native';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { generateAIContent } from '../../services/ai';
import nutritionData from '../../data/nutrition.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUI } from '../../context/UIContext';
import { DatabaseService, CustomFood } from '../../services/database';
import { AddCustomFoodModal } from '../../components/AddCustomFoodModal';



interface FoodDetail {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    servingSize: string;
    image?: string;
}

type RouteParams = {
    Search: {
        mealType?: string;
        isReplacing?: boolean;
        replaceId?: number;
    };
};

export const SearchScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<RouteProp<RouteParams, 'Search'>>();
    const params = route.params || {};
    const mealTypeFromRoute = params.mealType;
    const isReplacing = params.isReplacing;
    const replaceId = params.replaceId;
    const { t, language } = useUI();

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<FoodDetail[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [addedFood, setAddedFood] = useState<string | null>(null);
    const [selectedMealType, setSelectedMealType] = useState<string>(mealTypeFromRoute || 'breakfast');

    // SQLite / Custom Food State
    const [customFoods, setCustomFoods] = useState<CustomFood[]>([]);
    const [showCustomFoodModal, setShowCustomFoodModal] = useState(false);
    const [searchTab, setSearchTab] = useState<'global' | 'custom'>('global');

    // Initialize DB and load custom foods
    React.useEffect(() => {
        DatabaseService.init();
        loadCustomFoods();
    }, []);

    const loadCustomFoods = useCallback(() => {
        const foods = DatabaseService.getCustomFoods();
        setCustomFoods(foods);
    }, []);

    // Refresh custom foods when screen focuses
    useFocusEffect(
        useCallback(() => {
            loadCustomFoods();
        }, [])
    );

    // Sync selectedMealType when route param changes
    React.useEffect(() => {
        if (mealTypeFromRoute) {
            setSelectedMealType(mealTypeFromRoute);
        }
    }, [mealTypeFromRoute]);

    // OPTIMIZATION: useCallback to memoize search function and prevent unnecessary re-renders
    const handleSearch = useCallback(async () => {
        if (searchQuery.trim() === "") {
            setSearchResults([]);
            setError(null);
            return;
        }

        setIsLoading(true);
        setError(null);
        setSearchResults([]);

        try {
            // 1. Local Search First
            const queryLower = searchQuery.toLowerCase();
            const localMatches = nutritionData.filter((item) =>
                item.name.toLowerCase().includes(queryLower)
            );

            if (localMatches.length > 0) {
                // Simulate a short network delay for better UX
                await new Promise((resolve) => setTimeout(resolve, 600));

                const mappedResults: FoodDetail[] = localMatches.map((item) => ({
                    name: item.name,
                    calories: item.calories,
                    protein: item.proteins,
                    carbs: item.carbohydrate,
                    fat: item.fat,
                    servingSize: "100g (Database)",
                    image: item.image,
                }));

                setSearchResults(mappedResults);
                setIsLoading(false);
                return;
            }

            // 2. AI Fallback
            const prompt = `Identify the food item: "${searchQuery}"`;
            const result = await generateAIContent(prompt);

            if (!result.success) {
                throw new Error(result.error);
            }

            const foods: FoodDetail[] = JSON.parse(result.data);
            setSearchResults(foods);
        } catch (err: any) {
            console.error("Error during AI search:", err);
            setError(err?.message || "Search Failed");
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery]);

    const handleAddFood = async (food: FoodDetail) => {
        try {
            const saved = await AsyncStorage.getItem('dietPlan');
            let currentPlan = saved ? JSON.parse(saved) : { breakfast: [], lunch: [], dinner: [], snacks: [] };

            const newEntry = {
                id: isReplacing && replaceId ? replaceId : Date.now(),
                name: food.name,
                calories: food.calories,
                protein: food.protein,
                carbs: food.carbs,
                fat: food.fat,
                completed: false,
                image: food.image
            };

            const mealList = currentPlan[selectedMealType] || [];

            if (isReplacing && replaceId) {
                // Find index of item to replace
                const index = mealList.findIndex((item: any) => item.id === replaceId);
                if (index !== -1) {
                    mealList[index] = newEntry;
                    currentPlan[selectedMealType] = mealList;
                } else {
                    // Item not found, just add it? Or maybe replacement failed.
                    // Let's just add it as fallback
                    currentPlan[selectedMealType] = [...mealList, newEntry];
                }
            } else {
                // Add new item
                currentPlan[selectedMealType] = [...mealList, newEntry];
            }

            await AsyncStorage.setItem('dietPlan', JSON.stringify(currentPlan));

            setAddedFood(food.name);
            setTimeout(() => {
                setAddedFood(null);
                if (isReplacing) {
                    navigation.goBack();
                }
            }, 1000);
        } catch (e) {
            Alert.alert(language === 'id' ? "Error" : "Error", language === 'id' ? "Gagal menyimpan makanan." : "Failed to save food.");
        }
    };

    // Get meal type label
    const getMealLabel = (type: string) => {
        switch (type) {
            case 'breakfast': return t('meal.breakfast');
            case 'lunch': return t('meal.lunch');
            case 'dinner': return t('meal.dinner');
            case 'snacks': return t('meal.snacks');
            default: return t('meal.breakfast');
        }
    };

    return (
        <View className="flex-1 bg-[#02050a]">
            <LinearGradient
                colors={['#0f172a', '#020617', '#000000']}
                locations={[0, 0.4, 1]}
                style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
            />

            {/* Background Grid Pattern */}
            <View className="absolute inset-0 opacity-20 pointer-events-none">
                <View className="absolute top-[10%] left-0 w-full h-[1px] bg-cyan-500/10" />
                <View className="absolute left-[50%] top-0 h-full w-[1px] bg-cyan-500/10" />
            </View>

            <SafeAreaView className="flex-1" edges={['top']}>
                <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
                    {/* Header */}
                    <View className="flex-row items-center justify-between mb-4">
                        <View className="flex-row items-center gap-4">
                            <View className="p-3 bg-cyan-900/20 rounded-[1rem] border border-cyan-500/30" style={{ borderRadius: 16 }}>
                                <Scan size={24} color="#22d3ee" />
                            </View>
                            <View>
                                <Text className="text-2xl font-black text-white">
                                    {language === 'id' ? 'CARI MAKANAN' : 'FOOD SEARCH'}
                                </Text>
                                <Text className="text-xs text-slate-400 font-medium uppercase tracking-widest">
                                    {language === 'id' ? 'Didukung AI' : 'AI-Powered'}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Meal Type Selector */}
                    <View className="mb-6">
                        <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">
                            {language === 'id' ? 'Tambahkan ke:' : 'Add to:'}
                        </Text>
                        <View className="flex-row flex-wrap gap-2">
                            {['breakfast', 'lunch', 'dinner', 'snacks'].map((type) => (
                                <TouchableOpacity
                                    key={type}
                                    onPress={() => !isReplacing && setSelectedMealType(type)}
                                    activeOpacity={isReplacing ? 1 : 0.7}
                                    className={`px-4 py-2 rounded-full border ${selectedMealType === type
                                        ? 'bg-cyan-600 border-cyan-500'
                                        : 'bg-slate-800/50 border-white/10'
                                        } ${isReplacing ? 'opacity-50' : ''}`}
                                >
                                    <Text className={`text-sm font-bold ${selectedMealType === type ? 'text-white' : 'text-slate-400'
                                        }`}>
                                        {getMealLabel(type)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Tab Switcher */}
                    <View className="flex-row bg-slate-900/50 p-1 rounded-2xl mb-6 border border-white/5">
                        <TouchableOpacity
                            onPress={() => setSearchTab('global')}
                            className={`flex-1 py-3 rounded-xl items-center justify-center ${searchTab === 'global' ? 'bg-slate-800 shadow-sm' : ''}`}
                        >
                            <Text className={`text-xs font-bold uppercase tracking-widest ${searchTab === 'global' ? 'text-white' : 'text-slate-500'}`}>
                                {language === 'id' ? 'Pencarian Global' : 'Global Search'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setSearchTab('custom')}
                            className={`flex-1 py-3 rounded-xl items-center justify-center ${searchTab === 'custom' ? 'bg-slate-800 shadow-sm' : ''}`}
                        >
                            <Text className={`text-xs font-bold uppercase tracking-widest ${searchTab === 'custom' ? 'text-white' : 'text-slate-500'}`}>
                                {language === 'id' ? 'Makanan Saya' : 'My Foods'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Custom Foods Section */}
                    {searchTab === 'custom' && (
                        <View className="mb-8">
                            <TouchableOpacity
                                onPress={() => setShowCustomFoodModal(true)}
                                className="flex-row items-center justify-center gap-2 bg-ai-green/10 border border-ai-green/50 p-4 rounded-2xl mb-6 border-dashed"
                            >
                                <Plus size={20} color="#00ff88" />
                                <Text className="text-ai-green font-bold uppercase text-xs tracking-widest">
                                    {language === 'id' ? 'Tambah Makanan Baru' : 'Add New Food'}
                                </Text>
                            </TouchableOpacity>

                            {customFoods.length === 0 ? (
                                <View className="py-12 items-center justify-center bg-white/5 rounded-3xl border border-white/5 border-dashed">
                                    <View className="w-12 h-12 bg-slate-800 rounded-full items-center justify-center mb-3">
                                        <Database size={24} color="#64748b" />
                                    </View>
                                    <Text className="text-slate-500 font-bold text-center">
                                        {language === 'id' ? 'Belum ada makanan custom.' : 'No custom foods yet.'}
                                    </Text>
                                </View>
                            ) : (
                                <View className="gap-3">
                                    {customFoods.map((food) => (
                                        <View key={food.id} className="bg-slate-900/50 p-4 rounded-2xl border border-white/5 flex-row items-center justify-between">
                                            <View className="flex-1">
                                                <Text className="text-white font-bold text-lg mb-1">{food.name}</Text>
                                                <View className="flex-row gap-2">
                                                    <Text className="text-slate-400 text-xs font-bold bg-slate-800 px-2 py-0.5 rounded-md text-[10px]">{food.calories} kcal</Text>
                                                    <Text className="text-slate-500 text-xs">• {food.serving_size}</Text>
                                                </View>
                                            </View>
                                            <TouchableOpacity
                                                onPress={() => handleAddFood({
                                                    name: food.name,
                                                    calories: food.calories,
                                                    protein: food.protein,
                                                    carbs: food.carbs,
                                                    fat: food.fat,
                                                    servingSize: food.serving_size,
                                                    image: undefined
                                                })}
                                                className="bg-cyan-600 p-3 rounded-xl ml-3"
                                            >
                                                <Check size={16} color="white" />
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    )}

                    {/* Search Bar */}
                    {searchTab === 'global' && (
                        <>
                            <View className="mb-8 relative z-10">
                                <View className="flex-row items-center bg-slate-950/80 border border-white/10 overflow-hidden h-14" style={{ borderRadius: 20 }}>
                                    <View className="pl-4">
                                        <Search size={20} color="#94a3b8" />
                                    </View>
                                    <TextInput
                                        placeholder={language === 'id' ? 'Masukkan nama makanan...' : 'Enter food name...'}
                                        placeholderTextColor="#64748b"
                                        className="flex-1 px-4 text-white font-medium h-full"
                                        value={searchQuery}
                                        onChangeText={setSearchQuery}
                                        onSubmitEditing={handleSearch}
                                    />
                                    <TouchableOpacity
                                        onPress={handleSearch}
                                        disabled={isLoading || !searchQuery}
                                        className={`h-full px-6 flex-row items-center justify-center gap-2 border-l border-white/5 ${isLoading || !searchQuery ? 'bg-slate-900' : 'bg-cyan-600'}`}
                                    >
                                        {isLoading ? (
                                            <ActivityIndicator color="white" size="small" />
                                        ) : (
                                            <Text className="text-white font-bold text-xs pt-1">
                                                {language === 'id' ? 'CARI' : 'SEARCH'}
                                            </Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Error State */}
                            {error && (
                                <View className="mb-6 p-4 bg-red-900/20 border border-red-500/30 flex-row items-center gap-3" style={{ borderRadius: 16 }}>
                                    <AlertCircle size={20} color="#f87171" />
                                    <Text className="text-red-400 font-bold text-sm">{error}</Text>
                                </View>
                            )}

                            {/* Loading State */}
                            {isLoading && (
                                <View className="items-center justify-center py-12 gap-4">
                                    <View className="relative w-16 h-16 items-center justify-center">
                                        <ActivityIndicator size="large" color="#22d3ee" />
                                        <Database size={24} color="#22d3ee" style={{ position: 'absolute', opacity: 0.5 }} />
                                    </View>
                                    <View className="items-center">
                                        <Text className="text-white font-bold text-lg">AI WEB SCANNING...</Text>
                                        <Text className="text-slate-400 text-xs mt-1">Processing global nutritional data...</Text>
                                    </View>
                                </View>
                            )}

                            {/* Empty State */}
                            {!isLoading && !error && searchResults.length === 0 && (
                                <View className="py-12 border-2 border-dashed border-white/5 bg-white/5 items-center justify-center" style={{ borderRadius: 32 }}>
                                    <View className="w-16 h-16 bg-white/10 rounded-full items-center justify-center mb-4">
                                        <Search size={32} color="#94a3b8" />
                                    </View>
                                    <Text className="text-white font-bold">Ready to Search</Text>
                                    <Text className="text-slate-400 text-sm mt-1 text-center px-8">
                                        Input food name to find values locally & globally.
                                    </Text>
                                </View>
                            )}

                            {/* Results */}
                            {!isLoading && searchResults.length > 0 && (
                                <View className="gap-4">
                                    <View className="flex-row items-center justify-between mb-2">
                                        <Text className="text-sm font-bold text-slate-400 uppercase tracking-widest">SEARCH RESULTS</Text>
                                        <View className="px-2 py-1 bg-cyan-900/30 border border-cyan-500/20 rounded" style={{ borderRadius: 6 }}>
                                            <Text className="text-[10px] font-bold text-cyan-400">{searchResults.length} ITEMS FOUND</Text>
                                        </View>
                                    </View>

                                    {searchResults.map((food, index) => (
                                        <View
                                            key={index}
                                            className="bg-slate-800/50 border border-white/10 p-4 gap-4 overflow-hidden"
                                            style={{ borderRadius: 32 }}
                                        >
                                            <View className="flex-row gap-4">
                                                {/* Image */}
                                                <View className="w-24 h-24 bg-slate-900 overflow-hidden border border-white/5 relative" style={{ borderRadius: 24 }}>
                                                    <Image
                                                        source={{ uri: food.image || `https://placehold.co/200x200?text=${food.name}` }} // Fallback if no image
                                                        className="w-full h-full"
                                                        resizeMode="cover"
                                                    />
                                                    <View className="absolute bottom-0 left-0 right-0 p-1 bg-black/60 items-center">
                                                        <Text className="text-[8px] text-white font-bold uppercase">{food.servingSize}</Text>
                                                    </View>
                                                </View>

                                                {/* Details */}
                                                <View className="flex-1 justify-center">
                                                    <Text className="text-xl font-black text-white mb-1">{food.name}</Text>
                                                    <View className="bg-slate-700/50 self-start px-2 py-1 border border-white/10 mb-3" style={{ borderRadius: 8 }}>
                                                        <Text className="text-xs font-bold text-slate-300">{food.calories} KCAL</Text>
                                                    </View>

                                                    <TouchableOpacity
                                                        onPress={() => handleAddFood(food)}
                                                        className="bg-cyan-600 flex-row items-center justify-center py-2 gap-2 shadow-lg shadow-cyan-500/20"
                                                        style={{ borderRadius: 16 }}
                                                    >
                                                        <Check size={14} color="white" />
                                                        <Text className="text-white font-bold text-xs">
                                                            {isReplacing
                                                                ? (language === 'id' ? 'GANTI' : 'REPLACE')
                                                                : (language === 'id' ? 'TAMBAH' : 'ADD')}
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>

                                            {/* Macros Grid */}
                                            <View className="flex-row gap-2">
                                                <View className="flex-1 bg-blue-900/10 border border-blue-500/20 p-2 items-center" style={{ borderRadius: 16 }}>
                                                    <Text className="text-[10px] text-blue-500 font-bold uppercase">Protein</Text>
                                                    <Text className="text-lg font-black text-blue-400">{food.protein}<Text className="text-xs font-normal text-blue-400/70">g</Text></Text>
                                                </View>
                                                <View className="flex-1 bg-emerald-900/10 border border-emerald-500/20 p-2 items-center" style={{ borderRadius: 16 }}>
                                                    <Text className="text-[10px] text-emerald-500 font-bold uppercase">Carbs</Text>
                                                    <Text className="text-lg font-black text-emerald-400">{food.carbs}<Text className="text-xs font-normal text-emerald-400/70">g</Text></Text>
                                                </View>
                                                <View className="flex-1 bg-amber-900/10 border border-amber-500/20 p-2 items-center" style={{ borderRadius: 16 }}>
                                                    <Text className="text-[10px] text-orange-500 font-bold uppercase">Fat</Text>
                                                    <Text className="text-lg font-black text-orange-400">{food.fat}<Text className="text-xs font-normal text-orange-400/70">g</Text></Text>
                                                </View>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </>
                    )}
                </ScrollView>
            </SafeAreaView>

            {/* Notification Toast */}
            {
                addedFood && (
                    <View className="absolute top-0 bottom-0 left-0 right-0 justify-center items-center z-50 pointer-events-none">
                        <View className="bg-cyan-950/95 p-6 items-center gap-3 border border-cyan-500/30 shadow-2xl min-w-[200px]" style={{ borderRadius: 24 }}>
                            <View className="w-12 h-12 bg-green-500 rounded-full items-center justify-center shadow-[0_0_15px_#22c55e] mb-2">
                                <Check size={24} color="white" />
                            </View>
                            <View className="items-center">
                                <Text className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">
                                    {language === 'id' ? 'Berhasil' : 'Success'}
                                </Text>
                                <Text className="text-white font-bold text-center text-base">
                                    <Text className="text-cyan-400">{addedFood}</Text>
                                    {isReplacing
                                        ? (language === 'id' ? ' telah diganti di ' : ' replaced in ')
                                        : (language === 'id' ? ' ditambahkan ke ' : ' added to ')}
                                    <Text className="text-cyan-400">{getMealLabel(selectedMealType)}</Text>
                                </Text>
                            </View>
                        </View>
                    </View>
                )
            }
            {/* Add Custom Food Modal */}
            <AddCustomFoodModal
                visible={showCustomFoodModal}
                onClose={() => setShowCustomFoodModal(false)}
                onSuccess={loadCustomFoods}
            />
        </View >
    );
};
