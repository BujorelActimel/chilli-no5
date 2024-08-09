// CartScreen.js
import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../CartContext';

export default function CartScreen({ navigation }) {
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  const isCartEmpty = cartItems.length === 0;

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={item.image} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>£{item.price.toFixed(2)}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity style={styles.quantityButton} onPress={() => updateQuantity(item.id, -1)}>
          <Ionicons name="remove" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity style={styles.quantityButton} onPress={() => updateQuantity(item.id, 1)}>
          <Ionicons name="add" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => removeFromCart(item.id)}>
        <Ionicons name="trash-outline" size={24} color="#E40421" />
      </TouchableOpacity>
    </View>
  );

  const CartSummary = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal === 0 ? 0 : 5.00;
    const total = subtotal + shipping;

    return (
      <View style={styles.cartSummary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Subtotal</Text>
          <Text style={styles.summaryText}>£{subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Shipping</Text>
          <Text style={styles.summaryText}>£{shipping.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryTextBold}>Total</Text>
          <Text style={styles.summaryTextBold}>£{total.toFixed(2)}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
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
        style={[styles.checkoutButton, isCartEmpty && styles.disabledButton]}
        onPress={() => {
          if (!isCartEmpty) {
            navigation.navigate('Checkout')
          }
        }}
        disabled={isCartEmpty}
      >
        <Text style={styles.checkoutButtonText}>
          {isCartEmpty ? 'Cart is Empty' : 'Proceed to Checkout'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// const cartItems = [
//   { id: '1', name: 'MEXICAN FURY', color: '#3AAA35', price: 9.99, quantity: 1, image: require('../assets/product-placeholder.png') },
//   { id: '2', name: 'FIERY GAZPACHO', color: '#E8442F', price: 9.99, quantity: 2, image: require('../assets/product-placeholder.png') },
// ];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 30 : 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#121212',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontFamily: 'AbhayaLibreBold',
    fontSize: 24,
    color: '#FFFFFF',
    flex: 1,
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
  disabledButton: {
    backgroundColor: '#666666', // A muted color for the disabled state
  },
  checkoutButtonText: {
    fontFamily: 'GothamBold',
    fontSize: 18,
    color: '#FFFFFF',
  },
});