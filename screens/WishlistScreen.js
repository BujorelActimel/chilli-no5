import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';
import { useCart } from '../CartContext';
import { useWishlist } from '../WishlistContext';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function WishlistScreen({ navigation }) {
    const { wishlistItems, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();

    const handleAddToCart = (item) => {
        addToCart(item);
        Alert.alert("Added to Cart", `${item.name} has been added to your cart.`);
    };

    const handleRemoveFromWishlist = (itemId) => {
        Alert.alert(
            "Remove from Wishlist",
            "Are you sure you want to remove this item from your wishlist?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Remove",
                    onPress: () => removeFromWishlist(itemId),
                    style: "destructive"
                }
            ]
        );
    };

    const renderWishlistItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Image source={item.image} style={styles.itemImage} />
            <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>£{item.price.toFixed(2)}</Text>
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
            </View>
            <View style={styles.itemActions}>
                <TouchableOpacity onPress={() => handleAddToCart(item)} style={styles.addToCartButton}>
                    <Ionicons name="cart" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleRemoveFromWishlist(item.id)} style={styles.removeButton}>
                    <Ionicons name="trash-outline" size={24} color="#E40421" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Wishlist" />
            {wishlistItems.length > 0 ? (
                <FlatList
                    data={wishlistItems}
                    renderItem={renderWishlistItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Ionicons name="heart-outline" size={64} color="#999999" />
                    <Text style={styles.emptyText}>Your wishlist is empty</Text>
                    <TouchableOpacity 
                        style={styles.shopNowButton}
                        onPress={() => navigation.navigate('Home')}
                    >
                        <Text style={styles.shopNowButtonText}>Shop Now</Text>
                    </TouchableOpacity>
                </View>
            )}
            <BottomNavBar navigation={navigation} activeTab="Wishlist" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#151718',
    },
    listContainer: {
        padding: 16,
    },
    itemContainer: {
        flexDirection: 'row',
        backgroundColor: '#1A1A1A',
        borderRadius: 10,
        marginBottom: 16,
        padding: 16,
        alignItems: 'center',
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    itemDetails: {
        flex: 1,
        marginLeft: 16,
    },
    itemName: {
        fontFamily: 'GothamBold',
        fontSize: 16,
        color: '#FFFFFF',
        marginBottom: 4,
    },
    itemPrice: {
        fontFamily: 'GothamBook',
        fontSize: 14,
        color: '#999999',
        marginBottom: 4,
    },
    spicyLevelContainer: {
        flexDirection: 'row',
        marginTop: 4,
    },
    itemActions: {
        flexDirection: 'row',
    },
    addToCartButton: {
        backgroundColor: '#E40421',
        padding: 8,
        borderRadius: 20,
        marginRight: 8,
    },
    removeButton: {
        padding: 8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: '#FFFFFF',
        fontFamily: 'GothamBook',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 16,
        marginBottom: 24,
    },
    shopNowButton: {
        backgroundColor: '#E40421',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 25,
    },
    shopNowButtonText: {
        fontFamily: 'GothamBold',
        fontSize: 16,
        color: '#FFFFFF',
    },
});