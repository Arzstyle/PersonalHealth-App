import React, { useEffect, useRef } from 'react';
import { View, Text, Dimensions, Animated, Easing } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Zap, Trophy } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface CalorieRingProps {
    target: number;
    current: number;
}

export const CalorieRing = ({ target, current }: CalorieRingProps) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 8,
            tension: 20,
            useNativeDriver: true,
        }).start();
    }, []);

    const radius = 90;
    const strokeWidth = 14;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.min(Math.max(current / target, 0), 1);
    const strokeDashoffset = circumference - progress * circumference;
    const remaining = Math.max(0, target - current);

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }} className="items-center justify-center my-8">
            <View className="relative items-center justify-center">
                {/* Outer Glow/Blur */}
                <View className="absolute w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />

                {/* Decorative Dashed Borders (Simulated) */}
                <View className="absolute w-[240px] h-[240px] rounded-full border border-dashed border-gray-800" />

                {/* SVG Ring */}
                <Svg width={220} height={220} viewBox="0 0 220 220" className="transform -rotate-90">
                    {/* Background Circle */}
                    <Circle
                        cx="110"
                        cy="110"
                        r={radius}
                        stroke="#1e293b" // Slate-800
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeLinecap="round"
                        strokeOpacity={0.3}
                    />
                    {/* Progress Circle */}
                    <Circle
                        cx="110"
                        cy="110"
                        r={radius}
                        stroke="#06b6d4" // Cyan-500
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        fill="transparent"
                        strokeOpacity={0.9}
                    />
                </Svg>

                {/* Inner Content */}
                <View className="absolute items-center justify-center">
                    <View className="bg-[#0a101f] p-4 rounded-full border border-cyan-500/30 mb-3 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                        {remaining === 0 ? (
                            <Trophy size={24} color="#eab308" fill="#eab308" />
                        ) : (
                            <Zap size={24} color="#06b6d4" fill="#06b6d4" />
                        )}
                    </View>
                    <Text className="text-white text-5xl font-black shadow-lg">
                        {remaining}
                    </Text>
                    <Text className="text-gray-400 text-[10px] font-bold uppercase mt-1">
                        KCAL LEFT
                    </Text>
                </View>
            </View>
        </Animated.View>
    );
};
