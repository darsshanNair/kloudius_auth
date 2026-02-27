import { User } from '../models/user';
import usersData from '../../../users.json';
import RNFS from 'react-native-fs';

interface UserList {
  users: User[];
}

const USERS_FILE_PATH = `${RNFS.DocumentDirectoryPath}/users.json`;

let cachedUsers: UserList = { users: [...usersData.users] };

const loadUsers = async (): Promise<UserList> => {
  try {
    const fileExists = await RNFS.exists(USERS_FILE_PATH);

    if (fileExists) {
      const fileContent = await RNFS.readFile(USERS_FILE_PATH, 'utf8');
      cachedUsers = JSON.parse(fileContent);

      return cachedUsers;
    } else {
      await saveUsers(cachedUsers);

      return cachedUsers;
    }
  } catch (error) {
    console.error('Error loading users:', error);
    return cachedUsers;
  }
};

const saveUsers = async (data: UserList): Promise<void> => {
  try {
    await RNFS.writeFile(
      USERS_FILE_PATH,
      JSON.stringify(data, null, 2),
      'utf8',
    );
    cachedUsers = data;
  } catch (error) {
    console.error('Error saving users:', error);

    throw error;
  }
};

const login = async (email: string, password: string): Promise<User | null> => {
  return new Promise(async resolve => {
    setTimeout(async () => {
      const usersData = await loadUsers();

      const foundUser = usersData.users.find(
        (user: User) =>
          user.email.toLowerCase() === email.toLowerCase() &&
          user.password === password,
      );

      if (foundUser) {
        const updatedUsers = {
          users: usersData.users.map((user: User) =>
            user.email.toLowerCase() === email.toLowerCase()
              ? { ...user, lastLogin: new Date().toISOString() }
              : user,
          ),
        };

        await saveUsers(updatedUsers);

        const user: User = {
          email: foundUser.email,
          password: foundUser.password,
          name: foundUser.name,
          lastLogin: new Date().toISOString(),
        };
        resolve(user);
      } else {
        resolve(null);
      }
    }, 1000);
  });
};

const register = async (
  email: string,
  password: string,
  name: string,
): Promise<User | null> => {
  return new Promise(async resolve => {
    setTimeout(async () => {
      const usersData = await loadUsers();

      const existingUser = usersData.users.find(
        (user: User) => user.email.toLowerCase() === email.toLowerCase(),
      );

      if (existingUser) {
        resolve(null);
      } else {
        const newUser: User = {
          email: email,
          password: password,
          name: name,
          lastLogin: new Date().toISOString(),
        };

        const updatedUsers = {
          users: [...usersData.users, newUser],
        };

        try {
          await saveUsers(updatedUsers);

          const user: User = {
            email: newUser.email,
            password: newUser.password,
            name: newUser.name,
            lastLogin: new Date().toISOString(),
          };
          resolve(user);
        } catch (error) {
          console.error('Error saving new user:', error);
          resolve(null);
        }
      }
    }, 1000);
  });
};

const getUserInfo = async (email: string): Promise<User | null> => {
  try {
    const usersData = await loadUsers();

    const foundUser = usersData.users.find(
      (user: User) => user.email.toLowerCase() === email.toLowerCase(),
    );

    if (foundUser) {
      const user: User = {
        email: foundUser.email,
        password: foundUser.password,
        name: foundUser.name,
        lastLogin: foundUser.lastLogin
          ? new Date(foundUser.lastLogin).toISOString()
          : new Date().toISOString(),
      };

      return user;
    }

    return null;
  } catch (error) {
    console.error('Error getting user info:', error);

    return null;
  }
};

const logout = async (): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
};

// Initialize users data on module load
loadUsers();

const authService = {
  login,
  register,
  logout,
  getUserInfo,
};

export default authService;
