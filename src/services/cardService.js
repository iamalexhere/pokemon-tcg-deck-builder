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
 * Mendapatkan kartu berdasarkan ID set
 * @param {string} setId - ID Set (contoh: 'sm1', 'sm2')
 * @param {number} page - Nomor halaman (dimulai dari 1)
 * @param {number} pageSize - Jumlah kartu per halaman
 * @returns {Promise} - Promise dengan data kartu
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
 * Mencari kartu
 * @param {Object} params - Parameter pencarian
 * @param {string} params.name - Nama kartu
 * @param {string} params.type - Tipe kartu
 * @param {string} params.supertype - Supertipe kartu
 * @param {string} params.rarity - Kelangkaan kartu
 * @returns {Promise} - Promise dengan data kartu
 */
// export async function searchCards(params = {}) {
//   // Build query string from params
//   const queryParams = new URLSearchParams();
//   if (params.name) queryParams.append('name', params.name);
//   if (params.type) queryParams.append('type', params.type);
//   if (params.supertype) queryParams.append('supertype', params.supertype);
//   if (params.rarity) queryParams.append('rarity', params.rarity);

//   const response = await fetch(`${API_URL}/cards/search?${queryParams.toString()}`, {
//     method: 'GET',
//   });

//   if (!response.ok) {
//     const error = await response.json();
//     throw new Error(error.message || 'Failed to search cards');
//   }

//   return response.json();
// }

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
