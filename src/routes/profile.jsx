import styles from './profile.module.css';
import profileImage from '../assets/images/icon/Profile.png';
import { createSignal, Show } from "solid-js";
import editIcon from '../assets/images/icon/editIcon.png'
import DeckCard from '../components/DeckCard';

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

function profile(){
//   variabel untuk setting username
  const [username,setUsername] = createSignal("Username");
  const [showUsername, setShowUsername] = createSignal(true);
//   variabel untuk setting pronouns
  const [pronouns, setPronouns] = createSignal("Pronouns");
  const [showPronouns, setShowPronouns] = createSignal(true);
//   variabel untuk setting deskripsi
  const [deskripsi, setDeskripsi] = createSignal("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.");
  const [showDeskripsi, setShowDeskripsi] = createSignal(true);
// signal untuk error
const [usernameError, setUsernameError] = createSignal("");
const [pronounsError, setPronounsError] = createSignal("");
// signal untuk deck
const [deck, setDeck] = createSignal(initialDecks);
const [favoriteDeck, setFavoriteDeck] = createSignal(initialFDecks);
// signal for button deck click
const [activebutton,setActiveButton] = createSignal(true);


//function input handle username 
  function handleUsername(){
    if (showUsername()==true){
        setShowUsername(false);
    }else{
        if(usernameError()===""){
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

// function input handle pronouns
  function handlePronouns(){
    if (showPronouns()==true){
        setShowPronouns(false);
    }else{
        if(pronounsError()===""){
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
    if (showDeskripsi()==true){
        setShowDeskripsi(false);
    }else{
        if(deskripsi()===""){
            setDeskripsi("-");
        }
        setShowDeskripsi(true)
    }
  }

// func untuk mengconfirm deskripsi dengan enter
  function handleDeskripsiEnter(event){
    const maxNewLines = 0;
    const currentValue = event.target.value;
    const newLineCount = (currentValue.match(/\n/g) || []).length;

    // mencegah user untuk bikin new line
    if (event.key === 'Enter' && newLineCount >= maxNewLines) {
        event.preventDefault(); // Prevent adding another new line
    }

    // Optional: Ctrl+Enter to finish editing
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        handleDeskripsi(); // simulate clicking the edit icon to close editing
    }
  }


// function handle input and error
function ErrorHandleUser(event){
    if(event.target.value===""){
        setUsernameError("Warning: username cannot be empty!")
    }else if(event.target.value.length<4){
        setUsernameError("Warning: username cannot be below than 4!")
    }else{
        setUsername(event.target.value);
        setUsernameError("");
        
    }
}

function ErrorHandlePronouns(event){
    if(event.target.value===""){
        setPronounsError("Warning: username cannot be empty!")
    }else if(event.target.value.length<4){
        setPronounsError("Warning: username cannot be below than 4!")
    }else{
        setPronouns(event.target.value);
        setPronounsError("");
        
    }
}


  return (
    
    < >
        <div class={styles.profileFrame}>

            <div class={styles.fotoProfile}>
                <img src={profileImage} alt="Profile Photo" style="width:20rem; height:20rem; border-radius:50%;"/>
            </div>

            <div class={styles.textFrame}>
                {/* username div */}
                <div class={styles.usernameStyle}>
                    
                    <Show when={showUsername()} fallback={<input type="text" value={username()} onInput={(e)=>ErrorHandleUser(e)} onKeyDown={(e) => handleUsernameEnter(e)} maxLength={15}/> }>
                        <p s>{username()}</p>
                    </Show>

                    <button onClick={handleUsername} >
                        <img src={editIcon} alt="Edit" style="width: 2rem; height: 2rem;" />
                    </button>

                </div>    
                
                <div class={styles.errorContainer}>
                    <p>{usernameError()}</p>
                </div>

                {/* pronouns div */}
                <div class={styles.pronounStyle}>
                    
                    <Show when={showPronouns()} fallback={<input type="text" value={pronouns()} onInput={(e) => ErrorHandlePronouns(e)} onKeyDown={(e) => handlePronounsEnter(e)} maxLength={20}/> }>
                        <p>{pronouns()}</p>
                    </Show>

                    <button onClick={handlePronouns} >
                        <img src={editIcon} alt="Edit" style="width: 2rem; height: 2rem;" maxLength={250}/>
                    </button>
                </div>    
                
                <div class={styles.errorContainer}>
                    <p>{pronounsError()}</p>
                </div>

                <div class={styles.deskripsiStyle}>
                    
                    <Show when={showDeskripsi()} fallback={<textarea type="text" textContent={deskripsi()} onInput={(e) => setDeskripsi(e.target.value)} onKeyDown={(e) => handleDeskripsiEnter(e)} maxLength={250}/>}>
                        <p>{deskripsi()} </p>
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

export default profile;