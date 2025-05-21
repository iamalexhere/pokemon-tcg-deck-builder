import { createSignal, For } from 'solid-js';
import styles from './decklist.module.css';
import DeckCard from '../components/DeckCard';

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
  imageUrl: '', // Placeholder for image
  cardCount: Math.floor(Math.random() * 40) + 20, // Random card count
}));

const ITEMS_PER_PAGE = 9;

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pageNumbers = [];
  // Logic for displaying page numbers (e.g., ellipsis for many pages)
  // For simplicity, showing first, current, and last few pages
  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage() - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav class={styles.pagination}>
      <button
        onClick={() => onPageChange(Math.max(1, currentPage() - 1))}
        disabled={currentPage() === 1}
        aria-label="Previous Page"
      >
        Prev
      </button>
      {startPage > 1 && (
        <>
          <button onClick={() => onPageChange(1)}>1</button>
          {startPage > 2 && <span class={styles.ellipsis}>...</span>}
        </>
      )}
      <For each={pageNumbers}>
        {(page) => (
          <button
            onClick={() => onPageChange(page)}
            class={currentPage() === page ? styles.activePage : ''}
          >
            {page}
          </button>
        )}
      </For>
      {endPage < totalPages && (
        <>
          {endPage < totalPages -1 && <span class={styles.ellipsis}>...</span>}
          <button onClick={() => onPageChange(totalPages)}>{totalPages}</button>
        </>
      )}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage() + 1))}
        disabled={currentPage() === totalPages}
        aria-label="Next Page"
      >
        Next
      </button>
    </nav>
  );
}


function DeckList() {
  const [searchTerm, setSearchTerm] = createSignal('');
  const [allDecks, setAllDecks] = createSignal(initialDecks); // TODO: Fetch
  const [currentPage, setCurrentPage] = createSignal(1);

  const filteredDecks = () => {
    const lowerSearchTerm = searchTerm().toLowerCase();
    return allDecks().filter(deck =>
      deck.name.toLowerCase().includes(lowerSearchTerm)
    );
  };

  const totalPages = () => Math.ceil(filteredDecks().length / ITEMS_PER_PAGE);

  const paginatedDecks = () => {
    const start = (currentPage() - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredDecks().slice(start, end);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: trigger a new fetch or filter
    console.log("Searching for:", searchTerm());
    setCurrentPage(1); // Reset to first page on new search
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
        <button class={styles.createNewDeckButton}>
          Create New Deck +
        </button>
      </div>

      <div class={styles.deckGrid}>
        <For each={paginatedDecks()} fallback={<p class={styles.noDecksMessage}>No decks found.</p>}>
          {(deck) => <DeckCard deck={deck} />}
        </For>
      </div>

      {totalPages() > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages()}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

export default DeckList;