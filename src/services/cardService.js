/**
 * Layanan untuk berinteraksi dengan endpoint API kartu Pokemon TCG
 */

const API_URL = 'http://localhost:3001/api';

/**
 * Mendapatkan semua kartu
 * @returns {Promise} - Promise dengan data kartu
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
 * Mendapatkan kartu spesifik berdasarkan ID
 * @param {string} cardId - ID Kartu
 * @returns {Promise} - Promise dengan data kartu
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
