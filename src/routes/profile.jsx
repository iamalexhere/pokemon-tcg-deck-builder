import styles from './profile.module.css';
import { createSignal, createEffect, Show, For } from "solid-js";
import editIcon from '../assets/images/icon/editIcon.png';
import DeckCard from '../components/DeckCard';
import { useAuth } from '../context/AuthContext';

// Helper function to get deck data from localStorage or use defaults
const getStoredDecks = (key, defaultLength) => {
  try {
    const storedData = localStorage.getItem(key);
    if (storedData) {
      return JSON.parse(storedData);
    }
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
  }
  
  // Return default data if nothing in localStorage
  return Array.from({ length: defaultLength }, (_, i) => ({
    id: i + 1,
    name: `${key === 'recentDecks' ? 'My Recent Deck' : 'My Favorite Deck'} ${i + 1}`,
    imageUrl: '',
    cardCount: Math.floor(Math.random() * 40) + 20,
  }));
};

// Get initial deck data from localStorage or use defaults
const initialDecks = getStoredDecks('recentDecks', 3);
const initialFDecks = getStoredDecks('favoriteDecks', 6);

function Profile(){
  const auth = useAuth();
  const { 
    profilePicture, 
    updateProfilePicture, 
    updateProfile, 
    username, 
    pronouns, 
    description 
  } = auth;
  
  // The profile is already protected by ProtectedRoute in the router configuration
  
  // Variables for editing profile
  const [showUsername, setShowUsername] = createSignal(true);
  const [showPronouns, setShowPronouns] = createSignal(true);
  const [showDeskripsi, setShowDeskripsi] = createSignal(true);
  // signal untuk error
  const [usernameError, setUsernameError] = createSignal("");
  const [pronounsError, setPronounsError] = createSignal("");
  // signal untuk deck with localStorage persistence
  const [deck, setDeck] = createSignal(initialDecks);
  const [favoriteDeck, setFavoriteDeck] = createSignal(initialFDecks);
  
  // Save deck data to localStorage when it changes
  createEffect(() => {
    try {
      localStorage.setItem('recentDecks', JSON.stringify(deck()));
    } catch (error) {
      console.error('Error saving recent decks to localStorage:', error);
    }
  });
  
  createEffect(() => {
    try {
      localStorage.setItem('favoriteDecks', JSON.stringify(favoriteDeck()));
    } catch (error) {
      console.error('Error saving favorite decks to localStorage:', error);
    }
  });
  // signal for button deck click
  const [activebutton, setActiveButton] = createSignal(true);
  
  // Create signals for temporary values during editing - only used during edit mode
  const [tempUsername, setTempUsername] = createSignal(username());
  const [tempPronouns, setTempPronouns] = createSignal(pronouns());
  const [tempDeskripsi, setTempDeskripsi] = createSignal(description());
  
  // Variables for profile picture upload
  const [showProfileUpload, setShowProfileUpload] = createSignal(false);
  const [uploadError, setUploadError] = createSignal('');
  const [isUploading, setIsUploading] = createSignal(false);

  // Function to handle username editing
  function handleUsername(){
    if (showUsername() === true){
        setShowUsername(false);
    } else {
        if(usernameError() === ""){
            updateProfile({ username: tempUsername() });
            setShowUsername(true);
        }
    }
  }

// func untuk mengconfirm username dengan enter
  function handleUsernameEnter(event){
    if (event.key === "Enter"){
        handleUsername();
    }
  }

  // Function to handle pronouns editing
  function handlePronouns(){
    if (showPronouns() === true){
        setShowPronouns(false);
    } else {
        if(pronounsError() === ""){
            updateProfile({ pronouns: tempPronouns() });
            setShowPronouns(true);
        }
    }
  }

// func untuk mengconfirm Pronouns dengan enter
  function handlePronounsEnter(event){
    if (event.key === "Enter"){
        handlePronouns();
    }
  }

// function input handle deskripsi
 function handleDeskripsi(){
    if (showDeskripsi() === true){
        setShowDeskripsi(false);
    } else {
        updateProfile({ description: tempDeskripsi() });
        if(tempDeskripsi() === ""){
            setTempDeskripsi("-");
        }
        setShowDeskripsi(true);
    }
}
// Function to handle profile picture upload with error handling
  function handleProfilePictureUpload(e) {
    setUploadError('');
    const file = e.target.files[0];
    
    if (!file) {
      return;
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.');
      return;
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setUploadError('File is too large. Maximum size is 5MB.');
      return;
    }
    
    setIsUploading(true);
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      updateProfilePicture(e.target.result);
      setShowProfileUpload(false); // Close overlay after upload
      setIsUploading(false);
    };
    
    reader.onerror = () => {
      setUploadError('Failed to read the file. Please try again.');
      setIsUploading(false);
    };
    
    reader.readAsDataURL(file);
  }

// func untuk mengconfirm deskripsi dengan enter
  function handleDeskripsiEnter(event){
    const maxNewLines = 0;
    const currentValue = event.target.value;
    const newLineCount = (currentValue.match(/\n/g) || []).length;

    // mencegah user untuk bikin new line
    if (event.key === 'Enter' && newLineCount >= maxNewLines) {
        event.preventDefault(); // Prevent adding another new line
        handleDeskripsi(); // Submit on Enter
    }

    // Optional: Ctrl+Enter to finish editing
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        handleDeskripsi(); // simulate clicking the edit icon to close editing
    }
  }


// function handle input and error
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


  return (
    
    < >
        {/* Click handler moved to fotoProfile container */}
        <div class={styles.profileFrame}>
            <div class={styles.fotoProfile}>
                <img 
                    src={profilePicture()} 
                    alt="Profile" 
                    onClick={() => setShowProfileUpload(true)} 
                    style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" 
                />
                
                {showProfileUpload() && (
                    <div class={styles.uploadOverlay} onClick={(e) => e.stopPropagation()}>
                        {/* New elements for concentric circles */}
                        <div class={styles.outerCircle}></div>
                        <div class={styles.innerCircle}></div>
                        <div class={styles.centerDot}></div>

                        <div class={styles.fileInput}>
                            <button class={styles.uploadButton} disabled={isUploading()}>
                                {isUploading() ? 'Uploading...' : 'Choose File'}
                            </button>
                            <input 
                                type="file" 
                                accept="image/jpeg,image/png,image/gif,image/webp" 
                                onChange={handleProfilePictureUpload}
                                disabled={isUploading()} 
                            />
                        </div>
                        <p>Select a new profile picture from your device</p>
                        {uploadError() && <p class={styles.errorMessage}>{uploadError()}</p>}
                    </div>
                )}
            </div>

            <div class={styles.textFrame}>
                {/* username div */}
                <div class={styles.usernameStyle}>
                    
                    <Show when={showUsername()} fallback={<input type="text" value={tempUsername()} onInput={(e) => ErrorHandleUser(e)} onKeyDown={(e) => handleUsernameEnter(e)} maxLength={15}/> }>
                        <p>{username()}</p>
                    </Show>

                    <button onClick={handleUsername}>
                        <img src={editIcon} alt="Edit" style="width: 2rem; height: 2rem;" />
                    </button>

                </div>    
                
                <div class={styles.errorContainer}>
                    <p>{usernameError()}</p>
                </div>

                {/* pronouns div */}
                <div class={styles.pronounStyle}>
                    
                    <Show when={showPronouns()} fallback={<input type="text" value={tempPronouns()} onInput={(e) => ErrorHandlePronouns(e)} onKeyDown={(e) => handlePronounsEnter(e)} maxLength={20}/> }>
                        <p>{pronouns()}</p>
                    </Show>

                    <button onClick={handlePronouns}>
                        <img src={editIcon} alt="Edit" style="width: 2rem; height: 2rem;" />
                    </button>
                </div>    
                
                <div class={styles.errorContainer}>
                    <p>{pronounsError()}</p>
                </div>

                <div class={styles.deskripsiStyle}>
                    
                    <Show when={showDeskripsi()} fallback={<textarea value={tempDeskripsi()} onInput={(e) => setTempDeskripsi(e.target.value)} onKeyDown={(e) => handleDeskripsiEnter(e)} maxLength={250} style="width: 100%;"/>}>
                        <p>{description()}</p>
                    </Show>

                    <button onClick={handleDeskripsi}>
                        <img src={editIcon} alt="Edit" style="width: 2rem; height: 2rem;" />
                    </button>

                </div>


            </div>

        </div>
        <hr />
        <div class={styles.deck}>
            {/* button deck */}
            <div class={styles.deckButton}>
                <button onClick={() => setActiveButton(true)} class={activebutton() ? styles.activeButton : ""}>Recent Deck</button>
                <button onClick={() => setActiveButton(false)} class={!activebutton() ? styles.activeButton : ""}>Favorite Deck</button>
            </div>

            {/* tampilan */}
            <div class={styles.deckGrid}>
                
                <Show when={activebutton()}>
                    
                    <For each={deck()} fallback={<p class={styles.noDecksMessage}>No decks found.</p>}>
                    {(deck) => <DeckCard deck={deck} />}
                    
                    </For>
                </Show>
                <Show when={!activebutton()}>
                    <For each={favoriteDeck()} fallback={<p class={styles.noDecksMessage}>No decks found.</p>}>
                    {(favoriteDeck) => <DeckCard deck={favoriteDeck} />}
                    </For>
                </Show>
            </div>
        </div>
    </>
    
)}

export default Profile;