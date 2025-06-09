// Service for interacting with the Pokemon TCG deck API endpoints
const API_URL = 'http://localhost:3001/api';

/**
 * Helper function to make authenticated API calls with proper error handling.
 * @param {string} endpoint - API endpoint relative to API_URL.
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE).
 * @param {object} data - Request body data (for POST/PUT).
 * @returns {Promise<object>} - Response data from the API.
 * @throws {Error} - Throws an error if the API call fails or token is missing.
 */
async function authenticatedApiCall(endpoint, method = 'GET', data = null) {
  const tokenJson = localStorage.getItem('token');
  if (!tokenJson) {
    throw new Error('Authentication required: No token found. Please log in.');
  }

  // Parse the token from JSON string
  const token = JSON.parse(tokenJson);

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  const config = {
    method,
    headers,
    body: data ? JSON.stringify(data) : null,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || `API Error: ${response.status} ${response.statusText}`);
    }

    return responseData;
  } catch (error) {
    console.error(`Deck Service API Error (${endpoint}):`, error);
    throw error;
  }
}

/**
 * Get all decks for the authenticated user with optional pagination and search.
 * @param {number} page - Page number (starting from 1).
 * @param {number} limit - Number of decks per page.
 * @param {string} search - Search term for deck names.
 * @returns {Promise<object>} - Object containing decks array and totalPages.
 */
export async function getDecks(page = 1, limit = 9, search = '') {
  const queryParams = new URLSearchParams();
  queryParams.append('page', page);
  queryParams.append('limit', limit);
  if (search) {
    queryParams.append('search', search);
  }
  return await authenticatedApiCall(`/decks?${queryParams.toString()}`, 'GET');
}

/**
 * Get a specific deck by ID for the authenticated user.
 * @param {number} deckId - The ID of the deck to retrieve.
 * @param {boolean} includeCardDetails - Whether to include full card details in the response.
 * @returns {Promise<object>} - Deck data.
 */
export async function getDeckById(deckId, includeCardDetails = false) {
  const queryParams = new URLSearchParams();
  if (includeCardDetails) {
    queryParams.append('includeCardDetails', 'true');
  }
  const queryString = queryParams.toString();
  return await authenticatedApiCall(`/decks/${deckId}${queryString ? '?' + queryString : ''}`, 'GET');
}

/**
 * Create a new deck for the authenticated user.
 * @param {string} name - The name of the new deck.
 * @param {string} [imageUrl=''] - Optional URL for the deck's image.
 * @returns {Promise<object>} - Created deck data.
 */
export async function createDeck(name, imageUrl = '') {
  return await authenticatedApiCall('/decks', 'POST', { name, imageUrl });
}

/**
 * Update an existing deck for the authenticated user.
 * @param {number} deckId - The ID of the deck to update.
 * @param {object} deckData - Object containing updated deck properties (name, imageUrl, cards).
 * @param {string} [deckData.name] - New name of the deck.
 * @param {string} [deckData.imageUrl] - New image URL for the deck.
 * @param {Array<object>} [deckData.cards] - Array of cards in the deck, e.g., [{ id: 'card-id', count: 1 }].
 * @returns {Promise<object>} - Updated deck data.
 */
export async function updateDeck(deckId, deckData) {
  return await authenticatedApiCall(`/decks/${deckId}`, 'PUT', deckData);
}

/**
 * Delete a deck for the authenticated user.
 * @param {number} deckId - The ID of the deck to delete.
 * @returns {Promise<object>} - Success message.
 */
export async function deleteDeck(deckId) {
  return await authenticatedApiCall(`/decks/${deckId}`, 'DELETE');
}

/**
 * Get the most recently modified decks for the authenticated user.
 * @returns {Promise<object>} - Object containing an array of recent decks.
 */
export async function getRecentDecks() {
  return await authenticatedApiCall('/decks/recent', 'GET');
}

/**
 * Get favorite decks for the authenticated user.
 * @returns {Promise<object>} - Object containing an array of favorite decks.
 */
export async function getFavoriteDecks() {
  return await authenticatedApiCall('/decks/favorites', 'GET');
}

/**
 * Add or remove a deck from favorites for the authenticated user.
 * @param {number} deckId - The ID of the deck.
 * @param {boolean} favorite - True to add to favorites, false to remove.
 * @returns {Promise<object>} - Success message and new favorite status.
 */
export async function addRemoveFavoriteDeck(deckId, favorite) {
  return await authenticatedApiCall(`/decks/${deckId}/favorite`, 'POST', { favorite });
}

/**
 * Add a card to a deck or update its count for the authenticated user.
 * @param {number} deckId - The ID of the deck.
 * @param {string} cardId - The ID of the card to add/update.
 * @param {number} count - The number of copies of the card (between 1 and 4).
 * @returns {Promise<object>} - Added/updated card details.
 */
export async function addCardToDeck(deckId, cardId, count = 1) {
  return await authenticatedApiCall(`/decks/${deckId}/cards`, 'POST', { cardId, count });
}

/**
 * Remove a card from a deck for the authenticated user.
 * @param {number} deckId - The ID of the deck.
 * @param {string} cardId - The ID of the card to remove.
 * @returns {Promise<object>} - Success message and removed card ID.
 */
export async function removeCardFromDeck(deckId, cardId) {
  return await authenticatedApiCall(`/decks/${deckId}/cards/${cardId}`, 'DELETE');
}

/**
 * Update the count of a specific card within a deck for the authenticated user.
 * @param {number} deckId - The ID of the deck.
 * @param {string} cardId - The ID of the card.
 * @param {number} count - The new count of the card (between 1 and 4).
 * @returns {Promise<object>} - Updated card details.
 */
export async function updateCardCountInDeck(deckId, cardId, count) {
  return await authenticatedApiCall(`/decks/${deckId}/cards/${cardId}`, 'PUT', { count });
}
