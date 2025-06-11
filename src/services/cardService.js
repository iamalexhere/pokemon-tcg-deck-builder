/**
 * Service for interacting with the Pokemon TCG card API endpoints
 */

const API_URL = 'http://localhost:3001/api';

/**
 * Get all cards
 * @returns {Promise} - Promise with card data
 */
export async function getCards() {
  const response = await fetch(`${API_URL}/cards`, {
    method: 'GET',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch cards');
  }

  return response.json();
}

/**
 * Get cards by set ID
 * @param {string} setId - Set ID (e.g. 'sm1', 'sm2')
 * @param {number} page - Page number (starting from 1)
 * @param {number} pageSize - Number of cards per page
 * @returns {Promise} - Promise with card data
 */
export async function getCardsBySet(setId, page = 1, pageSize = 20) {
  const response = await fetch(`${API_URL}/cards/set/${setId}?page=${page}&pageSize=${pageSize}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch cards');
  }

  return response.json();
}

/**
 * Search for cards
 * @param {Object} params - Search parameters
 * @param {string} params.name - Card name
 * @param {string} params.type - Card type
 * @param {string} params.supertype - Card supertype
 * @param {string} params.rarity - Card rarity
 * @returns {Promise} - Promise with card data
 */
export async function searchCards(params = {}) {
  // Build query string from params
  const queryParams = new URLSearchParams();
  if (params.name) queryParams.append('name', params.name);
  if (params.type) queryParams.append('type', params.type);
  if (params.supertype) queryParams.append('supertype', params.supertype);
  if (params.rarity) queryParams.append('rarity', params.rarity);

  const response = await fetch(`${API_URL}/cards/search?${queryParams.toString()}`, {
    method: 'GET',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to search cards');
  }

  return response.json();
}

/**
 * Get a specific card by ID
 * @param {string} cardId - Card ID
 * @returns {Promise} - Promise with card data
 */
export async function getCardById(cardId) {
  const response = await fetch(`${API_URL}/cards/${cardId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch card');
  }

  return response.json();
}
