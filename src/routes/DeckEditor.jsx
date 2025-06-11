import { createSignal, createEffect, Switch, Match, For, onMount, createResource } from 'solid-js';
import { useNavigate, useParams } from '@solidjs/router';
import { RiArrowsArrowGoBackLine } from 'solid-icons/ri';
import { AiFillHeart, AiOutlineHeart, AiOutlineSearch, AiOutlineMinusCircle, AiOutlinePlusCircle } from 'solid-icons/ai';
import { FaRegularTrashCan } from 'solid-icons/fa';

import styles from './deckeditor.module.css';
import PLACEHOLDER_IMAGE from "../assets/images/placeholder.jpg";

import {
  getDeckById,
  updateDeck,
  deleteDeck,
  addRemoveFavoriteDeck,
  addCardToDeck as addCardToDeckApi, // Renamed to avoid conflict with local function
  removeCardFromDeck as removeCardFromDeckApi, // Renamed
  updateCardCountInDeck
} from '../services/deckService';

import {
  getCards,
  getCardById as getCardDetailsById // Renamed
} from '../services/cardService';

const MAX_DECK_CARDS = 60;
const MAX_IDENTICAL_CARDS = 4; // Max 4 copies of a non-basic energy card

function DeckEditor() {
  const navigate = useNavigate();
  const params = useParams();
  const deckId = () => parseInt(params.deckId); // Ensure deckId is always a number

  // Deck State
  const [deckName, setDeckName] = createSignal('');
  const [deckNameInput, setDeckNameInput] = createSignal('');
  const [deckCards, setDeckCards] = createSignal([]); // Stores { id: 'card-id', count: N, details: { ...fullCardObject } }
  const [favoriteDeck, setFavoriteDeck] = createSignal(false);

  // UI State
  const [selectedCardDetails, setSelectedCardDetails] = createSignal(null); // Full details of the card clicked in either deck or search results
  const [isLoadingDeck, setIsLoadingDeck] = createSignal(true);
  const [isSaving, setIsSaving] = createSignal(false);
  const [deckError, setDeckError] = createSignal(null);
  const [message, setMessage] = createSignal(''); // For success/info/warning messages
  const [messageType, setMessageType] = createSignal(''); // 'success', 'info', 'warning', 'error'

  // Card Search State
  const [searchQuery, setSearchQuery] = createSignal('');
  const [searchPage, setSearchPage] = createSignal(1);
  const [searchTotalPages, setSearchTotalPages] = createSignal(1);
  const CARDS_PER_SEARCH_PAGE = 12; // Number of cards to show in search results

  // --- Utility Functions ---
  const showMessage = (msg, type = 'info', duration = 3000) => {
    setMessage(msg);
    setMessageType(type);
    if (duration > 0) {
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, duration);
    }
  };

  // --- Data Fetching (Resources) ---

  // Resource for fetching all cards for searching
  const [allCardsData] = createResource(getCards);

  const filteredCards = () => {
    const allCards = allCardsData()?.data || [];
    const term = searchQuery().trim().toLowerCase();
    if (!term) {
        return allCards;
    }
    return allCards.filter(card => 
        card.name.toLowerCase().includes(term)
    );
  };

  const paginatedSearchResults = () => {
    const cards = filteredCards();
    const startIndex = (searchPage() - 1) * CARDS_PER_SEARCH_PAGE;
    const paginated = cards.slice(startIndex, startIndex + CARDS_PER_SEARCH_PAGE);
    setSearchTotalPages(Math.ceil(cards.length / CARDS_PER_SEARCH_PAGE));
    return paginated;
  };

  // --- Deck Data Loading ---
  onMount(() => {
    // Initial load of deck data
    loadDeckData();
  });

  // Effect to re-load deck data if deckId changes (e.g., navigating from /deckeditor/1 to /deckeditor/2)
  createEffect(() => {
    const currentRouteDeckId = parseInt(params.deckId);
    if (currentRouteDeckId && currentRouteDeckId !== deckId()) {
      loadDeckData();
      // Reset search when navigating to a new deck
      setSearchQuery('');
      setSearchPage(1);
    }
  });

  const loadDeckData = async () => {
    setIsLoadingDeck(true);
    setDeckError(null);
    try {
      const data = await getDeckById(deckId(), true); // Fetch with full card details
      setDeckName(data.name);
      setDeckNameInput(data.name);
      setDeckCards(data.cards || []);
      setFavoriteDeck(data.favorite);
      showMessage('Deck loaded successfully.', 'success');
    } catch (err) {
      console.error("Error loading deck:", err);
      if (err.message.includes('Deck not found')) {
        // If deck doesn't exist, assume it's a new deck
        setDeckName(`New Deck ${deckId()}`);
        setDeckNameInput(`New Deck ${deckId()}`);
        setDeckCards([]);
        setFavoriteDeck(false);
        showMessage('Creating a new deck.', 'info');
      } else {
        setDeckError(err.message || 'Failed to load deck data.');
      }
    } finally {
      setIsLoadingDeck(false);
    }
  };

  // --- Search Handlers ---
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Search is reactive, this just prevents form submission
    setSearchPage(1);
  };

  // --- Card Management Functions ---

  // Handles displaying full details of a card
  const displayCardDetails = async (card) => {
    if (!card.details) {
      // If card doesn't have full details (e.g., from search results which are partial)
      setIsSaving(true);
      try {
        const fullDetails = await getCardDetailsById(card.id);
        setSelectedCardDetails(fullDetails.data); // API wraps data in 'data' key
      } catch (err) {
        console.error("Error fetching card details:", err);
        showMessage(err.message || "Failed to fetch card details.", 'error');
      } finally {
        setIsSaving(false);
      }
    } else {
      setSelectedCardDetails(card.details);
    }
  };

  const addCardToDeck = async (card) => {
    // Check if card is already in the deck
    const existingCard = deckCards().find(dc => dc.id === card.id);
    const currentTotalCards = deckCards().reduce((sum, c) => sum + c.count, 0);

    if (currentTotalCards >= MAX_DECK_CARDS) {
      showMessage(`Deck is full! Maximum ${MAX_DECK_CARDS} cards allowed.`, 'warning');
      return;
    }

    let newCount = 1;
    if (existingCard) {
      newCount = existingCard.count + 1;
      if (newCount > MAX_IDENTICAL_CARDS) {
        showMessage(`Cannot add more than ${MAX_IDENTICAL_CARDS} copies of a card to the deck.`, 'warning');
        return;
      }
    }

    setIsSaving(true);
    try {
      await addCardToDeckApi(deckId(), card.id, newCount);
      // Update local state with the new card or updated count
      setDeckCards(prev => {
        if (existingCard) {
          return prev.map(c => c.id === card.id ? { ...c, count: newCount } : c);
        } else {
          // Add with full details for display
          return [...prev, { id: card.id, count: newCount, details: card }];
        }
      });
      showMessage(`Added ${card.name} to deck.`, 'success', 2000);
    } catch (err) {
      console.error("Error adding card to deck:", err);
      showMessage(err.message || "Failed to add card to deck.", 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const removeCardFromDeck = async (cardIdToRemove) => {
    setIsSaving(true);
    try {
      await removeCardFromDeckApi(deckId(), cardIdToRemove);
      setDeckCards(prev => prev.filter(card => card.id !== cardIdToRemove));
      // If the removed card was the one whose details are currently displayed, clear it
      if (selectedCardDetails()?.id === cardIdToRemove) {
        setSelectedCardDetails(null);
      }
      showMessage('Card removed from deck.', 'success', 2000);
    } catch (err) {
      console.error("Error removing card from deck:", err);
      showMessage(err.message || "Failed to remove card from deck.", 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const updateCardCount = async (cardIdToUpdate, newCount) => {
    if (newCount < 1 || newCount > MAX_IDENTICAL_CARDS) {
      showMessage(`Card count must be between 1 and ${MAX_IDENTICAL_CARDS}.`, 'warning');
      return;
    }

    setIsSaving(true);
    try {
      await updateCardCountInDeck(deckId(), cardIdToUpdate, newCount);
      setDeckCards(prev =>
        prev.map(c => (c.id === cardIdToUpdate ? { ...c, count: newCount } : c))
      );
      showMessage('Card count updated.', 'success', 2000);
    } catch (err) {
      console.error("Error updating card count:", err);
      showMessage(err.message || "Failed to update card count.", 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // --- Deck Actions ---

  const handleSaveDeck = async () => {
    if (deckNameInput().trim() === '') {
      showMessage('Deck name cannot be empty.', 'warning');
      return;
    }
    setIsSaving(true);
    try {
      // Prepare cards data for the API (only id and count needed)
      const cardsForApi = deckCards().map(card => ({ id: card.id, count: card.count }));
      await updateDeck(deckId(), {
        name: deckNameInput(),
        imageUrl: '', // Assuming image is handled separately or not editable here
        cards: cardsForApi
      });
      setDeckName(deckNameInput()); // Update displayed name if save is successful
      showMessage('Deck saved successfully!', 'success');
      // No navigation, stay on editor to allow more changes
    } catch (err) {
      console.error("Error saving deck:", err);
      showMessage(err.message || "Failed to save deck. Please try again.", 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDeck = async () => {
    // Replace with a custom modal confirmation
    if (!window.confirm('Are you sure you want to delete this deck? This action cannot be undone.')) {
      return;
    }
    setIsSaving(true);
    try {
      await deleteDeck(deckId());
      showMessage('Deck deleted successfully!', 'success');
      navigate('/decklist', { replace: true });
    } catch (err) {
      console.error("Error deleting deck:", err);
      showMessage(err.message || "Failed to delete deck.", 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleFavorite = async () => {
    setIsSaving(true);
    try {
      const newFavoriteStatus = !favoriteDeck();
      await addRemoveFavoriteDeck(deckId(), newFavoriteStatus);
      setFavoriteDeck(newFavoriteStatus);
      showMessage(`Deck ${newFavoriteStatus ? 'added to' : 'removed from'} favorites!`, 'success', 2000);
    } catch (err) {
      console.error("Error toggling favorite status:", err);
      showMessage(err.message || "Failed to update favorite status.", 'error');
    } finally {
      setIsSaving(false);
    }
    
  };

  const totalDeckCardCount = () => deckCards().reduce((sum, card) => sum + card.count, 0);

  return (
    <div class={styles.mainContainer}>
      {/* Global Message Display */}
      {message() && (
        <div class={`${styles.messageBox} ${styles[messageType()]}`}>
          {message()}
        </div>
      )}

      {/* Loading State for initial deck load */}
      <Show when={isLoadingDeck()} fallback={
        <Show when={!deckError()} fallback={
          <div class={styles.errorContainer}>
            <p class={styles.errorMessage}>{deckError()}</p>
            <button
              class={styles.retryButton}
              onClick={loadDeckData}
            >
              Retry Loading Deck
            </button>
          </div>
        }>
          {/* Main Content - Only show when not loading and no errors */}
          <div class={styles.deckEditorContent}>
            <div class={styles.topBar}>
              <button
                class={styles.backButton}
                onClick={() => navigate('/decklist')}
              >
                <RiArrowsArrowGoBackLine />
              </button>

              <input
                type="text"
                value={deckNameInput()}
                onInput={(e) => setDeckNameInput(e.target.value)}
                class={styles.deckNameInput}
                disabled={isSaving()}
              />

              <div class={styles.actionButtons}>
                <button class={styles.saveButton} onClick={handleSaveDeck} disabled={isSaving()}>
                  {isSaving() ? 'SAVING...' : 'SAVE'}
                </button>
                <button class={styles.cancelButton} onClick={() => navigate('/decklist')} disabled={isSaving()}>
                  CANCEL
                </button>
                <button class={styles.favoriteButton} onClick={handleToggleFavorite} disabled={isSaving()}>
                  {favoriteDeck() ? <AiFillHeart /> : <AiOutlineHeart />}
                </button>
                <button class={styles.removeButton} onClick={handleDeleteDeck} disabled={isSaving()}>
                  <FaRegularTrashCan />
                </button>
              </div>
            </div>

            <div class={styles.subContainer}>
              {/* Card Detail Container */}
              <div class={styles.cardDetailContainer}>
                <h2>Card's Details</h2>
                <Switch fallback={
                  <div class={styles.noCardSelected}>
                    <p>Select a card to view details</p>
                  </div>
                }>
                  <Match when={selectedCardDetails()}>
                    <div class={styles.cardImageContainer}>
                      <img src={selectedCardDetails().images?.large || selectedCardDetails().images?.small || PLACEHOLDER_IMAGE} alt={selectedCardDetails().name} />
                    </div>
                    <div class={styles.cardInfo}>
                      <h3>{selectedCardDetails().name}</h3>
                      <p><b>HP:</b> {selectedCardDetails().hp || 'N/A'}</p>
                      <p><b>Type:</b> {selectedCardDetails().types?.join(', ') || 'N/A'}</p>
                      <p><b>Supertype:</b> {selectedCardDetails().supertype || 'N/A'}</p>
                      <p><b>Subtype:</b> {selectedCardDetails().subtypes?.join(', ') || 'N/A'}</p>
                      <p><b>Rarity:</b> {selectedCardDetails().rarity || 'N/A'}</p>

                      <For each={selectedCardDetails().abilities}>
                        {(ability, index) => (
                          <>
                            <p class={styles.abilityName}>Ability {index() + 1}: {ability.name}</p>
                            <div class={styles.abilityDescription}>
                              {ability.text}
                            </div>
                          </>
                        )}
                      </For>
                      <For each={selectedCardDetails().attacks}>
                        {(attack, index) => (
                          <>
                            <p class={styles.abilityName}>Attack {index() + 1}: {attack.name} ({attack.cost?.join(', ') || 'None'})</p>
                            <div class={styles.abilityDescription}>
                              {attack.text} {attack.damage && `Damage: ${attack.damage}`}
                            </div>
                          </>
                        )}
                      </For>
                      <p><b>Weakness:</b> {selectedCardDetails().weaknesses?.map(w => `${w.type} ${w.value}`).join(', ') || 'N/A'}</p>
                      <p><b>Resistance:</b> {selectedCardDetails().resistances?.map(r => `${r.type} ${r.value}`).join(', ') || 'N/A'}</p>
                      <p><b>Retreat Cost:</b> {selectedCardDetails().retreatCost?.length || 0}</p>
                      <p><b>Artist:</b> {selectedCardDetails().artist || 'N/A'}</p>
                    </div>
                  </Match>
                </Switch>
              </div>

              {/* Card Deck Container */}
              <div class={styles.cardDeckContainer}>
                <div class={styles.deckHeader}>
                  <h2>Deck's Cards</h2>
                  <span class={styles.cardCount}>
                    {totalDeckCardCount()}/{MAX_DECK_CARDS} Cards
                  </span>
                </div>

                <div class={styles.deckGrid}>
                  <For each={deckCards()}>
                    {(card) => (
                      <div class={styles.deckCard}>
                        <img
                          src={card.details?.images?.small || PLACEHOLDER_IMAGE}
                          alt={card.details?.name || 'Card'}
                          onClick={() => displayCardDetails(card.details)}
                          onDblClick={() => removeCardFromDeck(card.id)}
                        />
                        <div class={styles.cardQuantityControls}>
                          <span class={styles.cardQuantity}>{card.count}x</span>
                          <button
                            class={styles.quantityButton}
                            onClick={() => updateCardCount(card.id, card.count - 1)}
                            disabled={card.count <= 1 || isSaving()}
                          >
                            <AiOutlineMinusCircle />
                          </button>
                          <button
                            class={styles.quantityButton}
                            onClick={() => updateCardCount(card.id, card.count + 1)}
                            disabled={card.count >= MAX_IDENTICAL_CARDS || isSaving()}
                          >
                            <AiOutlinePlusCircle />
                          </button>
                        </div>
                      </div>
                    )}
                  </For>
                  {/* Empty card placeholders if needed, but usually not visible with dynamic grid */}
                  {/* {Array(MAX_DECK_CARDS - totalDeckCardCount()).fill().map(() => (
                      <div class={`${styles.deckCard} ${styles.empty}`}>
                          <div class={styles.cardPlaceholder}></div>
                      </div>
                  ))} */}
                </div>
              </div>

              {/* Card Search Container */}
              <div class={styles.cardSearchContainer}>
                <h2>Search for Cards</h2>
                <form onSubmit={handleSearchSubmit} class={styles.searchForm}>
                  <input
                    type="text"
                    placeholder="Search Pokémon cards..."
                    value={searchQuery()}
                    onInput={(e) => setSearchQuery(e.target.value)}
                    class={styles.searchInput}
                    disabled={isSaving()}
                  />
                  <button type="submit" class={styles.searchButton} disabled={isSaving()}>
                    <AiOutlineSearch />
                  </button>
                </form>

                <Show when={!allCardsData.loading} fallback={
                  <div class={styles.loadingContainer}>
                    <div class={styles.loadingSpinner}></div>
                    <p>Searching cards...</p>
                  </div>
                }>
                  <div class={styles.searchResults}>
                    <For each={paginatedSearchResults()} fallback={
                      <p class={styles.noCardSelected}>No cards found.</p>
                    }>
                      {(card) => (
                        <div
                          class={styles.searchCard}
                          onClick={() => displayCardDetails(card)}
                          onDblClick={() => addCardToDeck(card)}
                        >
                          <img src={card.images?.small || PLACEHOLDER_IMAGE} alt={card.name} />
                        </div>
                      )}
                    </For>
                  </div>

                  {/* Search Pagination */}
                  <div class={styles.pagination}>
                    <button
                      onClick={() => handleSearchPageChange(searchPage() - 1)}
                      disabled={searchPage() === 1 || isSaving()}
                      class={styles.paginationButton}
                    >
                      &lt;
                    </button>
                    <For each={Array(searchTotalPages()).fill()}>
                      {(_, i) => (
                        <button
                          class={searchPage() === i + 1 ? `${styles.paginationButton} ${styles.active}` : styles.paginationButton}
                          onClick={() => handleSearchPageChange(i + 1)}
                          disabled={isSaving()}
                        >
                          {i + 1}
                        </button>
                      )}
                    </For>
                    <button
                      onClick={() => handleSearchPageChange(searchPage() + 1)}
                      disabled={searchPage() === searchTotalPages() || isSaving()}
                      class={styles.paginationButton}
                    >
                      &gt;
                    </button>
                  </div>
                </Show>
              </div>
            </div>
          </div>
        </Show>
      }>
        {/* Initial loading spinner for the whole page */}
        <div class={styles.loadingContainer}>
          <div class={styles.loadingSpinner}></div>
          <p>Loading deck editor...</p>
        </div>
      </Show>
    </div>
  );
}

export default DeckEditor;