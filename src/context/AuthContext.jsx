import { createContext, createSignal, useContext, createEffect, onMount } from "solid-js";
import defaultProfileImage from '../assets/images/icon/Profile.png';
import { useAuthService } from '../services/authService';

/**
 * Context untuk state management autentikasi global
 * 
 * Menyediakan:
 * - State autentikasi (isAuthenticated)
 * - Data profil pengguna
 * - Token JWT
 * - Fungsi login/logout
 * - Fungsi update profil
 * 
 * Digunakan oleh:
 * - Layout: untuk membungkus aplikasi dengan provider
 * - Navbar: untuk status login dan data profil
 * - Protected routes: untuk mengecek autentikasi
 * 
 * @context
 */
const AuthContext = createContext();
const API_URL = 'http://localhost:3001/api';

// Helper functions untuk menyimpan dan mengambil data dari localStorage
const saveToLocalStorage = (key, value) => {
  if (value === null || value === undefined) {
    localStorage.removeItem(key);
  } else {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

const getFromLocalStorage = (key, defaultValue) => {
  const storedValue = localStorage.getItem(key);
  if (storedValue === null) {
    return defaultValue;
  } else {
    return JSON.parse(storedValue);
  }
};

export function AuthProvider(props) {
  // Inisialisasi service autentikasi
  const authService = useAuthService();
  
  // Inisialisasi state untuk autentikasi
  const [isLoggedIn, setIsLoggedIn] = createSignal(getFromLocalStorage('isLoggedIn', false));
  const [token, setToken] = createSignal(getFromLocalStorage('token', null));
  const [user, setUser] = createSignal(getFromLocalStorage('user', null));
  const [profilePicture, setProfilePicture] = createSignal(getFromLocalStorage('profilePicture', defaultProfileImage));
  const [username, setUsername] = createSignal(getFromLocalStorage('username', ''));
  const [pronouns, setPronouns] = createSignal(getFromLocalStorage('pronouns', ''));
  const [description, setDescription] = createSignal(getFromLocalStorage('description', ''));
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal(null);

  // Effects untuk menyimpan state ke localStorage
  createEffect(() => saveToLocalStorage('isLoggedIn', isLoggedIn()));
  createEffect(() => saveToLocalStorage('token', token()));
  createEffect(() => saveToLocalStorage('user', user()));
  createEffect(() => saveToLocalStorage('profilePicture', profilePicture()));
  createEffect(() => saveToLocalStorage('username', username()));
  createEffect(() => saveToLocalStorage('pronouns', pronouns()));
  createEffect(() => saveToLocalStorage('description', description()));

  // Load user profile on mount jika token tersedia
  onMount(async () => {
    const savedToken = token();
    if (savedToken) {
      try {
        await fetchUserProfile(savedToken);
      } catch (err) {
        console.error('Error loading profile:', err);
        // If token is invalid, log out the user
        handleLogout();
      }
    }
  });

  // Fetch user profile dari API
  const fetchUserProfile = async (authToken) => {
    setLoading(true);
    setError(null);
    
    try {
      const userData = await authService.getProfile(authToken);
      
      setUser(userData);
      setUsername(userData.username);
      setProfilePicture(userData.profilePicture || defaultProfileImage);
      setPronouns(userData.pronouns || '');
      setDescription(userData.description || '');
      setIsLoggedIn(true);
      
      return userData;
    } catch (err) {
      setError(err.message || 'Failed to load profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const handleLogin = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(credentials);
      const authToken = response.token;
      
      setToken(authToken);
      
      // Fetch user profile dengan token yang didapat
      await fetchUserProfile(authToken);
      
      return true;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const handleRegister = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      await authService.register(userData);
      return true;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
    setUsername('');
    setProfilePicture(defaultProfileImage);
    setPronouns('');
    setDescription('');
  };

  // Update profile function
  const handleUpdateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    
    try {
      const currentToken = token();
      if (!currentToken) throw new Error('Not authenticated');
      
      const updatedProfile = await authService.updateProfile(profileData, currentToken);
      
      // Jika token berubah (misalnya setelah ganti username), simpan token baru
      if (updatedProfile.token) {
        setToken(updatedProfile.token);
        console.log('Token updated after username change');
      }
      
      if (profileData.username) setUsername(profileData.username);
      if (profileData.profilePicture) setProfilePicture(profileData.profilePicture);
      if (profileData.pronouns) setPronouns(profileData.pronouns);
      if (profileData.description) setDescription(profileData.description);
      
      return updatedProfile;
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      user,
      token,
      username,
      profilePicture,
      pronouns,
      description,
      loading,
      error,
      login: handleLogin,
      register: handleRegister,
      logout: handleLogout,
      updateProfile: handleUpdateProfile,
      apiCall: (endpoint, method, data) => authService.apiCall(endpoint, method, data, token())
    }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
