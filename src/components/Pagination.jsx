import { For } from 'solid-js';
import styles from './pagination.module.css';

/**
 * @typedef {Object} PaginationProps
 * @property {() => number} currentPage - Signal accessor untuk nomor halaman saat ini
 * @property {number} totalPages - Total jumlah halaman
 * @property {(page: number) => void} onPageChange - Fungsi callback saat halaman berubah
 * @property {number} [maxPagesToShow=5] - Maksimum jumlah tombol halaman yang ditampilkan (tidak termasuk prev/next dan ellipsis)
 */

/**
 * Komponen paginasi yang dapat digunakan kembali
 * 
 * Fitur:
 * - Navigasi halaman (Prev/Next)
 * - Tampilan nomor halaman dengan ellipsis
 * - Indikator halaman aktif
 * - Responsif untuk jumlah halaman yang banyak
 * 
 * @component
 * @param {PaginationProps} props - Props komponen
 */
function Pagination(props) {
  const currentPage = props.currentPage;
  const onPageChange = props.onPageChange;
  const maxPagesToShow = props.maxPagesToShow || 5;
  
  // Access totalPages as a reactive value
  const totalPages = () => typeof props.totalPages === 'function' ? props.totalPages() : props.totalPages;

  const pageNumbers = () => {
    const pages = [];
    const total = totalPages();
    // Logic untuk display page number (menggunakan ellipsis jika perlu)
    let startPage = Math.max(1, currentPage() - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(total, startPage + maxPagesToShow - 1);

    // Menyesuaikan startPage jika endPage terlalu dekat dengan totalPages
    if (endPage - startPage + 1 < maxPagesToShow && total >= maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  // Jangan tampilkan pagination jika hanya ada satu halaman
  if (totalPages() <= 1) {
    return null;
  }

  return (
    <nav class={styles.pagination} aria-label="Page navigation">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage() - 1))}
        disabled={currentPage() === 1}
        aria-label="Previous Page"
        class={styles.pageButton}
      >
        Prev
      </button>

      {pageNumbers()[0] > 1 && (
        <>
          <button onClick={() => onPageChange(1)} class={styles.pageButton}>1</button>
          {pageNumbers()[0] > 2 && <span class={styles.ellipsis}>...</span>}
        </>
      )}

      <For each={pageNumbers()}>
        {(page) => (
          <button
            onClick={() => onPageChange(page)}
            class={`${styles.pageButton} ${currentPage() === page ? styles.activePage : ''}`}
            aria-current={currentPage() === page ? 'page' : undefined}
          >
            {page}
          </button>
        )}
      </For>

      {pageNumbers()[pageNumbers().length - 1] < totalPages() && (
        <>
          {pageNumbers()[pageNumbers().length - 1] < totalPages() - 1 && <span class={styles.ellipsis}>...</span>}
          <button onClick={() => onPageChange(totalPages())} class={styles.pageButton}>{totalPages()}</button>
        </>
      )}

      <button
        onClick={() => onPageChange(Math.min(totalPages(), currentPage() + 1))}
        disabled={currentPage() === totalPages()}
        aria-label="Next Page"
        class={styles.pageButton}
      >
        Next
      </button>
    </nav>
  );
}

export default Pagination;