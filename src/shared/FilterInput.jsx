import styles from './FilterInput.module.css';

function FilterInput({ filterTerm, onFilterChange }) {
  return (
    <div className={styles.filterInput}>
      <label htmlFor="filterInput" className={styles.label}>
        Search todos:
      </label>
      <input
        id="filterInput"
        type="text"
        value={filterTerm}
        onChange={(event) => onFilterChange(event.target.value)}
        placeholder="Search by title..."
        className={styles.input}
      />
    </div>
  );
}

export default FilterInput;
