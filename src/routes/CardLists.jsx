import styles from './cardlists.module.css';
import { A } from "@solidjs/router";
import { createSignal, Switch, Match, For, createEffect, createResource, Show } from "solid-js";
import Pagination from '../components/Pagination';
import { useNavigate } from "@solidjs/router";
import PLACEHOLDER_IMAGE from "../assets/images/placeholder.jpg";
import { getCards } from '../services/cardService';

// Search Icon component
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
  </svg>
);

// Error component for displaying API errors
function ErrorDisplay({ error }) {
  return (
    <div class={styles.errorContainer}>
      <h3>Error Loading Cards</h3>
      <p>{error?.message || 'An unknown error occurred'}</p>
      <p>Please try again later or contact support if the problem persists.</p>
    </div>
  );
}

// Loading component for displaying loading state
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

function SearchBar({ searchTerm, setSearchTerm, handleSearch }) {
    return (
        <form class={styles.searchContainer} onSubmit={handleSearch}>
            <input 
                type="text" 
                placeholder="Search pokemon cards..."
                class={styles.searchInput}
                value={searchTerm()}
                onInput={(e) => setSearchTerm(e.currentTarget.value)}
            />
            <button type="submit" class={styles.searchButton} aria-label="Search">
                <SearchIcon />
            </button>
        </form>
    );
}

function Card({ card }) {
    const navigate = useNavigate();
    
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
    const [searchTerm, setSearchTerm] = createSignal('');
    const [currentPage, setCurrentPage] = createSignal(1);
    const ITEMS_PER_PAGE = 50;

    // Fetch all cards once
    const [cardsData] = createResource(getCards);

    const allCards = () => cardsData()?.data || [];

    // Filter cards based on search term
    const filteredCards = () => {
        const term = searchTerm().trim().toLowerCase();
        if (!term) {
            return allCards();
        }
        return allCards().filter(card =>
            card.name.toLowerCase().includes(term)
        );
    };

    // Reset to page 1 when search term changes
    createEffect(() => {
        searchTerm(); // re-run when searchTerm changes
        setCurrentPage(1);
    });

    const totalPages = () => Math.ceil(filteredCards().length / ITEMS_PER_PAGE);

    const paginatedCards = () => {
        const startIndex = (currentPage() - 1) * ITEMS_PER_PAGE;
        return filteredCards().slice(startIndex, startIndex + ITEMS_PER_PAGE);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        // Search is reactive, this just prevents form submission
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div class={styles.listContainer}>
            {/* Display error at the top if present */}
            <Show when={cardsData.error}>
                <ErrorDisplay error={cardsData.error} />
            </Show>
            
            <SearchBar 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm} 
                handleSearch={handleSearch} 
            />
            
            <Show when={!cardsData.loading} fallback={<LoadingDisplay />}>
                <Show when={!cardsData.error}>
                    <div class={styles.resultsInfo}>
                        {searchTerm()
                            ? `Search results for "${searchTerm()}"` 
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