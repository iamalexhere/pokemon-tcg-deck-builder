import styles from '../routes/decklist.module.css';

/**
 * Komponen untuk menampilkan kartu deck individual
 * 
 * @component
 * @param {Object} props
 * @param {Object} props.deck - Data deck yang akan ditampilkan
 * @param {string} props.deck.name - Nama deck
 * @param {string} props.deck.imageUrl - URL gambar deck
 * @param {Function} props.onClick - Handler ketika kartu diklik
 */
function DeckCard({ deck, onClick }) {

  return (
    <div class={styles.deckCard} onClick={onClick}>
      <div class={styles.deckImagePlaceholder}>
        {deck.imageUrl 
          ? <img src={deck.imageUrl} alt={deck.name} /> 
          : <span>Deck Image</span>
        }
      </div>
      <div class={styles.deckName}>
        {deck.name}
      </div>
    </div>
  );
}

export default DeckCard;
