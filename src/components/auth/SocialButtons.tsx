import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ghost, ShieldCheck } from 'lucide-react-native';

interface SocialButtonsProps {
    onGooglePress: () => void;
    onGuestPress: () => void;
    isLoading: boolean;
}

export const SocialButtons: React.FC<SocialButtonsProps> = ({
    onGooglePress,
    onGuestPress,
    isLoading
}) => {
    return (
        <View className="space-y-3 mt-6">
            <View className="relative my-6">
                <View className="absolute inset-0 flex-row items-center">
                    <View className="flex-1 border-t border-gray-200" />
                </View>
                <View className="relative flex-row justify-center">
                    <Text className="bg-white px-3 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                        OR CONTINUE WITH
                    </Text>
                </View>
            </View>

            <TouchableOpacity
                onPress={onGooglePress}
                disabled={isLoading}
                className="w-full py-4 bg-white border border-gray-200 rounded-xl flex-row items-center justify-center gap-3 shadow-sm active:bg-gray-50 bg-white shadow-sm"
            >
                {/* Simple Google Icon SVG representation or Image */}
                <View className="w-5 h-5 bg-transparent items-center justify-center">
                    <Text className="text-lg">G</Text>
                </View>
                <Text className="text-gray-700 font-bold text-xs uppercase tracking-wide">
                    Google Account
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={onGuestPress}
                disabled={isLoading}
                className="w-full py-4 bg-transparent border border-gray-300 rounded-xl flex-row items-center justify-center gap-3 active:bg-gray-50"
            >
                <Ghost size={16} color="#6B7280" />
                <Text className="text-gray-500 font-bold text-xs uppercase tracking-wide">
                    Guest Access
                </Text>
            </TouchableOpacity>

            <View className="bg-gray-50 p-3 mt-4 rounded-lg flex-row items-center justify-center gap-2 border border-blue-50">
                <ShieldCheck size={14} color="#9CA3AF" />
                <Text className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                    Secure Encrypted Protocol
                </Text>
            </View>
        </View>
    );
};
