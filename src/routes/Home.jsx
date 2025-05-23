import styles from "./home.module.css";
import poke from "../assets/home_img.png";

function Home() {
  return (
    <div class={styles.pageContainer}>
      <section class={styles.heroSection}>
        <div class={styles.heroContent}>
          <h1>Pokemon Deck Builder</h1>
          <p>
            The Pokémon TCG website is a platform that provides comprehensive
            information about the Pokémon Trading Card Game. Users can browse
            and search card lists, build and manage decks, and explore details
            about the latest card sets and game mechanics. Designed for both
            beginners and experienced collectors, the site serves as a digital
            hub for learning strategies and managing collections. With an
            organized and interactive interface, it supports players in
            enhancing their Pokémon TCG experience.
          </p>
          <button class={styles.learnMoreButton}>Learn More</button>
        </div>
        <img class={styles.imagePlaceholder} src={poke} alt="home_img" />
      </section>
    </div>
  );
}

export default Home;
