// CheckoutScreen.js
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../CartContext';

const PaymentMethodOption = ({ label, selected, onSelect }) => (
    <TouchableOpacity style={styles.paymentOption} onPress={onSelect}>
        <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected && <View style={styles.radioInner} />}
        </View>
        <Text style={styles.paymentOptionText}>{label}</Text>
    </TouchableOpacity>
);

export default function CheckoutScreen({ navigation }) {

  const { cartItems, clearCart } = useCart();
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 5.00;
  const total = subtotal + shipping;

  const paymentMethods = ['Credit Card', 'PayPal', 'Apple Pay', 'Google Pay'];

  const handleCheckout = () => {
    clearCart();
    navigation.navigate('Home', { showOrderAlert: true });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Shipping Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your shipping address"
          placeholderTextColor="#999999"
          value={shippingAddress}
          onChangeText={setShippingAddress}
        />

        <Text style={styles.sectionTitle}>Payment Method</Text>
        {paymentMethods.map((method) => (
          <PaymentMethodOption
            key={method}
            label={method}
            selected={paymentMethod === method}
            onSelect={() => setPaymentMethod(method)}
          />
        ))}

        <View style={styles.orderSummary}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
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
      </ScrollView>

      <TouchableOpacity 
        style={[styles.checkoutButton, (!shippingAddress || !paymentMethod) && styles.disabledButton]} 
        onPress={handleCheckout}
        disabled={!shippingAddress || !paymentMethod}
      >
        <Text style={styles.checkoutButtonText}>Place Order</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#121212',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontFamily: 'AbhayaLibreBold',
    fontSize: 24,
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontFamily: 'GothamBold',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    color: '#FFFFFF',
    fontFamily: 'GothamBook',
  },
  orderSummary: {
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
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  radio: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioSelected: {
    borderColor: '#E40421',
  },
  radioInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#E40421',
  },
  paymentOptionText: {
    fontFamily: 'GothamBook',
    fontSize: 16,
    color: '#FFFFFF',
  },
  disabledButton: {
    backgroundColor: '#666666',
  },
});