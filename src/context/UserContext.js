import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadMindliUser = async () => {
      try {
        const storedMindliUser = await AsyncStorage.getItem('currentUser');
        if (storedMindliUser) {
          setUser(JSON.parse(storedMindliUser));
        }
      } catch (error) {
        console.error('Error loading mindli user:', error);
      }
    };
    loadMindliUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
