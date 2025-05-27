import styles from './register.module.css';
import loginImage from '../assets/images/LoginPage/test.jpg';
import { A } from "@solidjs/router";
import { createSignal, Switch, Match } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { FiEye, FiEyeOff } from "solid-icons/fi";
import { style } from 'solid-js/web';

function FormRegister(){
    const [username, setUsername] = createSignal("");
    const [password, setPassword] = createSignal("");
    const [confirmPassword, setConfirmPassword] = createSignal("");
    const [showPassword, setShowPassword] = createSignal(false);
    const [showConfirmPassword, setShowConfirmPassword] = createSignal(false);
    const navigate = useNavigate();
    
    const handleSubmit = (event) => {
        event.preventDefault();

        if(password().length < 8){
            alert('Password must be at least 8 characters.');
            return;
        }

        if(password() !== confirmPassword()) {
            alert('Password does not match.');
            return;
        }

        navigate("/", {replace: true})
    }

    return (
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
                            Confirm Password
                            <input 
                                type={showConfirmPassword() ? "text" : "password"} 
                                name="" 
                                id="" 
                                class={styles.inputPassword} 
                                value={confirmPassword()}
                                onInput={(e) => setConfirmPassword(e.target.value)}
                                placeholder='Re-Enter your password'
                            />    
                        </td>
                        <td class={styles.showPasswordCell}>
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
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {/* <A href='' class={styles.forgotPassword}>Forgot password?</A>  */}
                            <button class={styles.loginButton}>Register</button>
                        </td>
                    </tr>
                </thead>
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