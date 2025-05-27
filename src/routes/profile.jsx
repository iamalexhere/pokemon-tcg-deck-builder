import styles from './profile.module.css';
import { createSignal, Show, For } from "solid-js";
import editIcon from '../assets/images/icon/editIcon.png'
import DeckCard from '../components/DeckCard';
import { useAuth } from '../context/AuthContext';

// Placeholder deck data recent
const initialDecks = Array.from({ length: 3 }, (_, i) => ({
  id: i + 1,
  name: `My Recent Deck ${i + 1}`,
  imageUrl: '',
  cardCount: Math.floor(Math.random() * 40) + 20,
}));

// Placeholder deck data recent
const initialFDecks = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  name: `My Favorite Deck ${i + 1}`,
  imageUrl: '',
  cardCount: Math.floor(Math.random() * 40) + 20,
}));

function Profile(){
  const auth = useAuth();
  const { isLoggedIn, profilePicture, updateProfilePicture, updateProfile } = auth;
  
  // Check if user is logged in
  if (!isLoggedIn()) {
    return <div class={styles.notLoggedIn}>Please login to view your profile</div>;
  }
  
  // Variables for editing profile
  const [showUsername, setShowUsername] = createSignal(true);
  const [showPronouns, setShowPronouns] = createSignal(true);
  const [showDeskripsi, setShowDeskripsi] = createSignal(true);
  const [tempUsername, setTempUsername] = createSignal(auth.username());
  const [tempPronouns, setTempPronouns] = createSignal(auth.pronouns());
  const [tempDeskripsi, setTempDeskripsi] = createSignal(auth.description());
  
  // Variable for profile picture upload
  const [showProfileUpload, setShowProfileUpload] = createSignal(false);

  // Function to handle username editing
  function handleUsername(){
    if (showUsername()) {
      setShowUsername(false);
    } else {
      updateProfile({ username: tempUsername() });
      setShowUsername(true);
    }
  }

  // Function to handle pronouns editing
  function handlePronouns(){
    if (showPronouns()) {
      setShowPronouns(false);
    } else {
      updateProfile({ pronouns: tempPronouns() });
      setShowPronouns(true);
    }
  }

  // Function to handle description editing
  function handleDeskripsi(){
    if (showDeskripsi()) {
      setShowDeskripsi(false);
    } else {
      updateProfile({ description: tempDeskripsi() });
      setShowDeskripsi(true);
    }
  }
  
  // Function to handle profile picture upload
  function handleProfilePictureUpload(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateProfilePicture(e.target.result);
        setShowProfileUpload(false); // Close overlay after upload
      };
      reader.readAsDataURL(file);
    }
  }

// signal untuk deck
const [deck, setDeck] = createSignal(initialDecks);
const [favoriteDeck, setFavoriteDeck] = createSignal(initialFDecks);

// signal for button click
const [activebutton,setActiveButton] = createSignal(true);


  return (
    
    < >
        {/* Click handler moved to fotoProfile container */}
        <div class={styles.profileFrame}>
            <div class={styles.fotoProfile} onClick={() => setShowProfileUpload(!showProfileUpload())}>
                {/* Conditionally render the profile image */}
                <Show when={!showProfileUpload()}>
                    <img 
                        src={profilePicture()} 
                        alt="Profile Photo" 
                        style="width:100%; height:100%; border-radius:50%; object-fit: cover;" // Make image fill container
                    />
                </Show>
                
                {/* Profile Upload Overlay */}
                {showProfileUpload() && (
                    <div class={styles.uploadOverlay} onClick={(e) => e.stopPropagation()}> {/* Prevent click from bubbling to fotoProfile */}
                        {/* New elements for concentric circles */}
                        <div class={styles.outerCircle}></div>
                        <div class={styles.innerCircle}></div>
                        <div class={styles.centerDot}></div>

                        <div class={styles.fileInput}>
                            <button class={styles.uploadButton}>Choose File</button>
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleProfilePictureUpload} 
                            />
                        </div>
                        <p>Select a new profile picture from your device</p>
                    </div>
                )}
            </div>

            <div class={styles.textFrame}>
                {/* username div */}
                <div class={styles.usernameStyle}>
                    
                    <Show when={showUsername()} fallback={<input type="text" value={tempUsername()} onInput={(e) => setTempUsername(e.target.value)}/> }>
                        <p>{auth.username()}</p>
                    </Show>

                    <button onClick={handleUsername} >
                        <img src={editIcon} alt="Edit" style="width: 2rem; height: 2rem;" />
                    </button>

                </div>    
                

                {/* pronouns div */}
                <div class={styles.pronounStyle}>
                    
                    <Show when={showPronouns()} fallback={<input type="text" value={tempPronouns()} onInput={(e) => setTempPronouns(e.target.value)}/> }>
                        <p>{auth.pronouns()}</p>
                    </Show>

                    <button onClick={handlePronouns} >
                        <img src={editIcon} alt="Edit" style="width: 2rem; height: 2rem;" />
                    </button>
                </div>    
                

                <div class={styles.deskripsiStyle}>
                    
                    <Show when={showDeskripsi()} fallback={<textarea type="text" value={tempDeskripsi()} onInput={(e) => setTempDeskripsi(e.target.value)}/>}>
                        <p>{auth.description()} </p>
                    </Show>

                    <button onClick={handleDeskripsi} >
                        <img src={editIcon} alt="Edit" style="width: 2rem; height: 2rem;" />
                    </button>

                </div>

                
            </div>

        </div>
        <hr />
        <div class={styles.deck}>
            {/* button deck */}
            <div class={styles.deckButton}>
                <button onClick={() => setActiveButton(true)} class={activebutton()===true?styles.activeButton:""}>Recent Deck</button>
                <button onClick={() => setActiveButton(false)} class={activebutton()===false?styles.activeButton:""}>Favorite Deck</button>
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