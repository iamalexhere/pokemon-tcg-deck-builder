import styles from './login.module.css';
import loginImage from '../assets/images/LoginPage/test.jpg';
import { A } from "@solidjs/router";
import { createSignal, Switch, Match, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { FiEye, FiEyeOff } from "solid-icons/fi";
import { useAuth } from '../context/AuthContext';

function Login() {
    // State management untuk input form, visibilitas password, dan error.
    const [username, setUsername] = createSignal("");
    const [password, setPassword] = createSignal("");
    const [showPassword, setShowPassword] = createSignal(false);
    const [usernameError, setUsernameError] = createSignal("");
    const [passwordError, setPasswordError] = createSignal("");
    const [formError, setFormError] = createSignal("");
    const [isSubmitting, setIsSubmitting] = createSignal(false);
    const navigate = useNavigate();
    // Menggunakan hook `useAuth` untuk mengakses fungsi login dari context.
    const auth = useAuth();

    // Fungsi untuk validasi input username.
    const validateUsername = (value) => {
        if (!value.trim()) {
            setUsernameError("Username is required");
            return false;
        }
        setUsernameError("");
        return true;
    };

    // Fungsi untuk validasi input password.
    const validatePassword = (value) => {
        if (!value) {
            setPasswordError("Password is required");
            return false;
        }
        setPasswordError("");
        return true;
    };

    // Handler untuk perubahan input username.
    const handleUsernameChange = (e) => {
        const value = e.target.value;
        setUsername(value);
        if (formError()) setFormError("");
        validateUsername(value);
    };

    // Handler untuk perubahan input password.
    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        if (formError()) setFormError("");
        validatePassword(value);
    };

    // Handler untuk submit form login.
    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormError("");
        
        // Validasi semua field sebelum submit.
        if (!validateUsername(username()) || !validatePassword(password())) {
            return;
        }
        
        setIsSubmitting(true);
        
        // Blok try-catch untuk menangani proses login dan kemungkinan error.
        try {
            // Memanggil fungsi login dari AuthContext.
            await auth.login({
                username: username(),
                password: password()
            });
            
            // Jika login berhasil, navigasi ke halaman utama.
            navigate("/", { replace: true });
        } catch (error) {
            // State management untuk error handling: menampilkan pesan error.
            setFormError(error.message || "Invalid username or password");
            console.error("Login error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div class={styles.mainContainer}>

            <div class={styles.formContainer}>

                <h1 class={styles.title}>Login</h1>

                {/* Conditional rendering untuk menampilkan pesan error form. */}
                <Show when={formError()}>
                    <div class={styles.formErrorOverlay}>
                        <div style={{
                            color: '#e53935',
                            fontWeight: 'bold',
                            padding: '10px',
                            marginBottom: '15px',
                            backgroundColor: 'rgba(229, 57, 53, 0.1)',
                            borderRadius: '4px',
                            borderLeft: '4px solid #e53935'
                        }}>
                            {formError()}
                        </div>
                    </div>
                </Show>

                <form method="post" class={styles.loginForm} onsubmit={handleSubmit}>

                    <table class={styles.formTable}>
                        <thead>
                            <tr>
                                <td>
                                    Username
                                    <input 
                                        type="text" 
                                        class={styles.inputUsername}
                                        value={username()}
                                        onInput={handleUsernameChange}
                                        placeholder='Enter your username (jdoe42)'
                                        aria-invalid={!!usernameError()}
                                    />
                                    {usernameError() && <div class={styles.errorText}>{usernameError()}</div>}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Password
                                    <input 
                                        type={showPassword() ? "text" : "password"} 
                                        class={styles.inputPassword} 
                                        value={password()}
                                        onInput={handlePasswordChange}
                                        placeholder='Enter your password (12345)'
                                        aria-invalid={!!passwordError()}
                                    />    
                                    {passwordError() && <div class={styles.errorText}>{passwordError()}</div>}
                                </td>
                                <td class={styles.showPasswordCell}>
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword())}
                                        class={styles.showPasswordButton}
                                    >
                                        <Switch>
                                            <Match when={showPassword()}>
                                                <FiEyeOff size={22} color="grey" />
                                            </Match>
                                            <Match when={!showPassword()}>
                                                <FiEye size={22} color="grey" />
                                            </Match>
                                        </Switch>
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <A href="/register" class={styles.forgotPassword}>Forgot password?</A> 
                                    <button class={styles.loginButton} disabled={isSubmitting()}>
                                        {/* Menampilkan status loading pada tombol saat proses submit. */}
                                        {isSubmitting() ? 
                                            <div class={styles.loadingState}>
                                                <div class={styles.loadingSpinner}></div>
                                                Logging in...
                                            </div> 
                                            : 'Login'}
                                    </button>
                                </td>
                            </tr>
                        </thead>
                    </table>

                    <p>Don't have an account? <A href="/register">Register.</A></p>

                </form>
            </div>
            <div class={styles.imageContainer}>

                <img
                    src={loginImage}
                    alt="Login illustration"
                    class={styles.image}
                />

            </div>
        </div>
    );
}

export default Login;