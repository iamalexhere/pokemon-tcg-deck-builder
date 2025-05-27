import { createContext, createSignal, useContext } from 'solid-js';
import defaultProfileImage from '../assets/images/icon/Profile.png';

const AuthContext = createContext();

export function AuthProvider(props) {
  const [isLoggedIn, setIsLoggedIn] = createSignal(false);
  const [user, setUser] = createSignal(null);
  const [profilePicture, setProfilePicture] = createSignal(defaultProfileImage);
  const [username, setUsername] = createSignal('Username');
  const [pronouns, setPronouns] = createSignal('Pronouns');
  const [description, setDescription] = createSignal('Lorem Ipsum is simply dummy text of the printing and typesetting industry.');

  const login = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    // In a real app, you might store auth token in localStorage here
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    // In a real app, you would clear localStorage here
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
