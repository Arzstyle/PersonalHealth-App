import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HubScreen } from '../screens/main/HubScreen';
import { NutritionScreen } from '../screens/main/NutritionScreen';
import { SearchScreen } from '../screens/main/SearchScreen';
import { TrainingScreen } from '../screens/main/TrainingScreen'; // Force resolve

import { IdentityScreen } from '../screens/main/IdentityScreen';
import { CustomTabBar } from '../components/navigation/CustomTabBar';

const Tab = createBottomTabNavigator();

export const MainTabNavigator = () => {
    // Navigator Definition
    return (
        <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute', // Required for custom floating effect
                    backgroundColor: 'transparent',
                    borderTopWidth: 0,
                    elevation: 0,
                }
            }}
        >
            <Tab.Screen name="Hub" component={HubScreen} />
            <Tab.Screen name="Nutrition" component={NutritionScreen} />
            <Tab.Screen name="Search" component={SearchScreen} />
            <Tab.Screen name="Training" component={TrainingScreen} />
            <Tab.Screen name="Identity" component={IdentityScreen} />
        </Tab.Navigator>
    );
};
