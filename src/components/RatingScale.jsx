import styles from './RatingScale.module.css'

/**
 * A 1–5 radio rating scale used heavily across the evaluation forms.
 *
 * Controlled: pass `value` (number|string) and `onChange(number)`.
 * `name` groups the radios. `min`/`max` default to 1–5.
 */
export default function RatingScale({
  name,
  value,
  onChange,
  min = 1,
  max = 5,
  lowLabel,
  highLabel,
}) {
  const options = []
  for (let i = min; i <= max; i++) options.push(i)

  return (
    <div className={styles.scale} role="radiogroup" aria-label={name}>
      {lowLabel && <span className={styles.endLabel}>{lowLabel}</span>}
      <div className={styles.options}>
        {options.map((n) => {
          const selected = Number(value) === n
          return (
            <label
              key={n}
              className={`${styles.option} ${selected ? styles.selected : ''}`}
            >
              <input
                type="radio"
                name={name}
                value={n}
                checked={selected}
                onChange={() => onChange?.(n)}
                className={styles.input}
              />
              <span className={styles.number}>{n}</span>
            </label>
          )
        })}
      </div>
      {highLabel && <span className={styles.endLabel}>{highLabel}</span>}
    </div>
  )
}
