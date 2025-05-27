import { createSignal, createEffect, onMount } from "solid-js";
import styles from "./styleGuide.module.css";
import cardStyles from "./carddetail.module.css";
import poke from "../assets/images/placeholder.jpg";
import { useNavigate, useParams } from "@solidjs/router";

function CardDetails() {
  const navigate = useNavigate();
  const params = useParams();
  const cardId = params.cardId;
  
  // State for card data and loading state
  const [cardData, setCardData] = createSignal(null);
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal(null);
  
  // Mock card database - in a real app, this would be fetched from an API
  const cardDatabase = {
    'charizard': {
      name: "Charizard",
      type: "Fire",
      hp: "120",
      abilities: [
        {
          name: "Energy Burn",
          description: "All Energy attached to Charizard are Fire Energy instead of their usual type.",
          value: "Passive",
        },
        {
          name: "Fire Spin",
          description: "Discard 2 Energy from Charizard in order to use this attack.",
          value: "100",
        },
      ],
      weakness: "Water ×2",
      resistance: "Fighting -30",
      retreatCost: "3",
      illustrator: "Mitsuhiro Arita",
    },
    'pikachu': {
      name: "Pikachu",
      type: "Electric",
      hp: "60",
      abilities: [
        {
          name: "Static",
          description: "When Pikachu is hit by an attack, the attacking Pokémon might become Paralyzed.",
          value: "Passive",
        },
        {
          name: "Thunder Shock",
          description: "Flip a coin. If heads, the Defending Pokémon is now Paralyzed.",
          value: "30",
        },
      ],
      weakness: "Fighting ×2",
      resistance: "None",
      retreatCost: "1",
      illustrator: "Ken Sugimori",
    },
    'bulbasaur': {
      name: "Bulbasaur",
      type: "Grass",
      hp: "40",
      abilities: [
        {
          name: "Leech Seed",
          description: "Remove 1 damage counter from Bulbasaur.",
          value: "20",
        }
      ],
      weakness: "Fire ×2",
      resistance: "Water -30",
      retreatCost: "1",
      illustrator: "Mitsuhiro Arita",
    }
  };
  
  // Fetch card data when component mounts or cardId changes
  onMount(() => {
    fetchCardData();
  });
  
  createEffect(() => {
    // This will re-run when cardId changes
    if (params.cardId) {
      fetchCardData();
    }
  });
  
  // Function to fetch card data based on cardId
  const fetchCardData = () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      setTimeout(() => {
        const card = cardDatabase[cardId.toLowerCase()];
        
        if (card) {
          setCardData(card);
        } else {
          setError(`Card with ID '${cardId}' not found`);
        }
        
        setIsLoading(false);
      }, 500);
    } catch (err) {
      setError('Failed to load card data');
      setIsLoading(false);
    }
  };

  const handleBackClick = () => {
    console.log("Ke halaman cardlist");
    // navigate('/deckeditor');
  };

  return (
    <div class={styles.pageContainer}>
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

      <div class={styles.showcaseSection}>
        <h2>Card Details: {cardId}</h2>

        {/* Loading State */}
        {isLoading() && (
          <div class={cardStyles.loadingContainer}>
            <div class={cardStyles.loadingSpinner}></div>
            <p>Loading card data...</p>
          </div>
        )}

        {/* Error State */}
        {error() && !isLoading() && (
          <div class={cardStyles.errorContainer}>
            <p class={cardStyles.errorMessage}>{error()}</p>
            <button 
              class={cardStyles.retryButton}
              onClick={fetchCardData}
            >
              Retry
            </button>
          </div>
        )}

        {/* Card Data */}
        {!isLoading() && !error() && cardData() && (
          <div class={styles.card}>
            <div class={cardStyles.cardContainer}>
              {/* Card Image Placeholder */}
              <div class={cardStyles.imageContainer}>
                <div class={cardStyles.imagePlaceholder}>
                  <img class={cardStyles.placeholderSvg} src={poke} alt={cardData().name} />
                </div>
              </div>

              {/* Card Info Panel */}
              <div class={cardStyles.infoContainer}>
                {/* Header */}
                <div class={cardStyles.cardHeader}>
                  <h3 class={`${styles.cardHeader} ${cardStyles.headerTitle}`}>
                    {cardData().name}
                  </h3>
                </div>

                {/* Type and HP Row */}
                <div class={cardStyles.typeHpRow}>
                  <div class={cardStyles.typeCell}>
                    <span class={styles.subtext1}>{cardData().type}</span>
                  </div>
                  <div class={cardStyles.hpCell}>
                    <span class={styles.subtext1}>{cardData().hp}</span>
                  </div>
                </div>

                {/* Abilities */}
                <div class={cardStyles.abilitiesSection}>
                  {cardData().abilities.map((ability, index) => (
                    <div class={cardStyles.abilityItem}>
                      <div class={cardStyles.abilityContent}>
                        <div
                          class={`${styles.textDefault} ${cardStyles.abilityName}`}
                        >
                          {ability.name}
                        </div>
                        <div
                          class={`${styles.subtext0} ${cardStyles.abilityDescription}`}
                        >
                          {ability.description}
                        </div>
                      </div>
                      <div
                        class={`${styles.textMauve} ${cardStyles.abilityValue}`}
                      >
                        {ability.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Stats Section */}
                <div class={cardStyles.statsSection}>
                  {/* Stats Header */}
                  <div class={cardStyles.statsHeader}>
                    <div class={cardStyles.statHeaderItem}>
                      <span class={`${styles.subtext1} ${cardStyles.statLabel}`}>
                        Weakness
                      </span>
                    </div>
                    <div class={cardStyles.statHeaderItem}>
                      <span class={`${styles.subtext1} ${cardStyles.statLabel}`}>
                        Resistance
                      </span>
                    </div>
                    <div class={cardStyles.statHeaderItem}>
                      <span class={`${styles.subtext1} ${cardStyles.statLabel}`}>
                        Retreat Cost
                      </span>
                    </div>
                  </div>

                  {/* Stats Values */}
                  <div class={cardStyles.statsValues}>
                    <div class={cardStyles.statValueItem}>
                      <span
                        class={`${styles.textDefault} ${cardStyles.statValue}`}
                      >
                        {cardData().weakness}
                      </span>
                    </div>
                    <div class={cardStyles.statValueItem}>
                      <span
                        class={`${styles.textDefault} ${cardStyles.statValue}`}
                      >
                        {cardData().resistance}
                      </span>
                    </div>
                    <div class={cardStyles.statValueItem}>
                      <span
                        class={`${styles.textDefault} ${cardStyles.statValue}`}
                      >
                        {cardData().retreatCost}
                      </span>
                    </div>
                  </div>

                  {/* Illustrator */}
                  <div class={cardStyles.illustratorSection}>
                    <span
                      class={`${styles.subtext0} ${cardStyles.illustratorText}`}
                    >
                      Illustrator: {cardData().illustrator}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CardDetails;
