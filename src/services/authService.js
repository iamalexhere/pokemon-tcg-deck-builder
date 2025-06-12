// Layanan autentikasi untuk berinteraksi dengan server API
const API_URL = 'http://localhost:3001/api';

/**
 * Layanan untuk menangani panggilan API terkait autentikasi
 */
export const useAuthService = () => {
  /**
   * Membuat panggilan API dengan penanganan kesalahan yang tepat
   * @param {string} endpoint - Endpoint API
   * @param {string} method - Metode HTTP
   * @param {object} data - Data body request
   * @param {string} token - Token autentikasi
   * @returns {Promise<object>} - Data respons
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
   * Login pengguna dengan username dan password
   * @param {object} credentials - Kredensial pengguna
   * @returns {Promise<object>} - Token dan data pengguna
   */
  const login = async (credentials) => {
    return await apiCall('/login', 'POST', credentials);
  };

  /**
   * Mendaftarkan pengguna baru
   * @param {object} userData - Data registrasi pengguna
   * @returns {Promise<object>} - Respons registrasi
   */
  const register = async (userData) => {
    return await apiCall('/register', 'POST', userData);
  };

  /**
   * Mendapatkan data profil pengguna
   * @param {string} token - Token autentikasi
   * @returns {Promise<object>} - Data profil pengguna
   */
  const getProfile = async (token) => {
    return await apiCall('/profile', 'GET', null, token);
  };

  /**
   * Memperbarui profil pengguna
   * @param {object} profileData - Data profil yang akan diperbarui
   * @param {string} token - Token autentikasi
   * @returns {Promise<object>} - Data profil yang telah diperbarui
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
