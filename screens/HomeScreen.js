// HomeScreen.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../CartContext';
import { useWindowDimensions } from 'react-native';
import { products } from '../products';
import CustomAlert from '../components/CustomAlert';



export default function HomeScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Home');
  // const [cartItems, setCartItems] = useState([]);
  const { cartItems, addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const { width } = useWindowDimensions();
  const numColumns = Math.floor(width / 180);
  const [alertVisible, setAlertVisible] = useState(false);

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
    <View style={styles.container}>
      {/* Header */}
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

      {/* Main Content */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProductItem}
        keyExtractor={item => item.id}
        numColumns={numColumns}
        contentContainerStyle={styles.productList}
        key={numColumns} // This forces the list to re-render when the number of columns changes
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
              else if (tab === 'Profile') navigation.navigate('Profile');
              else if (tab === 'Home') navigation.navigate('Home');
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
      <CustomAlert
        visible={alertVisible}
        title="Order Placed"
        message="Your order has been placed successfully!"
        onClose={handleCloseAlert}
      />
    </View>
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
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#121212',
  },
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