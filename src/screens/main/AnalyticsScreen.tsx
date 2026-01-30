import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const AnalyticsScreen = () => {
    return (
        <SafeAreaView className="flex-1 bg-ai-bg">
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <Text className="text-white text-3xl font-black uppercase tracking-widest mb-4">
                    Analytics
                </Text>
                <View className="h-60 bg-[#0a101f] rounded-2xl items-center justify-center border border-gray-800">
                    <Text className="text-gray-600">Performance Graphs</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};
