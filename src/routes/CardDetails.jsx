import { createResource, Show, createSignal, createMemo } from "solid-js";
import cardStyles from "./carddetail.module.css";
import PLACEHOLDER_IMAGE from "../assets/images/placeholder.jpg"; 
import { useNavigate, useParams } from "@solidjs/router";
import { getCardById } from '../services/cardService'; 
import { BiRegularArrowBack } from 'solid-icons/bi';

// Membuat cache kartu global untuk menyimpan kartu yang telah diambil di seluruh instance komponen
const cardCache = new Map();

// Fungsi fetch dengan caching
const fetchCardWithCache = async (cardId) => {
  if (!cardId) return null;
  
  // Memeriksa apakah kartu sudah ada di cache
  if (cardCache.has(cardId)) {
    console.log(`Using cached data for card ${cardId}`);
    return cardCache.get(cardId);
  }
  
  // Jika tidak ada di cache, ambil dari API
  console.log(`Fetching new data for card ${cardId}`);
  try {
    const response = await getCardById(cardId);
    if (response && response.data) {
      // Simpan di cache untuk penggunaan di masa mendatang
      cardCache.set(cardId, response.data);
      return response.data;
    }
    throw new Error(`Card with ID '${cardId}' not found or invalid data received.`);
  } catch (err) {
    console.error('Error fetching card data:', err);
    throw err; // Lempar kembali agar createResource menangani error
  }
};

function CardDetails() {
  const navigate = useNavigate();
  const params = useParams();
  
  // Menggunakan createResource untuk menangani fetching, loading, dan status error
  const [card, { refetch }] = createResource(
    () => params.cardId, 
    fetchCardWithCache
  );

  // Handler untuk tombol kembali, mengarahkan pengguna ke halaman daftar kartu.
  const handleBackClick = () => {
    navigate('/cardlist');
  };

  return (
    <div class={cardStyles.pageContainer}>
      <button class={cardStyles.backButton} onClick={handleBackClick}>
        <BiRegularArrowBack class={cardStyles.backIcon} />
        Back
      </button>

      <div class={cardStyles.showcaseSection}>
        <h2>Card Details: {card()?.name || params.cardId}</h2>

        {/* Conditional Rendering dengan status createResource */}
        <Show 
          when={!card.loading} 
          fallback={
            <div class={cardStyles.loadingContainer}>
              <div class={cardStyles.loadingSpinner}></div>
              <p>Loading card data...</p>
            </div>
          }
        >
          <Show 
            when={!card.error} 
            fallback={
              <div class={cardStyles.errorContainer}>
                <p class={cardStyles.errorMessage}>{card.error?.message || 'Failed to load card'}</p>
                <button class={cardStyles.retryButton} onClick={() => refetch()}>
                  Retry
                </button>
              </div>
            }
          >
            <Show when={card()}>
              <div class={cardStyles.card}>
                <div class={cardStyles.cardContainer}>
                  <div class={cardStyles.imageContainer}>
                    <div class={cardStyles.imagePlaceholder}>
                      <img 
                        class={cardStyles.placeholderSvg} 
                        src={card().images?.large || card().images?.small || PLACEHOLDER_IMAGE} 
                        alt={card().name} 
                      />
                    </div>
                  </div>

                  <div class={cardStyles.infoContainer}>
                    <div class={cardStyles.cardHeader}>
                      <h3 class={cardStyles.headerTitle}>
                        {card().name}
                      </h3>
                    </div>

                    <div class={cardStyles.typeHpRow}>
                      <div class={cardStyles.typeCell}>
                        <span class={cardStyles.subtext1}>Type: {card().types?.join(', ') || 'N/A'}</span>
                      </div>
                      <div class={cardStyles.hpCell}>
                        <span class={cardStyles.subtext1}>HP: {card().hp || 'N/A'}</span>
                      </div>
                    </div>

                    <Show when={card().attacks || card().abilities}>
                      <div class={cardStyles.abilitiesSection}>
                        <For each={card().attacks || card().abilities}>
                          {(attack) => (
                            <div class={cardStyles.abilityItem}>
                              <div class={cardStyles.abilityContent}>
                                <div class={cardStyles.abilityName}>
                                  {attack.name}
                                </div>
                                <div class={`${cardStyles.subtext0} ${cardStyles.abilityDescription}`}>
                                  {attack.text}
                                </div>
                              </div>
                              <Show when={attack.damage}>
                                <div class={`${cardStyles.textMauve} ${cardStyles.abilityValue}`}>
                                  {attack.damage}
                                </div>
                              </Show>
                            </div>
                          )}
                        </For>
                      </div>
                    </Show>

                    <div class={cardStyles.statsSection}>
                      <div class={cardStyles.statsHeader}>
                        <div class={cardStyles.statHeaderItem}>
                          <span class={`${cardStyles.subtext1} ${cardStyles.statLabel}`}>
                            Weakness
                          </span>
                        </div>
                        <div class={cardStyles.statHeaderItem}>
                          <span class={`${cardStyles.subtext1} ${cardStyles.statLabel}`}>
                            Resistance
                          </span>
                        </div>
                        <div class={cardStyles.statHeaderItem}>
                          <span class={`${cardStyles.subtext1} ${cardStyles.statLabel}`}>
                            Retreat Cost
                          </span>
                        </div>
                      </div>

                      <div class={cardStyles.statsValues}>
                        <div class={cardStyles.statValueItem}>
                          <span class={`${cardStyles.textDefault} ${cardStyles.statValue}`}>
                            {card().weaknesses?.map(w => `${w.type} ${w.value}`).join(', ') || 'N/A'}
                          </span>
                        </div>
                        <div class={cardStyles.statValueItem}>
                          <span class={`${cardStyles.textDefault} ${cardStyles.statValue}`}>
                            {card().resistances?.map(r => `${r.type} ${r.value}`).join(', ') || 'N/A'}
                          </span>
                        </div>
                        <div class={cardStyles.statValueItem}>
                          <span class={`${cardStyles.textDefault} ${cardStyles.statValue}`}>
                            {card().retreatCost?.length || 0}
                          </span>
                        </div>
                      </div>

                      <div class={cardStyles.illustratorSection}>
                        <span class={`${cardStyles.subtext0} ${cardStyles.illustratorText}`}>
                          Illustrator: {card().artist || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Show>
          </Show>
        </Show>
      </div>
    </div>
  );
}

export default CardDetails;