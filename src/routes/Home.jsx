import styles from './home.module.css';

function Home() {
  // Catppuccin Mocha Palette
  const catppuccinMochaPalette = [
    { name: 'Rosewater', hex: '#f5e0dc' },
    { name: 'Flamingo', hex: '#f2cdcd' },
    { name: 'Pink', hex: '#f5c2e7' },
    { name: 'Mauve', hex: '#cba6f7' },
    { name: 'Red', hex: '#f38ba8' },
    { name: 'Maroon', hex: '#eba0ac' },
    { name: 'Peach', hex: '#fab387' },
    { name: 'Yellow', hex: '#f9e2af' },
    { name: 'Green', hex: '#a6e3a1' },
    { name: 'Teal', hex: '#94e2d5' },
    { name: 'Sky', hex: '#89dceb' },
    { name: 'Sapphire', hex: '#74c7ec' },
    { name: 'Blue', hex: '#89b4fa' },
    { name: 'Lavender', hex: '#b4befe' },
    { name: 'Text', hex: '#cdd6f4' },
    { name: 'Subtext1', hex: '#bac2de' },
    { name: 'Subtext0', hex: '#a6adc8' },
    { name: 'Overlay2', hex: '#9399b2' },
    { name: 'Overlay1', hex: '#7f849c' },
    { name: 'Overlay0', hex: '#6c7086' },
    { name: 'Surface2', hex: '#585b70' },
    { name: 'Surface1', hex: '#45475a' },
    { name: 'Surface0', hex: '#313244' },
    { name: 'Base', hex: '#1e1e2e' },
    { name: 'Mantle', hex: '#181825' },
    { name: 'Crust', hex: '#11111b' },
  ];
  const showcasePalette = catppuccinMochaPalette.filter(color =>
    ['Rosewater', 'Mauve', 'Red', 'Peach', 'Yellow', 'Green', 'Teal', 'Sapphire', 'Blue', 'Lavender', 'Text', 'Base', 'Surface0', 'Crust'].includes(color.name)
  );


  return (
    <div class={styles.pageContainer}>
      <section class={styles.heroSection}>
        <div class={styles.heroContent}>
          <h1>Lorem ipsum dolor sit amet</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <button class={styles.learnMoreButton}>Learn More</button>
        </div>
        <div class={styles.imagePlaceholder}>
          <span>Image Placeholder</span>
        </div>
      </section>

      <section class={styles.paletteShowcase}>
        <h3>Catppuccin Mocha</h3>
        <div class={styles.colorBar}>
          {showcasePalette.map(color => (
            <div
              key={color.name}
              class={styles.colorSwatch}
              style={{ "background-color": color.hex }}
              title={`${color.name} - ${color.hex}`}
            >
              <span class={styles.swatchName}>{color.name}</span>
              <span class={styles.swatchHex}>{color.hex}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;