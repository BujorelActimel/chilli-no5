import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, FlatList, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../CartContext';
import { useWindowDimensions } from 'react-native';
import { products } from '../products';
import CustomAlert from '../components/CustomAlert';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';
import RecommendationPopup from '../components/RecommendationPopup';

export default function HomeScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Home');
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const { width } = useWindowDimensions();
  const numColumns = Math.floor(width / 180);
  const [alertVisible, setAlertVisible] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setActiveTab('Home');
      const showOrderAlert = navigation.getState().routes.find(
        route => route.name === 'Home'
      )?.params?.showOrderAlert;
      
      if (showOrderAlert) {
        setAlertVisible(true);
        navigation.setParams({ showOrderAlert: undefined });
      }
    });

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
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>£{item.price.toFixed(2)}</Text>
  
        <View style={styles.spicyLevelContainer}>
          {[...Array(5)].map((_, index) => (
            <FontAwesome6 
              key={index}
              name="pepper-hot" 
              size={16}
              color={index < item.spicyLevel ? "#E40421" : "#999999"}
            />
          ))}
        </View>
  
        <Text style={styles.pairingsLabel}>Pairs well with:</Text>
        <Text style={styles.pairings}>{item.pairings.join(', ')}</Text>
      </View>
  
      <TouchableOpacity 
        style={styles.addToCartButton}
        onPress={() => addToCart(item)}
      >
        <Text style={styles.addToCartText}>Add to Cart</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const handleRecommendationComplete = (recommendedProducts) => {
    setRecommendations(recommendedProducts);
    setShowRecommendation(false);
  };

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
      <FlatList
        data={filteredProducts}
        renderItem={renderProductItem}
        keyExtractor={item => item.id}
        numColumns={numColumns}
        contentContainerStyle={styles.productList}
        key={numColumns}
      />

      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={() => setShowRecommendation(true)}
      >
        {/* <Ionicons name="help-circle-outline" size={30} color="#FFFFFF" /> */}
        <Text style={styles.helpButtonText}>Need Help?</Text>
      </TouchableOpacity>

      <BottomNavBar navigation={navigation} activeTab="Home" />
      
      <CustomAlert
        visible={alertVisible}
        title="Order Placed"
        message="Your order has been successfully placed!"
        onClose={handleCloseAlert}
      />

      <RecommendationPopup
        visible={showRecommendation}
        onClose={() => setShowRecommendation(false)}
        navigation={navigation}
      />
    </SafeAreaView>
  );
}

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
    justifyContent: 'space-between',
    height: 350, // Set a fixed height for all items
  },
  productInfo: {
    flex: 1,
  },
  spicyLevelContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  pairingsLabel: {
    fontFamily: 'GothamBold',
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 5,
    textAlign: 'center',
  },
  pairings: {
    fontFamily: 'GothamBook',
    fontSize: 12,
    color: '#999999',
    marginBottom: 10,
    textAlign: 'center',
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
    alignSelf: 'center',
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
    textAlign: 'center',
    marginBottom: 10,
  },
  addToCartButton: {
    backgroundColor: '#E40421',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 10,
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
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    backgroundColor: '#E40421',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  helpButtonText: {
    color: '#FFFFFF',
    marginLeft: 5,
    fontFamily: 'GothamBook',
    fontSize: 12,
  },
});