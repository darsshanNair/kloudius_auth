import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useUser } from '../context/userContext';
import { APP_STRINGS } from '../../core/constants/appStrings';
import AuthService from '../../core/services/authService';

export const HomeScreen: React.FC = () => {
  const { user, logout } = useUser();
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(user);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (user?.email) {
        setLoading(true);
        const freshUserInfo = await AuthService.getUserInfo(user.email);
        if (freshUserInfo) {
          setUserInfo(freshUserInfo);
        }
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [user?.email]);

  const handleLogout = async () => {
    Alert.alert(
      APP_STRINGS.LOGOUT,
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: APP_STRINGS.LOGOUT,
          onPress: async () => {
            await logout();
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header with Logout Button */}
      <View className="px-6 pt-12 pb-4 flex-row justify-between items-center border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-800">
          {APP_STRINGS.HOME}
        </Text>
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-500 px-4 py-2 rounded-lg">
          <Text className="text-white font-semibold">
            {APP_STRINGS.LOGOUT}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Center Content */}
      <View className="flex-1 justify-center items-center px-6">
        <View className="bg-blue-50 p-8 rounded-2xl w-full max-w-md border border-blue-200">
          <Text className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Welcome!
          </Text>
          
          <View className="mb-4">
            <Text className="text-gray-600 font-medium mb-1">Name:</Text>
            <Text className="text-2xl font-semibold text-gray-800">
              {userInfo?.name || 'N/A'}
            </Text>
          </View>

          <View>
            <Text className="text-gray-600 font-medium mb-1">Email:</Text>
            <Text className="text-xl text-gray-800">
              {userInfo?.email || 'N/A'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};