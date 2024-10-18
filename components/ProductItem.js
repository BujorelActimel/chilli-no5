// components/ProductItem.js
import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import defaultProductImage from '../assets/product-placeholder.png';

const ProductItem = React.memo(({ item, isInWishlist, addToWishlist, removeFromWishlist, addToCart }) => {
  const handleToggleWishlist = () => {
    if (isInWishlist(item.id)) {
      removeFromWishlist(item.id);
    } else {
      addToWishlist(item);
    }
  };

  const getImageSource = () => {
    if (item.image && item.image.uri && item.image.uri.trim() !== '') {
      return item.image;
    }
    return defaultProductImage;
  };

  return (
    <View style={styles.productItem}>
      <Image source={getImageSource()} style={styles.productImage} />
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
          onPress={handleToggleWishlist}
        >
          <Ionicons 
            name={isInWishlist(item.id) ? "heart" : "heart-outline"} 
            size={20} 
            color={isInWishlist(item.id) ? "#FFFFFF" : "#E40421"} 
          />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.addToCartButton}
          onPress={() => addToCart(item)}
        >
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
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
});

export default ProductItem;