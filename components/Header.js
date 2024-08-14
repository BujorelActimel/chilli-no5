// components/Header.js
import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../CartContext';

export default function Header({ navigation }) {
  const { cartItems } = useCart();

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={styles.iconContainer}>
          <Ionicons name="cart-outline" size={24} color="#FFFFFF" />
          {cartItems.length > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</Text>
            </View>
          )}
        </TouchableOpacity>
        <Image
          source={require('../assets/extended-white-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.iconContainer}>
          <Image
            source={require('../assets/profile-placeholder.png')}
            style={styles.profileIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 10, // Reduced top padding
    paddingBottom: 10, // Added bottom padding
    backgroundColor: '#121212',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 30,
  },
  profileIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  cartBadge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#E40421',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'GothamBold',
  },
});