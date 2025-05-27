import { createSignal, For } from 'solid-js';
import styles from './decklist.module.css';
import DeckCard from '../components/DeckCard';
import Pagination from '../components/Pagination';
import { useNavigate } from "@solidjs/router";
import { useAuth } from '../context/AuthContext';

// Placeholder for Search Icon
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
  </svg>
);

// Placeholder deck data
const initialDecks = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  name: `My Awesome Deck ${i + 1}`,
  imageUrl: '',
  cardCount: Math.floor(Math.random() * 40) + 20,
}));

const ITEMS_PER_PAGE = 9;

function DeckList() {
  const [searchTerm, setSearchTerm] = createSignal('');
  const [allDecks, setAllDecks] = createSignal(initialDecks);
  const [currentPage, setCurrentPage] = createSignal(1);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  
  // If not logged in, redirect to login page
  if (!isLoggedIn()) {
    return (
      <div class={styles.notLoggedInContainer}>
        <h2>Please Log In</h2>
        <p>You need to be logged in to view and manage your decks.</p>
        <button onClick={() => navigate('/login')} class={styles.loginRedirectButton}>
          Go to Login
        </button>
      </div>
    );
  }

  const filteredDecks = () => {
    const lowerSearchTerm = searchTerm().toLowerCase();
    // Reset to first page if current page becomes invalid due to filtering
    const currentFiltered = allDecks().filter(deck =>
      deck.name.toLowerCase().includes(lowerSearchTerm)
    );
    const newTotalPages = Math.ceil(currentFiltered.length / ITEMS_PER_PAGE);
    if (currentPage() > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    } else if (newTotalPages === 0 && currentFiltered.length === 0) {
        // if no results, and current page is 1, keep it 1.
        // if current page was > 1 and now no results, reset to 1.
        if (currentPage() > 1) setCurrentPage(1);
    }
    return currentFiltered;
  };

  const totalPages = () => Math.ceil(filteredDecks().length / ITEMS_PER_PAGE);

  const paginatedDecks = () => {
    const start = (currentPage() - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredDecks().slice(start, end);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // When search term changes, filterDecks will run, and it now handles
    // resetting currentPage if it's out of bounds.
    // We still want to explicitly set to page 1 for a new search submission
    setCurrentPage(1);
    console.log("Searching for:", searchTerm());
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDeckClick = (deck) => {
    navigate(`/deckeditor/${deck.id}`);
  }

  return (
    <div class={styles.deckListPageContainer}>
      <h1 class={styles.pageTitle}>Deck List</h1>
      <p class={styles.pageDescription}>
        Create and manage your Pokémon Trading Card Game decks. Build competitive strategies with cards from different sets, save your favorite combinations, and experiment with various Pokémon types. A standard deck consists of exactly 60 cards, with limitations on the number of identical cards that can be included. Browse your saved decks below or create a new one to start building!
      </p>

      <div class={styles.controlsContainer}>
        <form class={styles.searchForm} onSubmit={handleSearch}>
          <input
            type="text"
            class={styles.searchInput}
            placeholder="Search pokemon decks..."
            value={searchTerm()}
            onInput={(e) => {
                setSearchTerm(e.currentTarget.value);
            }}
          />
          <button type="submit" class={styles.searchButton} aria-label="Search">
            <SearchIcon />
          </button>
        </form>
        <button 
          class={styles.createNewDeckButton}
          onClick={() => navigate(`/deckeditor/${allDecks().length + 1}`)}
        >
          Create New Deck +
        </button>
      </div>

      <div class={styles.deckGrid}>
        <For each={paginatedDecks()} fallback={<p class={styles.noDecksMessage}>No decks found.</p>}>
          {(deck) => <DeckCard deck={deck} onClick={handleDeckClick} />}
        </For>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages()}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default DeckList;