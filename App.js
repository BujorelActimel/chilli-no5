import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import HomeScreen from './screens/HomeScreen';
import CartScreen from './screens/CartScreen';
import ProfileScreen from './screens/ProfileScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import { CartProvider } from './CartContext';
import WishlistScreen from './screens/WishlistScreen';
import RecommendationResultsScreen from './screens/RecommendationResultsScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import { AuthProvider, useAuth } from './AuthContext';

const Stack = createStackNavigator();

const Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#151718',
  },
};

function Navigation() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // or a loading screen
  }

  return (
    <NavigationContainer theme={Theme}>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="RecommendationResults" component={RecommendationResultsScreen} />
            <Stack.Screen name="Cart" component={CartScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="Wishlist" component={WishlistScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

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
    <AuthProvider>
      <CartProvider>
        <Navigation />
      </CartProvider>
    </AuthProvider>
  );
}