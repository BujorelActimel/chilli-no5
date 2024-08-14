// RecommendationResultsScreen.js
import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../CartContext';
import { useWindowDimensions } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';

export default function RecommendationResultsScreen({ navigation, route }) {
  const { recommendations } = route.params;
  const { cartItems, addToCart } = useCart();
  const { width } = useWindowDimensions();
  const numColumns = Math.floor(width / 180);


  const renderProductItem = ({ item }) => (
    <TouchableOpacity style={styles.productItem}>
      <Image source={item.image} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>£{item.price.toFixed(2)}</Text>

      {/* Spiciness Level */}
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

      {/* Food Pairings */}
      <Text style={styles.pairingsLabel}>Pairs well with:</Text>
      <Text style={styles.pairings}>{item.pairings.join(', ')}</Text>

      <TouchableOpacity 
        style={styles.addToCartButton}
        onPress={() => {
          addToCart(item);
        }}
      >
        <Text style={styles.addToCartText}>Add to Cart</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} />
      <Text style={styles.recommendationTitle}>Recommended for You</Text>
      <FlatList
        data={recommendations}
        renderItem={renderProductItem}
        keyExtractor={item => item.id}
        numColumns={numColumns}
        contentContainerStyle={styles.productList}
        key={numColumns}
      />
      <BottomNavBar navigation={navigation} activeTab="Recommendation" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
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
  recommendationTitle: {
    fontFamily: 'AbhayaLibreBold',
    fontSize: 24,
    color: '#FFFFFF',
    marginTop: 10,
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
    textAlign: 'center',
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
  recommendationTitle: {
    fontFamily: 'AbhayaLibreBold',
    fontSize: 24,
    color: '#FFFFFF',
    margin: 20,
  },
});