import styles from './login.module.css';
import loginImage from '../assets/images/LoginPage/test.jpg';
import { A } from "@solidjs/router";
import { createSignal, Switch, Match } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { FiEye, FiEyeOff } from "solid-icons/fi";


function Login() {
    const [username, setUsername] = createSignal("");
    const [password, setPassword] = createSignal("");
    const [showPassword, setShowPassword] = createSignal(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // TODO: Replace with real auth call
        const isValid = username() === "user" && password() === "pass";

        if (isValid) {
            navigate("/", { replace: true });
        } else {
            alert("Invalid credentials");
        }
    };

    return (
        <div class={styles.mainContainer}>

            <div class={styles.formContainer}>

                <h1 class={styles.title}>Login</h1>

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
                                        onInput={(e) => setUsername(e.target.value)}
                                        placeholder='Enter your username'
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Password
                                    <input 
                                        type={showPassword() ? "text" : "password"} 
                                        name="" 
                                        id="" 
                                        class={styles.inputPassword} 
                                        value={password()}
                                        onInput={(e) => setPassword(e.target.value)}
                                        placeholder='Enter your password'
                                    />    
                                </td>
                                <td class={styles.showPasswordCell}>
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
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <A href='' class={styles.forgotPassword}>Forgot password?</A> 
                                    <button class={styles.loginButton}>Login</button>
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