import React, { useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
// import Animated, {
//     useSharedValue,
//     useAnimatedStyle,
//     withRepeat,
//     withTiming,
//     Easing
// } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export const AdaptiveBackground = () => {
    // Reanimated removed for stability

    return (
        <View className="absolute inset-0 bg-white">
            {/* Decorative Blobs */}
            <View
                className="absolute top-[-10%] right-[-20%] w-[300px] h-[300px] bg-blue-200 rounded-full"
            />
            <View
                className="absolute bottom-[-10%] left-[-20%] w-[300px] h-[300px] bg-purple-200 rounded-full"
            />

            {/* Grid Pattern Overlay (Simple Dot approximation) */}
            <View className="absolute inset-0 opacity-[0.05] bg-gray-900" style={{ zIndex: 1 }} />

            {/* Blur Effect over blobs */}
            <BlurView intensity={80} style={{ position: 'absolute', width: '100%', height: '100%' }} tint="light" />
        </View>
    );
};
