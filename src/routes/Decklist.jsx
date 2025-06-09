import { createSignal, For, createResource, Show, createEffect } from 'solid-js';
import styles from './decklist.module.css';
import DeckCard from '../components/DeckCard';
import Pagination from '../components/Pagination';
import { useNavigate } from "@solidjs/router";
import { useAuth } from '../context/AuthContext';
import { getDecks, createDeck } from '../services/deckService'; // Import deck service functions

// Placeholder for Search Icon
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
  </svg>
);

const ITEMS_PER_PAGE = 9; // Number of decks to display per page

function DeckList() {
  const [searchTerm, setSearchTerm] = createSignal('');
  const [currentPage, setCurrentPage] = createSignal(1);
  const [searchTrigger, setSearchTrigger] = createSignal(0); // Used to re-trigger resource
  const navigate = useNavigate();
  const { isLoggedIn, token } = useAuth(); // Get token from auth context

  // Resource to fetch decks based on current page and search term
  const [decksData] = createResource(() => {
    // Depend on currentPage and searchTrigger to re-fetch
    const page = currentPage();
    const search = searchTerm();
    return { page, search };
  }, async ({ page, search }) => {
    try {
      const response = await getDecks(page, ITEMS_PER_PAGE, search);
      // The API should return { decks: [...], totalPages: N }
      return response;
    } catch (error) {
      console.error('Error fetching decks:', error);
      // Re-throw to be caught by Solid's error handling for resource
      throw new Error(error.message || 'Failed to load decks.');
    }
  });

  // Handle pagination and filtering logic
  const totalPages = () => decksData()?.totalPages || 1;

  // Derive paginated decks from the resource data
  const paginatedDecks = () => decksData()?.decks || [];

  // If not logged in, redirect to login page
  // This check should happen before any authenticated API calls are attempted.
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

  // Effect to reset current page to 1 whenever the search term changes significantly
  createEffect(() => {
    // Only reset if decksData has loaded and the search term isn't empty on initial load
    // This prevents resetting page when component first mounts and search term is empty
    if (searchTrigger() > 0 && currentPage() !== 1) {
      setCurrentPage(1);
    }
  });

  const handleSearch = (e) => {
    e.preventDefault();
    // Trigger a re-fetch of the resource with the new search term
    setCurrentPage(1); // Always reset to page 1 on new search
    setSearchTrigger(prev => prev + 1); // Increment to trigger resource re-fetch
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDeckClick = (deck) => {
    navigate(`/deckeditor/${deck.id}`);
  };

  const handleCreateNewDeck = async () => {
    try {
      // Create a new deck with a default name.
      // The server will assign an ID and other defaults.
      const newDeckResponse = await createDeck("New Deck", "");
      if (newDeckResponse && newDeckResponse.deck && newDeckResponse.deck.id) {
        // Navigate to the editor for the newly created deck
        navigate(`/deckeditor/${newDeckResponse.deck.id}`);
      } else {
        alert('Failed to create new deck: Invalid response from server.');
      }
    } catch (error) {
      console.error('Error creating new deck:', error);
      alert(`Failed to create new deck: ${error.message || 'An unknown error occurred.'}`);
    }
  };


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
            onInput={(e) => setSearchTerm(e.currentTarget.value)}
          />
          <button type="submit" class={styles.searchButton} aria-label="Search">
            <SearchIcon />
          </button>
        </form>
        <button
          class={styles.createNewDeckButton}
          onClick={handleCreateNewDeck}
        >
          Create New Deck +
        </button>
      </div>

      <Show when={!decksData.loading} fallback={
        <div class={styles.loadingContainer}>
          <div class={styles.spinner}></div>
          <p>Loading decks...</p>
        </div>
      }>
        <Show when={!decksData.error} fallback={
          <div class={styles.errorContainer}>
            <p>{decksData.error.message}</p>
            <button onClick={() => decksData.refetch()} class={styles.retryButton}>
              Retry Loading Decks
            </button>
          </div>
        }>
          <div class={styles.deckGrid}>
            <For each={paginatedDecks()} fallback={<p class={styles.noDecksMessage}>No decks found.</p>}>
              {(deck) => <DeckCard deck={deck} onClick={() => handleDeckClick(deck)} />}
            </For>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages()}
            onPageChange={handlePageChange}
          />
        </Show>
      </Show>
    </div>
  );
}

export default DeckList;
