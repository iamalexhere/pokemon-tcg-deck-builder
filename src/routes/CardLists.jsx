import styles from './cardlists.module.css';
import { A } from "@solidjs/router";
import { createSignal, Switch, Match, For, createEffect } from "solid-js";
import { useNavigate } from "@solidjs/router";
import PLACEHOLDER_IMAGE from "../assets/images/placeholder.jpg";

// Search Icon component
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
  </svg>
);

// Sample card data with static details
const mockCards = [
  {
    id: 'card-1',
    name: 'Pokemon 1',
    image: PLACEHOLDER_IMAGE,
    type: 'Fire'
  },
  {
    id: 'card-2',
    name: 'Pokemon 2',
    image: PLACEHOLDER_IMAGE,
    type: 'Water'
  },
  {
    id: 'card-3',
    name: 'Pokemon 3',
    image: PLACEHOLDER_IMAGE,
    type: 'Grass'
  },
  {
    id: 'card-4',
    name: 'Pokemon 4',
    image: PLACEHOLDER_IMAGE,
    type: 'Electric'
  },
  {
    id: 'card-5',
    name: 'Pokemon 5',
    image: PLACEHOLDER_IMAGE,
    type: 'Psychic'
  },
  {
    id: 'card-6',
    name: 'Pokemon 6',
    image: PLACEHOLDER_IMAGE,
    type: 'Normal'
  }
];

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
                src={card.image || PLACEHOLDER_IMAGE} 
                alt={card.name} 
                class={styles.cardImage} 
            />
        </div>
    );
}

function CardGrid({ filteredCards, currentPage, itemsPerPage }) {
    // Calculate paginated cards
    const paginatedCards = () => {
        const start = (currentPage() - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return filteredCards().slice(start, end);
    };
    
    return (
        <div class={styles.cardGrid}>
            <For each={paginatedCards()} fallback={<p class={styles.noCardsMessage}>No cards found.</p>}>
                {(card) => <Card card={card} />}
            </For>
        </div>
    );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
    return (
        <div class={styles.pagination}>
            <button 
                class={styles.paginationBtn}
                onClick={() => onPageChange(currentPage() - 1)}
                disabled={currentPage() === 1}
            >
                &lt;
            </button>
            
            <For each={Array.from({ length: totalPages() }, (_, i) => i + 1)}>
                {(page) => (
                    <button 
                        class={`${styles.paginationBtn} ${currentPage() === page ? styles.active : ''}`}
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </button>
                )}
            </For>
            
            <button 
                class={styles.paginationBtn}
                onClick={() => onPageChange(currentPage() + 1)}
                disabled={currentPage() === totalPages()}
            >
                &gt;
            </button>
        </div>
    );
}

function ListCards() {
    const [searchTerm, setSearchTerm] = createSignal('');
    const [currentPage, setCurrentPage] = createSignal(1);
    const [allCards, setAllCards] = createSignal([]);
    const ITEMS_PER_PAGE = 10;
    
    // Initialize cards from mock data
    createEffect(() => {
        // Generate 30 cards by repeating the mock cards but keeping original IDs
        const generatedCards = Array.from({ length: 30 }, (_, i) => {
            // Use modulo to cycle through the 6 mock cards
            const index = i % mockCards.length;
            // Return the original mock card without modifying the ID
            return mockCards[index];
        });
        setAllCards(generatedCards);
    });
    
    // Filter cards based on search term
    const filteredCards = () => {
        const lowerSearchTerm = searchTerm().toLowerCase();
        
        // If search term is empty, return all cards
        if (!lowerSearchTerm) {
            return allCards();
        }
        
        // Filter cards by name or type
        const filtered = allCards().filter(card => 
            card.name.toLowerCase().includes(lowerSearchTerm) || 
            card.type.toLowerCase().includes(lowerSearchTerm)
        );
        
        // Reset to first page if current page becomes invalid due to filtering
        const newTotalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
        if (currentPage() > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
        } else if (newTotalPages === 0 && filtered.length === 0) {
            if (currentPage() > 1) setCurrentPage(1);
        }
        
        return filtered;
    };
    
    // Calculate total pages based on filtered cards
    const totalPages = () => Math.ceil(filteredCards().length / ITEMS_PER_PAGE);
    
    // Handle search form submission
    const handleSearch = (e) => {
        e.preventDefault();
        // Reset to page 1 when searching
        setCurrentPage(1);
        console.log("Searching for:", searchTerm());
    };
    
    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    
    return (
        <div class={styles.listContainer}>
            <SearchBar 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm} 
                handleSearch={handleSearch} 
            />
            <CardGrid 
                filteredCards={filteredCards} 
                currentPage={currentPage} 
                itemsPerPage={ITEMS_PER_PAGE} 
            />
            <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={handlePageChange} 
            />
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