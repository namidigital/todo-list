import styles from './TextInputWithLabel.module.css';

function TextInputWithLabel({
  elementId,
  labelText,
  onChange,
  ref,
  value,
  type = 'text',
  maxLength,
  autoComplete,
  ariaDescribedBy,
  ariaInvalid,
}) {
  return (
    <>
      <label htmlFor={elementId} className={styles.label}>
        {labelText}
      </label>
      <input
        type={type}
        id={elementId}
        ref={ref}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        autoComplete={autoComplete}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid || undefined}
        className={styles.input}
      />
    </>
  );
}

export default TextInputWithLabel;
