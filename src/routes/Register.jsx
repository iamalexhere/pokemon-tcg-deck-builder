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
        <form method="post" class={styles.loginForm} onSubmit={handleSubmit}>
            <table class={styles.formTable}>
                <thead>
                    <tr>
                        <td>
                            Username
                            <input 
                                onInput={(e) => {setUsername(e.target.value)}} 
                                type='text' 
                                id='username'
                                placeholder='Enter your username'
                                class={styles.inputUsername}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Password
                            <input 
                                onInput={(e) => {setPassword(e.target.value)}} 
                                type='password' 
                                id='password'
                                placeholder='Enter your password'
                                class={styles.inputPassword} 
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Confirm Password
                            <input 
                                onInput={(e) => {setConfirmPassword(e.target.value)}} 
                                type='password' 
                                id='confirmPassword'
                                placeholder='Confirm your password'
                                class={styles.inputPassword} 
                            />
                        </td>
                    </tr>
                </thead>
            </table>
            <button class={styles.loginButton}>Regist</button>
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