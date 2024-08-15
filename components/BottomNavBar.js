// components/BottomNavBar.js
import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BottomNavBar({ navigation, activeTab }) {
  const tabs = ['Home', 'Wishlist', 'Cart', 'Profile'];

  const getIconName = (tab) => {
    switch (tab) {
      case 'Home': return activeTab === 'Home' ? 'home' : 'home-outline';
      case 'Wishlist': return activeTab === 'Wishlist' ? 'heart' : 'heart-outline';
      case 'Cart': return activeTab === 'Cart' ? 'cart' : 'cart-outline';
      case 'Profile': return activeTab === 'Profile' ? 'person' : 'person-outline';
      default: return 'home-outline';
    }
  };

  const handleNavigation = (tab) => {
    // if (tab === 'Recommendation') {
    //   navigation.navigate('Recommendation');
    // } else {
      navigation.navigate(tab);
    // }
  };

  return (
    <View style={styles.bottomNav}>
      {tabs.map((tab) => (
        <TouchableOpacity 
          key={tab} 
          style={styles.navItem}
          onPress={() => handleNavigation(tab)}
        >
          <Ionicons 
            name={getIconName(tab)} 
            size={24} 
            color={activeTab === tab ? '#FFFFFF' : '#999999'} 
          />
          <Text style={[styles.navText, activeTab === tab && styles.activeNavText]}>{tab}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#121212',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontFamily: 'GothamBook',
    fontSize: 12,
    color: '#999999',
    marginTop: 5,
  },
  activeNavText: {
    color: '#FFFFFF',
  },
});