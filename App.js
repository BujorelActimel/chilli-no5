// App.js
import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import HomeScreen from './screens/HomeScreen';  // Move your main screen content here
import CartScreen from './screens/CartScreen';
import ProfileScreen from './screens/ProfileScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import { CartProvider } from './CartContext';
import RecommendationScreen from './screens/RecommendationScreen';
import RecommendationResultsScreen from './screens/RecommendationResultsScreen';

const Stack = createStackNavigator();

const Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#151718',
  },
};

export default function App() {
  const [fontsLoaded] = useFonts({
    'GothamBold': require('./assets/fonts/Gotham-Bold.otf'),
    'GothamBook': require('./assets/fonts/Gotham-Book.otf'),
    'AbhayaLibreBold': require('./assets/fonts/AbhayaLibre-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <CartProvider>
      <NavigationContainer theme={Theme}>
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="RecommendationResults" component={RecommendationResultsScreen} />
          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen name="Recommendation" component={RecommendationScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}

/*
TODO: -
*/