import React, { useState, useCallback, useMemo } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator, FlatList, Alert, Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Scan, Database, AlertCircle, Check, Loader } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { generateAIContent } from '../../services/ai';
import nutritionData from '../../data/nutrition.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FoodDetail {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    servingSize: string;
    image?: string;
}

export const SearchScreen = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<FoodDetail[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [addedFood, setAddedFood] = useState<string | null>(null);

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
    }, [searchQuery]); // Dependency array for useCallback

    const handleAddFood = async (food: FoodDetail) => {
        try {
            const saved = await AsyncStorage.getItem('dietPlan');
            let currentPlan = saved ? JSON.parse(saved) : { breakfast: [], lunch: [], dinner: [], snacks: [] };

            const hour = new Date().getHours();
            let mealType = 'snacks';
            if (hour < 11) mealType = 'breakfast';
            else if (hour < 15) mealType = 'lunch';
            else if (hour < 21) mealType = 'dinner';

            const newEntry = {
                id: Date.now(),
                name: food.name,
                calories: food.calories,
                protein: food.protein,
                carbs: food.carbs,
                fat: food.fat,
                completed: false,
                image: food.image
            };

            currentPlan[mealType] = [...(currentPlan[mealType] || []), newEntry];
            await AsyncStorage.setItem('dietPlan', JSON.stringify(currentPlan));

            setAddedFood(food.name);
            setTimeout(() => setAddedFood(null), 2000);
        } catch (e) {
            Alert.alert("Error", "Failed to save food.");
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
                    <View className="flex-row items-center gap-4 mb-8">
                        <View className="p-3 bg-cyan-900/20 rounded-[1rem] border border-cyan-500/30" style={{ borderRadius: 16 }}>
                            <Scan size={24} color="#22d3ee" />
                        </View>
                        <View>
                            <Text className="text-2xl font-black text-white">NEURAL FOOD SEARCH</Text>
                            <Text className="text-xs text-slate-400 font-medium uppercase tracking-widest">AI-Powered Nutritional Analysis</Text>
                        </View>
                    </View>

                    {/* Search Bar */}
                    <View className="mb-8 relative z-10">
                        <View className="flex-row items-center bg-slate-950/80 border border-white/10 overflow-hidden h-14" style={{ borderRadius: 20 }}>
                            <View className="pl-4">
                                <Search size={20} color="#94a3b8" />
                            </View>
                            <TextInput
                                placeholder="Enter food name..."
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
                                    <>
                                        <Text className="text-white font-bold text-xs pt-1">SEARCH</Text>
                                    </>
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
                                                <Text className="text-white font-bold text-xs">ADD TO MENU</Text>
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
                </ScrollView>
            </SafeAreaView>

            {/* Notification Toast */}
            {addedFood && (
                <View className="absolute bottom-24 left-6 right-6 z-50 items-center">
                    <View className="bg-cyan-950/90 p-4 flex-row items-center gap-3 border border-cyan-500/30 shadow-2xl" style={{ borderRadius: 20 }}>
                        <View className="w-8 h-8 bg-green-500 rounded-full items-center justify-center shadow-[0_0_10px_#22c55e]">
                            <Check size={16} color="white" />
                        </View>
                        <View>
                            <Text className="text-xs text-slate-400 uppercase font-bold tracking-widest">Success</Text>
                            <Text className="text-white font-bold text-sm">Added <Text className="text-cyan-400">{addedFood}</Text> to your plan.</Text>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
};
