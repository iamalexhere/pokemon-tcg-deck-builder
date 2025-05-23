import { createSignal, onMount } from 'solid-js';
import { pokemonTcg } from '../lib/pokemontcg.io';

function PokemonSearchTest() {
  const [searchResults, setSearchResults] = createSignal(null);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal(null);

  const performSearch = async () => {
    setIsLoading(true);
    setError(null);
    setSearchResults(null);
    try {
      // Example: Search for all cards with "Charizard" in the name
      // The API uses Lucene query syntax for the 'q' parameter.
      // For more search parameters, see https://docs.pokemontcg.io/api-reference/cards/search-cards
      const query = { q: 'name:Charizard' , pageSize: 5 }; 
      const response = await pokemonTcg.card.where(query);
      setSearchResults(response);
      console.log('Search Results:', response); // Log to console
    } catch (err) {
      console.error('Search Error:', err);
      setError(err.message || 'Failed to fetch data');
    }
    setIsLoading(false);
  };

  // Perform search when component mounts
  onMount(() => {
    performSearch();
  });

  return (
    <div>
      <h1>Pokemon TCG API Test</h1>
      {isLoading() && <p>Loading...</p>}
      {error() && <p style={{ color: 'red' }}>Error: {error()}</p>}
      {searchResults() && (
        <pre>
          {JSON.stringify(searchResults(), null, 2)}
        </pre>
      )}
    </div>
  );
}

export default PokemonSearchTest;
