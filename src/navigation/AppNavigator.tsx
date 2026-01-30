import React from 'react';
import { View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { WelcomeIntro } from '../screens/onboarding/WelcomeIntro';
import { OnboardingSteps } from '../screens/onboarding/OnboardingSteps';
import { LoginScreen } from '../screens/onboarding/LoginScreen';
import { BodyMetricsScreen } from '../screens/onboarding/BodyMetricsScreen';
import { MetabolicProfileScreen } from '../screens/onboarding/MetabolicProfileScreen';
import { MainTabNavigator } from './MainTabNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: '#02050a' },
                    animation: 'none',
                }}
            >
                <Stack.Screen name="WelcomeIntro" component={WelcomeIntro} />
                <Stack.Screen name="OnboardingSteps" component={OnboardingSteps} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="BodyMetrics" component={BodyMetricsScreen} />
                <Stack.Screen name="MetabolicProfile" component={MetabolicProfileScreen} />
                <Stack.Screen name="Main" component={MainTabNavigator} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
