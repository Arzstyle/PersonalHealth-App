import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { Ruler, Scale, Calendar, User, ChevronRight } from 'lucide-react-native';
import { getBMICategory } from '../../utils/calculations';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'BodyMetrics'>;

export const BodyMetricsScreen = () => {
    const navigation = useNavigation<NavigationProp>();

    // Form State - Empty by default
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState<'male' | 'female' | null>(null);

    // Parse values
    const h = parseFloat(height) || 0;
    const w = parseFloat(weight) || 0;
    const a = parseInt(age) || 0;

    // Direct calculations - updates immediately when any value changes
    // BMI = weight / (height in meters)^2
    const bmi = h > 0 && w > 0 ? Number((w / ((h / 100) * (h / 100))).toFixed(1)) : 0;

    // BMR using Mifflin-St Jeor: 10*weight + 6.25*height - 5*age + s (s=5 for male, -161 for female)
    const s = gender === 'male' ? 5 : -161;
    const bmr = w > 0 && h > 0 && a > 0 ? (10 * w + 6.25 * h - 5 * a + s) : 0;

    const bmiCategory = getBMICategory(bmi);

    const handleNext = () => {
        if (!gender) return;
        navigation.navigate('MetabolicProfile', {
            height: parseFloat(height) || 0,
            weight: parseFloat(weight) || 0,
            age: parseInt(age) || 0,
            gender,
        });
    };

    const isValid = parseFloat(height) > 0 && parseFloat(weight) > 0 && parseInt(age) > 0 && gender !== null;

    return (
        <SafeAreaView className="flex-1 bg-[#02050a]">
            {/* Background */}
            <LinearGradient
                colors={['#0f172a', '#020617', '#000000']}
                locations={[0, 0.4, 1]}
                style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
            />

            <View className="flex-1 px-6">
                {/* Progress Indicator */}
                <View className="flex-row justify-center gap-2 pt-2 pb-4">
                    <View className="w-16 h-1 bg-ai-green rounded-full" />
                    <View className="w-16 h-1 bg-slate-700 rounded-full" />
                </View>

                {/* Header - Compact */}
                <View className="items-center mb-4">
                    <View className="w-12 h-12 bg-blue-500/20 rounded-xl items-center justify-center mb-2 border border-blue-500/30">
                        <Ruler size={22} color="#3b82f6" />
                    </View>
                    <Text className="text-white text-2xl font-black">Body Metrics</Text>
                    <Text className="text-slate-400 text-xs">Let's start by calculating your BMI.</Text>
                </View>

                {/* Form Fields - Compact */}
                <View className="gap-3 mb-4">
                    {/* Height */}
                    <View>
                        <Text className="text-slate-500 text-[10px] font-bold uppercase mb-1 ml-1">HEIGHT (CM)</Text>
                        <View className="flex-row items-center bg-slate-900/80 border border-white/10 rounded-xl px-3 py-3">
                            <Ruler size={16} color="#64748b" />
                            <TextInput
                                className="flex-1 text-white text-lg font-bold ml-2"
                                value={height}
                                onChangeText={setHeight}
                                keyboardType="numeric"
                                placeholder="175"
                                placeholderTextColor="#475569"
                            />
                        </View>
                    </View>

                    {/* Weight */}
                    <View>
                        <Text className="text-slate-500 text-[10px] font-bold uppercase mb-1 ml-1">WEIGHT (KG)</Text>
                        <View className="flex-row items-center bg-slate-900/80 border border-white/10 rounded-xl px-3 py-3">
                            <Scale size={16} color="#64748b" />
                            <TextInput
                                className="flex-1 text-white text-lg font-bold ml-2"
                                value={weight}
                                onChangeText={setWeight}
                                keyboardType="numeric"
                                placeholder="70"
                                placeholderTextColor="#475569"
                            />
                        </View>
                    </View>

                    {/* Age */}
                    <View>
                        <Text className="text-slate-500 text-[10px] font-bold uppercase mb-1 ml-1">AGE</Text>
                        <View className="flex-row items-center bg-slate-900/80 border border-white/10 rounded-xl px-3 py-3">
                            <Calendar size={16} color="#64748b" />
                            <TextInput
                                className="flex-1 text-white text-lg font-bold ml-2"
                                value={age}
                                onChangeText={setAge}
                                keyboardType="numeric"
                                placeholder="25"
                                placeholderTextColor="#475569"
                            />
                        </View>
                    </View>

                    {/* Gender */}
                    <View>
                        <Text className="text-slate-500 text-[10px] font-bold uppercase mb-1 ml-1">GENDER</Text>
                        <View className="flex-row gap-2">
                            <TouchableOpacity
                                onPress={() => setGender('male')}
                                className={`flex-1 flex-row items-center justify-center py-3 rounded-xl border ${gender === 'male'
                                    ? 'bg-blue-500 border-blue-400'
                                    : 'bg-slate-900/80 border-white/10'
                                    }`}
                            >
                                <User size={16} color={gender === 'male' ? 'white' : '#64748b'} />
                                <Text className={`ml-2 font-bold text-sm ${gender === 'male' ? 'text-white' : 'text-slate-400'}`}>Male</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setGender('female')}
                                className={`flex-1 flex-row items-center justify-center py-3 rounded-xl border ${gender === 'female'
                                    ? 'bg-pink-500 border-pink-400'
                                    : 'bg-slate-900/80 border-white/10'
                                    }`}
                            >
                                <User size={16} color={gender === 'female' ? 'white' : '#64748b'} />
                                <Text className={`ml-2 font-bold text-sm ${gender === 'female' ? 'text-white' : 'text-slate-400'}`}>Female</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Results Cards - Compact */}
                {isValid && (
                    <View className="flex-row gap-2 mb-4">
                        {/* BMI Card */}
                        <View className="flex-1 bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 items-center">
                            <Text className="text-blue-400 text-[9px] font-bold uppercase mb-0.5">ESTIMATED BMI</Text>
                            <Text className="text-white text-2xl font-black">{bmi.toFixed(1)}</Text>
                            <View className="bg-blue-500/20 px-2 py-0.5 rounded-full mt-1">
                                <Text className="text-blue-300 text-[9px] font-bold">{bmiCategory.label}</Text>
                            </View>
                        </View>

                        {/* BMR Card */}
                        <View className="flex-1 bg-ai-green/10 border border-ai-green/30 rounded-xl p-3 items-center">
                            <Text className="text-ai-green text-[9px] font-bold uppercase mb-0.5">BASAL METABOLIC RATE</Text>
                            <Text className="text-white text-2xl font-black">{bmr.toFixed(2)}</Text>
                            <View className="bg-ai-green/20 px-2 py-0.5 rounded-full mt-1">
                                <Text className="text-ai-green text-[9px] font-bold">kcal/day (Base)</Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* Spacer */}
                <View className="flex-1" />

                {/* Next Button - Fixed at bottom */}
                <TouchableOpacity
                    onPress={handleNext}
                    disabled={!isValid}
                    className={`flex-row items-center justify-center py-4 rounded-xl mb-4 ${isValid ? 'bg-blue-500' : 'bg-slate-700'}`}
                >
                    <Text className={`font-bold text-base ${isValid ? 'text-white' : 'text-slate-400'}`}>Next Step</Text>
                    <ChevronRight size={18} color={isValid ? 'white' : '#64748b'} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};
