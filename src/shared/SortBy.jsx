import styles from './SortBy.module.css';

function SortBy({ sortBy, sortDirection, onSortByChange, onSortDirectionChange }) {
  return (
    <div className={styles.sortBy}>
      <div className={styles.field}>
        <label htmlFor="sortBy" className={styles.label}>
          Sort by
        </label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={(event) => onSortByChange(event.target.value)}
          className={styles.select}
        >
          <option value="createdAt">Created At</option>
          <option value="title">Title</option>
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="sortDirection" className={styles.label}>
          Order
        </label>
        <select
          id="sortDirection"
          value={sortDirection}
          onChange={(event) => onSortDirectionChange(event.target.value)}
          className={styles.select}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>
    </div>
  );
}

export default SortBy;
