// Layanan untuk berinteraksi dengan endpoint API deck Pokemon TCG
const API_URL = 'http://localhost:3001/api';

/**
 * Fungsi pembantu untuk membuat panggilan API terautentikasi dengan penanganan kesalahan yang tepat.
 * @param {string} endpoint - Endpoint API relatif terhadap API_URL.
 * @param {string} method - Metode HTTP (GET, POST, PUT, DELETE).
 * @param {object} data - Data body request (untuk POST/PUT).
 * @returns {Promise<object>} - Data respons dari API.
 * @throws {Error} - Melempar error jika panggilan API gagal atau token tidak ada.
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
 * Mendapatkan semua deck untuk pengguna terautentikasi dengan kata pencarian opsional.
 * @param {string} search - Kata pencarian untuk nama deck.
 * @returns {Promise<object>} - Objek yang berisi array deck.
 */
export async function getDecks(search = '') {
  const queryParams = new URLSearchParams();
  if (search) {
    queryParams.append('search', search);
  }
  const queryString = queryParams.toString();
  return await authenticatedApiCall(`/decks${queryString ? `?${queryString}` : ''}`, 'GET');
}

/**
 * Mendapatkan deck spesifik berdasarkan ID untuk pengguna terautentikasi.
 * @param {number} deckId - ID deck yang akan diambil.
 * @param {boolean} includeCardDetails - Apakah akan menyertakan detail kartu lengkap dalam respons.
 * @returns {Promise<object>} - Data deck.
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
 * Membuat deck baru untuk pengguna terautentikasi.
 * @param {string} name - Nama deck baru.
 * @param {string} [imageUrl=''] - URL opsional untuk gambar deck.
 * @returns {Promise<object>} - Data deck yang dibuat.
 */
export async function createDeck(name, imageUrl = '') {
  return await authenticatedApiCall('/decks', 'POST', { name, imageUrl });
}

/**
 * Memperbarui deck yang ada untuk pengguna terautentikasi.
 * @param {number} deckId - ID deck yang akan diperbarui.
 * @param {object} deckData - Objek yang berisi properti deck yang diperbarui (nama, imageUrl, kartu).
 * @param {string} [deckData.name] - Nama baru deck.
 * @param {string} [deckData.imageUrl] - URL gambar baru untuk deck.
 * @param {Array<object>} [deckData.cards] - Array kartu dalam deck, contoh: [{ id: 'card-id', count: 1 }].
 * @returns {Promise<object>} - Data deck yang diperbarui.
 */
export async function updateDeck(deckId, deckData) {
  return await authenticatedApiCall(`/decks/${deckId}`, 'PUT', deckData);
}

/**
 * Menghapus deck untuk pengguna terautentikasi.
 * @param {number} deckId - ID deck yang akan dihapus.
 * @returns {Promise<object>} - Pesan sukses.
 */
export async function deleteDeck(deckId) {
  return await authenticatedApiCall(`/decks/${deckId}`, 'DELETE');
}

/**
 * Mendapatkan deck yang baru-baru ini dimodifikasi untuk pengguna terautentikasi.
 * @returns {Promise<object>} - Objek yang berisi array deck terbaru.
 */
export async function getRecentDecks() {
  return await authenticatedApiCall('/decks/recent', 'GET');
}

/**
 * Mendapatkan deck favorit untuk pengguna terautentikasi.
 * @returns {Promise<object>} - Objek yang berisi array deck favorit.
 */
export async function getFavoriteDecks() {
  return await authenticatedApiCall('/decks/favorites', 'GET');
}

/**
 * Menambah atau menghapus deck dari favorit untuk pengguna terautentikasi.
 * @param {number} deckId - ID deck.
 * @param {boolean} favorite - True untuk menambahkan ke favorit, false untuk menghapus.
 * @returns {Promise<object>} - Pesan sukses dan status favorit baru.
 */
export async function addRemoveFavoriteDeck(deckId, favorite) {
  return await authenticatedApiCall(`/decks/${deckId}/favorite`, 'POST', { favorite });
}

/**
 * Menambah kartu ke deck atau memperbarui jumlahnya untuk pengguna terautentikasi.
 * @param {number} deckId - ID deck.
 * @param {string} cardId - ID kartu yang akan ditambah/diperbarui.
 * @param {number} count - Jumlah salinan kartu (antara 1 dan 4).
 * @returns {Promise<object>} - Detail kartu yang ditambah/diperbarui.
 */
export async function addCardToDeck(deckId, cardId, count = 1) {
  return await authenticatedApiCall(`/decks/${deckId}/cards`, 'POST', { cardId, count });
}

/**
 * Menghapus kartu dari deck untuk pengguna terautentikasi.
 * @param {number} deckId - ID deck.
 * @param {string} cardId - ID kartu yang akan dihapus.
 * @returns {Promise<object>} - Pesan sukses dan ID kartu yang dihapus.
 */
export async function removeCardFromDeck(deckId, cardId) {
  return await authenticatedApiCall(`/decks/${deckId}/cards/${cardId}`, 'DELETE');
}

/**
 * Memperbarui jumlah kartu tertentu dalam deck untuk pengguna terautentikasi.
 * @param {number} deckId - ID deck.
 * @param {string} cardId - ID kartu.
 * @param {number} count - Jumlah baru kartu (antara 1 dan 4).
 * @returns {Promise<object>} - Detail kartu yang diperbarui.
 */
export async function updateCardCountInDeck(deckId, cardId, count) {
  return await authenticatedApiCall(`/decks/${deckId}/cards/${cardId}`, 'PUT', { count });
}
