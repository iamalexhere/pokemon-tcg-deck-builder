import { createSignal } from "solid-js";
import styles from "./styleGuide.module.css";
import cardStyles from "./carddetail.module.css";
import poke from "../assets/images/placeholder.jpg";
import { useNavigate } from "@solidjs/router";

function CardDetails() {
  const navigate = useNavigate();
  const [cardData] = createSignal({
    name: "Charizard",
    type: "Fire",
    hp: "120",
    abilities: [
      {
        name: "Energy Burn",
        description:
          "All Energy attached to Charizard are Fire Energy instead of their usual type.",
        value: "Passive",
      },
      {
        name: "Fire Spin",
        description:
          "Discard 2 Energy from Charizard in order to use this attack.",
        value: "100",
      },
    ],
    weakness: "Water ×2",
    resistance: "Fighting -30",
    retreatCost: "3",
    illustrator: "Mitsuhiro Arita",
  });

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
        <h2>Card Details</h2>

        <div class={styles.card}>
          <div class={cardStyles.cardContainer}>
            {/* Card Image Placeholder */}
            <div class={cardStyles.imageContainer}>
              <div class={cardStyles.imagePlaceholder}>
                <img class={cardStyles.placeholderSvg} src={poke}></img>
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
      </div>
    </div>
  );
}

export default CardDetails;
