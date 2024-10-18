import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { useCart } from '../CartContext';
import { useWishlist } from '../WishlistContext';

const ProductScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const [additionalInfo, setAdditionalInfo] = useState(null);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    fetchAdditionalInfo();
  }, []);

  const fetchAdditionalInfo = async () => {
    // TODO: Implement fetching additional info from Google Sheets
    // For now, we'll use mock data
    setAdditionalInfo({
      spicyLevel: 2,
      description: "A delicious hot sauce with a perfect balance of heat and flavor.",
      flavorNotes: "Smoky, tangy, with a hint of sweetness",
      pairings: ["Grilled chicken", "Tacos", "Eggs"],
      reviews: [
        { user: "John D.", rating: 5, comment: "Fantastic sauce! Great on everything." },
        { user: "Sarah M.", rating: 4, comment: "Nice kick without being overwhelming." }
      ]
    });
  };

  const renderSpicyLevel = (level) => {
    return (
      <View style={styles.spicyLevelContainer}>
        {[...Array(3)].map((_, index) => (
          <FontAwesome6
            key={index}
            name="pepper-hot"
            size={20}
            color={index < level ? "#E40421" : "#999999"}
          />
        ))}
      </View>
    );
  };

  const handleToggleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleToggleWishlist}>
            <Ionicons 
              name={isInWishlist(product.id) ? "heart" : "heart-outline"} 
              size={24} 
              color={isInWishlist(product.id) ? "#E40421" : "#FFFFFF"} 
            />
          </TouchableOpacity>
        </View>
        
        <Image source={product.image} style={styles.productImage} />
        
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>£{product.price.toFixed(2)}</Text>
          
          {additionalInfo && (
            <>
              <View style={styles.spicyLevel}>
                <Text style={styles.sectionTitle}>Spicy Level:</Text>
                {renderSpicyLevel(additionalInfo.spicyLevel)}
              </View>
              
              <Text style={styles.description}>{additionalInfo.description}</Text>
              
              <Text style={styles.sectionTitle}>Flavor Notes:</Text>
              <Text style={styles.text}>{additionalInfo.flavorNotes}</Text>
              
              <Text style={styles.sectionTitle}>Pairings:</Text>
              {additionalInfo.pairings.map((pairing, index) => (
                <Text key={index} style={styles.text}>• {pairing}</Text>
              ))}
              
              <Text style={styles.sectionTitle}>Reviews:</Text>
              {additionalInfo.reviews.map((review, index) => (
                <View key={index} style={styles.review}>
                  <Text style={styles.reviewUser}>{review.user}</Text>
                  <Text style={styles.reviewRating}>{"⭐".repeat(review.rating)}</Text>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                </View>
              ))}
            </>
          )}
        </View>
      </ScrollView>
      
      <TouchableOpacity style={styles.addToCartButton} onPress={() => addToCart(product)}>
        <Text style={styles.addToCartText}>Add to Cart</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  productImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  productInfo: {
    padding: 20,
  },
  productName: {
    fontFamily: 'GothamBold',
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  productPrice: {
    fontFamily: 'GothamBook',
    fontSize: 20,
    color: '#E40421',
    marginBottom: 20,
  },
  spicyLevel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  spicyLevelContainer: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  sectionTitle: {
    fontFamily: 'GothamBold',
    fontSize: 18,
    color: '#FFFFFF',
    marginRight: 10,
    marginTop: 20,
    marginBottom: 10,
  },
  description: {
    fontFamily: 'GothamBook',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  text: {
    fontFamily: 'GothamBook',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  review: {
    marginBottom: 15,
  },
  reviewUser: {
    fontFamily: 'GothamBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  reviewRating: {
    fontSize: 14,
    marginVertical: 5,
  },
  reviewComment: {
    fontFamily: 'GothamBook',
    fontSize: 14,
    color: '#FFFFFF',
  },
  addToCartButton: {
    backgroundColor: '#E40421',
    padding: 20,
    alignItems: 'center',
  },
  addToCartText: {
    fontFamily: 'GothamBold',
    fontSize: 18,
    color: '#FFFFFF',
  },
});

export default ProductScreen;