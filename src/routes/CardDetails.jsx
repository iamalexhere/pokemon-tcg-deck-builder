import { createSignal, createEffect, onMount, Show } from "solid-js";
import cardStyles from "./carddetail.module.css";
import PLACEHOLDER_IMAGE from "../assets/images/placeholder.jpg"; // Renamed from poke for clarity
import { useNavigate, useParams } from "@solidjs/router";
import { getCardById } from '../services/cardService'; // Import the actual card service

function CardDetails() {
  const navigate = useNavigate();
  const params = useParams();
  const cardId = params.cardId;
  
  // State for card data and loading state
  const [cardData, setCardData] = createSignal(null);
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal(null);
  
  // Fetch card data when component mounts or cardId changes
  onMount(() => {
    fetchCardData();
  });
  
  createEffect(() => {
    // This will re-run when cardId changes
    if (params.cardId && params.cardId !== cardData()?.id) { // Only re-fetch if ID actually changed
      fetchCardData();
    }
  });
  
  // Function to fetch card data based on cardId
  const fetchCardData = async () => {
    setIsLoading(true);
    setError(null);
    setCardData(null); // Clear previous data
    
    try {
      const response = await getCardById(cardId);
      if (response && response.data) {
        setCardData(response.data);
      } else {
        setError(`Card with ID '${cardId}' not found or invalid data received.`);
      }
    } catch (err) {
      console.error('Error fetching card data:', err);
      setError(err.message || 'Failed to load card data. Please check your network connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackClick = () => {
    // Navigate back to the card list page
    navigate('/cardlist');
  };

  return (
    <div class={cardStyles.pageContainer}>
      {/* Back Button */}
      <button class={cardStyles.backButton} onClick={handleBackClick}>
        <svg
          class={cardStyles.backIcon}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>
        Back
      </button>

      <div class={cardStyles.showcaseSection}>
        <h2>Card Details: {cardData()?.name || cardId}</h2>

        {/* Loading State */}
        <Show when={isLoading()} fallback={
          // Error State
          <Show when={error()} fallback={
            // Card Data
            <Show when={cardData()}>
              <div class={cardStyles.card}>
                <div class={cardStyles.cardContainer}>
                  {/* Card Image Placeholder */}
                  <div class={cardStyles.imageContainer}>
                    <div class={cardStyles.imagePlaceholder}>
                      <img 
                        class={cardStyles.placeholderSvg} 
                        src={cardData().images?.large || cardData().images?.small || PLACEHOLDER_IMAGE} 
                        alt={cardData().name} 
                      />
                    </div>
                  </div>

                  {/* Card Info Panel */}
                  <div class={cardStyles.infoContainer}>
                    {/* Header */}
                    <div class={cardStyles.cardHeader}>
                      <h3 class={cardStyles.headerTitle}>
                        {cardData().name}
                      </h3>
                    </div>

                    {/* Type and HP Row */}
                    <div class={cardStyles.typeHpRow}>
                      <div class={cardStyles.typeCell}>
                        <span class={cardStyles.subtext1}>Type: {cardData().types?.join(', ') || 'N/A'}</span>
                      </div>
                      <div class={cardStyles.hpCell}>
                        <span class={cardStyles.subtext1}>HP: {cardData().hp || 'N/A'}</span>
                      </div>
                    </div>

                    {/* Abilities Section */}
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

                    {/* Stats Section */}
                    <div class={cardStyles.statsSection}>
                      {/* Stats Header */}
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

                      {/* Stats Values */}
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

                      {/* Illustrator */}
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
