import React from 'react';
import { View, Text, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronRight, Cpu, Activity, ShieldCheck } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../../types/navigation';

const { width, height } = Dimensions.get('window');
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

export const WelcomeIntro = () => {
    const navigation = useNavigation<NavigationProp>();

    const handleStart = () => {
        navigation.navigate('OnboardingSteps');
    };

    return (
        <View className="flex-1 bg-[#02050a] relative">
            <StatusBar barStyle="light-content" />

            {/* Background Gradient & Grid */}
            <LinearGradient
                colors={['#02050a', '#050a14', '#02050a']}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            />

            {/* Grid Pattern */}
            <View className="absolute inset-0 opacity-20">
                <View className="absolute top-[20%] left-0 w-full h-[1px] bg-ai-green/30" />
                <View className="absolute top-[40%] left-0 w-full h-[1px] bg-ai-green/30" />
                <View className="absolute top-[60%] left-0 w-full h-[1px] bg-ai-green/30" />
                <View className="absolute top-[80%] left-0 w-full h-[1px] bg-ai-green/30" />
                <View className="absolute left-[20%] top-0 h-full w-[1px] bg-ai-green/30" />
                <View className="absolute left-[40%] top-0 h-full w-[1px] bg-ai-green/30" />
                <View className="absolute left-[60%] top-0 h-full w-[1px] bg-ai-green/30" />
                <View className="absolute left-[80%] top-0 h-full w-[1px] bg-ai-green/30" />
            </View>

            <SafeAreaView className="flex-1 justify-between">

                {/* TOP SECTION: Visuals */}
                <View className="flex-1 items-center justify-center pt-10">
                    <View className="relative items-center justify-center">
                        {/* Outer Radar Rings */}
                        <View className="absolute w-[140%] h-[140%] border border-ai-green/10 rounded-full" />
                        <View className="absolute w-[180%] h-[180%] border border-ai-green/5 rounded-full" />

                        <View className="w-72 h-72 border border-ai-green/20 rounded-full items-center justify-center relative">
                            {/* Glowing Orbit */}
                            <View className="absolute top-0 w-3 h-3 bg-ai-green rounded-full shadow-[0_0_15px_#00ff88]" />

                            {/* Inner Core */}
                            <View className="w-32 h-32 bg-[#0a101f] border border-ai-green rounded-full items-center justify-center shadow-[0_0_30px_rgba(0,255,136,0.2)]">
                                <Cpu size={56} color="#00ff88" />
                            </View>

                            {/* Floating Badges */}
                            <View className="absolute -right-4 top-12 bg-[#0a101f]/90 border border-ai-green/30 px-3 py-2 rounded-lg flex-row items-center">
                                <Activity size={10} color="#00ff88" className="mr-2" />
                                <View>
                                    <Text className="text-[8px] text-ai-green font-bold tracking-widest">HEALTH STATUS</Text>
                                    <Text className="text-[8px] text-white">ANALYZING</Text>
                                </View>
                            </View>

                            <View className="absolute -left-2 bottom-12 bg-[#0a101f]/90 border border-ai-green/30 px-3 py-2 rounded-lg flex-row items-center">
                                <ShieldCheck size={10} color="#00ff88" className="mr-2" />
                                <View>
                                    <Text className="text-[8px] text-ai-green font-bold tracking-widest">PERSONAL DATA</Text>
                                    <Text className="text-[8px] text-white">SECURE</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* BOTTOM SECTION: Content */}
                <View className="px-6 pb-12 w-full">

                    {/* Badge */}
                    <View className="self-center px-4 py-1.5 border border-ai-green/30 bg-ai-green/5 rounded-full mb-6">
                        <View className="flex-row items-center space-x-2">
                            <View className="w-1.5 h-1.5 rounded-full bg-ai-green animate-pulse" />
                            <Text className="text-ai-green text-[10px] uppercase font-bold tracking-[2px]">
                                Intelligent Health Ecosystem
                            </Text>
                        </View>
                    </View>

                    {/* Headline */}
                    <View className="mb-4 items-center">
                        <Text
                            className="text-white text-3xl font-black uppercase tracking-tighter shadow-black text-center"
                            numberOfLines={1}
                            adjustsFontSizeToFit
                        >
                            Personal Health
                        </Text>
                        {/* Glowing AI Logo */}
                        <Text className="text-ai-green text-3xl font-black uppercase tracking-tighter mt-[-5px] shadow-[0_0_20px_#00ff88]">
                            AI
                        </Text>
                    </View>

                    <Text className="text-gray-400 text-center text-xs uppercase tracking-widest mb-8">
                        Your Smart Wellness Companion
                    </Text>

                    {/* Description with Green Line */}
                    <View className="flex-row items-stretch mb-10 px-4">
                        <View className="w-1 bg-ai-green mr-4 rounded-full" />
                        <Text className="text-gray-400 text-xs leading-5 flex-1 text-left">
                            Experience the future of wellness. Our AI analyzes your lifestyle to create personalized nutrition and workout plans tailored exactly to your body's needs.
                        </Text>
                    </View>

                    {/* Main Action Button */}
                    <TouchableOpacity
                        onPress={handleStart}
                        activeOpacity={0.8}
                        className="bg-[#00ff88] w-full py-4 rounded-tl-2xl rounded-br-2xl flex-row items-center justify-center shadow-[0_0_20px_rgba(0,255,136,0.2)]"
                    >
                        <Text className="text-black font-black text-sm uppercase tracking-widest mr-2">
                            Start Health Journey
                        </Text>
                        <ChevronRight size={18} color="black" strokeWidth={3} />
                    </TouchableOpacity>
                </View>

            </SafeAreaView>
        </View>
    );
};
