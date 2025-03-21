import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View, Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { UserProvider, UserContext } from './src/context/UserContext';
import { Provider, useDispatch } from 'react-redux';
import store from './src/redux/store';
import { loadUserData } from './src/redux/userSlice';
import LoadingMindilSunsetBeachScreen from './src/screens/LoadingMindilSunsetBeachScreen';


const Stack = createNativeStackNavigator();

const MindliSunsetBeachStack = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <UserProvider>
          <SafeAreaProvider>
            <AppNavigator />
          </SafeAreaProvider>
        </UserProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

const AppNavigator = () => {
  const dispatch = useDispatch();
  const { user, setUser } = useContext(UserContext);


  const [initializingMindilSunsetApp, setInitializingMindilSunsetApp] = useState(true);

  useEffect(() => {
    dispatch(loadUserData());
  }, [dispatch]);

  useEffect(() => {
    const loadMindilSunsetUser = async () => {
      try {
        const deviceId = await DeviceInfo.getUniqueId();
        const storageKey = `currentUser_${deviceId}`;
        const storedMindilSunsetUser = await AsyncStorage.getItem(storageKey);

        if (storedMindilSunsetUser) {
          setUser(JSON.parse(storedMindilSunsetUser));
        } 
      } catch (error) {
        console.error('Error loading of mindil sunset user', error);
      } finally {
        setInitializingMindilSunsetApp(false);
      }
    };
    loadMindilSunsetUser();
  }, [setUser]);

  if (initializingMindilSunsetApp) {
    return (
      <View style={{
        backgroundColor: '#141414',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
      }}>
        <ActivityIndicator size="large" color="#AC9958" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={'LoadingMindilSunsetBeachScreen'}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LoadingMindilSunsetBeachScreen" component={LoadingMindilSunsetBeachScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


export default MindliSunsetBeachStack;
