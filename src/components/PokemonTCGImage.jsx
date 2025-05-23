import { Show, createSignal, onMount, createEffect } from 'solid-js';
import styles from './PokemonTCGImage.module.css'; // We'll create this for basic styling

function PokemonTCGImage(props) {
  const [imageSrc, setImageSrc] = createSignal(null);
  const [isLoading, setIsLoading] = createSignal(true);
  const [hasError, setHasError] = createSignal(false);

  console.log(`PokemonTCGImage: Initializing for ${props.name}, size: ${props.size}`);
  console.log(`PokemonTCGImage: Received props - small: ${props.imageUrlSmall}, large: ${props.imageUrlLarge}`);

  onMount(() => {
    console.log(`PokemonTCGImage (${props.name}): onMount triggered`);
    const srcToLoad = props.size === 'large' ? props.imageUrlLarge : props.imageUrlSmall;
    if (srcToLoad) {
      console.log(`PokemonTCGImage (${props.name}): Setting imageSrc to ${srcToLoad}`);
      setImageSrc(srcToLoad);
    } else {
      console.log(`PokemonTCGImage (${props.name}): srcToLoad is falsy. Checking individual props.`);
      if (props.imageUrlLarge) {
        console.log(`PokemonTCGImage (${props.name}): Setting imageSrc to large: ${props.imageUrlLarge}`);
        setImageSrc(props.imageUrlLarge);
      } else if (props.imageUrlSmall) {
        console.log(`PokemonTCGImage (${props.name}): Setting imageSrc to small: ${props.imageUrlSmall}`);
        setImageSrc(props.imageUrlSmall);
      } else {
        console.log(`PokemonTCGImage (${props.name}): No valid image URL found, setting error.`);
        setIsLoading(false);
        setHasError(true); // Or treat as no image available
      }
    }
  });

  createEffect(() => {
    console.log(`PokemonTCGImage (${props.name}): imageSrc changed to: ${imageSrc()}`);
    console.log(`PokemonTCGImage (${props.name}): isLoading: ${isLoading()}, hasError: ${hasError()}`);
  });

  const handleImageLoad = () => {
    console.log(`PokemonTCGImage (${props.name}): Image loaded successfully: ${imageSrc()}`);
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    console.log(`PokemonTCGImage (${props.name}): Image failed to load: ${imageSrc()}`);
    setIsLoading(false);
    setHasError(true);
    console.error(`Failed to load image: ${imageSrc()}`);
  };

  return (
    <div class={`${styles.imageContainer} ${props.class || ''}`}>
      {/* Show loading placeholder if isLoading is true and no error has occurred */}
      <Show when={isLoading() && !hasError()}>
        <div class={`${styles.placeholder} ${styles.loading}`}>Loading...</div>
      </Show>

      {/* Show error placeholder if hasError is true */}
      <Show when={hasError()}>
        <div class={`${styles.placeholder} ${styles.error}`}>Image not available</div>
      </Show>

      {/* Show placeholder if no imageSrc could be determined and it's not loading/error from image element yet*/}
      {/* This covers the case where props might not provide any valid URLs initially */}
      <Show when={!imageSrc() && !isLoading() && !hasError()}>
        <div class={`${styles.placeholder} ${styles.noImageAvailable}`}>No image URL</div>
      </Show>

      {/* Render the image element if imageSrc is set and there's no error */}
      {/* The image will attempt to load. Its visibility is controlled by isLoading state. */}
      <Show when={imageSrc() && !hasError()}>
        <img 
          class={styles.pokemonImage}
          src={imageSrc()} 
          alt={`Image of ${props.name}`}
          onLoad={handleImageLoad} 
          onError={handleImageError}
          // Hide the image element itself while loading to prevent broken image icons flashing
          // It will become 'block' (or its default display) when isLoading is false
          style={{ display: isLoading() ? 'none' : 'block' }} 
        />
      </Show>
    </div>
  );
}

export default PokemonTCGImage;