import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
} from 'react-native';

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  loading = false,
  variant = 'primary',
  disabled,
  ...props
}) => {
  const isPrimary = variant === 'primary';
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      className={`w-full py-4 rounded-lg flex items-center justify-center ${
        isPrimary ? 'bg-blue-500' : 'bg-gray-200'
      } ${isDisabled ? 'opacity-50' : ''}`}
      disabled={isDisabled}
      {...props}>
      {loading ? (
        <ActivityIndicator color={isPrimary ? 'white' : 'black'} />
      ) : (
        <Text
          className={`font-semibold text-lg ${
            isPrimary ? 'text-white' : 'text-gray-700'
          }`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};