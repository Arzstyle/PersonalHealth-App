import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
    User, Settings, Scale, Ruler, Calendar, Activity,
    Target, Languages, LogOut, Utensils, ShieldAlert, Edit2, X, Save,
    Zap, Sparkles, CheckCircle2, Circle, Leaf, ChefHat, Cpu
} from 'lucide-react-native';
import { useUI } from '../../context/UIContext';
import { useAuth } from '../../context/AuthContext';
import { useUserProfile, UserProfile } from '../../context/UserProfileContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { calculateBMI, getBMICategory, calculateBMR, calculateTDEE } from '../../utils/calculations';

const RESTRICTION_OPTIONS = ['Vegetarian', 'Vegan', 'Keto', 'Paleo', 'Dairy-Free', 'Gluten-Free', 'Halal'];
const ALLERGY_OPTIONS = ['Nuts', 'Dairy', 'Soy', 'Eggs', 'Shellfish', 'Seafood', 'Gluten'];

// Extracted EditProfileModal Component
const EditProfileModal = ({ visible, onClose, profile, onSave }: { visible: boolean; onClose: () => void; profile: UserProfile; onSave: (p: UserProfile) => void }) => {
    const [localProfile, setLocalProfile] = useState<UserProfile>(profile);

    useEffect(() => {
        setLocalProfile(profile);
    }, [profile, visible]);

    return (
        <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
            <View className="flex-1 bg-black/90 justify-center px-4">
                <View className="bg-[#0f172a] rounded-3xl p-6 border border-white/10 relative overflow-hidden">
                    <View className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 blur-[50px] rounded-full" />

                    <View className="flex-row justify-between items-center mb-6">
                        <View className="flex-row items-center gap-2">
                            <Edit2 size={20} color="#22d3ee" />
                            <Text className="text-white text-xl font-bold">Edit Profile</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} className="bg-slate-800 p-2 rounded-full">
                            <X color="white" size={20} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                        <View className="gap-5">
                            <View>
                                <Text className="text-slate-400 text-xs uppercase font-bold mb-2">Display Name</Text>
                                <TextInput
                                    className="bg-slate-900/50 text-white p-4 rounded-2xl border border-white/10 font-bold text-lg"
                                    value={localProfile.name}
                                    placeholderTextColor="#64748b"
                                    onChangeText={t => setLocalProfile({ ...localProfile, name: t })}
                                />
                            </View>
                            <View className="flex-row gap-4">
                                <View className="flex-1">
                                    <Text className="text-slate-400 text-xs uppercase font-bold mb-2">Weight (kg)</Text>
                                    <TextInput
                                        className="bg-slate-900/50 text-white p-4 rounded-2xl border border-white/10 font-black text-2xl text-center"
                                        keyboardType="numeric"
                                        value={String(localProfile.weight)}
                                        onChangeText={t => setLocalProfile({ ...localProfile, weight: Number(t) || 0 })}
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-slate-400 text-xs uppercase font-bold mb-2">Height (cm)</Text>
                                    <TextInput
                                        className="bg-slate-900/50 text-white p-4 rounded-2xl border border-white/10 font-black text-2xl text-center"
                                        keyboardType="numeric"
                                        value={String(localProfile.height)}
                                        onChangeText={t => setLocalProfile({ ...localProfile, height: Number(t) || 0 })}
                                    />
                                </View>
                            </View>
                            <View className="flex-row gap-4">
                                <View className="flex-1">
                                    <Text className="text-slate-400 text-xs uppercase font-bold mb-2">Age</Text>
                                    <TextInput
                                        className="bg-slate-900/50 text-white p-4 rounded-2xl border border-white/10 font-black text-2xl text-center"
                                        keyboardType="numeric"
                                        value={String(localProfile.age)}
                                        onChangeText={t => setLocalProfile({ ...localProfile, age: Number(t) || 0 })}
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-slate-400 text-xs uppercase font-bold mb-2">Gender</Text>
                                    <TouchableOpacity
                                        onPress={() => setLocalProfile({ ...localProfile, gender: localProfile.gender === 'male' ? 'female' : 'male' })}
                                        className={`p-4 rounded-2xl border border-white/10 items-center justify-center ${localProfile.gender === 'male' ? 'bg-cyan-900/20' : 'bg-pink-900/20'}`}
                                    >
                                        <Text className={`font-black text-lg ${localProfile.gender === 'male' ? 'text-cyan-400' : 'text-pink-400'}`}>
                                            {localProfile.gender.toUpperCase()}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                    <TouchableOpacity
                        onPress={() => onSave(localProfile)}
                        className="bg-[#00ff88] p-4 rounded-2xl items-center mt-2 shadow-lg shadow-green-500/20"
                    >
                        <View className="flex-row gap-2 items-center">
                            <Save size={20} color="black" />
                            <Text className="text-black font-black text-lg tracking-wide">Save Profile</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

// EditProtocolsModal Component
const EditProtocolsModal = ({ visible, onClose, profile, onSave }: { visible: boolean; onClose: () => void; profile: UserProfile; onSave: (p: UserProfile) => void }) => {
    const [localProfile, setLocalProfile] = useState<UserProfile>(profile);

    useEffect(() => {
        setLocalProfile(profile);
    }, [profile, visible]);

    const toggleOption = (type: 'restrictions' | 'allergies', value: string) => {
        const list = type === 'restrictions' ? localProfile.dietaryRestrictions || [] : localProfile.allergies || [];
        const newList = list.includes(value) ? list.filter(i => i !== value) : [...list, value];

        if (type === 'restrictions') {
            setLocalProfile({ ...localProfile, dietaryRestrictions: newList });
        } else {
            setLocalProfile({ ...localProfile, allergies: newList });
        }
    };

    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
            <View className="flex-1 bg-black/80 justify-center px-4">
                <View className="bg-[#0f172a] rounded-3xl p-6 border border-white/10 relative overflow-hidden max-h-[85%]">
                    <View className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 blur-[60px] rounded-full" />

                    <View className="flex-row justify-between items-center mb-6">
                        <View className="flex-row items-center gap-2">
                            <Cpu size={20} color="#a855f7" />
                            <Text className="text-white text-xl font-bold uppercase tracking-wider">Edit Protocols</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} className="bg-slate-800 p-2 rounded-full">
                            <X color="white" size={20} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Restrictions Section */}
                        <View className="mb-6">
                            <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">Restrictions</Text>
                            <View className="flex-row flex-wrap gap-2">
                                {RESTRICTION_OPTIONS.map(opt => {
                                    const isSelected = localProfile.dietaryRestrictions?.includes(opt);
                                    return (
                                        <TouchableOpacity
                                            key={opt}
                                            onPress={() => toggleOption('restrictions', opt)}
                                            className={`px-4 py-2 rounded-xl border ${isSelected ? 'bg-slate-700 border-white/30' : 'bg-slate-900 border-white/5'}`}
                                        >
                                            <Text className={`font-bold ${isSelected ? 'text-white' : 'text-slate-500'}`}>{opt}</Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                        </View>

                        {/* Allergies Section */}
                        <View className="mb-6">
                            <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">Allergies</Text>
                            <View className="flex-row flex-wrap gap-2">
                                {ALLERGY_OPTIONS.map(opt => {
                                    const isSelected = localProfile.allergies?.includes(opt);
                                    return (
                                        <TouchableOpacity
                                            key={opt}
                                            onPress={() => toggleOption('allergies', opt)}
                                            className={`px-4 py-2 rounded-xl border ${isSelected ? 'bg-slate-700 border-white/30' : 'bg-slate-900 border-white/5'}`}
                                        >
                                            <Text className={`font-bold ${isSelected ? 'text-white' : 'text-slate-500'}`}>{opt}</Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                        </View>
                    </ScrollView>

                    <TouchableOpacity
                        onPress={() => onSave(localProfile)}
                        className="bg-[#8b5cf6] p-4 rounded-2xl items-center mt-2 shadow-lg shadow-purple-500/30"
                    >
                        <View className="flex-row gap-2 items-center">
                            <Save size={20} color="white" />
                            <Text className="text-white font-black text-lg tracking-wide">SAVE DATA</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

export const IdentityScreen = () => {
    const { t, language, setLanguage } = useUI();
    const { logout } = useAuth();
    const { profile, setProfile } = useUserProfile();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingProtocols, setIsEditingProtocols] = useState(false);

    const handleLogout = () => {
        Alert.alert(
            t('profile.logout'),
            t('profile.logout_confirm'),
            [
                {
                    text: t('profile.logout_no'),
                    style: 'cancel',
                },
                {
                    text: t('profile.logout_yes'),
                    style: 'destructive',
                    onPress: () => {
                        logout();
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Login' }],
                        });
                    },
                },
            ]
        );
    };

    const handleSaveProfile = async (newProfile: UserProfile) => {
        try {
            // Use context method which handles AsyncStorage internally
            await setProfile({ ...newProfile, isGuest: false });
            setIsEditing(false);
            setIsEditingProtocols(false);
            Alert.alert(t('common.success'), t('profile.save'));
        } catch (e) { Alert.alert('Error', 'Failed to save profile'); }
    };

    const bmi = calculateBMI(profile.weight, profile.height);
    const bmiCategory = getBMICategory(bmi);
    const bmr = calculateBMR(profile.weight, profile.height, profile.age, profile.gender);
    const tdee = calculateTDEE(bmr, profile.activityLevel);

    return (
        <SafeAreaView className="flex-1 bg-ai-bg" edges={['top']}>
            <View className="absolute inset-0 z-0">
                <LinearGradient
                    colors={['#020617', '#0f172a', '#020617']}
                    locations={[0, 0.5, 1]}
                    style={{ flex: 1 }}
                />
            </View>

            <EditProfileModal
                visible={isEditing}
                onClose={() => setIsEditing(false)}
                profile={profile}
                onSave={handleSaveProfile}
            />

            <EditProtocolsModal
                visible={isEditingProtocols}
                onClose={() => setIsEditingProtocols(false)}
                profile={profile}
                onSave={handleSaveProfile}
            />

            {/* Main Content: Using mx-6 for ALL cards to match Nutrition Screen layout EXACTLY */}
            <View className="flex-1 pt-8 pb-32">

                {/* 1. Header Card - Matching Vital Statistics structure exactly */}
                <View className="mx-6 bg-slate-900/40 p-5 border border-white/5 mb-5" style={{ borderRadius: 48 }}>
                    <View className="flex-row items-center gap-2 mb-3 px-1">
                        <User size={16} color="#22d3ee" />
                        <Text className="text-slate-400 font-bold text-xs uppercase tracking-wider">{t('hub.profile')}</Text>
                    </View>

                    <View className="flex-row items-center justify-center gap-4">
                        {/* Avatar */}
                        <View className="relative ml-4">
                            <View className="w-16 h-16 bg-slate-800 rounded-full items-center justify-center overflow-hidden border-2 border-ai-green shadow-lg shadow-green-500/20">
                                <LinearGradient colors={['#1e293b', '#0f172a']} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
                                <User size={28} color="#94a3b8" />
                            </View>
                            <TouchableOpacity onPress={() => setIsEditing(true)} className="absolute -bottom-1 -right-1 bg-ai-green p-1 rounded-full border-2 border-slate-900">
                                <Edit2 size={10} color="#000" />
                            </TouchableOpacity>
                        </View>

                        {/* Info */}
                        <View className="flex-1 items-center">
                            <Text className="text-white text-xl font-black tracking-tight mb-2" numberOfLines={1}>{profile.name}</Text>

                            <View className="flex-row items-center gap-3 mb-1">
                                <View className="flex-row items-center gap-1">
                                    <CheckCircle2 size={10} color="#4ade80" />
                                    <Text className="text-ai-green text-[10px] font-bold uppercase tracking-wider">{t('profile.verified')}</Text>
                                </View>
                                <Text className="text-slate-500 text-[9px] font-bold">{t('profile.joined')}: Jan 2026</Text>
                            </View>

                            <View className="flex-row items-center gap-1 bg-slate-800/50 px-2 py-0.5 rounded-full">
                                <View className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                <Text className="text-green-500 text-[9px] font-bold">{t('profile.online')}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* 2. Stats Summary (Nutrition Style) */}
                <View className="mx-6 bg-slate-900/40 p-5 border border-white/5 mb-5" style={{ borderRadius: 48 }}>
                    <View className="flex-row items-center gap-2 mb-3 px-1">
                        <Activity size={16} color="#22d3ee" />
                        <Text className="text-slate-400 font-bold text-xs uppercase tracking-wider">{t('profile.stats')}</Text>
                    </View>

                    <View className="flex-row flex-wrap justify-between gap-y-2">
                        {/* Height */}
                        <View className="w-[49%] p-4 bg-yellow-500/10 border border-white/5" style={{ borderRadius: 32 }}>
                            <Text className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">{t('stats.height')}</Text>
                            <Text className="text-xl font-black text-yellow-500">{profile.height}</Text>
                            <Text className="text-[10px] text-slate-500 font-medium">{t('common.cm')}</Text>
                        </View>

                        {/* Weight */}
                        <View className="w-[49%] p-4 bg-blue-500/10 border border-white/5" style={{ borderRadius: 32 }}>
                            <Text className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">{t('stats.weight')}</Text>
                            <Text className="text-xl font-black text-blue-500">{profile.weight}</Text>
                            <Text className="text-[10px] text-slate-500 font-medium">{t('common.kg')}</Text>
                        </View>

                        {/* Age */}
                        <View className="w-[49%] p-4 bg-purple-500/10 border border-white/5" style={{ borderRadius: 32 }}>
                            <Text className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">{t('stats.age')}</Text>
                            <Text className="text-xl font-black text-purple-500">{profile.age}</Text>
                            <Text className="text-[10px] text-slate-500 font-medium">{t('stats.years')}</Text>
                        </View>

                        {/* BMI */}
                        <View className="w-[49%] p-4 bg-emerald-500/10 border border-white/5" style={{ borderRadius: 32 }}>
                            <Text className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">{t('stats.bmi')}</Text>
                            <Text className="text-xl font-black" style={{ color: bmiCategory.color }}>{bmi}</Text>
                            <Text className="text-[10px] text-slate-500 font-medium">{bmiCategory.label}</Text>
                        </View>
                    </View>
                </View>

                {/* 3. Actions Row - inside container like stats */}
                <View className="mx-6 bg-slate-900/40 p-4 border border-white/5 mb-5" style={{ borderRadius: 48 }}>
                    <View className="flex-row items-center gap-2 mb-3 px-1">
                        <Target size={16} color="#22d3ee" />
                        <Text className="text-slate-400 font-bold text-xs uppercase tracking-wider">{t('profile.targets')}</Text>
                    </View>

                    <View className="flex-row gap-2">
                        {/* Target Value */}
                        <View className="flex-1 p-3 bg-ai-green/10 border border-white/5" style={{ borderRadius: 24 }}>
                            <View className="flex-row items-baseline gap-1">
                                <Text className="text-2xl font-black text-white">
                                    {profile.dailyCalories > 0 ? Math.round(profile.dailyCalories) : tdee}
                                </Text>
                                <Text className="text-ai-green font-bold text-xs">{t('common.kcal')}</Text>
                            </View>
                        </View>

                        {/* Language Button */}
                        <TouchableOpacity
                            onPress={() => setLanguage(language === 'en' ? 'id' : 'en')}
                            className="w-14 p-3 bg-slate-800/50 border border-white/5 items-center justify-center gap-1" style={{ borderRadius: 24 }}
                        >
                            <Languages size={16} color="#94a3b8" />
                            <Text className="text-slate-400 font-bold uppercase text-[8px]">{language.toUpperCase()}</Text>
                        </TouchableOpacity>

                        {/* Logout Button */}
                        <TouchableOpacity
                            onPress={handleLogout}
                            className="w-14 p-3 bg-red-500/10 border border-red-500/20 items-center justify-center" style={{ borderRadius: 24 }}
                        >
                            <LogOut size={16} color="#ef4444" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* 4. Nutritional Protocols (Bottom Item - compact) */}
                <View className="mx-6 bg-slate-900/40 rounded-[32px] border border-white/5 p-4 relative overflow-hidden">
                    <LinearGradient colors={['rgba(139, 92, 246, 0.05)', 'transparent']} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />

                    <View className="flex-row items-center justify-between mb-4">
                        <View className="flex-row items-center gap-2">
                            <Utensils size={18} color="#a855f7" />
                            <Text className="text-white font-bold text-sm uppercase tracking-wide">{t('profile.protocols')}</Text>
                        </View>
                        <TouchableOpacity onPress={() => setIsEditingProtocols(true)}>
                            <Edit2 size={16} color="#64748b" />
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row gap-3">
                        <View className="flex-1">
                            <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">{t('profile.restrictions')}</Text>
                            {profile.dietaryRestrictions && profile.dietaryRestrictions.length > 0 ? (
                                <View className="flex-row flex-wrap gap-1">
                                    {profile.dietaryRestrictions.map((r, i) => (
                                        <View key={i} className="bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
                                            <Text className="text-purple-300 text-[9px] font-bold">{r}</Text>
                                        </View>
                                    ))}
                                </View>
                            ) : (
                                <Text className="text-slate-500 text-[10px] italic">{t('profile.none')}</Text>
                            )}
                        </View>
                        <View className="flex-1">
                            <Text className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">{t('profile.allergies')}</Text>
                            {profile.allergies && profile.allergies.length > 0 ? (
                                <View className="flex-row flex-wrap gap-1">
                                    {profile.allergies.map((a, i) => (
                                        <View key={i} className="bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/20">
                                            <Text className="text-red-300 text-[9px] font-bold">{a}</Text>
                                        </View>
                                    ))}
                                </View>
                            ) : (
                                <Text className="text-slate-500 text-[10px] italic">{t('profile.none')}</Text>
                            )}
                        </View>
                    </View>
                </View>

            </View>
        </SafeAreaView>
    );
};
