import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { X, Save, ChefHat } from 'lucide-react-native';
import { DatabaseService } from '../services/database';

interface AddCustomFoodModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const AddCustomFoodModal = ({ visible, onClose, onSuccess }: AddCustomFoodModalProps) => {
    const [name, setName] = useState('');
    const [calories, setCalories] = useState('');
    const [protein, setProtein] = useState('');
    const [carbs, setCarbs] = useState('');
    const [fat, setFat] = useState('');
    const [servingSize, setServingSize] = useState('');

    const handleSave = () => {
        if (!name || !calories || !servingSize) {
            Alert.alert('Error', 'Please fill in Name, Calories, and Serving Size');
            return;
        }

        try {
            DatabaseService.addCustomFood({
                name,
                calories: Number(calories),
                protein: Number(protein) || 0,
                carbs: Number(carbs) || 0,
                fat: Number(fat) || 0,
                serving_size: servingSize
            });
            Alert.alert('Success', 'Custom food added!');
            setName('');
            setCalories('');
            setProtein('');
            setCarbs('');
            setFat('');
            setServingSize('');
            onSuccess();
            onClose();
        } catch (e) {
            Alert.alert('Error', 'Failed to save food');
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View className="flex-1 bg-black/80 justify-center px-4">
                <View className="bg-[#0f172a] rounded-3xl p-6 border border-white/10 max-h-[90%]">
                    {/* Header */}
                    <View className="flex-row justify-between items-center mb-6">
                        <View className="flex-row items-center gap-2">
                            <ChefHat size={24} color="#00ff88" />
                            <Text className="text-white text-xl font-bold">Add Custom Food</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} className="bg-slate-800 p-2 rounded-full">
                            <X color="white" size={20} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View className="gap-4">
                            <View>
                                <Text className="text-slate-400 text-xs uppercase font-bold mb-2">Food Name</Text>
                                <TextInput
                                    className="bg-slate-900/50 text-white p-4 rounded-xl border border-white/10 font-bold"
                                    placeholder="e.g. Nasi Goreng Spesial"
                                    placeholderTextColor="#64748b"
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>

                            <View className="flex-row gap-3">
                                <View className="flex-1">
                                    <Text className="text-slate-400 text-xs uppercase font-bold mb-2">Calories</Text>
                                    <TextInput
                                        className="bg-slate-900/50 text-white p-4 rounded-xl border border-white/10 font-bold text-center"
                                        placeholder="0"
                                        placeholderTextColor="#64748b"
                                        keyboardType="numeric"
                                        value={calories}
                                        onChangeText={setCalories}
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-slate-400 text-xs uppercase font-bold mb-2">Serving Size</Text>
                                    <TextInput
                                        className="bg-slate-900/50 text-white p-4 rounded-xl border border-white/10 font-bold text-center"
                                        placeholder="1 porsi"
                                        placeholderTextColor="#64748b"
                                        value={servingSize}
                                        onChangeText={setServingSize}
                                    />
                                </View>
                            </View>

                            <Text className="text-slate-500 text-xs font-bold uppercase mt-2">Macros (Optional)</Text>
                            <View className="flex-row gap-3">
                                <View className="flex-1">
                                    <Text className="text-blue-400 text-[10px] uppercase font-bold mb-1">Protein (g)</Text>
                                    <TextInput
                                        className="bg-slate-900/50 text-white p-3 rounded-xl border border-white/10 font-bold text-center"
                                        keyboardType="numeric"
                                        value={protein}
                                        onChangeText={setProtein}
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-yellow-400 text-[10px] uppercase font-bold mb-1">Carbs (g)</Text>
                                    <TextInput
                                        className="bg-slate-900/50 text-white p-3 rounded-xl border border-white/10 font-bold text-center"
                                        keyboardType="numeric"
                                        value={carbs}
                                        onChangeText={setCarbs}
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-purple-400 text-[10px] uppercase font-bold mb-1">Fat (g)</Text>
                                    <TextInput
                                        className="bg-slate-900/50 text-white p-3 rounded-xl border border-white/10 font-bold text-center"
                                        keyboardType="numeric"
                                        value={fat}
                                        onChangeText={setFat}
                                    />
                                </View>
                            </View>
                        </View>
                    </ScrollView>

                    <TouchableOpacity
                        onPress={handleSave}
                        className="bg-ai-green w-full py-4 rounded-2xl flex-row items-center justify-center mt-6 shadow-lg shadow-green-500/20"
                    >
                        <Save size={20} color="black" className="mr-2" />
                        <Text className="text-black font-black text-sm uppercase tracking-widest">
                            Save Food
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};
