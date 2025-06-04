import { createSignal, createEffect, onMount } from "solid-js";
import styles from "./styleGuide.module.css";
import cardStyles from "./carddetail.module.css";
import poke from "../assets/images/placeholder.jpg"; // Fallback placeholder
import { useNavigate, useParams } from "@solidjs/router";
import { getCardById } from "../services/cardService";

function CardDetails() {
  const navigate = useNavigate();
  const params = useParams();
  const cardId = params.cardId;

  const [cardData, setCardData] = createSignal(null); // Will hold the { data: { ... } } structure
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal(null);

  onMount(fetchCardData);

  createEffect(() => {
    if (params.cardId && params.cardId !== (cardData() && cardData().data ? cardData().data.id : null)) {
      fetchCardData();
    }
  });

  async function fetchCardData() {
    if (!cardId) {
      setError("Card ID is missing.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await getCardById(cardId); // Assuming this returns { data: { ... } }
      console.log("Fetched card details:", response);

      if (response && response.data) {
        setCardData(response); // Store the whole response { data: { ... } }
      } else if (response && !response.data) { // Case where response is an object but no 'data' field
        setCardData(null);
        setError(`Card data format is incorrect for ID '${cardId}'.`);
      }
      else {
        setCardData(null);
        setError(`Card with ID '${cardId}' not found or invalid response.`);
      }
    } catch (err) {
      console.error("Error fetching card data:", err);
      setCardData(null);
      setError("Failed to load card data. Please check the console for more details.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleBackClick = () => navigate("/cardlist");

  // Helper to format weaknesses/resistances
  const formatStatEntry = (entryArray) => {
    if (!entryArray || entryArray.length === 0) {
      return "None";
    }
    const entry = entryArray[0]; // Assuming we only display the first one
    return `${entry.type} ${entry.value}`;
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
        {/* Ensure cardData() and cardData().data exist before trying to access properties */}
        {!isLoading() && !error() && cardData() && cardData().data && (
          <div class={styles.card}>
            <div class={cardStyles.cardContainer}>
              {/* Card Image */}
              <div class={cardStyles.imageContainer}>
                <div class={cardStyles.imagePlaceholder}>
                  <img
                    class={cardStyles.placeholderSvg} /* You might want a different class for actual images */
                    // MODIFIED LINE BELOW:
                    src={cardData().data.images?.large || cardData().data.images?.small || poke}
                    alt={cardData().data.name || "Card image"}
                    onError={(e) => { e.target.src = poke; }} // Fallback to placeholder if image fails to load
                  />
                </div>
              </div>

              {/* Card Info Panel */}
              <div class={cardStyles.infoContainer}>
                {/* Header */}
                <div class={cardStyles.cardHeader}>
                  <h3 class={`${styles.cardHeader} ${cardStyles.headerTitle}`}>
                    {cardData().data.name || "Unknown Card"}
                  </h3>
                  {cardData().data.supertype && (
                     <span class={`${styles.subtext0} ${cardStyles.supertypeText}`}>
                        {cardData().data.supertype}
                     </span>
                  )}
                </div>

                {/* Type and HP Row */}
                <div class={cardStyles.typeHpRow}>
                  <div class={cardStyles.typeCell}>
                    <span class={styles.subtext1}>
                      {cardData().data.types?.join(", ") || "N/A"}
                    </span>
                  </div>
                  <div class={cardStyles.hpCell}>
                    <span class={styles.subtext1}>
                      {cardData().data.hp ? `HP ${cardData().data.hp}` : "N/A"}
                    </span>
                  </div>
                </div>

                {/* Attacks (replaces Abilities) */}
                <div class={cardStyles.abilitiesSection}> {/* Keeping class name for now, but semantically it's 'attacks' */}
                  <h4 class={cardStyles.sectionTitle}>Attacks</h4>
                  {cardData().data.attacks && cardData().data.attacks.length > 0 ? (
                    cardData().data.attacks.map((attack, index) => (
                      <div class={cardStyles.abilityItem} key={index}>
                        <div class={cardStyles.abilityContent}>
                          <div
                            class={`${styles.textDefault} ${cardStyles.abilityName}`}
                          >
                            {attack.name}
                            {attack.cost && attack.cost.length > 0 && (
                              <span class={cardStyles.attackCost}>
                                {" (" + attack.cost.join(", ") + ")"}
                              </span>
                            )}
                          </div>
                          <div
                            class={`${styles.subtext0} ${cardStyles.abilityDescription}`}
                          >
                            {attack.text || "No description."}
                          </div>
                        </div>
                        {attack.damage && (
                          <div
                            class={`${styles.textMauve} ${cardStyles.abilityValue}`}
                          >
                            {attack.damage}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p class={`${styles.subtext0} ${cardStyles.noItemsText}`}>No attacks listed.</p>
                  )}
                </div>

                {/* Stats Section */}
                <div class={cardStyles.statsSection}>
                  <h4 class={cardStyles.sectionTitle}>Details</h4>
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
                        {formatStatEntry(cardData().data.weaknesses)}
                      </span>
                    </div>
                    <div class={cardStyles.statValueItem}>
                      <span
                        class={`${styles.textDefault} ${cardStyles.statValue}`}
                      >
                        {formatStatEntry(cardData().data.resistances)}
                      </span>
                    </div>
                    <div class={cardStyles.statValueItem}>
                      <span
                        class={`${styles.textDefault} ${cardStyles.statValue}`}
                      >
                        {cardData().data.retreatCost?.join(", ") || "None"}
                      </span>
                    </div>
                  </div>

                  {/* Other Details: Rarity, Set */}
                  <div class={cardStyles.otherDetailsSection}>
                     {cardData().data.rarity && (
                        <div class={cardStyles.detailItem}>
                           <span class={`${styles.subtext0} ${cardStyles.detailLabel}`}>Rarity:</span>
                           <span class={`${styles.textDefault} ${cardStyles.detailValue}`}>{cardData().data.rarity}</span>
                        </div>
                     )}
                     {cardData().data.set && cardData().data.set.name && (
                        <div class={cardStyles.detailItem}>
                           <span class={`${styles.subtext0} ${cardStyles.detailLabel}`}>Set:</span>
                           <span class={`${styles.textDefault} ${cardStyles.detailValue}`}>{cardData().data.set.name}</span>
                        </div>
                     )}
                    {/* The original 'Illustrator' field is not in the provided JSON sample under 'data'.
                        If it can sometimes be present, you would access it via cardData().data.illustrator
                        Example:
                        {cardData().data.illustrator && (
                          <div class={cardStyles.detailItem}>
                            <span class={`${styles.subtext0} ${cardStyles.detailLabel}`}>Illustrator:</span>
                            <span class={`${styles.textDefault} ${cardStyles.detailValue}`}>{cardData().data.illustrator}</span>
                          </div>
                        )}
                    */}
                    {/* Displaying description from JSON if available */}
                    {cardData().data.description && cardData().data.description.trim() !== "" && (
                         <div class={cardStyles.descriptionSection}>
                            <h5 class={`${styles.subtext1} ${cardStyles.detailLabel}`}>Description:</h5>
                            <p class={`${styles.subtext0} ${cardStyles.illustratorText}`}> {/* Reusing illustratorText style for now */}
                                {cardData().data.description}
                            </p>
                         </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Data but no error and not loading (e.g., card not found or malformed data) */}
        {!isLoading() && !error() && (!cardData() || !cardData().data) && (
             <div class={cardStyles.errorContainer}>
                <p class={cardStyles.errorMessage}>Card data could not be displayed. The card might not exist or the data is incomplete.</p>
             </div>
        )}
      </div>
    </div>
  );
}

export default CardDetails;