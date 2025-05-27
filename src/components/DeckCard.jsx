import styles from '../routes/decklist.module.css';

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
