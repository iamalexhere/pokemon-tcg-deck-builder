import { createSignal, createEffect, Switch, Match, For, onMount, createResource, Show } from 'solid-js';
import { useNavigate, useParams } from '@solidjs/router';
import { RiArrowsArrowGoBackLine } from 'solid-icons/ri';
import { AiFillHeart, AiOutlineHeart, AiOutlineMinusCircle, AiOutlinePlusCircle } from 'solid-icons/ai';
import { FaRegularTrashCan } from 'solid-icons/fa';
import { BsSearch } from 'solid-icons/bs';

import styles from './deckeditor.module.css';
import cardDetailStyles from './carddetail.module.css'; 
import Pagination from '../components/Pagination';
import PLACEHOLDER_IMAGE from "../assets/images/placeholder.jpg";

import {
  getDeckById,
  updateDeck,
  deleteDeck,
  addRemoveFavoriteDeck,
  addCardToDeck as addCardToDeckApi,
  removeCardFromDeck as removeCardFromDeckApi,
  updateCardCountInDeck
} from '../services/deckService';

import {
  getCards,
  getCardById as getCardDetailsById
} from '../services/cardService';

const MAX_DECK_CARDS = 60;
const MAX_IDENTICAL_CARDS = 4;

function DeckEditor() {
  const navigate = useNavigate();
  // Mengambil `deckId` dari parameter URL.
  const params = useParams();
  const deckId = () => parseInt(params.deckId);

  // State Management untuk Data Deck.
  const [deckName, setDeckName] = createSignal('');
  const [deckNameInput, setDeckNameInput] = createSignal('');
  const [deckCards, setDeckCards] = createSignal([]);
  const [favoriteDeck, setFavoriteDeck] = createSignal(false);

  // State Management untuk UI.
  const [selectedCardDetails, setSelectedCardDetails] = createSignal(null);
  const [isLoadingDeck, setIsLoadingDeck] = createSignal(true);
  const [isSaving, setIsSaving] = createSignal(false);
  const [deckError, setDeckError] = createSignal(null);
  const [message, setMessage] = createSignal('');
  const [messageType, setMessageType] = createSignal('');

  // State Management untuk Pencarian Kartu.
  const [searchQuery, setSearchQuery] = createSignal('');
  const [searchPage, setSearchPage] = createSignal(1);
  const [totalSearchPages, setTotalSearchPages] = createSignal(1); // Add signal for total pages
  const CARDS_PER_SEARCH_PAGE = 12;

  // State Management untuk Drag and Drop.
  const [draggedCard, setDraggedCard] = createSignal(null);
  const [isDraggingOver, setIsDraggingOver] = createSignal(false);

  // Fungsi utilitas untuk menampilkan notifikasi.
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

  // `createResource` untuk mengambil semua kartu dari API untuk fitur pencarian.
  const [allCardsData] = createResource(getCards);

  // State turunan (derived state) untuk memfilter kartu berdasarkan `searchQuery`.
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

  // Update totalSearchPages setiap kali filteredCards berubah.
  createEffect(() => {
    const cards = filteredCards();
    const total = Math.ceil(cards.length / CARDS_PER_SEARCH_PAGE);
    setTotalSearchPages(total > 0 ? total : 1);
  });

  // State turunan untuk paginasi hasil pencarian kartu.
  const paginatedSearchResults = () => {
    const cards = filteredCards();
    const startIndex = (searchPage() - 1) * CARDS_PER_SEARCH_PAGE;
    return cards.slice(startIndex, startIndex + CARDS_PER_SEARCH_PAGE);
  };
  
  // Efek untuk mereset halaman ke halaman pertama setiap kali searchQuery berubah
  createEffect(() => {
    searchQuery(); // Memicu efek ketika searchQuery berubah
    setSearchPage(1);
  });
  
  // Efek untuk memastikan halaman saat ini valid berdasarkan total halaman
  createEffect(() => {
    const total = totalSearchPages();
    if (searchPage() > total && total > 0) {
      setSearchPage(1); // Reset to first page if current page is beyond total
    }
  });

  // Memuat data deck saat komponen pertama kali di-mount.
  onMount(() => {
    loadDeckData();
  });

  // Efek untuk memuat ulang data deck jika `deckId` di URL berubah.
  createEffect(() => {
    const currentRouteDeckId = parseInt(params.deckId);
    if (currentRouteDeckId && currentRouteDeckId !== deckId()) {
      loadDeckData();
      setSearchQuery('');
      setSearchPage(1);
    }
  });

  // Fungsi untuk memuat data deck dari API.
  const loadDeckData = async () => {
    setIsLoadingDeck(true);
    setDeckError(null);
    try {
      const data = await getDeckById(deckId(), true);
      setDeckName(data.name);
      setDeckNameInput(data.name);
      setDeckCards(data.cards || []);
      setFavoriteDeck(data.favorite);
      showMessage('Deck loaded successfully.', 'success');
    } catch (err) { // Error handling jika deck tidak ditemukan (mode membuat deck baru).
      console.error("Error loading deck:", err);
      if (err.message.includes('Deck not found')) {
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

  // Handler untuk form pencarian.
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Memastikan halaman pencarian di-reset ke 1 saat melakukan pencarian baru.
    setSearchPage(1);
  };

  // Fungsi untuk menampilkan detail kartu yang dipilih.
  const displayCardDetails = async (card) => {
    if (!card.details) {
      setIsSaving(true);
      try {
        const fullDetails = await getCardDetailsById(card.id);
        setSelectedCardDetails(fullDetails.data);
      } catch (err) { // Error handling saat fetch detail kartu.
        console.error("Error fetching card details:", err);
        showMessage(err.message || "Failed to fetch card details.", 'error');
      } finally {
        setIsSaving(false);
      }
    } else {
      setSelectedCardDetails(card.details);
    }
  };

  // Fungsi untuk menambahkan kartu ke dalam deck.
  const addCardToDeck = async (card) => {
    const existingCard = deckCards().find(dc => dc.id === card.id);
    const currentTotalCards = deckCards().reduce((sum, c) => sum + c.count, 0);

    // Validasi jumlah total kartu dalam deck.
    if (currentTotalCards >= MAX_DECK_CARDS) {
      showMessage(`Deck is full! Maximum ${MAX_DECK_CARDS} cards allowed.`, 'warning');
      return;
    }

    let newCount = 1;
    if (existingCard) {
      newCount = existingCard.count + 1;
      // Skip identical cards validation for Energy cards, otherwise apply the limit
      const isEnergyCard = card.details && card.details.supertype === 'Energy';
      if (!isEnergyCard && newCount > MAX_IDENTICAL_CARDS) {
        showMessage(`Cannot add more than ${MAX_IDENTICAL_CARDS} copies of a card to the deck.`, 'warning');
        return;
      }
    }

    setIsSaving(true);
    try {
      await addCardToDeckApi(deckId(), card.id, newCount);
      // Memperbarui state `deckCards` secara lokal untuk responsivitas UI.
      setDeckCards(prev => {
        if (existingCard) {
          return prev.map(c => c.id === card.id ? { ...c, count: newCount } : c);
        } else {
          return [...prev, { id: card.id, count: newCount, details: card }];
        }
      });
      showMessage(`Added ${card.name} to deck.`, 'success', 2000);
    } catch (err) { // Error handling saat menambahkan kartu.
      console.error("Error adding card to deck:", err);
      showMessage(err.message || "Failed to add card to deck.", 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Fungsi untuk menghapus kartu dari deck.
  const removeCardFromDeck = async (cardIdToRemove) => {
    setIsSaving(true);
    try {
      await removeCardFromDeckApi(deckId(), cardIdToRemove);
      setDeckCards(prev => prev.filter(card => card.id !== cardIdToRemove));
      if (selectedCardDetails()?.id === cardIdToRemove) {
        setSelectedCardDetails(null);
      }
      showMessage('Card removed from deck.', 'success', 2000);
    } catch (err) { // Error handling saat menghapus kartu.
      console.error("Error removing card from deck:", err);
      showMessage(err.message || "Failed to remove card from deck.", 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Fungsi untuk mengubah jumlah kartu tertentu di dalam deck.
  const updateCardCount = async (cardIdToUpdate, newCount) => {
    // Find the card in the deck
    const cardToUpdate = deckCards().find(c => c.id === cardIdToUpdate);
    
    // Check if it's an Energy card (which has no limit) or a regular card (limited to MAX_IDENTICAL_CARDS)
    const isEnergyCard = cardToUpdate && cardToUpdate.details && cardToUpdate.details.supertype === 'Energy';
    
    if (newCount < 1 || (!isEnergyCard && newCount > MAX_IDENTICAL_CARDS)) {
      const maxMessage = isEnergyCard ? '' : ` and ${MAX_IDENTICAL_CARDS}`;
      showMessage(`Card count must be between 1${maxMessage}.`, 'warning');
      return;
    }

    setIsSaving(true);
    try {
      await updateCardCountInDeck(deckId(), cardIdToUpdate, newCount);
      setDeckCards(prev =>
        prev.map(c => (c.id === cardIdToUpdate ? { ...c, count: newCount } : c))
      );
      showMessage('Card count updated.', 'success', 2000);
    } catch (err) { // Error handling saat mengubah jumlah kartu.
      console.error("Error updating card count:", err);
      showMessage(err.message || "Failed to update card count.", 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Handler untuk menyimpan perubahan pada deck.
  const handleSaveDeck = async () => {
    if (deckNameInput().trim() === '') {
      showMessage('Deck name cannot be empty.', 'warning');
      return;
    }
    setIsSaving(true);
    try {
      const cardsForApi = deckCards().map(card => ({ id: card.id, count: card.count }));
      await updateDeck(deckId(), {
        name: deckNameInput(),
        imageUrl: '',
        cards: cardsForApi
      });
      setDeckName(deckNameInput());
      showMessage('Deck saved successfully!', 'success');
    } catch (err) { // Error handling saat menyimpan deck.
      console.error("Error saving deck:", err);
      showMessage(err.message || "Failed to save deck. Please try again.", 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Handler untuk menghapus deck.
  const handleDeleteDeck = async () => {
    if (!window.confirm('Are you sure you want to delete this deck? This action cannot be undone.')) {
      return;
    }
    setIsSaving(true);
    try {
      await deleteDeck(deckId());
      showMessage('Deck deleted successfully!', 'success');
      navigate('/decklist', { replace: true });
    } catch (err) { // Error handling saat menghapus deck.
      console.error("Error deleting deck:", err);
      showMessage(err.message || "Failed to delete deck.", 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Handler untuk menambah/menghapus deck dari favorit.
  const handleToggleFavorite = async () => {
    setIsSaving(true);
    try {
      const newFavoriteStatus = !favoriteDeck();
      await addRemoveFavoriteDeck(deckId(), newFavoriteStatus);
      setFavoriteDeck(newFavoriteStatus);
      showMessage(`Deck ${newFavoriteStatus ? 'added to' : 'removed from'} favorites!`, 'success', 2000);
    } catch (err) { // Error handling saat mengubah status favorit.
      console.error("Error toggling favorite status:", err);
      showMessage(err.message || "Failed to update favorite status.", 'error');
    } finally {
      setIsSaving(false);
    }
    
  };

  // Handler untuk paginasi hasil pencarian.
  const handleSearchPageChange = (page) => {
    if (page > 0 && page <= totalSearchPages()) {
      setSearchPage(page);
    }
  };

  // Handler untuk memulai proses drag.
  const handleDragStart = (e, card) => {
    setDraggedCard(card);
    e.dataTransfer.effectAllowed = 'copy';
    e.target.style.opacity = '0.5';
  };

  // Handler untuk mengakhiri proses drag.
  const handleDragEnd = (e) => {
    e.target.style.opacity = '';
    setDraggedCard(null);
  };
  
  // Handler saat item yang di-drag berada di atas drop zone.
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  let dragCounter = 0;
  
  // Handler saat item yang di-drag memasuki drop zone.
  const handleDragEnter = (e) => {
      e.preventDefault();
      dragCounter++;
      if (dragCounter === 1) {
          setIsDraggingOver(true);
      }
  };

  // Handler saat item yang di-drag meninggalkan drop zone.
  const handleDragLeave = (e) => {
    e.preventDefault();
    dragCounter--;
    if (dragCounter === 0) {
        setIsDraggingOver(false);
    }
  };

  // Handler saat item di-drop ke drop zone.
  const handleDrop = async (e) => {
    e.preventDefault();
    const card = draggedCard();
    if (card) {
        await addCardToDeck(card);
    }
    dragCounter = 0;
    setIsDraggingOver(false);
  };

  const totalDeckCardCount = () => deckCards().reduce((sum, card) => sum + card.count, 0);

  return (
    <div class={styles.mainContainer}>
      {/* Notifikasi akan muncul di sini. */}
      {message() && (
        <div class={`${styles.messageBox} ${styles[messageType()]}`}>
          {message()}
        </div>
      )}

      {/* Conditional rendering: tampilkan loading, error, atau editor deck. */}
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
              {/* Kontainer untuk menampilkan detail kartu. */}
              <div class={styles.cardDetailContainer}>
                <h2>Card's Details</h2>
                {/* Switch untuk menampilkan detail kartu atau pesan placeholder. */}
                <Switch>
                  <Match when={selectedCardDetails()}>
                    <div class={cardDetailStyles.cardContainer} style={{ "flex-direction": "column", "align-items": "stretch" }}>
                      <div class={cardDetailStyles.imageContainer} style={{ "padding-left": "0", "margin": "0 auto", "max-width": "300px" }}>
                        <div class={styles.cardImageContainer} style={{ "width": "100%", "height": "auto" }}>
                          <img 
                            class={cardDetailStyles.placeholderSvg}
                            src={selectedCardDetails().images?.large || selectedCardDetails().images?.small || PLACEHOLDER_IMAGE}
                            alt={selectedCardDetails().name}
                          />
                        </div>
                      </div>

                      <div class={cardDetailStyles.infoContainer} style={{"margin-top": "20px"}}>
                        <div class={cardDetailStyles.cardHeader}>
                          <h3 class={cardDetailStyles.headerTitle}>
                            {selectedCardDetails().name}
                          </h3>
                        </div>

                        <div class={cardDetailStyles.typeHpRow}>
                          <div class={cardDetailStyles.typeCell}>
                            <span>Type: {selectedCardDetails().types?.join(', ') || 'N/A'}</span>
                          </div>
                          <div class={cardDetailStyles.hpCell}>
                            <span>HP: {selectedCardDetails().hp || 'N/A'}</span>
                          </div>
                        </div>
                        
                        <Show when={selectedCardDetails().abilities?.length > 0}>
                            <div class={cardDetailStyles.abilitiesSection}>
                                <For each={selectedCardDetails().abilities}>
                                    {(ability) => (
                                        <div class={cardDetailStyles.abilityItem}>
                                            <div class={cardDetailStyles.abilityContent}>
                                                <div class={cardDetailStyles.abilityName}>{ability.name}</div>
                                                <div class={cardDetailStyles.abilityDescription}>{ability.text}</div>
                                            </div>
                                        </div>
                                    )}
                                </For>
                            </div>
                        </Show>

                        <Show when={selectedCardDetails().attacks?.length > 0}>
                          <div class={cardDetailStyles.abilitiesSection}>
                            <For each={selectedCardDetails().attacks}>
                              {(attack) => (
                                <div class={cardDetailStyles.abilityItem}>
                                  <div class={cardDetailStyles.abilityContent}>
                                    <div class={cardDetailStyles.abilityName}>{attack.name} ({attack.cost?.join(', ') || 'None'})</div>
                                    <div class={cardDetailStyles.abilityDescription}>{attack.text}</div>
                                  </div>
                                  <Show when={attack.damage}>
                                    <div class={cardDetailStyles.abilityValue}>{attack.damage}</div>
                                  </Show>
                                </div>
                              )}
                            </For>
                          </div>
                        </Show>

                        <div class={cardDetailStyles.statsSection}>
                          <div class={cardDetailStyles.statsHeader}>
                            <div class={cardDetailStyles.statHeaderItem}><span>Weakness</span></div>
                            <div class={cardDetailStyles.statHeaderItem}><span>Resistance</span></div>
                            <div class={cardDetailStyles.statHeaderItem}><span>Retreat Cost</span></div>
                          </div>
                          <div class={cardDetailStyles.statsValues}>
                            <div class={cardDetailStyles.statValueItem}><span>{selectedCardDetails().weaknesses?.map(w => `${w.type} ${w.value}`).join(', ') || 'N/A'}</span></div>
                            <div class={cardDetailStyles.statValueItem}><span>{selectedCardDetails().resistances?.map(r => `${r.type} ${r.value}`).join(', ') || 'N/A'}</span></div>
                            <div class={cardDetailStyles.statValueItem}><span>{selectedCardDetails().retreatCost?.length || 0}</span></div>
                          </div>
                          <div class={cardDetailStyles.illustratorSection}>
                            <span>Illustrator: {selectedCardDetails().artist || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Match>
                  <Match when={!selectedCardDetails()}>
                     <div class={styles.noCardSelected}>
                        <p>Select a card to view details</p>
                     </div>
                  </Match>
                </Switch>
              </div>

              {/* Kontainer untuk menampilkan kartu yang ada di deck (Drop Zone). */}
              <div 
                class={`${styles.cardDeckContainer} ${isDraggingOver() ? styles.draggingOver : ''}`}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div class={styles.deckHeader}>
                  <div class={styles.deckHeaderTitle}>
                    <h2>Deck's Cards</h2>
                    <p class={styles.deckHeaderDescription}>
                      Drag cards from the search results to add them here.
                    </p>
                    <p class={styles.deckHeaderDescription}>
                      Double-Click cards to remove it from deck.
                    </p>
                  </div>
                  <span class={styles.cardCount}>
                    {totalDeckCardCount()}/{MAX_DECK_CARDS} Cards
                  </span>
                </div>

                <div class={styles.deckGrid}>
                  {/* Iterasi untuk menampilkan setiap kartu di dalam deck. */}
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
                            disabled={(card.details?.supertype !== 'Energy' && card.count >= MAX_IDENTICAL_CARDS) || totalDeckCardCount() >= MAX_DECK_CARDS || isSaving()}
                          >
                            <AiOutlinePlusCircle />
                          </button>
                        </div>
                      </div>
                    )}
                  </For>
                </div>
              </div>

              {/* Kontainer untuk pencarian kartu. */}
              <div class={styles.cardSearchContainer}>
                <h2>Search for Cards</h2>
                <form onSubmit={handleSearchSubmit} class={styles.searchForm}>
                  <input
                    type="text"
                    placeholder="Search Pokémon cards..."
                    value={searchQuery()}
                    onInput={(e) => {
                      setSearchQuery(e.target.value);
                      setSearchPage(1); // Reset page to 1 when search query changes
                    }}
                    class={styles.searchInput}
                    disabled={isSaving()}
                  />
                  <button type="submit" class={styles.searchButton} disabled={isSaving()}>
                    <BsSearch />
                  </button>
                </form>
                
                {/* Menampilkan loading atau hasil pencarian. */}
                <Show when={!allCardsData.loading} fallback={
                  <div class={styles.loadingContainer}>
                    <div class={styles.loadingSpinner}></div>
                    <p>Searching cards...</p>
                  </div>
                }>
                  <div class={styles.resultsInfo}>
                    {searchQuery().trim()
                      ? `Search results for "${searchQuery().trim()}"`
                      : 'All Pokémon Cards'}
                    <span class={styles.cardCount}>
                      {filteredCards().length} cards found
                    </span>
                  </div>
                  
                  <div class={styles.searchResults}>
                    {/* Iterasi untuk menampilkan hasil pencarian. */}
                    <For each={paginatedSearchResults()} fallback={
                      <p class={styles.noCardSelected}>No cards found.</p>
                    }>
                      {(card) => (
                        <div
                          class={`${styles.searchCard} ${styles.draggable}`}
                          onClick={() => displayCardDetails(card)}
                          onDblClick={() => addCardToDeck(card)}
                          draggable={true}
                          onDragStart={(e) => handleDragStart(e, card)}
                          onDragEnd={handleDragEnd}
                        >
                          <img 
                            src={card.images?.small || PLACEHOLDER_IMAGE} 
                            alt={card.name}
                            draggable={false}
                          />
                          <div class={styles.dragHint}>Drag to deck</div>
                        </div>
                      )}
                    </For>
                  </div>

                  <Pagination
                    currentPage={searchPage}
                    totalPages={totalSearchPages()} 
                    onPageChange={handleSearchPageChange}
                    maxPagesToShow={5}
                  />
                </Show>
              </div>
            </div>
          </div>
        </Show>
      }>
        <div class={styles.loadingContainer}>
          <div class={styles.loadingSpinner}></div>
          <p>Loading deck editor...</p>
        </div>
      </Show>
    </div>
  );
}

export default DeckEditor;