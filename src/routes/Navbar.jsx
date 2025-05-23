import styles from "./navbar.module.css";
import logo from "../assets/logo_pokemon.jpeg";

const Navbar = () => {
  return (
    <nav class={styles.navbar}>
      <div class={styles["navbar-left"]}>
        <img
          class={styles["logo-placeholder"]}
          src={logo}
          alt="logo"
        />
      </div>
      <div class={styles["navbar-center"]}>
        <a href="#" class={styles["nav-link"]}>
          Card List
        </a>
        <a href="#" class={styles["nav-link"]}>
          Deck
        </a>
        <a href="#" class={styles["nav-link"]}>
          About
        </a>
      </div>
      <div class={styles["navbar-right"]}>
        <button class={styles["login-btn"]}>Login</button>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class={styles["user-icon"]}
        >
          <path
            fill-rule="evenodd"
            d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </nav>
  );
};

export default Navbar;
