import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import HomeScreen from './src/screens/HomeScreen';
import LetterDetailScreen from './src/screens/LetterDetailScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import SettingsIcon from './src/components/SettingsIcon';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    EduAidSolid: require('./assets/fonts/EduAidSolid.ttf'),
    EduAidBold: require('./assets/fonts/EduAidBold.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#4A90E2',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontFamily: 'EduAidBold',
          },
          // Hide the back button text (e.g. "Klinkende Klanke") on child screens
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={({ navigation }: any) => ({
            title: 'Klinkende Klanke',
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('Settings')}
                style={{ marginRight: 16, padding: 8 }}
              >
                <SettingsIcon size={24} color="#FFFFFF" />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen 
          name="LetterDetail" 
          component={LetterDetailScreen}
          options={({ route }: any) => {
            const params = route.params as { letter: string } | undefined;
            return {
              title: `Letter ${params?.letter?.toUpperCase() || 'A'}`,
            };
          }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: 'Settings' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

