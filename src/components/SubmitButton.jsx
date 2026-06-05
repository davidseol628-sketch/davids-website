import styles from './SubmitButton.module.css'

/**
 * Submit button with a loading state. Disabled while `loading` is true.
 */
export default function SubmitButton({
  loading = false,
  children = 'Submit',
  disabled = false,
  ...props
}) {
  return (
    <button
      type="submit"
      className={styles.button}
      disabled={loading || disabled}
      aria-busy={loading}
      {...props}
    >
      {loading ? <span className={styles.spinner} aria-hidden="true" /> : null}
      {loading ? 'Working…' : children}
    </button>
  )
}
