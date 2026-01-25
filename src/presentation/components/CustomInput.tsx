import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, TouchableOpacity } from 'react-native';

interface CustomInputProps extends TextInputProps {
  label: string;
  error?: string;
  showPasswordToggle?: boolean;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  error,
  showPasswordToggle = false,
  secureTextEntry,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View className="w-full mb-4">
      <Text className="text-gray-700 font-medium mb-2">{label}</Text>
      <View className="relative">
        <TextInput
          className={`w-full px-4 py-3 border rounded-lg ${
            error ? 'border-red-500' : 'border-gray-300'
          } bg-white ${showPasswordToggle ? 'pr-12' : ''}`}
          secureTextEntry={showPasswordToggle ? !isPasswordVisible : secureTextEntry}
          {...props}
        />
        {showPasswordToggle && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            className="absolute right-4 top-3.5"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text className="text-2xl">
              {isPasswordVisible ? '👁️' : '👁️‍🗨️'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
    </View>
  );
};