import { createSignal, For, createResource, Show, createEffect } from 'solid-js';
import styles from './decklist.module.css';
import DeckCard from '../components/DeckCard';
import Pagination from '../components/Pagination';
import { useNavigate } from "@solidjs/router";
import { useAuth } from '../context/AuthContext';
import { getDecks, createDeck } from '../services/deckService'; 

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
  </svg>
);

const ITEMS_PER_PAGE = 9; 

function DeckList() {
  // State management untuk pencarian, paginasi, dan daftar deck.
  const [searchTerm, setSearchTerm] = createSignal('');
  const [currentPage, setCurrentPage] = createSignal(1);
  const [allDecks, setAllDecks] = createSignal([]);
  const navigate = useNavigate();
  // Menggunakan hook `useAuth` untuk memeriksa status login pengguna.
  const { isLoggedIn } = useAuth();

  // `createResource` untuk mengambil data deck. Akan otomatis re-fetch jika `searchTerm` berubah.
  const [decksData] = createResource(searchTerm, async (search) => {
    try {
      const response = await getDecks(search);
      setAllDecks(response.decks || []);
      return response.decks || [];
    } catch (error) { // Error handling saat fetch data deck.
      console.error('Error fetching decks:', error);
      throw new Error(error.message || 'Failed to load decks.');
    }
  });

  // State turunan untuk memfilter deck berdasarkan `searchTerm`.
  const filteredDecks = () => {
    const search = searchTerm().toLowerCase();
    if (!search) return allDecks();
    return allDecks().filter(deck => deck.name.toLowerCase().includes(search));
  };

  const totalPages = () => Math.ceil(filteredDecks().length / ITEMS_PER_PAGE);

  // State turunan untuk paginasi deck yang sudah difilter.
  const paginatedDecks = () => {
    const startIndex = (currentPage() - 1) * ITEMS_PER_PAGE;
    return filteredDecks().slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };
  
  // Proteksi rute: jika pengguna belum login, tampilkan pesan dan tombol untuk login.
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

  // Efek untuk mereset halaman ke 1 setiap kali ada pencarian baru.
  createEffect(() => {
    setCurrentPage(1);
  });

  // Handler untuk submit form pencarian.
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(e.currentTarget.querySelector('input').value);
  };

  // Handler untuk mengubah halaman.
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handler untuk mengarahkan ke editor deck saat sebuah deck di-klik.
  const handleDeckClick = (deck) => {
    navigate(`/deckeditor/${deck.id}`);
  };

  // Handler untuk membuat deck baru.
  const handleCreateNewDeck = async () => {
    try {
      const newDeckResponse = await createDeck("New Deck", "");
      if (newDeckResponse && newDeckResponse.deck && newDeckResponse.deck.id) {
        // Navigasi ke editor untuk deck yang baru dibuat.
        navigate(`/deckeditor/${newDeckResponse.deck.id}`);
      } else {
        alert('Failed to create new deck: Invalid response from server.');
      }
    } catch (error) { // Error handling saat membuat deck baru.
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
      
      {/* Conditional rendering: tampilkan loading, error, atau daftar deck. */}
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