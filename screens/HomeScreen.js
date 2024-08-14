// HomeScreen.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, FlatList, Platform } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../CartContext';
import { useWindowDimensions } from 'react-native';
import { products } from '../products';
import CustomAlert from '../components/CustomAlert';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';


export default function HomeScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Home');
  // const [cartItems, setCartItems] = useState([]);
  const { cartItems, addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const { width } = useWindowDimensions();
  const numColumns = Math.floor(width / 180);
  const [alertVisible, setAlertVisible] = useState(false);
  // const [hasRecommendations, setHasRecommendations] = useState(false);

  // useEffect(() => {
  //   checkRecommendations();
  // }, []);

  // const checkRecommendations = async () => {
  //   try {
  //     const recommendations = await AsyncStorage.getItem('recommendations');
  //     setHasRecommendations(recommendations !== null);
  //   } catch (error) {
  //     console.error('Error checking recommendations:', error);
  //   }
  // };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setActiveTab('Home');
      // Check if there's a showOrderAlert param in the navigation state
      const showOrderAlert = navigation.getState().routes.find(
        route => route.name === 'Home'
      )?.params?.showOrderAlert;
      
      if (showOrderAlert) {
        setAlertVisible(true);
        // Clear the parameter
        navigation.setParams({ showOrderAlert: undefined });
      }
    });

    // Cleanup the listener on component unmount
    return unsubscribe;
  }, [navigation]);

  const handleCloseAlert = () => {
    setAlertVisible(false);
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity style={styles.productItem}>
      <Image source={item.image} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>£{item.price.toFixed(2)}</Text>

      {/* Spiciness Level */}
      <View style={styles.spicyLevelContainer}>
        {[...Array(5)].map((_, index) => (
          // <Ionicons 
          //   key={index}
          //   name={index < item.spicyLevel ? "flame" : "flame-outline"} 
          //   size={16} 
          //   color={index < item.spicyLevel ? "#E40421" : "#999999"} 
          // />
          <FontAwesome6 
            key={index}
            name="pepper-hot" 
            size={16}
            color={index < item.spicyLevel ? "#E40421" : "#999999"}
          />
        ))}
      </View>

      {/* Food Pairings */}
      <Text style={styles.pairingsLabel}>Pairs well with:</Text>
      <Text style={styles.pairings}>{item.pairings.join(', ')}</Text>

      <TouchableOpacity 
        style={styles.addToCartButton}
        onPress={() => {
          addToCart(item);
          // Optionally, you can show a confirmation message or navigate to the cart
          // navigation.navigate('Cart');
        }}
      >
        <Text style={styles.addToCartText}>Add to Cart</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} />
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#FFFFFF" />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search products" 
            placeholderTextColor="#999999"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>
      {/* {!hasRecommendations && (
        <TouchableOpacity 
          style={styles.recommendationButton}
          onPress={() => navigation.navigate('Recommendation')}
        >
          <Text style={styles.recommendationButtonText}>Don't know what you're looking for?</Text>
          <Text style={styles.recommendationButtonSubtext}>Let us help you find the perfect sauce!</Text>
        </TouchableOpacity>
      )} */}
      <TouchableOpacity 
        style={styles.recommendationButton}
        onPress={() => navigation.navigate('Recommendation')}
      >
        <Text style={styles.recommendationButtonText}>Don't know what you're looking for?</Text>
        <Text style={styles.recommendationButtonSubtext}>Let us help you find the perfect sauce!</Text>
      </TouchableOpacity>
      <FlatList
        data={filteredProducts}
        renderItem={renderProductItem}
        keyExtractor={item => item.id}
        numColumns={numColumns}
        contentContainerStyle={styles.productList}
        key={numColumns}
      />
      <BottomNavBar navigation={navigation} activeTab="Home" />
    </SafeAreaView>
  );
}

// ... rest of your code (getIconName, products, styles) stays the same
const getIconName = (tab, isActive) => {
  switch (tab) {
    case 'Home': return isActive ? 'home' : 'home-outline';
    case 'Shop': return isActive ? 'grid' : 'grid-outline';
    case 'Cart': return isActive ? 'cart' : 'cart-outline';
    case 'Profile': return isActive ? 'person' : 'person-outline';
    default: return 'home-outline';
  }
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  searchBarContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#121212',
  },
  // header: {
  //   padding: 20,
  //   paddingTop: 50,
  //   backgroundColor: '#121212',
  // },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
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
    padding: 15,
    alignItems: 'center',
  },
  spicyLevelContainer: {
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 5,
  },
  pairingsLabel: {
    fontFamily: 'GothamBold',
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 5,
  },
  pairings: {
    fontFamily: 'GothamBook',
    fontSize: 12,
    color: '#999999',
    marginBottom: 10,
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
    // paddingBottom: add for ios
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A',
    // paddingBottom: Platform.OS === 'ios' ? 20 : 10, // Add extra padding for iOS
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
  recommendationButton: {
    backgroundColor: '#1A1A1A',
    padding: 15,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  recommendationButtonText: {
    fontFamily: 'GothamBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  recommendationButtonSubtext: {
    fontFamily: 'GothamBook',
    fontSize: 14,
    color: '#999999',
    marginTop: 5,
  },
});