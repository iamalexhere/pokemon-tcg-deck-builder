import styles from './cardlists.module.css';
import { A } from "@solidjs/router";
import { createSignal, Switch, Match, For } from "solid-js";
import { useNavigate } from "@solidjs/router";

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

function Card({ index }) {
    return (
        <div class={styles.card}>
            <div class={styles.cardPlaceholder}>
                <div class={styles.crossLine1}></div>
                <div class={styles.crossLine2}></div>
            </div>
        </div>
    );
}

function CardGrid() {
    // Generate 30 cards for 3 rows of 10 cards each
    const cards = Array.from({ length: 30 }, (_, i) => i);
    
    return (
        <div class={styles.cardGrid}>
            <For each={cards}>
                {(cardIndex) => <Card index={cardIndex} />}
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