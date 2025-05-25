import styles from "./home.module.css";
import poke from "../assets/images/home/home_img.png";

function Home() {
  return (
    <div class={styles.pageContainer}>
      <section class={styles.heroSection}>
        <div class={styles.heroContent}>
          <h1>Pokemon Deck Builder</h1>
          <h3>
            The Pokémon TCG website is a platform that provides comprehensive
            information about the Pokémon Trading Card Game.
          </h3>
          <button class={styles.learnMoreButton}>Learn More</button>
        </div>
        <img class={styles.imagePlaceholder} src={poke} alt="home_img" />
      </section>
    </div>
  );
}

export default Home;
