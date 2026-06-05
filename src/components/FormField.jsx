import styles from './FormField.module.css'

/**
 * Label + control + error message wrapper.
 *
 * Pass form controls as children, or use the convenience `register`/`type`
 * props for a plain input. `error` is the message string to show.
 */
export default function FormField({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
}) {
  return (
    <div className={styles.field}>
      {label && (
        <label className={styles.label} htmlFor={htmlFor}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className={styles.hint}>{hint}</p>}
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
