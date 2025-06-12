import  styles from "./error.module.css";
import { useNavigate } from "@solidjs/router";

function error(){
    // `useNavigate` digunakan untuk mengarahkan pengguna ke halaman lain.
    const navigate = useNavigate()
    return(
    <>
        <div class={styles.containerErrorPage}>
            
            <p class={styles.title}>Oops!</p>
            <p class={styles.subTitle}>404 - Page Not Found</p>
            <p class={styles.deskripsi}>The page that you are looking for is not exist</p>
            {/* Tombol ini akan mengarahkan pengguna kembali ke halaman utama. */}
            <button onClick={()=> navigate("/")}>Go to Homepage</button>
        </div>
    </>);
}

export default error