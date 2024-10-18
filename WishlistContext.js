import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const storedWishlist = await AsyncStorage.getItem('wishlist');
      if (storedWishlist) {
        setWishlistItems(JSON.parse(storedWishlist));
      }
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    }
  };

  const saveWishlist = async (items) => {
    try {
      await AsyncStorage.setItem('wishlist', JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save wishlist:', error);
    }
  };

  const addToWishlist = (item) => {
    const updatedWishlist = [...wishlistItems, item];
    setWishlistItems(updatedWishlist);
    saveWishlist(updatedWishlist);
  };

  const removeFromWishlist = (itemId) => {
    const updatedWishlist = wishlistItems.filter(item => item.id !== itemId);
    setWishlistItems(updatedWishlist);
    saveWishlist(updatedWishlist);
  };

  const isInWishlist = (itemId) => {
    return wishlistItems.some(item => item.id === itemId);
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};