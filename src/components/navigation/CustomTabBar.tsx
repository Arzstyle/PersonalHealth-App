import React from 'react';
import { View, TouchableOpacity, Text, Dimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LayoutGrid, Utensils, Search, Dumbbell, User } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
    return (
        <View className="absolute bottom-10 left-0 right-0 pointer-events-box-none">
            {/* Background Shape mimicking the reference (Bump in middle) */}
            <View className="absolute bottom-0 w-full h-[70px] bg-[#02050a] border-t border-white/5 shadow-2xl rounded-t-[20px]">
                {/* This matches the bump effect logic conceptually or just clean curve */}
            </View>

            <View className="flex-row items-end justify-between px-3 pb-2 h-[80px]">
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    // Icon Mapping
                    let IconComponent = LayoutGrid;
                    if (route.name === 'Hub') IconComponent = LayoutGrid;
                    else if (route.name === 'Nutrition') IconComponent = Utensils;
                    else if (route.name === 'Search') IconComponent = Search;
                    else if (route.name === 'Training') IconComponent = Dumbbell;
                    else if (route.name === 'Identity') IconComponent = User;

                    // CENTER BUTTON (Search)
                    if (route.name === 'Search') {
                        return (
                            <View key={index} className="relative items-center mb-5" style={{ width: width / 5 }}>
                                {/* The "Bump" Background Cutout Simulator */}
                                <View className="absolute -bottom-6 w-20 h-20 bg-[#02050a] rounded-full border-t border-white/5" />

                                <TouchableOpacity
                                    onPress={onPress}
                                    activeOpacity={0.9}
                                    className={`w-14 h-14 rounded-full items-center justify-center shadow-[0_0_15px_#06b6d4] ${isFocused ? 'bg-cyan-500' : 'bg-gray-800 border block-gray-700'}`}
                                >
                                    <IconComponent
                                        size={24}
                                        color="#ffffff"
                                        strokeWidth={3}
                                    />
                                </TouchableOpacity>
                            </View>
                        );
                    }

                    // STANDARD TABS
                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={onPress}
                            activeOpacity={0.7}
                            className={`items-center justify-center mb-1`}
                            style={{ width: width / 5.5 }}
                        >
                            <View className={`p-2 rounded-xl scale-90 ${isFocused ? 'bg-cyan-500/10' : 'bg-transparent'}`}>
                                <IconComponent
                                    size={22}
                                    color={isFocused ? '#06b6d4' : '#64748b'}
                                    strokeWidth={isFocused ? 2.5 : 2}
                                />
                            </View>
                            {/* Small Dot Indicator for active state */}
                            {isFocused && <View className="w-1 h-1 bg-cyan-500 rounded-full mt-1" />}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};
