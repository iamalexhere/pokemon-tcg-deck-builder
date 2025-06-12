import styles from './cardlists.module.css';
import { A } from "@solidjs/router";
import { createSignal, Switch, Match, For, createEffect, createResource, Show, createMemo } from "solid-js";
import Pagination from '../components/Pagination';
import { useNavigate } from "@solidjs/router";
import PLACEHOLDER_IMAGE from "../assets/images/placeholder.jpg";
import { getCards } from '../services/cardService';
import { BsSearch } from 'solid-icons/bs';

const SearchIcon = BsSearch;

// Komponen untuk menampilkan pesan error dari API.
function ErrorDisplay({ error }) {
  return (
    <div class={styles.errorContainer}>
      <h3>Error Loading Cards</h3>
      <p>{error?.message || 'An unknown error occurred'}</p>
      <p>Please try again later or contact support if the problem persists.</p>
    </div>
  );
}

// Komponen untuk menampilkan status loading.
function LoadingDisplay() {
  return (
    <div class={styles.loadingContainer}>
      <div class={styles.spinner}></div>
      <p>Loading Pokémon cards...</p>
    </div>
  );
}

function Header() {
    return (
        <div class={styles.header}>
            <h1 style={{color: "white"}}>Card List</h1>
            <p style={{color: "white"}}>Explore and manage your Pokémon collection 
                through a beautifully designed desktop experience. Navigate rich 
                visuals and intuitive menus as you browse different regions, track 
                your favorite Pokémon, and dive into detailed stats and evolutions. 
                Discover type matchups, compare base stats, and build your ultimate 
                dream team. Whether you're researching legendary Pokémon or exploring 
                the full Pokédex, the site offers smooth interaction and immersive 
                design built for fans. Jump into the world of Pokémon and start your 
                journey today!</p>
        </div>
    )
}

function SearchBar({ searchTerm, setSearchTerm, handleSearch, isSearching }) {
    return (
        <form class={styles.searchContainer} onSubmit={handleSearch}>
            <input 
                type="text" 
                placeholder="Search pokemon cards..."
                class={`${styles.searchInput} ${isSearching() ? styles.searching : ''}`}
                value={searchTerm()}
                onInput={(e) => setSearchTerm(e.currentTarget.value)}
            />
            <button type="submit" class={styles.searchButton} aria-label="Search">
                {isSearching() ? (
                    <div class={styles.smallSpinner}></div>
                ) : (
                    <SearchIcon />
                )}
            </button>
        </form>
    );
}

function Card({ card }) {
    const navigate = useNavigate();
    
    // Handler untuk navigasi ke halaman detail kartu saat kartu di-klik.
    const handleCardClick = () => {
        navigate(`/card-details/${card.id}`);
    };
    
    return (
        <div class={styles.card} onClick={handleCardClick}>
            <img 
                src={card.images?.small || PLACEHOLDER_IMAGE} 
                alt={card.name} 
                class={styles.cardImage} 
            />
            <div class={styles.cardInfo}>
                <h3 class={styles.cardName}>{card.name}</h3>
                <div class={styles.cardMeta}>
                    {card.types && <span class={styles.cardType}>{card.types.join(', ')}</span>}
                    {card.rarity && <span class={styles.cardRarity}>{card.rarity}</span>}
                </div>
            </div>
        </div>
    );
}

function CardGrid({ cards }) {
    return (
        <div class={styles.cardGrid}>
            <For each={cards()} fallback={<p class={styles.noCardsMessage}>No cards found.</p>}>
                {(card) => <Card card={card} />}
            </For>
        </div>
    );
}



function ListCards() {
    // State management untuk istilah pencarian dan halaman saat ini
    const [searchTerm, setSearchTerm] = createSignal('');
    const [currentPage, setCurrentPage] = createSignal(1);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = createSignal('');
    const [isSearching, setIsSearching] = createSignal(false);
    const ITEMS_PER_PAGE = 50;
    const DEBOUNCE_DELAY = 300; // milliseconds
    
    // Debounce istilah pencarian untuk menghindari pemfilteran yang berlebihan
    createEffect(() => {
        const searchValue = searchTerm();
        
        if (searchValue !== debouncedSearchTerm()) {
            setIsSearching(true);
        }
        
        const timeoutId = setTimeout(() => {
            setDebouncedSearchTerm(searchValue);
            setIsSearching(false);
        }, DEBOUNCE_DELAY);
        
        // Cleanup timeout if searchTerm changes before timeout expires
        return () => clearTimeout(timeoutId);
    });

    // `createResource` untuk mengambil semua kartu sekali
    const [cardsData] = createResource(getCards);

    const allCards = () => cardsData()?.data || [];

    // State turunan (derived state) untuk memfilter kartu berdasarkan `debouncedSearchTerm`
    const filteredCards = createMemo(() => {
        const term = debouncedSearchTerm().trim().toLowerCase();
        if (!term) {
            return allCards();
        }
        return allCards().filter(card =>
            card.name.toLowerCase().includes(term)
        );
    });

    // Kembali ke halaman pertama ketika istilah pencarian berubah
    createEffect(() => {
        debouncedSearchTerm(); 
        setCurrentPage(1);
    });

    const totalPages = createMemo(() => Math.ceil(filteredCards().length / ITEMS_PER_PAGE));

    // Kartu yang dipaginasi berdasarkan halaman saat ini
    const paginatedCards = createMemo(() => {
        const startIndex = (currentPage() - 1) * ITEMS_PER_PAGE;
        return filteredCards().slice(startIndex, startIndex + ITEMS_PER_PAGE);
    });

    // Handler untuk form pencarian.
    const handleSearch = (e) => {
        e.preventDefault();
    };

    // Handler untuk mengubah halaman.
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div class={styles.listContainer}>
            {/* Menampilkan komponen error jika ada masalah saat mengambil data. */}
            <Show when={cardsData.error}>
                <ErrorDisplay error={cardsData.error} />
            </Show>
            
            <SearchBar 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm} 
                handleSearch={handleSearch} 
                isSearching={isSearching}
            />
            
            {/* Rendering kondisional: tampilkan loading atau konten (daftar kartu). */}
            <Show when={!cardsData.loading} fallback={<LoadingDisplay />}>
                <Show when={!cardsData.error}>
                    <div class={styles.resultsInfo}>
                        {debouncedSearchTerm()
                            ? `Search results for "${debouncedSearchTerm()}"` 
                            : 'All Pokémon Cards'}
                        <span class={styles.cardCount}>
                            {filteredCards().length} cards found
                        </span>
                    </div>
                    
                    <CardGrid 
                        cards={paginatedCards}
                    />
                    
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

function CardLists() {
    return(
        <div class={styles.container}>
            <Header/>
            <ListCards/>
        </div>
    )
}

export default CardLists;