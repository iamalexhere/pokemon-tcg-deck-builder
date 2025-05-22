import styles from './login.module.css';

function Login() {
    

    return (
        <div class={styles.mainContainer}>
            <div class={styles.formContainer}>

                <h1 class={styles.title}>Login</h1>

                <form method="post" class={styles.loginForm}>
                    <table class={styles.formTable}>
                        <thead>
                            <tr>
                                <td>
                                    Username
                                    <input type="text" class={styles.inputUsername}/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Password
                                    <input type="password" name="" id="" class={styles.inputPassword} />    
                                </td>
                            </tr>
                        </thead>
                    </table>

                    <a href="" class={styles.forgotPassword}>Forgot password?</a> 
                    <button class={styles.loginButton}>Login</button>

                    <p>Don't have an account? <a href="">Register.</a></p>

                </form>
            </div>
            <div class={styles.imageContainer}>
                <img
                    // src={testImage}
                    alt="Login illustration"
                    class={styles.image}
                />
            </div>
        </div>
    );
}

export default Login;