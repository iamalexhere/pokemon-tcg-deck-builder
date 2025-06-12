import styles from "./profile.module.css";
import { createSignal, createEffect, onMount, Show, For } from "solid-js";
import { useAuth } from "../context/AuthContext";
import DeckCard from "../components/DeckCard";
import defaultProfileImage from "../assets/images/icon/Profile.png";
import { getRecentDecks, getFavoriteDecks } from "../services/deckService"; 
import { useNavigate } from "@solidjs/router";
import deckEditor from "./DeckEditor";

function Profile() {
  // Menggunakan hook `useAuth` untuk mengakses data dan fungsi otentikasi.
  const auth = useAuth();

  // State management untuk UI, form, dan data.
  const [activeButton, setActiveButton] = createSignal(
    localStorage.getItem("activeButton") || "recentDecks",
  );
  const [isEditingProfile, setIsEditingProfile] = createSignal(false);
  const [isChangingPassword, setIsChangingPassword] = createSignal(false);
  const [tempUsername, setTempUsername] = createSignal(auth.username || "");
  const [tempPronouns, setTempPronouns] = createSignal(auth.pronouns || "");
  const [tempDescription, setTempDescription] = createSignal(
    auth.description || "",
  );
  const [profilePicture, setProfilePicture] = createSignal(
    auth.profilePicture || defaultProfileImage,
  );
  const [currentPassword, setCurrentPassword] = createSignal("");
  const [newPassword, setNewPassword] = createSignal("");
  const [confirmPassword, setConfirmPassword] = createSignal("");
  const [passwordError, setPasswordError] = createSignal("");
  const [successMessage, setSuccessMessage] = createSignal("");
  const [errorMessage, setErrorMessage] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);
  const [recentDecks, setRecentDecks] = createSignal([]);
  const [favoriteDecks, setFavoriteDecks] = createSignal([]);
  const [usernameError, setUsernameError] = createSignal("");
  const [pronounsError, setPronounsError] = createSignal("");
  const [isUploading, setIsUploading] = createSignal(false);
  const [uploadError, setUploadError] = createSignal("");
  const navigate = useNavigate();

  function handleEditDeck(deck) {
    navigate(`/deckEditor/${deck.id}`);
  }

  // Efek untuk menyimpan tab aktif (Recent/Favorite) ke localStorage.
  createEffect(() => {
    localStorage.setItem("activeButton", activeButton());
  });

  // Memuat data profil dan deck saat komponen pertama kali di-mount.
  onMount(async () => {
    if (auth.isLoggedIn()) {
      try {
        setIsLoading(true);

        setTempUsername(auth.username || "");
        setTempPronouns(auth.pronouns || "");
        setTempDescription(auth.description || "");
        setProfilePicture(auth.profilePicture || defaultProfileImage);

        // Blok try-catch untuk fetch data deck dari API.
        try {
          const recentDecksResponse = await getRecentDecks();
          const favoriteDecksResponse = await getFavoriteDecks();

          if (recentDecksResponse && recentDecksResponse.decks) {
            setRecentDecks(recentDecksResponse.decks);
          } else {
            console.warn(
              'Recent decks response is missing "decks" array:',
              recentDecksResponse,
            );
          }

          if (favoriteDecksResponse && favoriteDecksResponse.decks) {
            setFavoriteDecks(favoriteDecksResponse.decks);
          } else {
            console.warn(
              'Favorite decks response is missing "decks" array:',
              favoriteDecksResponse,
            );
          }
        } catch (error) { // Error handling spesifik untuk fetch deck.
          console.error("Error fetching decks:", error);
          setErrorMessage("Failed to load decks. Please try again later.");
        }
      } catch (error) { // Error handling umum untuk load profile.
        console.error("Error loading profile:", error);
        setErrorMessage("Failed to load profile. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
  });

  // Handler untuk mengubah gambar profil.
  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validasi tipe dan ukuran file.
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setErrorMessage("Please select a valid image file (JPEG, PNG, GIF)");
      return;
    }
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setErrorMessage("Image size should be less than 5MB");
      return;
    }

    setIsUploading(true);
    // Menggunakan FileReader untuk membaca file dan menampilkannya sebagai preview.
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfilePicture(e.target.result);
      setIsUploading(false);
    };
    reader.onerror = () => {
      setErrorMessage("Error reading file");
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // Handler untuk menyimpan perubahan profil.
  const handleSaveProfile = async () => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    // Validasi input.
    if (tempUsername().length < 3) {
      setErrorMessage("Username must be at least 3 characters");
      setIsLoading(false);
      return;
    }

    try {
      const profileData = {
        username: tempUsername(),
        pronouns: tempPronouns(),
        description: tempDescription(),
        profilePicture: profilePicture(),
      };
      // Memanggil fungsi updateProfile dari AuthContext.
      await auth.updateProfile(profileData);
      setIsEditingProfile(false);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) { // Error handling saat update profile.
      console.error("Error updating profile:", error);
      setErrorMessage(
        error.message || "Failed to update profile. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handler untuk mengubah password.
  const handleChangePassword = async () => {
    setIsLoading(true);
    setPasswordError("");
    setErrorMessage("");
    setSuccessMessage("");

    // Validasi input password.
    if (!currentPassword() || !newPassword() || newPassword().length < 5 || newPassword() !== confirmPassword()) {
        setPasswordError("Please check your input.");
        setIsLoading(false);
        return;
    }
    
    try {
      // Memanggil API untuk mengubah password.
      await auth.apiCall("/profile/password", "PUT", {
        currentPassword: currentPassword(),
        newPassword: newPassword(),
      });
      setIsChangingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordError("");
      setSuccessMessage("Password changed successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) { // Error handling saat ganti password.
      console.error("Error changing password:", error);
      setPasswordError(
        error.message || "Failed to change password. Please check your current password.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handler untuk beralih antara tab 'Recent Decks' dan 'Favorite Decks'.
  const toggleDecks = (buttonType) => {
    setActiveButton(buttonType);
  };

  return (
    <>
      <div class={styles.profileContainer}>
        {/* Conditional rendering untuk pesan sukses dan error. */}
        {successMessage() && <div class={styles.successMessage}>{successMessage()}</div>}
        {errorMessage() && <div class={styles.errorMessage}>{errorMessage()}</div>}

        <div class={styles.profileFrame}>
          <div class={styles.fotoProfile}>
            <img
              src={profilePicture()}
              alt="Profile"
              onClick={() => !isEditingProfile() && setIsEditingProfile(true)}
              style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;"
            />
          </div>

          <div class={styles.profileInfo}>
            {/* Conditional rendering antara mode lihat dan mode edit profil. */}
            <Show
              when={!isEditingProfile()}
              fallback={
                <div class={styles.profileEditForm}>
                  <h2>Edit Profile</h2>
                  <div class={styles.formGroup}>
                    <label>Username</label>
                    <input type="text" value={tempUsername()} onInput={(e) => setTempUsername(e.target.value)} maxLength={20} />
                  </div>
                  <div class={styles.formGroup}>
                    <label>Pronouns</label>
                    <input type="text" value={tempPronouns()} onInput={(e) => setTempPronouns(e.target.value)} maxLength={20}/>
                  </div>
                  <div class={styles.formGroup}>
                    <label>Description</label>
                    <textarea value={tempDescription()} onInput={(e) => setTempDescription(e.target.value)} rows={4}/>
                  </div>
                  <div class={styles.formGroup}>
                    <label>Profile Picture</label>
                    <input type="file" accept="image/jpeg,image/png,image/gif" onChange={handleProfilePictureChange} disabled={isUploading()}/>
                    {isUploading() && <span>Uploading...</span>}
                  </div>
                  <div class={styles.profileEditActions}>
                    <button class={styles.saveProfileButton} onClick={handleSaveProfile} disabled={isLoading()}>
                      {isLoading() ? "Saving..." : "Save"}
                    </button>
                    <button class={styles.cancelButton} onClick={() => setIsEditingProfile(false)} disabled={isLoading()}>
                      Cancel
                    </button>
                  </div>
                </div>
              }
            >
              <div class={styles.profileDetails}>
                <h2>{auth.username}</h2>
                <p class={styles.pronouns}>{auth.pronouns}</p>
                <p class={styles.description}>{auth.description}</p>
                <div class={styles.profileActions}>
                  <button class={styles.editProfileButton} onClick={() => setIsEditingProfile(true)} disabled={isLoading()}>
                    Edit Profile
                  </button>
                  <button class={styles.changePasswordButton} onClick={() => setIsChangingPassword(true)} disabled={isLoading()}>
                    Change Password
                  </button>
                </div>
              </div>
            </Show>
          </div>
        </div>

        {/* Modal untuk ganti password, ditampilkan secara kondisional. */}
        <Show when={isChangingPassword()}>
          <div class={styles.passwordChangeModal}>
            <div class={styles.modalContent}>
              <h2>Change Password</h2>
              <div class={styles.formGroup}>
                <label>Current Password</label>
                <input type="password" value={currentPassword()} onInput={(e) => setCurrentPassword(e.target.value)}/>
              </div>
              <div class={styles.formGroup}>
                <label>New Password</label>
                <input type="password" value={newPassword()} onInput={(e) => setNewPassword(e.target.value)} />
              </div>
              <div class={styles.formGroup}>
                <label>Confirm New Password</label>
                <input type="password" value={confirmPassword()} onInput={(e) => setConfirmPassword(e.target.value)} />
              </div>
              {passwordError() && <div class={styles.errorMessage}>{passwordError()}</div>}
              <div class={styles.passwordChangeActions}>
                <button class={styles.savePasswordButton} onClick={handleChangePassword} disabled={isLoading()}>
                  {isLoading() ? "Changing..." : "Change Password"}
                </button>
                <button class={styles.cancelButton} onClick={() => setIsChangingPassword(false)} disabled={isLoading()}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </Show>

        {/* Bagian untuk menampilkan daftar deck. */}
        <div class={styles.deckSection}>
          <div class={styles.deckButtonFrame}>
            <button class={`${styles.deckButton} ${activeButton() === "recentDecks" ? styles.activeButton : styles.inactiveButton}`} onClick={() => toggleDecks("recentDecks")}>
              Recent Decks
            </button>
            <button class={`${styles.deckButton} ${activeButton() === "favoriteDecks" ? styles.activeButton : styles.inactiveButton}`} onClick={() => toggleDecks("favoriteDecks")}>
              Favorite Decks
            </button>
          </div>
          <div class={styles.deckList}>
            {/* Conditional rendering untuk tab Recent vs Favorite. */}
            <Show when={activeButton() === "recentDecks"} fallback={
                <div class={styles.favoriteDeck}>
                  {favoriteDecks().length > 0 ? (
                    <For each={favoriteDecks()}>{(deck) => <div onClick={() => handleEditDeck(deck)} style={{ cursor: "pointer" }}><DeckCard deck={deck} /></div>}</For>
                  ) : (<p class={styles.noDeckMessage}>No favorite decks yet</p>)}
                </div>
              }>
              <div class={styles.recentDeck}>
                {recentDecks().length > 0 ? (
                  <For each={recentDecks()}>{(deck) => <div onClick={() => handleEditDeck(deck)} style={{ cursor: "pointer" }}><DeckCard deck={deck} /></div>}</For>
                ) : (<p class={styles.noDeckMessage}>No recent decks yet</p>)}
              </div>
            </Show>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;