import { createSignal, createEffect, onMount, Show } from "solid-js";
import cardStyles from "./carddetail.module.css";
import PLACEHOLDER_IMAGE from "../assets/images/placeholder.jpg"; 
import { useNavigate, useParams } from "@solidjs/router";
import { getCardById } from '../services/cardService'; 
import { BiRegularArrowBack } from 'solid-icons/bi';

function CardDetails() {
  const navigate = useNavigate();
  // Mengambil parameter `cardId` dari URL.
  const params = useParams();
  const cardId = params.cardId;
  
  // State untuk menyimpan data kartu, status loading, dan pesan error.
  const [cardData, setCardData] = createSignal(null);
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal(null);
  
  // Memanggil fungsi fetch data saat komponen pertama kali di-mount.
  onMount(() => {
    fetchCardData();
  });
  
  // `createEffect` untuk memuat ulang data jika `cardId` dari URL berubah.
  createEffect(() => {
    if (params.cardId && params.cardId !== cardData()?.id) { 
      fetchCardData();
    }
  });
  
  // Fungsi untuk mengambil data detail kartu dari API.
  const fetchCardData = async () => {
    setIsLoading(true);
    setError(null);
    setCardData(null); 
    
    // Blok try-catch untuk menangani proses fetch dan kemungkinan error.
    try {
      const response = await getCardById(cardId);
      if (response && response.data) {
        setCardData(response.data);
      } else {
        setError(`Card with ID '${cardId}' not found or invalid data received.`);
      }
    } catch (err) {
      console.error('Error fetching card data:', err);
      // State management untuk error handling.
      setError(err.message || 'Failed to load card data. Please check your network connection.');
    } finally {
      // State management untuk menghentikan status loading.
      setIsLoading(false);
    }
  };

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
        <h2>Card Details: {cardData()?.name || cardId}</h2>

        {/* Conditional rendering untuk menampilkan loading, error, atau data kartu. */}
        <Show when={isLoading()} fallback={
          <Show when={error()} fallback={
            <Show when={cardData()}>
              <div class={cardStyles.card}>
                <div class={cardStyles.cardContainer}>
                  <div class={cardStyles.imageContainer}>
                    <div class={cardStyles.imagePlaceholder}>
                      <img 
                        class={cardStyles.placeholderSvg} 
                        src={cardData().images?.large || cardData().images?.small || PLACEHOLDER_IMAGE} 
                        alt={cardData().name} 
                      />
                    </div>
                  </div>

                  <div class={cardStyles.infoContainer}>
                    <div class={cardStyles.cardHeader}>
                      <h3 class={cardStyles.headerTitle}>
                        {cardData().name}
                      </h3>
                    </div>

                    <div class={cardStyles.typeHpRow}>
                      <div class={cardStyles.typeCell}>
                        <span class={cardStyles.subtext1}>Type: {cardData().types?.join(', ') || 'N/A'}</span>
                      </div>
                      <div class={cardStyles.hpCell}>
                        <span class={cardStyles.subtext1}>HP: {cardData().hp || 'N/A'}</span>
                      </div>
                    </div>

                    {(cardData().attacks || cardData().abilities) && (
                      <div class={cardStyles.abilitiesSection}>
                        {(cardData().attacks || cardData().abilities).map((attack) => (
                          <div class={cardStyles.abilityItem}>
                            <div class={cardStyles.abilityContent}>
                              <div
                                class={cardStyles.abilityName}
                              >
                                {attack.name}
                              </div>
                              <div
                                class={`${cardStyles.subtext0} ${cardStyles.abilityDescription}`}
                              >
                                {attack.text}
                              </div>
                            </div>
                            <Show when={attack.damage}>
                              <div
                                class={`${cardStyles.textMauve} ${cardStyles.abilityValue}`}
                              >
                                {attack.damage}
                              </div>
                            </Show>
                          </div>
                        ))}
                      </div>
                    )}

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
                          <span
                            class={`${cardStyles.textDefault} ${cardStyles.statValue}`}
                          >
                            {cardData().weaknesses?.map(w => `${w.type} ${w.value}`).join(', ') || 'N/A'}
                          </span>
                        </div>
                        <div class={cardStyles.statValueItem}>
                          <span
                            class={`${cardStyles.textDefault} ${cardStyles.statValue}`}
                          >
                            {cardData().resistances?.map(r => `${r.type} ${r.value}`).join(', ') || 'N/A'}
                          </span>
                        </div>
                        <div class={cardStyles.statValueItem}>
                          <span
                            class={`${cardStyles.textDefault} ${cardStyles.statValue}`}
                          >
                            {cardData().retreatCost?.length || 0}
                          </span>
                        </div>
                      </div>

                      <div class={cardStyles.illustratorSection}>
                        <span
                          class={`${cardStyles.subtext0} ${cardStyles.illustratorText}`}
                        >
                          Illustrator: {cardData().artist || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Show>
          }>
            {/* Tampilan jika terjadi error saat fetch data. */}
            <div class={cardStyles.errorContainer}>
              <p class={cardStyles.errorMessage}>{error()}</p>
              <button 
                class={cardStyles.retryButton}
                onClick={fetchCardData}
              >
                Retry
              </button>
            </div>
          </Show>
        }>
          {/* Tampilan saat data sedang dimuat. */}
          <div class={cardStyles.loadingContainer}>
            <div class={cardStyles.loadingSpinner}></div>
            <p>Loading card data...</p>
          </div>
        </Show>
      </div>
    </div>
  );
}

export default CardDetails;