import  styles from "./error.module.css";
function error(){
    return(
    <>
        <div class={styles.containerErrorPage}>
            
            <p class={styles.title}>Oops!</p>
            <p class={styles.subTitle}>404 - Page Not Found</p>
            <p class={styles.deskripsi}>The page that you are looking for is not exist</p>
            <button>Go to Homepage</button>
        </div>
    </>);
}

export default error