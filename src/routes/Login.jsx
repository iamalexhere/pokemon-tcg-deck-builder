import styles from './login.module.css';
import loginImage from '../assets/images/LoginPage/test.jpg';
import { A } from "@solidjs/router";
import { createSignal, Switch, Match, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { FiEye, FiEyeOff } from "solid-icons/fi";
import { useAuth } from '../context/AuthContext';

function Login() {
    const [username, setUsername] = createSignal("");
    const [password, setPassword] = createSignal("");
    const [showPassword, setShowPassword] = createSignal(false);
    const [usernameError, setUsernameError] = createSignal("");
    const [passwordError, setPasswordError] = createSignal("");
    const [formError, setFormError] = createSignal("");
    const [isSubmitting, setIsSubmitting] = createSignal(false);
    const navigate = useNavigate();
    const auth = useAuth();

    // Validate username input
    const validateUsername = (value) => {
        if (!value.trim()) {
            setUsernameError("Username is required");
            return false;
        }
        if (value.length < 3) {
            setUsernameError("Username must be at least 3 characters");
            return false;
        }
        setUsernameError("");
        return true;
    };

    // Validate password input
    const validatePassword = (value) => {
        if (!value) {
            setPasswordError("Password is required");
            return false;
        }
        if (value.length < 4) {
            setPasswordError("Password must be at least 4 characters");
            return false;
        }
        setPasswordError("");
        return true;
    };

    // Handle username input change
    const handleUsernameChange = (e) => {
        const value = e.target.value;
        setUsername(value);
        if (formError()) setFormError("");
        validateUsername(value);
    };

    // Handle password input change
    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        if (formError()) setFormError("");
        validatePassword(value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormError("");
        
        // Validate all fields
        if (!validateUsername(username())) {
            return;
        }
        
        if (!validatePassword(password())) {
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            // Call login function from AuthContext with credentials
            await auth.login({
                username: username(),
                password: password()
            });
            
            // If login is successful, navigate to home
            navigate("/", { replace: true });
        } catch (error) {
            // Display error message
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

                <Show when={formError()}>
                    <div class={styles.formErrorOverlay}>
                        <div class={styles.formErrorMessage}>{formError()}</div>
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
                                        placeholder='Enter your username (Mock Data: user)'
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
                                        placeholder='Enter your password (Mock Data: pass)'
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