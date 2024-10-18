// services/authService.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, ACCESS_TOKEN } from "@env";

const authService = {
  async login(email, password) {
    try {
      if (!password.trim()) {
        return { success: false, message: 'Password cannot be empty' };
      }

      const response = await axios.post(`${API_BASE_URL}/crm/v3/objects/contacts/search`, {
        filterGroups: [{
          filters: [{
            propertyName: 'email',
            operator: 'EQ',
            value: email
          }]
        }],
        properties: ['email', 'firstname', 'lastname', 'createdate', 'lastmodifieddate'],
        limit: 1
      }, {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.results && response.data.results.length > 0) {
        const user = response.data.results[0];
        const userData = {
          email: user.properties.email,
          firstName: user.properties.firstname,
          lastName: user.properties.lastname,
          createdAt: user.properties.createdate,
          lastModified: user.properties.lastmodifieddate
        };

        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        
        return { 
          success: true, 
          user: userData
        };
      }
      return { success: false, message: 'User not found' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'An error occurred during login' };
    }
  },

  async register(email, password, firstName, lastName) {
    // Registration is currently not implemented due to lack of write permissions
    return { success: false, message: 'Registration is currently unavailable. Please contact support.' };
  },

  async logout() {
    try {
      await AsyncStorage.multiRemove(['userData']);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, message: 'An error occurred during logout' };
    }
  },

  async isAuthenticated() {
    try {
      const userData = await AsyncStorage.getItem('userData');
      return !!userData;
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  },

  async getCurrentUserData() {
    try {
      const userData = await AsyncStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting current user data:', error);
      return null;
    }
  },

  async getUserProfile(email) {
    try {
      const response = await axios.get(`${API_BASE_URL}/crm/v3/objects/contacts/search`, {
        data: {
          filterGroups: [{
            filters: [{
              propertyName: 'email',
              operator: 'EQ',
              value: email
            }]
          }],
          properties: ['email', 'firstname', 'lastname', 'createdate', 'lastmodifieddate'],
          limit: 1
        },
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.results && response.data.results.length > 0) {
        const user = response.data.results[0];
        return {
          success: true,
          profile: {
            id: user.id,
            email: user.properties.email,
            firstName: user.properties.firstname,
            lastName: user.properties.lastname,
            createdAt: user.properties.createdate,
            lastModified: user.properties.lastmodifieddate
          }
        };
      }
      return { success: false, message: 'User not found' };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return { success: false, message: 'An error occurred while fetching the user profile' };
    }
  },
  async getCurrentUserEmail() {
    try {
      return await AsyncStorage.getItem('userEmail');
    } catch (error) {
      console.error('Error getting current user email:', error);
      return null;
    }
  }
};

export default authService;