import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import HomeScreen from './screens/HomeScreen';
import ReminderScreen from './screens/ReminderScreen';
import { initNotifications } from './services/NotificationService';
import { initBackgroundFetch } from './services/BackgroundService';

const Stack = createStackNavigator();

type RootStackParamList = {
  Home: undefined;
  Reminder: { prayerId: string };
};

const App = () => {
  useEffect(() => {
    // 初期化
    initNotifications();
    initBackgroundFetch();
  }, []);

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: '礼拝リマインダー' }} />
            <Stack.Screen 
              name="Reminder" 
              component={ReminderScreen} 
              options={{ 
                title: '礼拝確認',
                presentation: 'modal',
                headerShown: false
              }} 
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;
