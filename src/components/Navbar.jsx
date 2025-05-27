
import styles from "./navbar.module.css"
import logo from "../assets/images/navbar/PokeDeck (3).png"
import { useNavigate } from "@solidjs/router"
import { A } from "@solidjs/router"
import { useAuth } from "../context/AuthContext"

const Navbar = () => {
  const navigate = useNavigate()
  const { isLoggedIn, logout } = useAuth()

  return (
    <nav class={styles.navbar}>
      <div class={styles["navbar-left"]}>
        <img
          class={styles["logo-placeholder"]}
          src={logo || "/placeholder.svg"}
          alt="logo"
          onclick={() => navigate("/")}
        />
      </div>
      <div class={styles["navbar-center"]}>
        <A href="/cardlist" class={styles["nav-link"]}>
          Card List
        </A>
        <A href="/decklist" class={styles["nav-link"]}>
          Deck
        </A>
        <A href="/about" class={styles["nav-link"]}>
          About
        </A>
      </div>
      <div class={styles["navbar-right"]}>
        {isLoggedIn() ? (
          <button
            class={styles["login-btn"]}
            onClick={() => {
              logout()
              navigate("/")
            }}
          >
            Logout
          </button>
        ) : (
          <A href="/login">
            <button class={styles["login-btn"]}>Login</button>
          </A>
        )}
        <A href="/profile">
          <div class={styles["profile-icon-container"]}>
            <img src={useAuth().profilePicture() || "/placeholder.svg"} alt="Profile" class={styles["profile-icon"]} />
          </div>
        </A>
      </div>
    </nav>
  )
}

export default Navbar
