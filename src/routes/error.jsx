import  styles from "./error.module.css";
import { useNavigate } from "@solidjs/router";

function error(){
    const navigate = useNavigate()
    return(
    <>
        <div class={styles.containerErrorPage}>
            
            <p class={styles.title}>Oops!</p>
            <p class={styles.subTitle}>404 - Page Not Found</p>
            <p class={styles.deskripsi}>The page that you are looking for is not exist</p>
            <button onClick={()=> navigate("/")}>Go to Homepage</button>
        </div>
    </>);
}

export default error