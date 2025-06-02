import styles from './profile.module.css';
import { createSignal, createEffect, onMount, Show, For } from 'solid-js';
import { useAuth } from '../context/AuthContext';
import { FiEdit } from 'solid-icons/fi';
import DeckCard from '../components/DeckCard';
import defaultProfileImage from '../assets/images/icon/Profile.png';
import editIcon from '../assets/images/icon/editIcon.png';

// Helper function to get deck data from localStorage or use defaults
const getStoredDecks = (key, defaultLength) => {
  try {
    const storedDecks = localStorage.getItem(key);
    if (storedDecks) {
      return JSON.parse(storedDecks);
    }
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error);
  }
  
  // Return default decks if none in localStorage
  return Array(defaultLength).fill().map((_, index) => ({
    id: index + 1,
    name: `Deck ${index + 1}`,
    image: `https://images.pokemontcg.io/base1/${(index * 5) % 16 + 1}.png`
  }));
};

// Initialize decks from localStorage or defaults
const initialDecks = getStoredDecks('recentDecks', 3);
const initialFDecks = getStoredDecks('favoriteDecks', 2);

function Profile() {
  const auth = useAuth();
  
  // State signals
  const [activeButton, setActiveButton] = createSignal(localStorage.getItem('activeButton') || 'recentDecks');
  const [isEditingProfile, setIsEditingProfile] = createSignal(false);
  const [isChangingPassword, setIsChangingPassword] = createSignal(false);
  const [tempUsername, setTempUsername] = createSignal(auth.username || '');
  const [tempPronouns, setTempPronouns] = createSignal(auth.pronouns || '');
  const [tempDescription, setTempDescription] = createSignal(auth.description || '');
  const [profilePicture, setProfilePicture] = createSignal(auth.profilePicture || defaultProfileImage);
  const [currentPassword, setCurrentPassword] = createSignal('');
  const [newPassword, setNewPassword] = createSignal('');
  const [confirmPassword, setConfirmPassword] = createSignal('');
  const [passwordError, setPasswordError] = createSignal('');
  const [successMessage, setSuccessMessage] = createSignal('');
  const [errorMessage, setErrorMessage] = createSignal('');
  const [isLoading, setIsLoading] = createSignal(false);
  const [recentDecks, setRecentDecks] = createSignal([]);
  const [favoriteDecks, setFavoriteDecks] = createSignal([]);
  const [usernameError, setUsernameError] = createSignal('');
  const [pronounsError, setPronounsError] = createSignal('');
  const [isUploading, setIsUploading] = createSignal(false);
  const [uploadError, setUploadError] = createSignal('');

  // Save active button selection to localStorage
  createEffect(() => {
    localStorage.setItem('activeButton', activeButton());
  });

  // Load user data and decks on component mount
  onMount(async () => {
    if (auth.isLoggedIn()) {
      try {
        setIsLoading(true);
        
        // Initialize form fields with user data
        setTempUsername(auth.username || '');
        setTempPronouns(auth.pronouns || '');
        setTempDescription(auth.description || '');
        setProfilePicture(auth.profilePicture || defaultProfileImage);
        
        // Fetch decks from API
        try {
          const decksResponse = await auth.apiCall('/decks', 'GET');
          
          if (decksResponse && decksResponse.decks) {
            const allDecks = decksResponse.decks;
            setRecentDecks(allDecks.slice(0, 5)); // Get most recent 5 decks
            setFavoriteDecks(allDecks.filter(deck => deck.favorite)); // Get favorite decks
          }
        } catch (error) {
          console.error('Error fetching decks:', error);
          setErrorMessage('Failed to load decks. Please try again later.');
          
          // Fallback to mock data if API fails
          setRecentDecks(initialDecks);
          setFavoriteDecks(initialFDecks);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        setErrorMessage('Failed to load profile. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
  });

  // Handle profile picture change
  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Please select a valid image file (JPEG, PNG, GIF)');
      return;
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setErrorMessage('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);
    
    // Read and set the image
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfilePicture(e.target.result);
      setIsUploading(false);
    };
    reader.onerror = () => {
      setErrorMessage('Error reading file');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // Handle saving profile changes
  const handleSaveProfile = async () => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    // Validate inputs
    if (tempUsername().length < 3) {
      setErrorMessage('Username must be at least 3 characters');
      setIsLoading(false);
      return;
    }
    
    try {
      // Prepare profile data
      const profileData = {
        username: tempUsername(),
        pronouns: tempPronouns(),
        description: tempDescription(),
        profilePicture: profilePicture()
      };
      
      // Update profile through API
      await auth.updateProfile(profileData);
      
      setIsEditingProfile(false);
      setSuccessMessage('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password change
  const handleChangePassword = async () => {
    setIsLoading(true);
    setPasswordError('');
    setErrorMessage('');
    setSuccessMessage('');
    
    // Validate password inputs
    if (!currentPassword()) {
      setPasswordError('Current password is required');
      setIsLoading(false);
      return;
    }

    if (!newPassword()) {
      setPasswordError('New password is required');
      setIsLoading(false);
      return;
    }

    if (newPassword().length < 5) {
      setPasswordError('New password must be at least 5 characters');
      setIsLoading(false);
      return;
    }

    if (newPassword() !== confirmPassword()) {
      setPasswordError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      // Call password change API
      await auth.apiCall('/profile/password', 'PUT', {
        currentPassword: currentPassword(),
        newPassword: newPassword()
      });
      
      // Reset form and show success message
      setIsChangingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccessMessage('Password changed successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordError(error.message || 'Failed to change password. Please check your current password.');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle between recent and favorite decks
  const toggleDecks = (buttonType) => {
    setActiveButton(buttonType);
  };

  // Function to handle username editing
  function handleUsername(){
    if (showUsername() === true){
        setShowUsername(false);
    } else {
        if(usernameError() === ""){
            auth.updateProfile({ username: tempUsername() });
            setShowUsername(true);
        }
    }
  }

  // Function to handle pronouns editing
  function handlePronouns(){
    if (showPronouns() === true){
        setShowPronouns(false);
    } else {
        if(pronounsError() === ""){
            auth.updateProfile({ pronouns: tempPronouns() });
            setShowPronouns(true);
        }
    }
  }

  // Function to handle input and error
  function ErrorHandleUser(event){
    const input = event.target.value;
    setTempUsername(input);
    
    if(input === ""){
        setUsernameError("Warning: username cannot be empty!");
    } else if(input.length < 4){
        setUsernameError("Warning: username cannot be below 4 characters!");
    } else {
        setUsernameError("");
    }
  }

  function ErrorHandlePronouns(event){
    const input = event.target.value;
    setTempPronouns(input);
    
    if(input === ""){
        setPronounsError("Warning: pronouns cannot be empty!");
    } else if(input.length < 2){
        setPronounsError("Warning: pronouns must be at least 2 characters!");
    } else {
        setPronounsError("");
    }
  }

  onMount(async () => {
    if (auth.isLoggedIn()) {
      try {
        setIsLoading(true);
        // Fetch decks from API
        const decksResponse = await auth.apiCall('/decks', 'GET');
        
        // Process decks data
        if (decksResponse && decksResponse.decks) {
          const allDecks = decksResponse.decks;
          setRecentDecks(allDecks.slice(0, 5)); // Get most recent 5 decks
          setFavoriteDecks(allDecks.filter(deck => deck.favorite)); // Get favorite decks
        }
      } catch (error) {
        console.error('Error fetching decks:', error);
        setErrorMessage('Failed to load decks. Please try again later.');
        
        // Fallback to mock data if API fails
        setRecentDecks([
          { id: 1, name: 'Fire Deck', image: 'https://images.pokemontcg.io/base1/4.png' },
          { id: 2, name: 'Water Deck', image: 'https://images.pokemontcg.io/base1/2.png' },
          { id: 3, name: 'Grass Deck', image: 'https://images.pokemontcg.io/base1/15.png' },
        ]);
        setFavoriteDecks([
          { id: 2, name: 'Water Deck', image: 'https://images.pokemontcg.io/base1/2.png' },
          { id: 4, name: 'Electric Deck', image: 'https://images.pokemontcg.io/base1/13.png' },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  });

  return (
    <>
      <div class={styles.profileContainer}>
        {/* Profile Section */}
        <div class={styles.profileFrame}>
          {/* Profile Picture */}
          <div class={styles.fotoProfile}>
            <img 
              src={profilePicture()} 
              alt="Profile" 
              onClick={() => !isEditingProfile() && setIsEditingProfile(true)} 
              style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" 
            />
          </div>

          {/* Profile Information */}
          <div class={styles.profileInfo}>
            {/* Show either profile view or edit mode */}
            <Show when={!isEditingProfile()} fallback={
              <div class={styles.profileEditForm}>
                <h2>Edit Profile</h2>
                
                <div class={styles.formGroup}>
                  <label>Username</label>
                  <input 
                    type="text" 
                    value={tempUsername()} 
                    onInput={(e) => setTempUsername(e.target.value)}
                    maxLength={20}
                  />
                </div>
                
                <div class={styles.formGroup}>
                  <label>Pronouns</label>
                  <input 
                    type="text" 
                    value={tempPronouns()} 
                    onInput={(e) => setTempPronouns(e.target.value)}
                    maxLength={20}
                  />
                </div>
                
                <div class={styles.formGroup}>
                  <label>Description</label>
                  <textarea 
                    value={tempDescription()} 
                    onInput={(e) => setTempDescription(e.target.value)}
                    rows={4}
                  />
                </div>
                
                <div class={styles.formGroup}>
                  <label>Profile Picture</label>
                  <input 
                    type="file" 
                    accept="image/jpeg,image/png,image/gif" 
                    onChange={handleProfilePictureChange}
                    disabled={isUploading()} 
                  />
                  {isUploading() && <span>Uploading...</span>}
                </div>
                
                <div class={styles.profileEditActions}>
                  <button 
                    class={styles.saveProfileButton} 
                    onClick={handleSaveProfile}
                    disabled={isLoading()}
                  >
                    {isLoading() ? 'Saving...' : 'Save'}
                  </button>
                  <button 
                    class={styles.cancelButton} 
                    onClick={() => {
                      setIsEditingProfile(false);
                      setTempUsername(auth.username);
                      setTempPronouns(auth.pronouns);
                      setTempDescription(auth.description);
                      setProfilePicture(auth.profilePicture || defaultProfileImage);
                    }}
                    disabled={isLoading()}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            }>
              {/* Profile View Mode */}
              <div class={styles.profileDetails}>
                <h2>{auth.username}</h2>
                <p class={styles.pronouns}>{auth.pronouns}</p>
                <p class={styles.description}>{auth.description}</p>
                
                <div class={styles.profileActions}>
                  <button 
                    class={styles.editProfileButton} 
                    onClick={() => setIsEditingProfile(true)}
                    disabled={isLoading()}
                  >
                    Edit Profile
                  </button>
                  <button 
                    class={styles.changePasswordButton} 
                    onClick={() => setIsChangingPassword(true)}
                    disabled={isLoading()}
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </Show>
          </div>
        </div>
        
        {/* Password Change Modal */}
        <Show when={isChangingPassword()}>
          <div class={styles.passwordChangeModal}>
            <div class={styles.modalContent}>
              <h2>Change Password</h2>
              
              <div class={styles.formGroup}>
                <label>Current Password</label>
                <input 
                  type="password" 
                  value={currentPassword()} 
                  onInput={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              
              <div class={styles.formGroup}>
                <label>New Password</label>
                <input 
                  type="password" 
                  value={newPassword()} 
                  onInput={(e) => setNewPassword(e.target.value)}
                />
              </div>
              
              <div class={styles.formGroup}>
                <label>Confirm New Password</label>
                <input 
                  type="password" 
                  value={confirmPassword()} 
                  onInput={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              
              {passwordError() && (
                <div class={styles.errorMessage}>{passwordError()}</div>
              )}
              
              <div class={styles.passwordChangeActions}>
                <button 
                  class={styles.savePasswordButton} 
                  onClick={handleChangePassword}
                  disabled={isLoading()}
                >
                  {isLoading() ? 'Changing...' : 'Change Password'}
                </button>
                <button 
                  class={styles.cancelButton} 
                  onClick={() => {
                    setIsChangingPassword(false);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setPasswordError('');
                  }}
                  disabled={isLoading()}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </Show>
        
        {/* Decks Section */}
        <div class={styles.deckSection}>
          <div class={styles.deckButtonFrame}>
            <button 
              class={`${styles.deckButton} ${activeButton() === 'recentDecks' ? styles.activeButton : styles.inactiveButton}`} 
              onClick={() => toggleDecks('recentDecks')}
            >
              Recent Decks
            </button>
            <button 
              class={`${styles.deckButton} ${activeButton() === 'favoriteDecks' ? styles.activeButton : styles.inactiveButton}`} 
              onClick={() => toggleDecks('favoriteDecks')}
            >
              Favorite Decks
            </button>
          </div>

          <div class={styles.deckList}>
            <Show when={activeButton() === 'recentDecks'} fallback={
              <div class={styles.favoriteDeck}>
                {favoriteDecks().length > 0 ? (
                  <For each={favoriteDecks()}>
                    {(deck) => (
                      <DeckCard name={deck.name} image={deck.image} />
                    )}
                  </For>
                ) : (
                  <p class={styles.noDeckMessage}>No favorite decks yet</p>
                )}
              </div>
            }>
              <div class={styles.recentDeck}>
                {recentDecks().length > 0 ? (
                  <For each={recentDecks()}>
                    {(deck) => (
                      <DeckCard name={deck.name} image={deck.image} />
                    )}
                  </For>
                ) : (
                  <p class={styles.noDeckMessage}>No recent decks yet</p>
                )}
              </div>
            </Show>
          </div>
        </div>
        
        {/* Success and Error Messages */}
        {successMessage() && (
          <div class={styles.successMessage}>
            {successMessage()}
          </div>
        )}
        
        {errorMessage() && (
          <div class={styles.errorMessage}>
            {errorMessage()}
          </div>
        )}
      </div>
    </>
  );}

export default Profile;