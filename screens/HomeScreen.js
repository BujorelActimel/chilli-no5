// HomeScreen.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../CartContext';
import { useWishlist } from '../WishlistContext';
import { useWindowDimensions } from 'react-native';
import CustomAlert from '../components/CustomAlert';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';
import RecommendationPopup from '../components/RecommendationPopup';
import FilterModal from '../components/FilterModal';
import { XMLParser } from 'fast-xml-parser';
import { useFocusEffect } from '@react-navigation/native';
import ProductItem from '../components/ProductItem';

export default function HomeScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Home');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    spicyLevel: null,
    priceRange: null,
    category: null,
  });

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist, refreshWishlist } = useWishlist();
  const { width } = useWindowDimensions();
  const numColumns = Math.floor(width / 180);

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

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
      refreshWishlist();
    }, [fetchProducts, refreshWishlist])
  );

  const handleCloseAlert = () => {
    setAlertVisible(false);
  };

  const handleSearch = useCallback((text) => {
    setSearchQuery(text);
  }, []);

  const applyFilters = useCallback((searchText, filterOptions) => {
    let filtered = products;

    if (searchText) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (filterOptions.spicyLevel) {
      filtered = filtered.filter(product => product.spicyLevel === filterOptions.spicyLevel);
    }

    if (filterOptions.priceRange) {
      const [min, max] = filterOptions.priceRange;
      filtered = filtered.filter(product => product.price >= min && product.price <= max);
    }

    if (filterOptions.category) {
      filtered = filtered.filter(product => product.category === filterOptions.category);
    }

    setFilteredProducts(filtered);
  }, [products]);

  useEffect(() => {
    applyFilters(searchQuery, filters);
  }, [searchQuery, filters, applyFilters]);

  const handleFilterApply = useCallback((newFilters) => {
    setFilters(newFilters);
    setShowFilterModal(false);
  }, []);

  const handleClearFilters = useCallback(() => {
    const clearedFilters = {
      spicyLevel: null,
      priceRange: null,
      category: null,
    };
    setFilters(clearedFilters);
    setShowFilterModal(false);
  }, []);

  const memoizedIsInWishlist = useCallback((itemId) => {
    return isInWishlist(itemId);
  }, [isInWishlist]);

  const renderProductItem = useCallback(({ item }) => (
    <ProductItem
      item={item}
      isInWishlist={memoizedIsInWishlist}
      addToWishlist={addToWishlist}
      removeFromWishlist={removeFromWishlist}
      addToCart={addToCart}
    />
  ), [memoizedIsInWishlist, addToWishlist, removeFromWishlist, addToCart]);

  const getItemLayout = useCallback((data, index) => ({
    length: 250,
    offset: 250 * index,
    index,
  }), []);

  const handleRecommendationComplete = useCallback((recommendedFilters) => {
    setFilters(recommendedFilters);
    setShowRecommendation(false);
  }, []);

  const memoizedFilteredProducts = useMemo(() => filteredProducts, [filteredProducts]);

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
        data={memoizedFilteredProducts}
        renderItem={renderProductItem}
        keyExtractor={item => item.id}
        numColumns={numColumns}
        contentContainerStyle={styles.productList}
        getItemLayout={getItemLayout}
        removeClippedSubviews={true}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
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
        onComplete={handleRecommendationComplete}
      />

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleFilterApply}
        onClear={handleClearFilters}
        currentFilters={filters}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  searchBarContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#121212',
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
});