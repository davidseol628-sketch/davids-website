import styles from './Home.module.css'

export default function DNAtoDisease() {
  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <h1>DNA to Disease: The Genetics Behind Human Health</h1>
        <div className={styles.articleIntro}>
          <p><strong>Duration:</strong> 3-hour session</p>
          <p><strong>Age Range:</strong> Middle School & High School (Ages 12-18)</p>
        </div>
      </section>
    </div>
  )
}