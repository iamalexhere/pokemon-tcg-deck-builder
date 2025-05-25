import { createSignal, createEffect, Switch, For } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { RiArrowsArrowGoBackLine } from 'solid-icons/ri';
import { AiFillHeart, AiOutlineHeart, AiOutlineSearch } from 'solid-icons/ai';
import { FaRegularTrashCan } from 'solid-icons/fa';

import styles from './deckEditor.module.css';
import PLACEHOLDER_IMAGE from "../assets/images/placeholder.jpg"; //

function DeckEditor() {
    // State management for the deck
    const [deckName, setDeckName] = createSignal('Untitled Deck');
    const [deckNameInput, setDeckNameInput] = createSignal('Untitled Deck');
    const [deckCards, setDeckCards] = createSignal([]);
    const [selectedCard, setSelectedCard] = createSignal(null);
    const [searchResults, setSearchResults] = createSignal([]);
    const [searchQuery, setSearchQuery] = createSignal(''); // For the input field
    const [submittedQuery, setSubmittedQuery] = createSignal(''); // For triggering API calls
    const [currentPage, setCurrentPage] = createSignal(1);
    const [totalCount, setTotalCount] = createSignal(0); // Total cards available from API for current query
    const [favoriteDeck, setFavoriteDeck] = createSignal(false);
    const [draggedCard, setDraggedCard] = createSignal(null);
    const [error, setError] = createSignal('');
    const [loading, setLoading] = createSignal(false); // For loading indicator

    const cardsPerPage = 12;
    const navigate = useNavigate();
    const maxCards = 60;

    const API_BASE_URL = 'https://api.pokemontcg.io/v2/cards';
    // const API_KEY = 'YOUR_API_KEY'; // Optional: Add your API key here if you have one

    // Fetch cards from Pokémon TCG API
    const fetchCards = async (query, page) => {
        setLoading(true);
        setError('');
        setSearchResults([]); // Clear previous results

        let apiUrl = `${API_BASE_URL}?page=${page}&pageSize=${cardsPerPage}&orderBy=name`; // Sort by name for consistency

        if (query && query.trim() !== "") {
            // Sanitize query for API: API expects Lucene syntax, e.g. name:"Pikachu*"
            // For simplicity, we'll search by name. Adjust if more complex queries are needed.
            apiUrl += `&q=name:"${query.trim()}*"`;
        }

        try {
            const headers = {
                // 'X-Api-Key': API_KEY // Uncomment if using an API key
            };
            const response = await fetch(apiUrl, { headers });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || `API Error: ${response.status}`);
            }

            const data = await response.json();

            const mappedResults = data.data.map(apiCard => ({
                id: apiCard.id, // API provides unique ID
                name: apiCard.name,
                image: apiCard.images?.small || PLACEHOLDER_IMAGE,
                type: apiCard.types?.join(', ') || 'N/A',
                release: apiCard.set?.releaseDate || 'N/A',
                subType: apiCard.subtypes?.join(', ') || 'N/A',
                abilities: apiCard.abilities?.map(ability => ({
                    name: ability.name,
                    description: ability.text || 'No description available.',
                    type: ability.type
                })) || [],
                // Additional details for selected card view
                rarity: apiCard.rarity || '',
                flavorText: apiCard.flavorText || '',
                set: {
                    id: apiCard.set?.id,
                    name: apiCard.set?.name || 'N/A',
                    series: apiCard.set?.series || 'N/A',
                    printedTotal: apiCard.set?.printedTotal,
                    total: apiCard.set?.total,
                    releaseDate: apiCard.set?.releaseDate,
                    updatedAt: apiCard.set?.updatedAt,
                    images: {
                        symbol: apiCard.set?.images?.symbol,
                        logo: apiCard.set?.images?.logo,
                    }
                },
                attacks: apiCard.attacks?.map(attack => ({
                    name: attack.name,
                    cost: attack.cost?.join(', '),
                    convertedEnergyCost: attack.convertedEnergyCost,
                    damage: attack.damage,
                    text: attack.text
                })) || [],
                weaknesses: apiCard.weaknesses?.map(w => `${w.type} ${w.value}`).join(', ') || 'N/A',
                resistances: apiCard.resistances?.map(r => `${r.type} ${r.value}`).join(', ') || 'N/A',
                retreatCost: apiCard.retreatCost?.join(', ') || 'N/A',
                artist: apiCard.artist || '',
                number: apiCard.number || '',
                hp: apiCard.hp || '',
            }));

            setSearchResults(mappedResults);
            setTotalCount(data.totalCount || 0);
            if (data.data.length === 0 && query.trim() !== "") {
                setError(`No cards found for "${query.trim()}".`);
            }

        } catch (err) {
            console.error('Failed to fetch cards:', err);
            setError(err.message || 'Failed to fetch cards. Please try again.');
            setSearchResults([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    };

    // Effect for fetching data when currentPage or submittedQuery changes
    createEffect(() => {
        fetchCards(submittedQuery(), currentPage());
    });
    
    // Handle search form submission
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setCurrentPage(1); // Reset to first page for new search
        setSubmittedQuery(searchQuery()); // This will trigger the createEffect above
    };


    // Add card to deck
    const addCardToDeck = (card) => {
        if (deckCards().length < maxCards) {
            // Create a unique ID for the card instance within the deck
            const cardInDeckId = `deck-${card.id}-${Date.now()}`;
            setDeckCards([...deckCards(), { ...card, deckId: cardInDeckId }]);
        } else {
            alert('Deck is full! Maximum 60 cards allowed.');
        }
    };

    // Remove card from deck
    const removeCardFromDeck = (cardDeckIdToRemove) => {
        setDeckCards(deckCards().filter(card => card.deckId !== cardDeckIdToRemove));
        if (selectedCard() && selectedCard().deckId === cardDeckIdToRemove) {
            setSelectedCard(null);
        }
    };

    // Save deck
    const saveDeck = () => {
        if (deckNameInput().trim() === "") {
            setError("Deck name cannot be empty.");
            return;
        }
        setError('');
        setDeckName(deckNameInput());
        console.log('Saving deck:', { name: deckName(), cards: deckCards() });
        alert('Deck saved successfully!');
        // navigate('/decklist'); // Make sure '/decklist' route exists
    };

    // Delete deck
    const deleteDeck = () => {
        if (confirm('Are you sure you want to delete this deck?')) {
            console.log('Deleting deck');
            setDeckCards([]);
            setDeckName('Untitled Deck');
            setDeckNameInput('Untitled Deck');
            setFavoriteDeck(false);
            setSelectedCard(null);
            // navigate('/decklist', { replace: true });
        }
    };

    // Toggle favorite
    const toggleFavorite = () => {
        setFavoriteDeck(!favoriteDeck());
        console.log('Favorite status:', !favoriteDeck());
    };

    // Drag and Drop handlers
    const handleDragStart = (e, card, fromDeck = false) => {
        setDraggedCard({ ...card, fromDeck });
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDropOnDeck = (e) => {
        e.preventDefault();
        const card = draggedCard();
        if (card && !card.fromDeck) {
            addCardToDeck(card);
        }
        setDraggedCard(null);
    };

    const handleDropOnSearch = (e) => {
        e.preventDefault();
        const card = draggedCard();
        if (card && card.fromDeck) {
            removeCardFromDeck(card.deckId);
        }
        setDraggedCard(null);
    };

    const totalPages = () => Math.ceil(totalCount() / cardsPerPage);

    return (
        <div class={styles.mainContainer}>
            <div class={styles.topBar}>
                <button
                    class={styles.backButton}
                    onClick={() => navigate('/')}
                >
                    <RiArrowsArrowGoBackLine />
                </button>
                <input
                    type="text"
                    value={deckNameInput()}
                    onInput={(e) => setDeckNameInput(e.target.value)}
                    class={styles.deckNameInput}
                    placeholder="Enter Deck Name"
                />
                <div class={styles.actionButtons}>
                    <button class={styles.saveButton} onClick={saveDeck}>SAVE</button>
                    <button class={styles.cancelButton} onClick={() => navigate('/')}>CANCEL</button>
                    <button class={styles.favoriteButton} onClick={toggleFavorite}>
                        {favoriteDeck() ? <AiFillHeart /> : <AiOutlineHeart />}
                    </button>
                    <button class={styles.removeButton} onClick={deleteDeck}>
                        <FaRegularTrashCan />
                    </button>
                </div>
            </div>

            {error() && <div class={styles.errorMessage}>{error()}</div>}
            {loading() && <div class={styles.loadingMessage}>Loading cards...</div>}


            <div class={styles.subContainer}>
                {/* Card Detail Container */}
                <div class={styles.cardDetailContainer}>
                    <h2>Card Details</h2>
                    <Switch>
                        <Match when={selectedCard()}>
                            <div class={styles.cardImageContainer}>
                                <img src={selectedCard().image || PLACEHOLDER_IMAGE} alt={selectedCard().name} />
                            </div>
                            <div class={styles.cardInfo}>
                                <h3>{selectedCard().name} ({selectedCard().id})</h3>
                                <p><b>HP:</b> {selectedCard().hp}</p>
                                <p><b>Type:</b> {selectedCard().type}</p>
                                <p><b>Subtype:</b> {selectedCard().subType}</p>
                                <p><b>Rarity:</b> {selectedCard().rarity}</p>
                                <p><b>Set:</b> {selectedCard().set?.name} ({selectedCard().set?.id})</p>
                                <p><b>Number:</b> {selectedCard().number} / {selectedCard().set?.printedTotal}</p>
                                <p><b>Release Date:</b> {selectedCard().release}</p>
                                <p><b>Artist:</b> {selectedCard().artist}</p>
                                {selectedCard().flavorText && <p><i>{selectedCard().flavorText}</i></p>}

                                {selectedCard().abilities && selectedCard().abilities.length > 0 && (
                                    <>
                                        <h4>Abilities:</h4>
                                        <For each={selectedCard().abilities}>
                                            {(ability, index) => (
                                                <div class={styles.abilityDescription}>
                                                    <strong>{ability.name} ({ability.type})</strong>
                                                    <p>{ability.description}</p>
                                                </div>
                                            )}
                                        </For>
                                    </>
                                )}

                                {selectedCard().attacks && selectedCard().attacks.length > 0 && (
                                     <>
                                        <h4>Attacks:</h4>
                                        <For each={selectedCard().attacks}>
                                            {(attack) => (
                                                <div class={styles.abilityDescription}> {/* Re-use style or create new */}
                                                    <strong>{attack.name}</strong>
                                                    <p>Cost: {attack.cost} | Damage: {attack.damage}</p>
                                                    <p>{attack.text}</p>
                                                </div>
                                            )}
                                        </For>
                                    </>
                                )}
                                <p><b>Weaknesses:</b> {selectedCard().weaknesses}</p>
                                <p><b>Resistances:</b> {selectedCard().resistances}</p>
                                <p><b>Retreat Cost:</b> {selectedCard().retreatCost}</p>
                            </div>
                        </Match>
                        <Match when={!selectedCard()}>
                            <div class={styles.noCardSelected}>
                                <p>Select a card to view details.</p>
                            </div>
                        </Match>
                    </Switch>
                </div>

                {/* Card Deck Container - Drop Zone */}
                <div
                    class={styles.cardDeckContainer}
                    onDragOver={handleDragOver}
                    onDrop={handleDropOnDeck}
                >
                    <div class={styles.deckHeader}>
                        <h2>Deck ({deckCards().length}/{maxCards} Cards)</h2>
                        <p>Drag or Double-Click cards from search to the deck area.</p>
                    </div>
                    <div class={styles.deckGrid}>
                        <For each={deckCards()}>
                            {(card) => (
                                <div
                                    class={styles.deckCard}
                                    onClick={() => setSelectedCard(card)}
                                    onDblClick={() => removeCardFromDeck(card.deckId)}
                                    draggable="true"
                                    onDragStart={(e) => handleDragStart(e, card, true)}
                                >
                                    <img src={card.image || PLACEHOLDER_IMAGE} alt={card.name} />
                                </div>
                            )}
                        </For>
                         {/* Placeholder for empty slots - Optional visual */}
                        {Array(Math.max(0, 60 - deckCards().length)).fill(0).map(() => (
                            <div class={`${styles.deckCard} ${styles.emptyDeckSlot}`}></div>
                        ))}
                    </div>
                </div>

                {/* Card Search Container - Drag Source and Drop Zone for removal */}
                <div
                    class={styles.cardSearchContainer}
                    onDragOver={handleDragOver}
                    onDrop={handleDropOnSearch}
                >
                    <h2>Search Cards</h2>
                    <form onSubmit={handleSearchSubmit} class={styles.searchForm}>
                        <input
                            type="text"
                            placeholder="Charizard, Blastoise, etc."
                            value={searchQuery()}
                            onInput={(e) => setSearchQuery(e.target.value)}
                            class={styles.searchInput}
                        />
                        <button type="submit" class={styles.searchButton} disabled={loading()}>
                            {loading() ? '...' : <AiOutlineSearch />}
                        </button>
                    </form>
                     <div class={styles.dragToRemoveHint}>Drag or Double-Click cards to add or remove.</div>
                    <div class={styles.searchResults}>
                        <For each={searchResults()}>
                            {(card) => (
                                <div
                                    class={styles.searchCard}
                                    onClick={() => setSelectedCard(card)}
                                    onDblClick={() => addCardToDeck(card)}
                                    draggable="true"
                                    onDragStart={(e) => handleDragStart(e, card, false)}
                                >
                                    <img src={card.image || PLACEHOLDER_IMAGE} alt={card.name} />
                                </div>
                            )}
                        </For>
                    </div>
                    <div class={styles.pagination}>
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage() === 1 || loading()}
                            class={styles.paginationButton}
                        >
                            &lt;
                        </button>
                        <span>Page {currentPage()} of {totalPages() > 0 ? totalPages() : 1}</span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages(), p + 1))}
                            disabled={currentPage() === totalPages() || totalPages() === 0 || loading()}
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