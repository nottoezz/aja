import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Text } from 'react-native';
import { useFonts } from 'expo-font';
import HomeScreen from './src/screens/HomeScreen';
import LetterDetailScreen from './src/screens/LetterDetailScreen';
import FormationScreen from './src/screens/FormationScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    TeachersPet: require('./assets/fonts/TeachersPet.ttf'),
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
            fontFamily: 'TeachersPet',
          },
          // Hide the back button text (e.g. "Afrikaans Phonics") on child screens
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'Afrikaans Phonics' }}
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
          name="Formation" 
          component={FormationScreen}
          options={({ navigation, route }: any) => {
            const params = route.params as { letter: string; isUppercase: boolean } | undefined;
            return {
              title: params?.isUppercase 
                ? `Vorm ${params.letter.toUpperCase()}`
                : `Vorm ${params?.letter?.toLowerCase() || ''}`,
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={{ marginRight: 16, padding: 8 }}
                >
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 24,
                      fontWeight: 'bold',
                      fontFamily: 'TeachersPet',
                    }}
                  >
                    ×
                  </Text>
                </TouchableOpacity>
              ),
            };
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

