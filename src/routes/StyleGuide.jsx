import styles from './styleGuide.module.css';

function StyleGuide() {
  const accentColors = [
    { name: 'Rosewater', varName: '--ctp-rosewater', textClass: styles.textRosewater, bgClass: styles.bgRosewater },
    { name: 'Flamingo', varName: '--ctp-flamingo', textClass: styles.textFlamingo, bgClass: styles.bgFlamingo },
    { name: 'Pink', varName: '--ctp-pink', textClass: styles.textPink, bgClass: styles.bgPink },
    { name: 'Mauve', varName: '--ctp-mauve', textClass: styles.textMauve, bgClass: styles.bgMauve },
    { name: 'Red', varName: '--ctp-red', textClass: styles.textRed, bgClass: styles.bgRed },
    { name: 'Maroon', varName: '--ctp-maroon', textClass: styles.textMaroon, bgClass: styles.bgMaroon },
    { name: 'Peach', varName: '--ctp-peach', textClass: styles.textPeach, bgClass: styles.bgPeach },
    { name: 'Yellow', varName: '--ctp-yellow', textClass: styles.textYellow, bgClass: styles.bgYellow },
    { name: 'Green', varName: '--ctp-green', textClass: styles.textGreen, bgClass: styles.bgGreen },
    { name: 'Teal', varName: '--ctp-teal', textClass: styles.textTeal, bgClass: styles.bgTeal },
    { name: 'Sky', varName: '--ctp-sky', textClass: styles.textSky, bgClass: styles.bgSky },
    { name: 'Sapphire', varName: '--ctp-sapphire', textClass: styles.textSapphire, bgClass: styles.bgSapphire },
    { name: 'Blue', varName: '--ctp-blue', textClass: styles.textBlue, bgClass: styles.bgBlue },
    { name: 'Lavender', varName: '--ctp-lavender', textClass: styles.textLavender, bgClass: styles.bgLavender },
  ];

  const surfaceColors = [
    { name: 'Surface0', varName: '--ctp-surface0', bgClass: styles.bgSurface0 },
    { name: 'Surface1', varName: '--ctp-surface1', bgClass: styles.bgSurface1 },
    { name: 'Surface2', varName: '--ctp-surface2', bgClass: styles.bgSurface2 },
    { name: 'Mantle', varName: '--ctp-mantle', bgClass: styles.bgMantle },
    { name: 'Base', varName: '--ctp-base', bgClass: styles.bgBase },
    { name: 'Crust', varName: '--ctp-crust', bgClass: styles.bgCrust },
  ];


  return (
    <div class={styles.pageContainer}>
      <h1 style={{ "text-align": 'center', color: 'var(--ctp-mauve)', "margin-bottom": '40px' }}>
        Catppuccin Mocha Theme Showcase
      </h1>

      {/* Typography Section */}
      <section class={styles.showcaseSection}>
        <h2>Typography</h2>
        <p class={styles.textDefault}>Default text (var(--ctp-text))</p>
        <p class={styles.subtext1}>Subtext1 (var(--ctp-subtext1)) - a bit lighter or more subtle.</p>
        <p class={styles.subtext0}>Subtext0 (var(--ctp-subtext0)) - even more subtle.</p>
        <p>Link example: <a href="#">This is a link (var(--ctp-sapphire) / var(--ctp-sky) on hover)</a></p>
        <p>Code example: <code>const example = "var(--ctp-mauve)";</code></p>
        <hr class={styles.divider} />
        <h3>Accent Text Colors:</h3>
        <div class={styles.showcaseGrid} style={{"grid-template-columns": "repeat(auto-fill, minmax(150px, 1fr))"}}>
          {accentColors.map(color => (
            <div class={`${styles.colorBlock} ${color.textClass}`}>
              {color.name}
              <small>{color.varName}</small>
            </div>
          ))}
        </div>
      </section>

      {/* UI Elements Section */}
      <section class={styles.showcaseSection}>
        <h2>UI Elements</h2>
        <p class={styles.textDefault}>Various interactive elements.</p>

        <h3>Buttons:</h3>
        <div class={styles.buttonContainer}>
          <button class={`${styles.showcaseButton} ${styles.buttonPrimary}`}>Primary (Blue)</button>
          <button class={`${styles.showcaseButton} ${styles.buttonSuccess}`}>Success (Green)</button>
          <button class={`${styles.showcaseButton} ${styles.buttonDanger}`}>Danger (Red)</button>
          <button class={`${styles.showcaseButton} ${styles.buttonWarning}`}>Warning (Yellow)</button>
          <button class={`${styles.showcaseButton} ${styles.buttonInfo}`}>Info (Sky)</button>
          <button class={`${styles.showcaseButton} ${styles.buttonAccent}`}>Accent (Mauve)</button>
          <button class={`${styles.showcaseButton} ${styles.buttonSubtle}`}>Subtle (Surface1)</button>
        </div>

        <h3>Input Field:</h3>
        <input type="text" class={styles.inputField} placeholder="Type something here..." />

        <h3>Card Example:</h3>
        <div class={styles.showcaseGrid} style={{"grid-template-columns": "repeat(auto-fill, minmax(300px, 1fr))"}}>
          <div class={styles.card}>
            <h4 class={styles.cardHeader}>Card Title (Peach)</h4>
            <p class={styles.cardBody}>
              This is the body of the card. It uses <strong>Subtext0</strong> for its main content,
              and Subtext1 for emphasis. The card itself uses Surface0 as background.
            </p>
          </div>
          <div class={styles.card} style={{"background-color": "var(--ctp-surface1)"}}>
            <h4 class={styles.cardHeader} style={{color: "var(--ctp-green)"}}>Another Card (Green Title)</h4>
            <p class={styles.cardBody} style={{"color": "var(--ctp-subtext1)"}}>
              This card uses <strong>Surface1</strong> for its background and Subtext1 for its content.
            </p>
          </div>
        </div>
      </section>

      {/* Backgrounds & Surfaces Section */}
      <section class={styles.showcaseSection}>
        <h2>Backgrounds & Surfaces</h2>
        <p class={styles.textDefault}>Different background shades and how text appears on them.</p>
        <h3>Accent Backgrounds:</h3>
        <div class={styles.showcaseGrid} style={{"grid-template-columns": "repeat(auto-fill, minmax(180px, 1fr))"}}>
          {accentColors.slice(0, 8).map(color => ( // Show a subset for brevity
            <div class={`${styles.colorBlock} ${color.bgClass}`}>
              {color.name} BG
              <small>{color.varName}</small>
            </div>
          ))}
        </div>
        <hr class={styles.divider} />
        <h3>Surface & Base Backgrounds:</h3>
        <div class={styles.showcaseGrid} style={{"grid-template-columns": "repeat(auto-fill, minmax(180px, 1fr))"}}>
          {surfaceColors.map(color => (
            <div class={`${styles.colorBlock} ${color.bgClass}`}>
              {color.name}
              <small>{color.varName}</small>
            </div>
          ))}
        </div>
      </section>

       <section class={styles.showcaseSection}>
        <h2>All Accent Swatches (Text on Mantle)</h2>
        <div class={styles.showcaseGrid} style={{"grid-template-columns": "repeat(auto-fill, minmax(130px, 1fr))", "background-color": "var(--ctp-mantle)", padding: "10px", "border-radius": "var(--border-radius-medium)"}}>
          {accentColors.map(color => (
            <div style={{ padding: "10px", color: `var(${color.varName})`, "text-align": "center", "border": "1px solid var(--ctp-surface1)", "border-radius":"var(--border-radius-small)"}}>
              {color.name}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

export default StyleGuide;