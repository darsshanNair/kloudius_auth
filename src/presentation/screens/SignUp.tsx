import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CustomInput, CustomButton } from '../components';
import { useUser } from '../context/userContext';
import { registerSchema } from '../../core/validation/userSchema';
import { APP_STRINGS } from '../../core/constants/appStrings';
import { AuthStackParamList } from '../navigation/AppNavigator';

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Register'
>;

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { register } = useUser();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  const handleRegister = async () => {
    try {
      // Validate inputs
      await registerSchema.validate(
        { name, email, password },
        { abortEarly: false }
      );
      setErrors({});

      setLoading(true);

      const user = await register(email, password, name);

      if (user) {
        // Navigation is handled by AppNavigator based on user state
      } else {
        Alert.alert(
          'Registration Failed',
          'An account with this email already exists. Please login instead.'
        );
      }
    } catch (error: any) {
      if (error.inner) {
        const validationErrors: {
          name?: string;
          email?: string;
          password?: string;
        } = {};
        error.inner.forEach((err: any) => {
          validationErrors[err.path as keyof typeof validationErrors] =
            err.message;
        });
        setErrors(validationErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white">
      <ScrollView
        contentContainerClassName="flex-grow"
        keyboardShouldPersistTaps="handled">
        <View className="flex-1 justify-center px-6 py-8">
          <Text className="text-4xl font-bold text-gray-800 mb-2">
            {APP_STRINGS.REGISTER}
          </Text>
          <Text className="text-gray-600 mb-8">
            Create your account
          </Text>

          <CustomInput
            label={APP_STRINGS.NAME}
            placeholder={APP_STRINGS.NAME_PLACEHOLDER}
            value={name}
            onChangeText={setName}
            error={errors.name}
            autoCapitalize="words"
          />

          <CustomInput
            label={APP_STRINGS.EMAIL}
            placeholder={APP_STRINGS.EMAIL_PLACEHOLDER}
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <CustomInput
            label={APP_STRINGS.PASSWORD}
            placeholder={APP_STRINGS.PASSWORD_PLACEHOLDER}
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            secureTextEntry
            autoCapitalize="none"
            showPasswordToggle={true}
          />

          <CustomButton
            title={APP_STRINGS.SIGN_UP}
            onPress={handleRegister}
            loading={loading}
          />

          <View className="flex-row justify-center items-center mt-6">
            <Text className="text-gray-600">
              {APP_STRINGS.ALREADY_HAVE_ACCOUNT}{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text className="text-blue-500 font-semibold">
                {APP_STRINGS.LOGIN}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};