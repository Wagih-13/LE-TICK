import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UserData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

interface UserDataContextType {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  clearUserData: () => void;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

const USER_DATA_STORAGE_KEY = 'letick_user_data';

const defaultUserData: UserData = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
};

export function UserDataProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData>(() => {
    try {
      const savedUserData = localStorage.getItem(USER_DATA_STORAGE_KEY);
      return savedUserData ? JSON.parse(savedUserData) : defaultUserData;
    } catch (error) {
      console.error('Error loading user data from localStorage:', error);
      return defaultUserData;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data to localStorage:', error);
    }
  }, [userData]);

  const updateUserData = (data: Partial<UserData>) => {
    setUserData((prev) => ({ ...prev, ...data }));
  };

  const clearUserData = () => {
    setUserData(defaultUserData);
  };

  return (
    <UserDataContext.Provider
      value={{
        userData,
        updateUserData,
        clearUserData,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
}
