import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StatusBar, ActivityIndicator, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { Mail, Lock, Ghost, ShieldCheck, UserPlus, LogIn, CheckCircle, ArrowRight, Sparkles, XCircle, AlertTriangle } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { useUserProfile } from '../../context/UserProfileContext';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { auth } from '../../services/firebase';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

// Success Modal Component
const SuccessModal = ({
    visible,
    title,
    message,
    subMessage,
    buttonText,
    onPress
}: {
    visible: boolean;
    title: string;
    message: string;
    subMessage?: string;
    buttonText: string;
    onPress: () => void;
}) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
        >
            <View className="flex-1 bg-black/80 justify-center items-center px-6">
                <View className="bg-[#0a101f] border border-ai-green/30 rounded-3xl p-8 w-full max-w-[340px] items-center shadow-2xl">
                    {/* Success Icon with Glow */}
                    <View className="w-20 h-20 rounded-full bg-ai-green/20 items-center justify-center mb-6 border-2 border-ai-green/50">
                        <CheckCircle size={44} color="#00ff88" />
                    </View>

                    {/* Sparkles decoration */}
                    <View className="absolute top-12 left-8">
                        <Sparkles size={16} color="#00ff88" />
                    </View>
                    <View className="absolute top-16 right-10">
                        <Sparkles size={12} color="#00ff88" />
                    </View>

                    {/* Title */}
                    <Text className="text-ai-green text-2xl font-black uppercase tracking-widest text-center mb-3">
                        {title}
                    </Text>

                    {/* Message */}
                    <Text className="text-white text-base font-bold text-center mb-2">
                        {message}
                    </Text>

                    {/* Sub Message */}
                    {subMessage && (
                        <Text className="text-gray-400 text-sm text-center mb-6 leading-5">
                            {subMessage}
                        </Text>
                    )}

                    {/* Divider with glow */}
                    <View className="w-full h-[1px] bg-ai-green/30 my-4" />

                    {/* Action Button */}
                    <TouchableOpacity
                        onPress={onPress}
                        activeOpacity={0.8}
                        className="bg-ai-green w-full py-4 rounded-xl flex-row items-center justify-center mt-2"
                    >
                        <Text className="text-black font-black text-sm uppercase tracking-widest mr-2">
                            {buttonText}
                        </Text>
                        <ArrowRight size={18} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

// Error Modal Component
const ErrorModal = ({
    visible,
    title,
    message,
    onClose
}: {
    visible: boolean;
    title: string;
    message: string;
    onClose: () => void;
}) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
        >
            <View className="flex-1 bg-black/80 justify-center items-center px-6">
                <View className="bg-[#0a101f] border border-red-500/30 rounded-3xl p-8 w-full max-w-[340px] items-center shadow-2xl">
                    {/* Error Icon with Glow */}
                    <View className="w-20 h-20 rounded-full bg-red-500/20 items-center justify-center mb-6 border-2 border-red-500/50">
                        <XCircle size={44} color="#ef4444" />
                    </View>

                    {/* Warning decoration */}
                    <View className="absolute top-12 left-8">
                        <AlertTriangle size={16} color="#f97316" />
                    </View>
                    <View className="absolute top-16 right-10">
                        <AlertTriangle size={12} color="#f97316" />
                    </View>

                    {/* Title */}
                    <Text className="text-red-500 text-2xl font-black uppercase tracking-widest text-center mb-3">
                        {title}
                    </Text>

                    {/* Message */}
                    <Text className="text-white text-base font-bold text-center mb-2 leading-6">
                        {message}
                    </Text>

                    {/* Divider */}
                    <View className="w-full h-[1px] bg-red-500/30 my-4" />

                    {/* Close Button */}
                    <TouchableOpacity
                        onPress={onClose}
                        activeOpacity={0.8}
                        className="bg-red-500 w-full py-4 rounded-xl flex-row items-center justify-center mt-2"
                    >
                        <Text className="text-white font-black text-sm uppercase tracking-widest">
                            Mengerti
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export const LoginScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const { login, register, authError, clearError, user } = useAuth();
    const { setGuestProfile, syncAuthProfile, hasValidProfile } = useUserProfile();
    const { t } = useUI();

    // Mode: 'login' | 'register'
    const [mode, setMode] = useState<'login' | 'register'>('login');

    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Modal States
    const [showRegisterSuccess, setShowRegisterSuccess] = useState(false);
    const [showLoginSuccess, setShowLoginSuccess] = useState(false);

    const handleSubmit = async () => {
        if (!email || !password) {
            return;
        }

        if (mode === 'register' && password !== confirmPassword) {
            alert('Password tidak cocok!');
            return;
        }

        if (password.length < 6) {
            alert('Password minimal 6 karakter!');
            return;
        }

        setIsLoading(true);
        try {
            if (mode === 'login') {
                await login(email, password);
                // Show login success modal
                setShowLoginSuccess(true);
            } else {
                await register(email, password);
                // Show registration success modal
                setShowRegisterSuccess(true);
            }
        } catch (e) {
            // Error already handled in AuthContext
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegisterSuccessContinue = () => {
        setShowRegisterSuccess(false);
        // Switch to login mode so user can login
        setMode('login');
        setPassword('');
        setConfirmPassword('');
    };

    const handleLoginSuccessContinue = async () => {
        setShowLoginSuccess(false);

        // SYNC DATA: Sync auth profile (name/photo)
        if (auth.currentUser) {
            await syncAuthProfile(auth.currentUser);
        }

        // VALIDATION: Check if user has valid profile data
        if (hasValidProfile()) {
            navigation.replace('WelcomeBack');
        } else {
            // New user or incomplete profile
            navigation.replace('BodyMetrics');
        }
    };

    const handleGuest = () => {
        setGuestProfile();
        navigation.replace('Main');
    };

    const handleGoogleLogin = () => {
        // Placeholder for Google Login - show coming soon
        alert('Google Sign-In akan tersedia segera! 🚀');
    };

    const toggleMode = () => {
        setMode(mode === 'login' ? 'register' : 'login');
        setPassword('');
        setConfirmPassword('');
    };

    return (
        <SafeAreaView className="flex-1 bg-ai-bg">
            <StatusBar barStyle="light-content" />

            {/* Success Modals */}
            <SuccessModal
                visible={showRegisterSuccess}
                title={t('modal.register_success')}
                message={t('modal.register_saved')}
                subMessage={t('modal.register_hint')}
                buttonText={t('modal.login_now')}
                onPress={handleRegisterSuccessContinue}
            />

            <SuccessModal
                visible={showLoginSuccess}
                title={t('modal.login_success')}
                message={t('modal.welcome_back')}
                subMessage={t('modal.login_hint')}
                buttonText={t('modal.fill_data')}
                onPress={handleLoginSuccessContinue}
            />

            {/* Error Modal */}
            <ErrorModal
                visible={authError !== null}
                title={authError?.title || 'Error'}
                message={authError?.message || 'Terjadi kesalahan'}
                onClose={clearError}
            />

            {/* Background Grid Elements */}
            <View className="absolute inset-0 opacity-20">
                <View className="absolute top-[30%] left-0 w-full h-[1px] bg-ai-green/20" />
                <View className="absolute top-[70%] left-0 w-full h-[1px] bg-ai-green/20" />
                <View className="absolute left-[50%] top-0 h-full w-[1px] bg-ai-green/20" />
            </View>

            <View className="flex-1 px-6 justify-center">

                {/* Header Icon */}
                <View className="items-center mb-6">
                    <View className="w-16 h-16 rounded-2xl bg-[#0a101f] border border-ai-green/30 items-center justify-center shadow-[0_0_20px_rgba(0,255,136,0.15)]">
                        {mode === 'login' ? (
                            <LogIn size={28} color="#00ff88" />
                        ) : (
                            <UserPlus size={28} color="#00ff88" />
                        )}
                    </View>
                </View>

                {/* Title */}
                <View className="items-center mb-8">
                    <Text className="text-white text-3xl font-black uppercase tracking-widest text-center shadow-lg">
                        {mode === 'login' ? t('login.title') : t('login.register_title')}
                    </Text>
                    <Text className="text-gray-400 text-xs uppercase tracking-widest text-center mt-2 font-bold max-w-[280px] leading-5">
                        {mode === 'login'
                            ? t('login.subtitle')
                            : t('login.register_subtitle')}
                    </Text>
                </View>

                {/* Form Inputs */}
                <View className="space-y-4">
                    <View>
                        <Text className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2 ml-1">
                            {t('login.email')}
                        </Text>
                        <View className="flex-row items-center bg-[#0a101f] border border-gray-800 rounded-xl px-4">
                            <Mail size={18} color="#6b7280" />
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                placeholder="user@example.com"
                                placeholderTextColor="rgba(107, 114, 128, 0.5)"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                className="flex-1 py-4 pl-3 text-white font-bold tracking-wide text-base"
                            />
                        </View>
                    </View>

                    <View>
                        <Text className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2 ml-1">
                            {t('login.password')}
                        </Text>
                        <View className="flex-row items-center bg-[#0a101f] border border-gray-800 rounded-xl px-4">
                            <Lock size={18} color="#6b7280" />
                            <TextInput
                                value={password}
                                onChangeText={setPassword}
                                placeholder="••••••••"
                                secureTextEntry
                                placeholderTextColor="rgba(107, 114, 128, 0.5)"
                                className="flex-1 py-4 pl-3 text-white font-bold tracking-wide text-base"
                            />
                        </View>
                    </View>

                    {/* Confirm Password - Only for Register */}
                    {mode === 'register' && (
                        <View>
                            <Text className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2 ml-1">
                                {t('login.confirm_password')}
                            </Text>
                            <View className="flex-row items-center bg-[#0a101f] border border-gray-800 rounded-xl px-4">
                                <Lock size={18} color="#6b7280" />
                                <TextInput
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    placeholder="••••••••"
                                    secureTextEntry
                                    placeholderTextColor="rgba(107, 114, 128, 0.5)"
                                    className="flex-1 py-4 pl-3 text-white font-bold tracking-wide text-base"
                                />
                            </View>
                        </View>
                    )}

                    {/* Submit Button */}
                    <TouchableOpacity
                        onPress={handleSubmit}
                        activeOpacity={0.8}
                        disabled={isLoading}
                        className={`w-full py-4 rounded-xl items-center shadow-[0_0_20px_rgba(0,255,136,0.2)] mt-4 ${isLoading ? 'bg-gray-600' : 'bg-[#00ff88]'}`}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#000" />
                        ) : (
                            <Text className="text-black font-black text-sm uppercase tracking-widest">
                                {mode === 'login' ? t('login.login_button') : t('login.register_button')}
                            </Text>
                        )}
                    </TouchableOpacity>

                    {/* Toggle Mode */}
                    <TouchableOpacity
                        className="items-center py-2"
                        onPress={toggleMode}
                    >
                        <Text className="text-gray-400 text-xs font-medium">
                            {mode === 'login' ? (
                                <>{t('login.new_user')} <Text className="text-white font-bold">{t('login.create_profile')}</Text></>
                            ) : (
                                <>{t('login.have_account')} <Text className="text-white font-bold">{t('login.login_link')}</Text></>
                            )}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Divider */}
                <View className="flex-row items-center my-6">
                    <View className="flex-1 h-[1px] bg-gray-800" />
                    <Text className="mx-4 text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                        {t('login.or_continue')}
                    </Text>
                    <View className="flex-1 h-[1px] bg-gray-800" />
                </View>

                {/* Social Buttons */}
                <View className="space-y-3">
                    {/* Google Sign-In Button */}
                    <TouchableOpacity
                        className="bg-white w-full py-4 rounded-xl flex-row items-center justify-center shadow-lg"
                        onPress={handleGoogleLogin}
                        activeOpacity={0.9}
                    >
                        <View className="mr-3">
                            <Svg width={20} height={20} viewBox="0 0 24 24">
                                <Path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <Path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <Path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <Path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </Svg>
                        </View>
                        <Text className="text-black font-bold text-xs uppercase tracking-widest">
                            {t('login.google')}
                        </Text>
                    </TouchableOpacity>

                    {/* Guest Button */}
                    <TouchableOpacity
                        onPress={handleGuest}
                        activeOpacity={0.8}
                        className="bg-transparent border border-gray-700 w-full py-4 rounded-xl flex-row items-center justify-center"
                    >
                        <Ghost size={18} color="white" className="mr-2" />
                        <Text className="text-white font-bold text-xs uppercase tracking-widest ml-2">
                            {t('login.guest')}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <View className="items-center mt-8">
                    <View className="flex-row items-center opacity-50">
                        <ShieldCheck size={14} color="#6b7280" className="mr-2" />
                        <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-widest ml-1">
                            {t('login.secure')}
                        </Text>
                    </View>
                </View>

            </View>
        </SafeAreaView>
    );
};
