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
  
  // Static card database with generic details
  const cardDatabase = {
    'card-1': {
      name: "Pokemon 1",
      type: "Fire",
      hp: "120",
      abilities: [
        {
          name: "Ability A",
          description: "This is the first ability description. It explains what happens when this ability is used.",
          value: "Passive",
        },
        {
          name: "Ability B",
          description: "This is the second ability description. It has a different effect than the first ability.",
          value: "100",
        },
      ],
      weakness: "Water ×2",
      resistance: "Fighting -30",
      retreatCost: "3",
      illustrator: "Artist Name",
    },
    'card-2': {
      name: "Pokemon 2",
      type: "Water",
      hp: "90",
      abilities: [
        {
          name: "Ability C",
          description: "This water-type ability has a unique effect that can change the battle dynamics.",
          value: "Passive",
        },
        {
          name: "Ability D",
          description: "A powerful attack that requires specific energy to use effectively.",
          value: "70",
        },
      ],
      weakness: "Electric ×2",
      resistance: "None",
      retreatCost: "2",
      illustrator: "Artist Name",
    },
    'card-3': {
      name: "Pokemon 3",
      type: "Grass",
      hp: "80",
      abilities: [
        {
          name: "Ability E",
          description: "A grass-type ability that affects the battlefield in a strategic way.",
          value: "40",
        },
        {
          name: "Ability F",
          description: "This ability can be combined with other cards for increased effectiveness.",
          value: "60",
        }
      ],
      weakness: "Fire ×2",
      resistance: "Water -30",
      retreatCost: "1",
      illustrator: "Artist Name",
    },
    'card-4': {
      name: "Pokemon 4",
      type: "Electric",
      hp: "70",
      abilities: [
        {
          name: "Ability G",
          description: "An electric-type ability that can paralyze opponents.",
          value: "30",
        },
        {
          name: "Ability H",
          description: "A high-damage attack with a potential drawback effect.",
          value: "90",
        }
      ],
      weakness: "Ground ×2",
      resistance: "Flying -20",
      retreatCost: "1",
      illustrator: "Artist Name",
    },
    'card-5': {
      name: "Pokemon 5",
      type: "Psychic",
      hp: "100",
      abilities: [
        {
          name: "Ability I",
          description: "A psychic ability that can confuse the opponent.",
          value: "Passive",
        },
        {
          name: "Ability J",
          description: "This attack deals damage based on specific conditions in the game.",
          value: "50+",
        }
      ],
      weakness: "Dark ×2",
      resistance: "Fighting -30",
      retreatCost: "2",
      illustrator: "Artist Name",
    },
    'card-6': {
      name: "Pokemon 6",
      type: "Normal",
      hp: "110",
      abilities: [
        {
          name: "Ability K",
          description: "A versatile ability that works well in many different situations.",
          value: "40",
        },
        {
          name: "Ability L",
          description: "A powerful finishing move that can quickly end battles.",
          value: "120",
        }
      ],
      weakness: "Fighting ×2",
      resistance: "Ghost -0",
      retreatCost: "3",
      illustrator: "Artist Name",
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
    // Navigate back to the card list page
    navigate('/cardlist');
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
