import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import { useUserProfile } from '../../context/UserProfileContext';
import { useUI } from '../../context/UIContext';

export const HubHeader = () => {
    const { profile } = useUserProfile();
    const { t, language } = useUI();
    const [dateStr, setDateStr] = useState('');
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        const today = new Date();
        setDateStr(today.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
            weekday: "long",
            day: "numeric",
            month: "long",
        }));

        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                easing: Easing.out(Easing.back(1.5)),
                useNativeDriver: true,
            })
        ]).start();
    }, [language]);

    // Get first name or first letter for display
    const displayName = profile.name || 'Guest';
    const shortName = displayName.split(' ')[0];

    return (
        <Animated.View
            style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
            className="flex-row justify-between items-end mb-8 pt-4"
        >
            <View>
                <View className="flex-row items-center mb-2">
                    <View className="w-2 h-2 rounded-full bg-cyan-400 mr-2 animate-pulse" />
                    <Text className="text-cyan-400 text-[10px] font-bold uppercase">
                        {profile.isGuest ? t('hub.guest_mode') : t('hub.system_online')}
                    </Text>
                </View>

                <Text className="text-white text-4xl font-black">
                    {t('hub.hello')}, <Text className="text-cyan-400">{shortName}</Text> 🤖
                </Text>
            </View>

            {/* Date Badge */}
            <View className="bg-[#0a101f]/90 border border-cyan-500/20 px-4 py-2 rounded-2xl shadow-lg">
                <Text className="text-gray-500 text-[10px] font-bold uppercase">
                    {t('hub.today')}
                </Text>
                <Text className="text-gray-200 font-bold text-xs">
                    {dateStr}
                </Text>
            </View>
        </Animated.View >
    );
};
