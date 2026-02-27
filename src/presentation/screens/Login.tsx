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
import { loginSchema } from '../../core/validation/userSchema';
import { APP_STRINGS } from '../../core/constants/appStrings';
import { AuthStackParamList } from '../navigation/AppNavigator';

type LoginScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Login'
>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login } = useUser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const handleLogin = async () => {
    try {
      await loginSchema.validate({ email, password }, { abortEarly: false });
      setErrors({});

      setLoading(true);

      const user = await login(email, password);

      if (!user) {
        Alert.alert(
          'Login Failed',
          'Invalid email or password. Please check your credentials and try again.'
        );
      }
    } catch (error: any) {
      if (error.inner) {
        const validationErrors: { email?: string; password?: string } = {};
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
            {APP_STRINGS.WELCOME_MESSAGE}
          </Text>
          <Text className="text-gray-600 mb-8">
            {APP_STRINGS.SIGN_IN}
          </Text>

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
            title={APP_STRINGS.LOGIN}
            onPress={handleLogin}
            loading={loading}
          />

          <View className="flex-row justify-center items-center mt-6">
            <Text className="text-gray-600">
              {APP_STRINGS.CREATE_ACCOUNT}{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text className="text-blue-500 font-semibold">
                {APP_STRINGS.REGISTER}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};