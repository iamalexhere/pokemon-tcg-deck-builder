import styles from './deckeditor.module.css';

function DeckEditor() {
    

    return (
        <div class={styles.mainContainer}>
            
            <div class={styles.topBar}>
                <button class={styles.backButton}>back</button>
                <input type="text" name="" id="" />
                <button class={styles.saveButton}>SAVE</button>
                <button class={styles.cancelButton}>CANCEL</button>
                <button class={styles.favoriteButton}>favorite</button>
                <button class={styles.removeButton}>remove</button>
            </div>

            <div class={styles.subContainer}>
                <div class={styles.cardDetailContainer}>
            
                </div>
                <div class={styles.cardDeckContainer}>

                </div>
                <div class={styles.cardSearchContainer}>
                    
                </div>
            </div>
        </div>
    )
}

export default DeckEditor;