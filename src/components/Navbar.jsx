
import styles from "./navbar.module.css"
import logo from "../assets/images/navbar/PokeDeck (3).png"
import { useNavigate } from "@solidjs/router"
import { A } from "@solidjs/router"
import { useAuth } from "../context/AuthContext"

/**
 * Komponen Navbar untuk navigasi utama aplikasi
 * 
 * Fitur:
 * - Logo dengan link ke halaman utama
 * - Menu navigasi (Card List, Deck, About)
 * - Tombol Login/Logout berdasarkan status autentikasi
 * - Gambar profil pengguna
 * 
 * Menggunakan context:
 * - AuthContext: untuk status login, logout, dan data profil
 * 
 * @component
 */
const Navbar = () => {
  const navigate = useNavigate()
  const { isLoggedIn, logout, profilePicture } = useAuth()

  return (
    <nav class={styles.navbar}>
      <div class={styles["navbar-left"]}>
        <A href="/">
          <img
            class={styles["logo-placeholder"]}
            src={logo || "/placeholder.svg"}
            alt="logo"
          />
        </A>
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
          <A href="/" onClick={(e) => {
            e.preventDefault()
            logout()
            navigate("/")
          }}>
            <button class={styles["login-btn"]}>
              Logout
            </button>
          </A>
        ) : (
          <A href="/login">
            <button class={styles["login-btn"]}>Login</button>
          </A>
        )}
        <A href="/profile">
          <div class={styles["profile-icon-container"]}>
            <img src={profilePicture() || "/placeholder.svg"} alt="Profile" class={styles["profile-icon"]} />
          </div>
        </A>
      </div>
    </nav>
  )
}

export default Navbar
