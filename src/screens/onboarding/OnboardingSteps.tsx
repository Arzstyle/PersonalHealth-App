import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronRight, ChevronLeft, ShieldCheck, Brain, Activity, Target } from 'lucide-react-native';
import { RootStackParamList } from '../../types/navigation';
import { ONBOARDING_SLIDES } from '../../data/onboarding';

const { width } = Dimensions.get('window');
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'OnboardingSteps'>;

export const OnboardingSteps = () => {
    const navigation = useNavigation<NavigationProp>();
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    const currentSlide = ONBOARDING_SLIDES[currentSlideIndex];

    const nextSlide = () => {
        if (currentSlideIndex < ONBOARDING_SLIDES.length - 1) {
            setCurrentSlideIndex(prev => prev + 1);
        } else {
            // Navigate to Login
            navigation.replace('Login');
        }
    };

    const prevSlide = () => {
        if (currentSlideIndex > 0) {
            setCurrentSlideIndex(prev => prev - 1);
        } else {
            navigation.goBack();
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-ai-bg relative">
            {/* Background Grid */}
            <View className="absolute inset-0 opacity-20">
                <View className="absolute top-[20%] left-0 w-full h-[1px] bg-ai-green/20" />
                <View className="absolute top-[60%] left-0 w-full h-[1px] bg-ai-green/20" />
                <View className="absolute left-[50%] top-0 h-full w-[1px] bg-ai-green/20" />
            </View>

            <View className="flex-1 px-6 justify-between py-8">

                {/* Header */}
                <View className="flex-row justify-between items-center mb-4">
                    <View className="flex-row items-center gap-2">
                        <View className="w-4 h-4">
                            {/* Simple lightning icon simulation or import Zap if needed */}
                            <Text className="text-ai-green font-bold">⚡</Text>
                        </View>
                        <Text className="text-white font-bold tracking-widest uppercase text-sm">
                            System Intro
                        </Text>
                    </View>

                    {/* Progress Indicator */}
                    <View className="flex-row gap-1">
                        {ONBOARDING_SLIDES.map((_, idx) => (
                            <View
                                key={idx}
                                className={`h-1.5 rounded-full ${idx === currentSlideIndex ? 'w-8 bg-ai-green' : 'w-2 bg-gray-700'}`}
                            />
                        ))}
                    </View>
                </View>

                {/* Main Card Content */}
                <View className="flex-1 justify-center items-center mt-4">

                    {/* Icon Circle */}
                    <View className="relative mb-8 items-center justify-center">
                        <View className="absolute w-64 h-64 border border-gray-800 rounded-full border-dashed" />
                        <View className="w-40 h-40 bg-[#0a101f] rounded-full items-center justify-center border border-ai-green/20 shadow-[0_0_30px_rgba(0,255,136,0.1)]">
                            <currentSlide.icon size={64} color="#00ff88" />
                        </View>
                    </View>

                    {/* Text Content */}
                    <Text className="text-3xl text-white font-bold text-center mb-4 font-body">
                        {currentSlide.title}
                    </Text>
                    <Text className="text-gray-400 text-center leading-6 mb-8 px-4">
                        {currentSlide.desc}
                    </Text>

                    {/* Features List */}
                    <View className="w-full gap-3">
                        {currentSlide.features.map((feature, idx) => (
                            <View key={idx} className="bg-[#0a101f] border border-gray-800 rounded-xl p-4 flex-row items-center">
                                <ShieldCheck size={20} color="#00ff88" className="mr-3" />
                                <Text className="text-white font-semibold">
                                    {feature}
                                </Text>
                            </View>
                        ))}
                    </View>

                </View>

                {/* Footer Navigation */}
                <View className="flex-row items-center justify-between mt-8">
                    <TouchableOpacity onPress={prevSlide} className="flex-row items-center p-4">
                        <ChevronLeft size={20} color="gray" />
                        <Text className="text-gray-500 font-bold ml-1">Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={nextSlide}
                        activeOpacity={0.8}
                        className="bg-[#00ff88] px-8 py-4 rounded-xl flex-row items-center shadow-[0_0_20px_rgba(0,255,136,0.3)] shadow-ai-green/50"
                    >
                        <Text className="text-black font-bold uppercase tracking-wider mr-2">
                            {currentSlideIndex === ONBOARDING_SLIDES.length - 1 ? "Initialize System" : "Next Preview"}
                        </Text>
                        <ChevronRight size={18} color="black" />
                    </TouchableOpacity>
                </View>

            </View>
        </SafeAreaView>
    );
};
