import styles from './cardlists.module.css';
import { A } from "@solidjs/router";
import { createSignal, Switch, Match, For, createEffect, createResource, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import PLACEHOLDER_IMAGE from "../assets/images/placeholder.jpg";
import { getCards, searchCards } from '../services/cardService';

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
            <p style={{color: "white"}}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has 
                been the industry's standard dummy text ever since the 1500s, when an unknown printer 
                took a galley of type and scrambled it to make a type specimen book.</p>
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

function Pagination({ currentPage, totalPages, onPageChange }) {
    // Function to generate the page numbers to display (only 5 at a time)
    const getPageNumbers = () => {
        const current = currentPage();
        const total = totalPages();
        const pages = [];
        
        // Always show 5 pages or less if totalPages < 5
        let startPage = Math.max(1, current - 2);
        let endPage = Math.min(total, startPage + 4);
        
        // Adjust if we're near the end
        if (endPage - startPage < 4 && total > 5) {
            startPage = Math.max(1, endPage - 4);
        }
        
        // Generate the array of page numbers
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        
        return pages;
    };
    
    return (
        <div class={styles.pagination}>
            {/* First page button */}
            <button 
                class={styles.paginationBtn}
                onClick={() => onPageChange(1)}
                disabled={currentPage() === 1}
                title="First Page"
            >
                &lt;&lt;
            </button>
            
            {/* Previous page button */}
            <button 
                class={styles.paginationBtn}
                onClick={() => onPageChange(currentPage() - 1)}
                disabled={currentPage() === 1}
                title="Previous Page"
            >
                &lt;
            </button>
            
            {/* Page number buttons - only show 5 at a time */}
            <For each={getPageNumbers()}>
                {(page) => (
                    <button 
                        class={`${styles.paginationBtn} ${currentPage() === page ? styles.active : ''}`}
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </button>
                )}
            </For>
            
            {/* Next page button */}
            <button 
                class={styles.paginationBtn}
                onClick={() => onPageChange(currentPage() + 1)}
                disabled={currentPage() === totalPages()}
                title="Next Page"
            >
                &gt;
            </button>
            
            {/* Last page button */}
            <button 
                class={styles.paginationBtn}
                onClick={() => onPageChange(totalPages())}
                disabled={currentPage() === totalPages()}
                title="Last Page"
            >
                &gt;&gt;
            </button>
        </div>
    );
}

function ListCards() {
    const [searchTerm, setSearchTerm] = createSignal('');
    const [currentPage, setCurrentPage] = createSignal(1);
    const [isSearching, setIsSearching] = createSignal(false);
    const [searchParams, setSearchParams] = createSignal({});
    const ITEMS_PER_PAGE = 50;
    
    // Fetch cards from API based on current page
    const fetchCards = async ([page, isSearch, params]) => {
        try {
            let result;
            if (isSearch) {
                // If searching, use search endpoint
                result = await searchCards({
                    ...params,
                    page,
                    pageSize: ITEMS_PER_PAGE
                });
            } else {
                // Otherwise get all cards with pagination
                result = await getCards(page, ITEMS_PER_PAGE);
            }
            
            // Debug server response structure
            console.log('Server response:', result);
            console.log('Page:', page);
            console.log('Total pages:', result.totalPages);
            console.log('Card count:', result.count);
            
            return result;
        } catch (error) {
            console.error('Error fetching cards:', error);
            throw error;
        }
    };
    
    // Create a resource for fetching cards
    const [cardsData, { refetch, mutate }] = createResource(
        () => [currentPage(), isSearching(), searchParams()],
        fetchCards
    );
    
    // Handle search form submission
    const handleSearch = (e) => {
        e.preventDefault();
        const term = searchTerm().trim();
        
        // Reset to page 1 when searching
        setCurrentPage(1);
        
        if (term) {
            // Set search parameters based on the search term
            setSearchParams({ name: term });
            setIsSearching(true);
        } else {
            // If search term is empty, show all cards
            setIsSearching(false);
            setSearchParams({});
        }
        
        console.log("Searching for:", term);
    };
    
    // Handle page change
    const handlePageChange = (page) => {
        console.log('Page changed to:', page);
        setCurrentPage(page);
    };
    
    // Calculate total pages based on API response
    const totalPages = () => {
        if (!cardsData()) {
            return 1;
        }
        // Server returns totalPages directly in the response
        return cardsData().totalPages || 1;
    };
    
    // Get cards from the API response
    const cards = () => {
        if (!cardsData() || !cardsData().data) {
            return [];
        }
        return cardsData().data;
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
                        {isSearching() && searchTerm() 
                            ? `Search results for "${searchTerm()}"` 
                            : 'All Pokémon Cards'}
                        {cardsData() && cardsData().count && (
                            <span class={styles.cardCount}>
                                {cardsData().count} cards found
                            </span>
                        )}
                    </div>
                    
                    <CardGrid 
                        cards={cards}
                    />
                    
                    <Pagination 
                        currentPage={currentPage} 
                        totalPages={totalPages} 
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