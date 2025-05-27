import styles from './cardlists.module.css';
import { A } from "@solidjs/router";
import { createSignal, Switch, Match, For, createEffect } from "solid-js";
import { useNavigate } from "@solidjs/router";
import PLACEHOLDER_IMAGE from "../assets/images/placeholder.jpg";

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

function SearchBar() {
    const [searchTerm, setSearchTerm] = createSignal('');
    
    return (
        <div class={styles.searchContainer}>
            <input 
                type="text" 
                placeholder="Search pokemon cards"
                class={styles.searchInput}
                value={searchTerm()}
                onInput={(e) => setSearchTerm(e.target.value)}
            />
            <button class={styles.searchButton}>🔍</button>
        </div>
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

function CardGrid() {
    // Create signal for cards with pagination
    const [cards, setCards] = createSignal([]);
    
    // Initialize cards from mock data
    createEffect(() => {
        // Generate 30 cards by repeating the mock cards but keeping original IDs
        const generatedCards = Array.from({ length: 30 }, (_, i) => {
            // Use modulo to cycle through the 6 mock cards
            const index = i % mockCards.length;
            // Return the original mock card without modifying the ID
            return mockCards[index];
        });
        setCards(generatedCards);
    });
    
    return (
        <div class={styles.cardGrid}>
            <For each={cards()} fallback={<p>Loading cards...</p>}>
                {(card) => <Card card={card} />}
            </For>
        </div>
    );
}

function Pagination() {
    const [currentPage, setCurrentPage] = createSignal(1);
    const totalPages = 5;
    
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    
    return (
        <div class={styles.pagination}>
            <button 
                class={styles.paginationBtn}
                onClick={() => goToPage(currentPage() - 1)}
                disabled={currentPage() === 1}
            >
                &lt;
            </button>
            
            <For each={Array.from({ length: totalPages }, (_, i) => i + 1)}>
                {(page) => (
                    <button 
                        class={`${styles.paginationBtn} ${currentPage() === page ? styles.active : ''}`}
                        onClick={() => goToPage(page)}
                    >
                        {page}
                    </button>
                )}
            </For>
            
            <button 
                class={styles.paginationBtn}
                onClick={() => goToPage(currentPage() + 1)}
                disabled={currentPage() === totalPages}
            >
                &gt;
            </button>
        </div>
    );
}

function ListCards() {
    return (
        <div class={styles.listContainer}>
            <SearchBar />
            <CardGrid />
            <Pagination />
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