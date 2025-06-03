import styles from './register.module.css';
import loginImage from '../assets/images/LoginPage/test.jpg';
import { A } from "@solidjs/router";
import { createSignal, Switch, Match, createEffect, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { FiEye, FiEyeOff } from "solid-icons/fi";
import { useAuth } from '../context/AuthContext';

function FormRegister(){
    const [username, setUsername] = createSignal("");
    const [name, setName] = createSignal("");
    const [password, setPassword] = createSignal("");
    const [confirmPassword, setConfirmPassword] = createSignal("");
    const [showPassword, setShowPassword] = createSignal(false);
    const [showConfirmPassword, setShowConfirmPassword] = createSignal(false);
    const [formError, setFormError] = createSignal("");
    const [isSubmitting, setIsSubmitting] = createSignal(false);
    const navigate = useNavigate();
    const auth = useAuth();
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormError("");

        // Validate all fields
        if(username().length < 3){
            setFormError('Username must be at least 3 characters.');
            return;
        }

        if(!name()){
            setFormError('Name is required.');
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

        try {
            // Register the user
            await auth.register({
                username: username(),
                name: name(),
                password: password()
            });

            // If registration is successful, navigate to login
            navigate("/login", {replace: true});
        } catch (error) {
            setFormError(error.message || 'Registration failed. Please try again.');
            console.error("Registration error:", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    const [usernameError, setUsernameError] = createSignal("");
    createEffect(() => {
        if(username().length>0 && username().length < 3) {
            setUsernameError("Username must be at least 3 characters.")
        } 
        else {
            setUsernameError("")
        }
    })

    const [passwordError, setPasswordError] = createSignal("");
    createEffect(() => {
        if(password().length>0 && password().length < 5) {
            setPasswordError("Password must be at least 5 characters.")
        } 
        else {
            setPasswordError("")
        }
    })

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

            <table class={styles.formTable}>
                <thead>
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
                            <button class={styles.loginButton} disabled={isSubmitting()}>
                                {isSubmitting() ? 'Registering...' : 'Register'}
                            </button>
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