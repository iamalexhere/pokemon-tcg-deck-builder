import { createSignal, onMount, For } from 'solid-js';
import { useParams } from '@solidjs/router';
import { pokemonTcg } from '../lib/pokemontcg.io'; 
import PokemonTCGImage from '../components/PokemonTCGImage'; 
import styles from './SetDisplayPage.module.css';

function SetDisplayPage() {
  const params = useParams();
  const [cards, setCards] = createSignal([]);
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal(null);
  const [setName, setSetName] = createSignal('');

  onMount(async () => {
    const setId = params.setId;
    if (!setId) {
      setError('No set ID provided in the URL.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const query = { q: `set.id:${setId}`, pageSize: 8 }; // for now set page size to 8
      const response = await pokemonTcg.card.where(query);
      console.log(`SetDisplayPage: API response for set ${setId}:`, JSON.parse(JSON.stringify(response)));

      if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
        console.log(`SetDisplayPage: Setting ${response.data.length} cards.`);
        setCards(response.data);
        // Attempt to get set name from the first card (assuming all cards in response are from the same set)
        setSetName(response.data[0].set.name);
      } else {
        setCards([]);
        setError(`No cards found for set ID: ${setId}, or the set is empty or response was not as expected.`);
      }
    } catch (err) {
      console.error(`Error fetching cards for set ${setId}:`, err);
      setError(err.message || `Failed to fetch cards for set ID: ${setId}`);
      setCards([]);
    }
    console.log('SetDisplayPage: onMount finished, setting isLoading to false.');
    setIsLoading(false);
  });

  return (
    <div class={styles.setDisplayPageContainer}>
      <Show when={setName() && !isLoading() && !error()}>
        <h1>Cards from Set: {setName()} ({params.setId})</h1>
      </Show>
      <Show when={!setName() && !isLoading() && !error() && cards().length > 0}>
         <h1>Cards from Set: {params.setId}</h1>
      </Show>

      {isLoading() && <p class={styles.loadingText}>Loading cards for set {params.setId}...</p>}
      {error() && <p class={styles.errorText}>Error: {error()}</p>}
      
      <Show when={!isLoading() && !error() && cards().length === 0 && !error()}>
        <p>No cards to display for this set, or the set ID is invalid.</p>
      </Show>

      <div class={styles.cardGrid}>
        <For each={cards()}>
          {(card, index) => {
            console.log(`SetDisplayPage: Rendering card index ${index()} - ${card.name}, Images:`, JSON.parse(JSON.stringify(card.images)));
            return (
            <div class={styles.cardItem}>
              <PokemonTCGImage 
                name={card.name}
                imageUrlSmall={card.images?.small} 
                imageUrlLarge={card.images?.large}
                size="small"
              />
              {/* Optional: display card name or other details below image */}
              {<p class={styles.cardName}>{card.name}</p> }
            </div>
          )}}
        </For>
      </div>
    </div>
  );
}

export default SetDisplayPage;
