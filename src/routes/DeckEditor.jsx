import { createSignal, createEffect } from 'solid-js';
import styles from './deckEditor.module.css';

function DeckEditor() {
    // State management for the deck
    const [deckName, setDeckName] = createSignal('Untitled Deck');
    const [deckCards, setDeckCards] = createSignal([]);
    const [selectedCard, setSelectedCard] = createSignal(null);
    const [searchResults, setSearchResults] = createSignal([]);
    const [searchQuery, setSearchQuery] = createSignal('');
    const [currentPage, setCurrentPage] = createSignal(1);
    const cardsPerPage = 12;

    // Maximum number of cards in a deck
    const maxCards = 60;

  // TODO: Fetch cards from API or database
    const fetchCards = async (query) => {
        // This would be replaced with actual API call
        console.log('Searching for:', query);
        // Mock data for demonstration
        const mockResults = Array(20).fill().map((_, i) => ({
        id: `card-${i}`,
        name: `Pokemon ${i}`,
        image: '/placeholder.svg',
        type: i % 3 === 0 ? 'Fire' : i % 3 === 1 ? 'Water' : 'Grass',
        subType: 'Basic',
        abilities: [
            { name: `Ability ${i}`, description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
            { name: `Ability ${i+1}`, description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' }
        ]
        }));
        setSearchResults(mockResults);
    };

    // Handle search input
    const handleSearch = (e) => {
        e.preventDefault();
        fetchCards(searchQuery());
    };

    // Add card to deck
    const addCardToDeck = (card) => {
        if (deckCards().length < maxCards) {
            setDeckCards([...deckCards(), card]);
        } else {
            alert('Deck is full! Maximum 60 cards allowed.');
        }
    };

    // Remove card from deck
    const removeCardFromDeck = (cardId) => {
        setDeckCards(deckCards().filter(card => card.id !== cardId));
    };

    // Save deck
    const saveDeck = () => {
        // TODO: Save deck to database
        console.log('Saving deck:', {
            name: deckName(),
            cards: deckCards()
        });
        alert('Deck saved successfully!');
    };

    // Delete deck
    const deleteDeck = () => {
        if (confirm('Are you sure you want to delete this deck?')) {
            // TODO: Delete deck from database
            console.log('Deleting deck');
            setDeckCards([]);
            setDeckName('Untitled Deck');
        }
    };

    // Add to favorites
    const toggleFavorite = () => {
        // TODO: Add/remove from favorites in database
        console.log('Deck added to favorites');
    };

    // Initialize with some search results
    createEffect(() => {
        fetchCards('');
    });

  return (
    <div class={styles.mainContainer}>

      <div class={styles.topBar}>

            <button class={styles.backButton}>
                <i class={styles.icon}>←</i>
            </button>

            {/* Deck's name input */}
            <input 
                type="text" 
                value={deckName()} 
                onInput={(e) => setDeckName(e.target.value)}
                class={styles.deckNameInput}
            />

            {/* Action Button */}
            <div class={styles.actionButtons}>

                <button class={styles.saveButton} onClick={saveDeck}>SAVE</button>

                <button class={styles.cancelButton} onClick={() => window.history.back()}>CANCEL</button>

                <button class={styles.favoriteButton} onClick={toggleFavorite}>
                    <i class={styles.icon}>♥</i>
                </button>

                <button class={styles.removeButton} onClick={deleteDeck}>
                    <i class={styles.icon}>🗑</i>
                </button>

            </div>
      </div>

      <div class={styles.subContainer}>

            {/* Card Detail Container */}
            <div class={styles.cardDetailContainer}>

                <h2>Card's Details</h2>

                {/* Cards detail using ternary operator. TODO: change to <Switch> */}
                {selectedCard() ? (
                    <>
                    <div class={styles.cardImageContainer}>
                        <img src={selectedCard().image || "/placeholder.svg"} alt={selectedCard().name} />
                    </div>

                    <div class={styles.cardInfo}>
                        <h3>{selectedCard().name}</h3>
                        <p class={styles.releaseDate}>Release: 2023</p>
                        <p class={styles.cardType}>Type: {selectedCard().type}</p>
                        <p class={styles.cardSubtype}>Sub-type: {selectedCard().subType}</p>
                        
                        {selectedCard().abilities.map((ability, index) => (
                        <>
                            <p class={styles.abilityName}>Ability {index + 1}</p>
                            <div class={styles.abilityDescription}>
                            {ability.description}
                            </div>
                        </>
                        ))}
                    </div>
                    </>
                ) : (
                    <div class={styles.noCardSelected}>
                        <p>Select a card to view details</p>
                    </div>
                )}

            </div>

            {/* Card Deck Container */}
            <div class={styles.cardDeckContainer}>

                <div class={styles.deckHeader}>
                    <h2>Deck's Cards</h2>
                    <span class={styles.cardCount}>{deckCards().length}/{maxCards} Cards</span>
                </div>

                <div class={styles.deckGrid}>
                    {deckCards().map(card => (
                        <div 
                            class={styles.deckCard} 
                            onClick={() => setSelectedCard(card)}
                            onDblClick={() => removeCardFromDeck(card.id)}
                        >
                            <img src={card.image || "/placeholder.svg"} alt={card.name} />
                        </div>
                    ))}

                    {Array(maxCards - deckCards().length).fill().map(() => (
                        <div class={`${styles.deckCard} ${styles.empty}`}>
                            <div class={styles.cardPlaceholder}></div>
                        </div>
                    ))}

                </div>

            </div>

            {/* Card Search Container */}
            <div class={styles.cardSearchContainer}>

                <h2>Search for Cards</h2>
                
                {/* Search input */}
                <form onSubmit={handleSearch} class={styles.searchForm}>
                    <input 
                        type="text" 
                        placeholder="Search pokemon cards..." 
                        value={searchQuery()} 
                        onInput={(e) => setSearchQuery(e.target.value)}
                        class={styles.searchInput}
                    />

                    <button type="submit" class={styles.searchButton}>
                        <i class={styles.icon}>🔍</i>
                    </button>
                </form>
                
                {/* Search results */}
                <div class={styles.searchResults}>
                    {searchResults().slice((currentPage() - 1) * cardsPerPage, currentPage() * cardsPerPage).map(card => (
                    <div 
                        class={styles.searchCard} 
                        onClick={() => setSelectedCard(card)}
                        onDblClick={() => addCardToDeck(card)}
                    >
                        <img src={card.image || "/placeholder.svg"} alt={card.name} />
                    </div>
                    ))}
                </div>
                
                {/* Pagination */}
                <div class={styles.pagination}>
                    <button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage() === 1}
                        class={styles.paginationButton}
                    >
                        &lt;
                    </button>

                    {[...Array(Math.ceil(searchResults().length / cardsPerPage))].map((_, i) => (
                        <button 
                            class={currentPage() === i + 1 ? `${styles.paginationButton} ${styles.active}` : styles.paginationButton}
                            onClick={() => setCurrentPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button 
                        onClick={() => setCurrentPage(p => Math.min(Math.ceil(searchResults().length / cardsPerPage), p + 1))}
                        disabled={currentPage() === Math.ceil(searchResults().length / cardsPerPage)}
                        class={styles.paginationButton}
                    >
                        &gt;
                    </button>
                </div>

            </div>

      </div>

    </div>
  );
}

export default DeckEditor;