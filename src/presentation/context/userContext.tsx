import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../../core/models/user';
import AuthService from '../../core/services/authService';
import KeychainService from '../../core/services/keychainService';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  resetUser: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

const APP_SERVICE_NAME = 'KloudiusAuth';

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  const resetUser = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, resetUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

  const login = async (
    email: string,
    password: string,
  ): Promise<User | null> => {
    const user = await AuthService.login(email, password);
    if (user) {
      context.setUser(user);
      await KeychainService.saveCredentials(email, password, APP_SERVICE_NAME);
    }

    return user;
  };

  const register = async (
    email: string,
    password: string,
    name: string
  ): Promise<User | null> => {
    const user = await AuthService.register(email, password, name);
    if (user) {
      context.setUser(user);
      await KeychainService.saveCredentials(email, password, APP_SERVICE_NAME);
    }

    return user;
  };

  const logout = async (): Promise<void> => {
    await _resetUser();

    return AuthService.logout();
  };

  const _resetUser = async () => {
    await KeychainService.deleteCredentials(APP_SERVICE_NAME);
    context.setUser(null);
  };

  const checkStoredCredentials = async (): Promise<User | null> => {
    try {
      const credentials = await KeychainService.getCredentials(APP_SERVICE_NAME);
      
      if (credentials && credentials.username && credentials.password) {
        const email = credentials.username;
        const password = credentials.password;
        
        const user = await AuthService.getUserInfo(email);
        
        if (user) {
          const validUser = await AuthService.login(email, password);
          if (validUser) {
            context.setUser(validUser);

            return validUser;
          }
        }
      }

      return null;
    } catch (error) {
      console.error('Error checking stored credentials:', error);

      return null;
    }
  };

  return {
    ...context,
    login,
    register,
    logout,
    checkStoredCredentials,
  };
};