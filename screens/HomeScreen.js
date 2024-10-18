import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, FlatList, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../CartContext';
import { useWishlist } from '../WishlistContext';
import { useWindowDimensions } from 'react-native';
import CustomAlert from '../components/CustomAlert';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';
import RecommendationPopup from '../components/RecommendationPopup';
import FilterModal from '../components/FilterModal';
import { XMLParser } from 'fast-xml-parser';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Home');
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist, wishlistItems, refreshWishlist } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]); // State to hold the fetched products
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { width } = useWindowDimensions();
  const numColumns = Math.floor(width / 180);
  const [alertVisible, setAlertVisible] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    spicyLevel: null,
    priceRange: null,
    category: null,
  });

  const wishlistKey = JSON.stringify(wishlistItems.map(item => item.id));

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch('https://chilli-no5.com/wp-content/uploads/woo-feed/google/xml/feed-uk-3.xml');
      const xmlString = await response.text();
  
      const parser = new XMLParser();
      const parsedXML = parser.parse(xmlString);
  
      const fetchedProducts = parsedXML.rss.channel.item.map(item => ({
        id: item['g:id'],
        name: item['g:title'],
        price: parseFloat(item['g:price'].replace(' USD', '')),
        image: { uri: item['g:image_link'] },
        pairings: [],
        spicyLevel: 0,
      }));
  
      setProducts(fetchedProducts);
      setFilteredProducts(fetchedProducts);
    } catch (error) {
      console.error("Error fetching and parsing XML", error);
      setProducts([]);
    }
  }, []);

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

  useEffect(() => {
    applyFilters(searchQuery, filters);
  }, [products, searchQuery, filters, wishlistKey]);

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
      refreshWishlist();
    }, [fetchProducts, refreshWishlist])
  );

  const handleCloseAlert = () => {
    setAlertVisible(false);
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    applyFilters(text, filters);
  };

  const applyFilters = (searchText, filterOptions) => {
    let filtered = products;

    // Apply search filter
    if (searchText) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Apply spicy level filter
    if (filterOptions.spicyLevel) {
      filtered = filtered.filter(product => product.spicyLevel === filterOptions.spicyLevel);
    }

    // Apply price range filter
    if (filterOptions.priceRange) {
      const [min, max] = filterOptions.priceRange;
      filtered = filtered.filter(product => product.price >= min && product.price <= max);
    }

    // Apply category filter
    if (filterOptions.category) {
      filtered = filtered.filter(product => product.category === filterOptions.category);
    }

    setFilteredProducts(filtered);
  };

  const handleFilterApply = (newFilters) => {
    setFilters(newFilters);
    setShowFilterModal(false);
    applyFilters(searchQuery, newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      spicyLevel: null,
      priceRange: null,
      category: null,
    };
    setFilters(clearedFilters);
    setShowFilterModal(false);
    applyFilters(searchQuery, clearedFilters);
  };

  const renderProductItem = useCallback(({ item }) => (
    <View style={styles.productItem}>
      <Image source={item.image} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">{item.name}</Text>
        <Text style={styles.productPrice}>£{item.price.toFixed(2)}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[
            styles.wishlistButton,
            isInWishlist(item.id) && styles.wishlistButtonActive
          ]}
          onPress={() => {
            if (isInWishlist(item.id)) {
              removeFromWishlist(item.id);
            } else {
              addToWishlist(item);
            }
          }}
        >
          <Ionicons 
            name={isInWishlist(item.id) ? "heart" : "heart-outline"} 
            size={20} 
            color={isInWishlist(item.id) ? "#FFFFFF" : "#E40421"} 
          />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.addToCartButton}
          onPress={() => {
            addToCart(item);
          }}
        >
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  ), [isInWishlist, removeFromWishlist, addToWishlist]);

  const handleRecommendationComplete = (recommendedFilters) => {
    setFilters(recommendedFilters);
    setShowRecommendation(false);
    applyFilters(searchQuery, recommendedFilters);
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
          <TouchableOpacity onPress={() => setShowFilterModal(true)}>
            <Ionicons name="filter" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.recommendationButton}
        onPress={() => setShowRecommendation(true)}
      >
        <View style={styles.recommendationContent}>
          <Ionicons name="help-circle-outline" size={24} color="#FFFFFF" style={styles.recommendationIcon} />
          <View style={styles.recommendationText}>
            <Text style={styles.recommendationButtonTitle}>Not sure what to buy?</Text>
            <Text style={styles.recommendationButtonSubtitle}>Find the perfect sauce!</Text>
          </View>
        </View>
      </TouchableOpacity>

      <FlatList
        data={filteredProducts}
        renderItem={renderProductItem}
        keyExtractor={item => item.id}
        numColumns={numColumns}
        contentContainerStyle={styles.productList}
        key={`${numColumns}-${wishlistKey}`}
      />

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

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleFilterApply}
        onClear={handleClearFilters}
        currentFilters={filters}
      />

      <RecommendationPopup
        visible={showRecommendation}
        onClose={() => setShowRecommendation(false)}
        onComplete={handleRecommendationComplete}
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
    minHeight: 250,
  },
  productInfo: {
    flex: 1,
  },
  productImage: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 10,
    resizeMode: 'contain',
  },
  productName: {
    fontFamily: 'GothamBold',
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 5,
    flexWrap: 'wrap',
  },
  productPrice: {
    fontFamily: 'GothamBook',
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  wishlistButton: {
    backgroundColor: '#2A2A2A',
    padding: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wishlistButtonActive: {
    backgroundColor: '#E40421',
  },
  addToCartButton: {
    backgroundColor: '#E40421',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    flex: 1,
    marginLeft: 10,
  },
  addToCartText: {
    fontFamily: 'GothamBold',
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
  },

  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#121212',
    paddingVertical: 10,
    // paddingBottom: add for ios
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
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 10,
    marginVertical: 5,
    marginTop: 10,
  },
  recommendationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendationIcon: {
    marginRight: 10,
  },
  recommendationText: {
    flex: 1,
  },
  recommendationButtonTitle: {
    fontFamily: 'GothamBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  recommendationButtonSubtitle: {
    fontFamily: 'GothamBook',
    fontSize: 12,
    color: '#999999',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  wishlistButton: {
    backgroundColor: '#2A2A2A',
    padding: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'GothamBold',
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});