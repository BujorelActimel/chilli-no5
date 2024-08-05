import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Home');

  const renderProductItem = ({ item }) => (
    <TouchableOpacity style={styles.productItem}>
      <View style={[styles.productColor, { backgroundColor: item.color }]} />
      <Image source={item.image} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>${item.price}</Text>
      <TouchableOpacity 
        style={styles.addToCartButton}
        onPress={() => navigation.navigate('Cart')}
      >
        <Text style={styles.addToCartText}>Add to Cart</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../assets/extended-white-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#FFFFFF" />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search products" 
            placeholderTextColor="#999999"
          />
        </View>
      </View>

      {/* Main Content */}
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.productList}
      />

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {['Home', 'Shop', 'Cart', 'Profile'].map((tab) => (
          <TouchableOpacity 
            key={tab} 
            style={styles.navItem}
            onPress={() => {
              setActiveTab(tab);
              if (tab === 'Cart') navigation.navigate('Cart');
              if (tab === 'Profile') navigation.navigate('Profile');
            }}
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
    </View>
  );
}

// ... rest of your code (getIconName, products, styles) stays the same
const getIconName = (tab) => {
    switch (tab) {
      case 'Home': return 'home';
      case 'Shop': return 'grid';
      case 'Cart': return 'cart';
      case 'Profile': return 'person';
      default: return 'home';
    }
  };
  
  const products = [
    { id: '1', name: 'MEXICAN FURY', color: '#3AAA35', price: 9.99, image: require('../assets/product-placeholder.png') },
    { id: '2', name: 'FIERY GAZPACHO', color: '#E8442F', price: 9.99, image: require('../assets/product-placeholder.png') },
    { id: '3', name: 'HEAVENLY HARISSA', color: '#942D88', price: 9.99, image: require('../assets/product-placeholder.png') },
    { id: '4', name: 'JAMAICAN JERK', color: '#FCC018', price: 9.99, image: require('../assets/product-placeholder.png') },
    { id: '5', name: 'REGAL RED PEPPER', color: '#E40421', price: 9.99, image: require('../assets/product-placeholder.png') },
    { id: '6', name: 'TOTALLY THAI', color: '#E71C64', price: 9.99, image: require('../assets/product-placeholder.png') },
  ];
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000000',
    },
    header: {
      padding: 20,
      paddingTop: 50,
      backgroundColor: '#121212',
    },
    logo: {
      width: 150,
      height: 50,
      alignSelf: 'center',
      marginBottom: 10,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#2A2A2A',
      borderRadius: 20,
      paddingHorizontal: 15,
      height: 40,
    },
    searchInput: {
      flex: 1,
      color: '#FFFFFF',
      marginLeft: 10,
      fontFamily: 'GothamBook',
    },
    productList: {
      padding: 10,
    },
    productItem: {
      flex: 1,
      margin: 5,
      backgroundColor: '#1A1A1A',
      borderRadius: 10,
      padding: 10,
      alignItems: 'center',
    },
    productColor: {
      width: 30,
      height: 30,
      borderRadius: 15,
      position: 'absolute',
      top: 5,
      right: 5,
    },
    productImage: {
      width: 120,
      height: 120,
      marginBottom: 10,
    },
    productName: {
      fontFamily: 'GothamBold',
      fontSize: 14,
      color: '#FFFFFF',
      textAlign: 'center',
      marginBottom: 5,
    },
    productPrice: {
      fontFamily: 'GothamBook',
      fontSize: 14,
      color: '#FFFFFF',
      marginBottom: 10,
    },
    addToCartButton: {
      backgroundColor: '#E40421',
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 20,
    },
    addToCartText: {
      fontFamily: 'GothamBold',
      fontSize: 12,
      color: '#FFFFFF',
    },
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