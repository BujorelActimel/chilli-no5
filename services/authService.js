// services/authService.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { API_BASE_URL, ACCESS_TOKEN } from "@env";

const authService = {
    login: async (email, password) => {
        try {
          console.log('Attempting login for:', email);
          const response = await axios.get(`${API_BASE_URL}/crm/v3/objects/contacts`, {
            params: {
              limit: 1,
              properties: ['email', 'firstname', 'lastname'],
              filterGroups: [{
                filters: [{
                  propertyName: 'email',
                  operator: 'EQ',
                  value: email
                }]
              }]
            },
            headers: {
              'Authorization': `Bearer ${ACCESS_TOKEN}`,
              'Content-Type': 'application/json'
            }
          });
    
          console.log('API response:', JSON.stringify(response.data, null, 2));
    
          if (response.data.results && response.data.results.length > 0) {
            const user = response.data.results[0];
            
            // Ensure the email in the response matches the input email
            if (user.properties.email.toLowerCase() === email.toLowerCase()) {
              // In a real-world scenario, you would validate the password here.
              // For this example, we'll just check if the password is not empty.
              if (password.trim() !== '') {
                await AsyncStorage.setItem('userEmail', email);
                await AsyncStorage.setItem('userName', `${user.properties.firstname} ${user.properties.lastname}`);
                console.log('User logged in successfully:', email);
                return { success: true, user: { email, name: `${user.properties.firstname} ${user.properties.lastname}` } };
              } else {
                console.log('Login failed: Invalid password');
                return { success: false, message: 'Invalid password. Please try again.' };
              }
            } else {
              console.log('Login failed: Email mismatch');
              return { success: false, message: 'User not found. Please check your email or sign up.' };
            }
          } else {
            console.log('Login failed: User not found');
            return { success: false, message: 'User not found. Please check your email or sign up.' };
          }
        } catch (error) {
          console.error('Login error:', error.response ? error.response.data : error.message);
          return { success: false, message: 'An error occurred during login. Please try again.' };
        }
      },

  logout: async () => {
    try {
      await AsyncStorage.removeItem('userEmail');
      await AsyncStorage.removeItem('userName');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, message: 'An error occurred during logout' };
    }
  },

  isAuthenticated: async () => {
    try {
      const userEmail = await AsyncStorage.getItem('userEmail');
      console.log('Checking auth status. User email from storage:', userEmail);
      return !!userEmail;
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  },
  register: async (email, password, firstName, lastName) => {
        try {
            // Check if user already exists
            const checkResponse = await axios.get(`${API_BASE_URL}/crm/v3/objects/contacts`, {
            params: {
                limit: 1,
                properties: ['email'],
                filterGroups: [{
                filters: [{
                    propertyName: 'email',
                    operator: 'EQ',
                    value: email
                }]
                }]
            },
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            }
            });

            if (checkResponse.data.results.length > 0) {
            return { success: false, message: 'User already exists' };
            }

            // Create new contact in HubSpot
            const createResponse = await axios.post(`${API_BASE_URL}/crm/v3/objects/contacts`, {
            properties: {
                email: email,
                firstname: firstName,
                lastname: lastName
            }
            }, {
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            }
            });

            if (createResponse.data.id) {
            await AsyncStorage.setItem('userEmail', email);
            return { success: true };
            } else {
            return { success: false, message: 'Failed to create user' };
            }
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, message: 'An error occurred during registration' };
        }
    }
};

export default authService;