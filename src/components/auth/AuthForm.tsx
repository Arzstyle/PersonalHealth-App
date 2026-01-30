import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Mail, Smartphone, Lock, Activity } from 'lucide-react-native';

interface AuthFormProps {
    onEmailLogin: (email: string, pass: string, isRegister: boolean) => void;
    onPhoneLogin: (phone: string) => void;
    isLoading: boolean;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onEmailLogin, onPhoneLogin, isLoading }) => {
    const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
    const [isRegistering, setIsRegistering] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');

    const inputClasses = "w-full p-4 rounded-xl text-sm bg-white border border-gray-200 text-gray-900 focus:border-blue-500 font-bold mb-4";

    return (
        <View className="w-full">
            {/* Tabs */}
            <View className="flex-row border-b border-gray-100 mb-6 mx-4">
                <TouchableOpacity
                    onPress={() => setLoginMethod('email')}
                    className={`flex-1 py-3 flex-row justify-center items-center gap-2 border-b-2 ${loginMethod === 'email' ? 'border-blue-600 bg-blue-50/50' : 'border-transparent'}`}
                >
                    <Mail size={16} color={loginMethod === 'email' ? '#2563EB' : '#9CA3AF'} />
                    <Text className={`text-xs font-bold uppercase tracking-widest ${loginMethod === 'email' ? 'text-blue-600' : 'text-gray-500'}`}>
                        Email
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setLoginMethod('phone')}
                    className={`flex-1 py-3 flex-row justify-center items-center gap-2 border-b-2 ${loginMethod === 'phone' ? 'border-blue-600 bg-blue-50/50' : 'border-transparent'}`}
                >
                    <Smartphone size={16} color={loginMethod === 'phone' ? '#2563EB' : '#9CA3AF'} />
                    <Text className={`text-xs font-bold uppercase tracking-widest ${loginMethod === 'phone' ? 'text-blue-600' : 'text-gray-500'}`}>
                        Phone
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Form Content */}
            <View className="px-2">
                {loginMethod === 'email' ? (
                    <View>
                        <Text className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2 pl-1">
                            {isRegistering ? 'Register with Email' : 'Email Address'}
                        </Text>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            className={inputClasses}
                            placeholder="user@example.com"
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />

                        <Text className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2 pl-1">
                            Password
                        </Text>
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            className={inputClasses}
                            placeholder="••••••••"
                            secureTextEntry
                        />

                        <TouchableOpacity
                            disabled={isLoading}
                            onPress={() => onEmailLogin(email, password, isRegistering)}
                            className="w-full py-4 bg-gray-900 rounded-xl items-center justify-center mt-2 shadow-lg"
                        >
                            {isLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-white font-bold text-xs uppercase tracking-wider">
                                    {isRegistering ? 'Sign Up' : 'Log In'}
                                </Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)} className="mt-4">
                            <Text className="text-center text-xs text-gray-500 font-bold">
                                {isRegistering ? 'Already have an account? Log In' : 'New here? Create Account'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View>
                        <Text className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2 pl-1">
                            Phone Number
                        </Text>
                        <TextInput
                            value={phone}
                            onChangeText={setPhone}
                            className={inputClasses}
                            placeholder="+62 812 3456 7890"
                            keyboardType="phone-pad"
                        />

                        <TouchableOpacity
                            disabled={isLoading}
                            onPress={() => onPhoneLogin(phone)}
                            className="w-full py-4 bg-blue-600 rounded-xl items-center justify-center mt-2 shadow-lg"
                        >
                            {isLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-white font-bold text-xs uppercase tracking-wider">
                                    Send OTP
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
};
