// Authentication service for interacting with the server API
const API_URL = 'http://localhost:3001/api';

/**
 * Service for handling authentication-related API calls
 */
export const useAuthService = () => {
  /**
   * Make an API call with proper error handling
   * @param {string} endpoint - API endpoint
   * @param {string} method - HTTP method
   * @param {object} data - Request body data
   * @param {string} token - Auth token
   * @returns {Promise<object>} - Response data
   */
  const apiCall = async (endpoint, method = 'GET', data = null, token = null) => {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      method,
      headers,
      body: data ? JSON.stringify(data) : null,
    };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, config);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'An error occurred');
      }

      return responseData;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  };

  /**
   * Login user with username and password
   * @param {object} credentials - User credentials
   * @returns {Promise<object>} - Token and user data
   */
  const login = async (credentials) => {
    return await apiCall('/login', 'POST', credentials);
  };

  /**
   * Register a new user
   * @param {object} userData - User registration data
   * @returns {Promise<object>} - Registration response
   */
  const register = async (userData) => {
    return await apiCall('/register', 'POST', userData);
  };

  /**
   * Get user profile data
   * @param {string} token - Auth token
   * @returns {Promise<object>} - User profile data
   */
  const getProfile = async (token) => {
    return await apiCall('/profile', 'GET', null, token);
  };

  /**
   * Update user profile
   * @param {object} profileData - Profile data to update
   * @param {string} token - Auth token
   * @returns {Promise<object>} - Updated profile data
   */
  const updateProfile = async (profileData, token) => {
    return await apiCall('/profile', 'PUT', profileData, token);
  };

  return {
    login,
    register,
    getProfile,
    updateProfile,
    apiCall
  };
};

export default useAuthService;
