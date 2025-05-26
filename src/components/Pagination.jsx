import { For } from 'solid-js';
import styles from './pagination.module.css';

/**
 * @typedef {Object} PaginationProps
 * @property {() => number} currentPage - A signal accessor for the current page number.
 * @property {number} totalPages - The total number of pages.
 * @property {(page: number) => void} onPageChange - Callback function when a page is changed.
 * @property {number} [maxPagesToShow=5] - Maximum number of page buttons to show directly (excluding prev/next and first/last ellipsis).
 */

/**
 * A reusable pagination component.
 * @param {PaginationProps} props
 */
function Pagination(props) {
  const currentPage = props.currentPage;
  const totalPages = props.totalPages;
  const onPageChange = props.onPageChange;
  const maxPagesToShow = props.maxPagesToShow || 5;

  const pageNumbers = () => {
    const pages = [];
    // Logic for displaying page numbers (e.g., ellipsis for many pages)
    let startPage = Math.max(1, currentPage() - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    // Adjust startPage if endPage hits the limit before showing maxPagesToShow
    if (endPage - startPage + 1 < maxPagesToShow && totalPages >= maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  // Don't render if there's only one page or less
  if (totalPages <= 1) {
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

      {pageNumbers()[pageNumbers().length - 1] < totalPages && (
        <>
          {pageNumbers()[pageNumbers().length - 1] < totalPages - 1 && <span class={styles.ellipsis}>...</span>}
          <button onClick={() => onPageChange(totalPages)} class={styles.pageButton}>{totalPages}</button>
        </>
      )}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage() + 1))}
        disabled={currentPage() === totalPages}
        aria-label="Next Page"
        class={styles.pageButton}
      >
        Next
      </button>
    </nav>
  );
}

export default Pagination;