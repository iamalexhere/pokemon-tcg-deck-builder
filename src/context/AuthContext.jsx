import { createContext, createSignal, useContext, createEffect, onMount } from 'solid-js';
import defaultProfileImage from '../assets/images/icon/Profile.png';

const AuthContext = createContext();

// Helper functions for localStorage
const saveToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const getFromLocalStorage = (key, defaultValue) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  } catch (error) {
    console.error('Error getting from localStorage:', error);
    return defaultValue;
  }
};

export function AuthProvider(props) {
  // Initialize state from localStorage if available
  const [isLoggedIn, setIsLoggedIn] = createSignal(getFromLocalStorage('isLoggedIn', false));
  const [user, setUser] = createSignal(getFromLocalStorage('user', null));
  const [profilePicture, setProfilePicture] = createSignal(getFromLocalStorage('profilePicture', defaultProfileImage));
  const [username, setUsername] = createSignal(getFromLocalStorage('username', 'Username'));
  const [pronouns, setPronouns] = createSignal(getFromLocalStorage('pronouns', 'Pronouns'));
  const [description, setDescription] = createSignal(getFromLocalStorage('description', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'));

  // Effects to update localStorage when state changes
  createEffect(() => saveToLocalStorage('isLoggedIn', isLoggedIn()));
  createEffect(() => saveToLocalStorage('user', user()));
  createEffect(() => saveToLocalStorage('profilePicture', profilePicture()));
  createEffect(() => saveToLocalStorage('username', username()));
  createEffect(() => saveToLocalStorage('pronouns', pronouns()));
  createEffect(() => saveToLocalStorage('description', description()));

  const login = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    // localStorage is now handled by createEffect
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    // localStorage is now handled by createEffect
  };

  const updateProfilePicture = (imageData) => {
    setProfilePicture(imageData);
  };

  const updateProfile = (data) => {
    if (data.username) setUsername(data.username);
    if (data.pronouns) setPronouns(data.pronouns);
    if (data.description) setDescription(data.description);
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      user, 
      login, 
      logout, 
      profilePicture, 
      updateProfilePicture,
      username,
      pronouns,
      description,
      updateProfile
    }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
