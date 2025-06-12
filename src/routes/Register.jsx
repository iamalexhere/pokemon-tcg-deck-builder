import styles from './register.module.css';
import loginImage from '../assets/images/LoginPage/test.jpg';
import { A } from "@solidjs/router";
import { createSignal, Switch, Match, createEffect, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { FiEye, FiEyeOff } from "solid-icons/fi";
import { useAuth } from '../context/AuthContext';

function FormRegister(){
    // State management untuk input form, visibilitas password, dan error.
    const [username, setUsername] = createSignal("");
    const [password, setPassword] = createSignal("");
    const [confirmPassword, setConfirmPassword] = createSignal("");
    const [showPassword, setShowPassword] = createSignal(false);
    const [showConfirmPassword, setShowConfirmPassword] = createSignal(false);
    const [formError, setFormError] = createSignal("");
    const [isSubmitting, setIsSubmitting] = createSignal(false);
    const navigate = useNavigate();
    // Menggunakan hook `useAuth` untuk mengakses fungsi register dari context.
    const auth = useAuth();
    
    // Handler untuk submit form registrasi.
    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormError("");

        // Validasi semua field sebelum submit.
        if(username().length < 3){
            setFormError('Username must be at least 3 characters.');
            return;
        }
        if(password().length < 5){
            setFormError('Password must be at least 5 characters.');
            return;
        }
        if(password() !== confirmPassword()){
            setFormError('Passwords do not match.');
            return;
        }

        setIsSubmitting(true);
        
        // Blok try-catch untuk menangani proses registrasi dan kemungkinan error.
        try {
            await auth.register({
                username: username(),
                name: username(),
                password: password()
            });

            // Jika registrasi berhasil, navigasi ke halaman login.
            navigate("/login", {replace: true});
        } catch (error) {
            // State management untuk error handling: menampilkan pesan error.
            setFormError(error.message || 'Registration failed. Please try again.');
            console.error("Registration error:", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    // `createEffect` untuk validasi username secara real-time.
    const [usernameError, setUsernameError] = createSignal("");
    createEffect(() => {
        if(username().length>0 && username().length < 3) {
            setUsernameError("Username must be at least 3 characters.")
        } 
        else {
            setUsernameError("")
        }
    })

    // `createEffect` untuk validasi panjang password secara real-time.
    const [passwordError, setPasswordError] = createSignal("");
    createEffect(() => {
        if(password().length>0 && password().length < 5) {
            setPasswordError("Password must be at least 5 characters.")
        } 
        else {
            setPasswordError("")
        }
    })

    // `createEffect` untuk validasi konfirmasi password secara real-time.
    const [confirmPasswordError, setConfirmPasswordError] = createSignal("");
    createEffect(() => {
        if(confirmPassword().length>0 && password() !== confirmPassword()) {
            setConfirmPasswordError("Password does not match.")
        } 
        else {
            setConfirmPasswordError("")
        }
    })

    return (
        <form method="post" class={styles.loginForm} onsubmit={handleSubmit}>
            <Show when={formError()}>
                <p class={styles.Error}>{formError()}</p>
            </Show>

            <table class={styles.formTable}>
                <tbody>
                    <tr class={styles.UsernameCell}>
                        <td class={styles.Error}>
                            <p>{usernameError()}</p>
                        </td>
                        <td>
                            Username
                            <input 
                                type="text" 
                                class={styles.inputUsername}
                                value={username()}
                                onInput={(e) => setUsername(e.target.value)}
                                placeholder='Enter your username'
                            />
                        </td>
                    </tr>
                    <tr class={styles.PasswordCell}>
                        <td>
                            <div>
                                Password
                                <div class={styles.inputPasswordCell}>
                                    <input 
                                        type={showPassword() ? "text" : "password"} 
                                        name="" 
                                        id="" 
                                        class={styles.inputPassword} 
                                        value={password()}
                                        onInput={(e) => setPassword(e.target.value)}
                                        placeholder='Enter your password'
                                    />    
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword())}
                                        class={styles.showPasswordButton}
                                    >
                                        <Switch>
                                            <Match when={showPassword()}>
                                                <FiEyeOff size={20} color="grey" />
                                            </Match>
                                            <Match when={!showPassword()}>
                                                <FiEye size={20} color="grey" />
                                            </Match>
                                        </Switch>
                                    </button>
                                </div>
                            </div>
                        </td>
                        <td class={styles.Error}>
                            <p>{passwordError()}</p>
                        </td>
                    </tr>
                    <tr class={styles.ConfirmPasswordCell}>
                        <td>
                            <div>
                                Confirm Password
                                <div class={styles.inputPasswordCell}>
                                    <input 
                                        type={showConfirmPassword() ? "text" : "password"} 
                                        name="" 
                                        id="" 
                                        class={styles.inputPassword} 
                                        value={confirmPassword()}
                                        onInput={(e) => setConfirmPassword(e.target.value)}
                                        placeholder='Confirm your password'
                                    />    
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword())}
                                        class={styles.showPasswordButton}
                                    >
                                        <Switch>
                                            <Match when={showConfirmPassword()}>
                                                <FiEyeOff size={20} color="grey" />
                                            </Match>
                                            <Match when={!showConfirmPassword()}>
                                                <FiEye size={20} color="grey" />
                                            </Match>
                                        </Switch>
                                    </button>
                                </div>
                            </div>
                        </td>
                        <td class={styles.Error}>
                            <p>{confirmPasswordError()}</p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <button type="submit" class={styles.loginButton} disabled={isSubmitting()}>
                                {/* Menampilkan status loading pada tombol. */}
                                {isSubmitting() ? 'Registering...' : 'Register'}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <p>Already have an account? <A href="/login">Login.</A></p>

        </form>
    )
}


function Register() {
    return(
        <div class={styles.mainContainer}>
            <div class={styles.formContainer}>
                <h1 class={styles.title}>Register</h1>
                <FormRegister/>
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

export default Register;