import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CartScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Cart</Text>
      </View>

      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.cartList}
        ListFooterComponent={CartSummary}
      />

      <TouchableOpacity 
        style={styles.checkoutButton}
        onPress={() => {
          // Implement checkout logic here
          navigation.navigate('Home');  // Navigate back to home after checkout
        }}
      >
        <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
      </TouchableOpacity>
    </View>
  );
}

const renderCartItem = ({ item }) => (
  <View style={styles.cartItem}>
    <View style={[styles.productColor, { backgroundColor: item.color }]} />
    <Image source={item.image} style={styles.productImage} />
    <View style={styles.productInfo}>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
    </View>
    <View style={styles.quantityContainer}>
      <TouchableOpacity style={styles.quantityButton}>
        <Ionicons name="remove" size={20} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.quantityText}>{item.quantity}</Text>
      <TouchableOpacity style={styles.quantityButton}>
        <Ionicons name="add" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  </View>
);

const CartSummary = () => (
  <View style={styles.cartSummary}>
    <View style={styles.summaryRow}>
      <Text style={styles.summaryText}>Subtotal</Text>
      <Text style={styles.summaryText}>$29.97</Text>
    </View>
    <View style={styles.summaryRow}>
      <Text style={styles.summaryText}>Shipping</Text>
      <Text style={styles.summaryText}>$5.00</Text>
    </View>
    <View style={styles.summaryRow}>
      <Text style={styles.summaryTextBold}>Total</Text>
      <Text style={styles.summaryTextBold}>$34.97</Text>
    </View>
  </View>
);

const cartItems = [
  { id: '1', name: 'MEXICAN FURY', color: '#3AAA35', price: 9.99, quantity: 1, image: require('../assets/product-placeholder.png') },
  { id: '2', name: 'FIERY GAZPACHO', color: '#E8442F', price: 9.99, quantity: 2, image: require('../assets/product-placeholder.png') },
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
  headerTitle: {
    fontFamily: 'AbhayaLibreBold',
    fontSize: 24,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  cartList: {
    padding: 10,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  productColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  productImage: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontFamily: 'GothamBold',
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  productPrice: {
    fontFamily: 'GothamBook',
    fontSize: 14,
    color: '#FFFFFF',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#2A2A2A',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontFamily: 'GothamBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginHorizontal: 10,
  },
  cartSummary: {
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryText: {
    fontFamily: 'GothamBook',
    fontSize: 16,
    color: '#FFFFFF',
  },
  summaryTextBold: {
    fontFamily: 'GothamBold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  checkoutButton: {
    backgroundColor: '#E40421',
    margin: 20,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  checkoutButtonText: {
    fontFamily: 'GothamBold',
    fontSize: 18,
    color: '#FFFFFF',
  },
});