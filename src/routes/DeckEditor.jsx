import { createSignal, createEffect, Switch, onMount } from 'solid-js';
import { useNavigate, useParams } from '@solidjs/router';
import { RiArrowsArrowGoBackLine } from 'solid-icons/ri';
import { AiFillHeart, AiOutlineHeart, AiOutlineSearch  } from 'solid-icons/ai'
import { FaRegularTrashCan } from 'solid-icons/fa';

import styles from './deckeditor.module.css';
import PLACEHOLDER_IMAGE from "../assets/images/placeholder.jpg";

function DeckEditor() {
    // Get the deck ID from the URL parameter
    const params = useParams();
    const deckId = params.deckId;
    
    // State management for the deck
    const [deckName, setDeckName] = createSignal('Untitled Deck');
    const [deckNameInput, setDeckNameInput] = createSignal('Untitled Deck');
    const [deckCards, setDeckCards] = createSignal([]);
    const [selectedCard, setSelectedCard] = createSignal(null);
    const [searchResults, setSearchResults] = createSignal([]);
    const [searchQuery, setSearchQuery] = createSignal('');
    const [currentPage, setCurrentPage] = createSignal(1);
    const [favoriteDeck, setFavoriteDeck] = createSignal(false);
    const [isLoading, setIsLoading] = createSignal(true);
    const [error, setError] = createSignal(null);
    const cardsPerPage = 12;
    const navigate = useNavigate();

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
            image: PLACEHOLDER_IMAGE,
            type: i % 3 === 0 ? 'Fire' : i % 3 === 1 ? 'Water' : 'Grass',
            release: 2020 + i,
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
        if (deckNameInput().trim() === "") {
            setError("Deck name cannot be empty.");
            return;
        }

        // Update deck name
        setDeckName(deckNameInput());

        // In a real app, this would save to a database
        // For now, we'll just log it and simulate a save
        console.log('Saving deck:', { 
            id: deckId,
            name: deckName(), 
            cards: deckCards(),
            isFavorite: favoriteDeck()
        });
        
        // Update the mock database (in a real app, this would be an API call)
        mockDecks[deckId] = {
            id: deckId,
            name: deckName(),
            cards: deckCards(),
            isFavorite: favoriteDeck()
        };
        
        alert('Deck saved successfully!');
        navigate('/decklist');
    };

    // Delete deck
    const deleteDeck = () => {
        if (confirm('Are you sure you want to delete this deck?')) {
            // In a real app, this would delete from a database
            console.log(`Deleting deck with ID ${deckId}`);
            
            // Delete from mock database (in a real app, this would be an API call)
            delete mockDecks[deckId];
            
            // Navigate back to deck list
            navigate('/decklist', {replace: true});
        }
    };

    // Add to favorites
    const toggleFavorite = () => {
        // TODO: Add/remove from favorites in database

        if (favoriteDeck()) {
            setFavoriteDeck(false)
        } else {
            setFavoriteDeck(true)
        }

        console.log('Deck added to favorites');
    };

    // Mock database of decks
    const mockDecks = {
        '1': {
            id: '1',
            name: 'Fire Starter Deck',
            isFavorite: true,
            cards: Array(15).fill().map((_, i) => ({
                id: `fire-card-${i}`,
                name: `Fire Pokemon ${i}`,
                image: PLACEHOLDER_IMAGE,
                type: 'Fire',
                release: 2020 + i % 5,
                subType: i % 3 === 0 ? 'Basic' : 'Evolution',
                abilities: [
                    { name: `Flame ${i}`, description: 'Deals 30 damage to the opponent.' },
                    { name: `Heat Wave ${i}`, description: 'Deals 50 damage to the opponent and 10 damage to each benched Pokemon.' }
                ]
            }))
        },
        '2': {
            id: '2',
            name: 'Water Starter Deck',
            isFavorite: false,
            cards: Array(12).fill().map((_, i) => ({
                id: `water-card-${i}`,
                name: `Water Pokemon ${i}`,
                image: PLACEHOLDER_IMAGE,
                type: 'Water',
                release: 2019 + i % 5,
                subType: i % 4 === 0 ? 'Basic' : 'Evolution',
                abilities: [
                    { name: `Splash ${i}`, description: 'Deals 20 damage to the opponent.' },
                    { name: `Hydro Pump ${i}`, description: 'Deals 40 damage plus 10 more damage for each Water Energy attached to this Pokemon.' }
                ]
            }))
        },
        '3': {
            id: '3',
            name: 'Grass Starter Deck',
            isFavorite: false,
            cards: Array(18).fill().map((_, i) => ({
                id: `grass-card-${i}`,
                name: `Grass Pokemon ${i}`,
                image: PLACEHOLDER_IMAGE,
                type: 'Grass',
                release: 2021 + i % 3,
                subType: i % 2 === 0 ? 'Basic' : 'Evolution',
                abilities: [
                    { name: `Vine Whip ${i}`, description: 'Deals 30 damage to the opponent.' },
                    { name: `Solar Beam ${i}`, description: 'Deals 70 damage to the opponent.' }
                ]
            }))
        }
    };
    
    // Function to load deck data based on ID
    const loadDeckData = () => {
        setIsLoading(true);
        setError(null);
        
        try {
            // Simulate API call delay
            setTimeout(() => {
                // Check if deck exists in mock database
                if (mockDecks[deckId]) {
                    const deck = mockDecks[deckId];
                    setDeckName(deck.name);
                    setDeckNameInput(deck.name);
                    setDeckCards(deck.cards);
                    setFavoriteDeck(deck.isFavorite);
                    console.log(`Loaded deck ${deckId}: ${deck.name}`);
                } else {
                    // Create a new deck if ID doesn't exist
                    setDeckName(`New Deck ${deckId}`);
                    setDeckNameInput(`New Deck ${deckId}`);
                    setDeckCards([]);
                    setFavoriteDeck(false);
                    console.log(`Created new deck with ID ${deckId}`);
                }
                setIsLoading(false);
            }, 500);
        } catch (err) {
            setError('Failed to load deck data');
            setIsLoading(false);
            console.error('Error loading deck:', err);
        }
    };
    
    // Load deck data when component mounts or deckId changes
    onMount(() => {
        loadDeckData();
        fetchCards('');
    });
    
    createEffect(() => {
        // This will re-run when deckId changes
        if (params.deckId && params.deckId !== deckId) {
            loadDeckData();
        }
    });

  return (
    <div class={styles.mainContainer}>
      {/* Loading State */}
      {isLoading() && (
        <div class={styles.loadingContainer}>
          <div class={styles.loadingSpinner}></div>
          <p>Loading deck data...</p>
        </div>
      )}

      {/* Error State */}
      {error() && !isLoading() && (
        <div class={styles.errorContainer}>
          <p class={styles.errorMessage}>{error()}</p>
          <button 
            class={styles.retryButton}
            onClick={loadDeckData}
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Content - Only show when not loading and no errors */}
      {!isLoading() && !error() && (
        <div class={styles.deckEditorContent}>
          <div class={styles.topBar}>

            <button 
                class={styles.backButton}
                onClick={() => navigate('/decklist')}
            >
                <RiArrowsArrowGoBackLine />
            </button>

            {/* Deck's name input */}
            <input 
                type="text" 
                value={deckName()} 
                onInput={(e) => setDeckNameInput(e.target.value)}
                class={styles.deckNameInput}
            />

            {/* Action Button */}   
            <div class={styles.actionButtons}>

                <button class={styles.saveButton} onClick={saveDeck}>SAVE</button>

                <button class={styles.cancelButton} onClick={() => navigate('/decklist')}>CANCEL</button>

                <button class={styles.favoriteButton} onClick={toggleFavorite}>
                    {favoriteDeck() ? <AiFillHeart /> : <AiOutlineHeart />}
                </button>

                <button class={styles.removeButton} onClick={deleteDeck}>
                    <FaRegularTrashCan />
                </button>

            </div>
      </div>

      <div class={styles.subContainer}>

            {/* Card Detail Container */}
            <div class={styles.cardDetailContainer}>

                <h2>Card's Details</h2>

                <Switch>
                    
                    <Match when={selectedCard()}>
                        <>
                            <div class={styles.cardImageContainer}>
                                <img src={selectedCard().image || PLACEHOLDER_IMAGE} alt={selectedCard().name} />
                            </div>

                            <div class={styles.cardInfo}>
                                <h3>{selectedCard().name}</h3>
                                <p class={styles.releaseDate}><b>Release:</b> {selectedCard().release}</p>
                                <p class={styles.cardType}><b>Type:</b> {selectedCard().type}</p>
                                <p class={styles.cardSubtype}><b>Sub-type:</b> {selectedCard().subType}</p>

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
                    </Match>

                    <Match when={!selectedCard()}>
                        <div class={styles.noCardSelected}>
                            <p>Select a card to view details</p>
                        </div>
                    </Match>

                </Switch>

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
                            <img src={card.image || PLACEHOLDER_IMAGE} alt={card.name} />
                        </div>
                    ))}
                    
                    {/* EMPTY CARD PLACEHOLDER */}
                    {/* {Array(maxCards - deckCards().length).fill().map(() => (
                        <div class={`${styles.deckCard} ${styles.empty}`}>
                            <div class={styles.cardPlaceholder}></div>
                        </div>
                    ))} */}

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
                        <AiOutlineSearch />
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
                        <img src={card.image || PLACEHOLDER_IMAGE} alt={card.name} />
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
      )}
    </div>
  );
}

export default DeckEditor;