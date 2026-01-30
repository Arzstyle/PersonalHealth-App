import React, { memo } from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'outline';
    className?: string;
}

// OPTIMIZATION: React.memo to prevent unnecessary re-renders when props haven't changed
export const Button: React.FC<ButtonProps> = memo(({
    title,
    variant = 'primary',
    className,
    ...props
}) => {
    const baseStyles = "py-4 rounded-xl items-center justify-center";

    const variants = {
        primary: "bg-blue-600",
        secondary: "bg-gray-100",
        outline: "bg-transparent border border-gray-300"
    };

    const textStyles = {
        primary: "text-white font-bold text-lg",
        secondary: "text-gray-900 font-bold text-lg",
        outline: "text-gray-700 font-semibold text-lg"
    };

    return (
        <TouchableOpacity
            className={`${baseStyles} ${variants[variant]} ${className || ''}`}
            activeOpacity={0.8}
            {...props}
        >
            <Text className={textStyles[variant]}>{title}</Text>
        </TouchableOpacity>
    );
});
