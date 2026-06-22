import styles from './Home.module.css'

export default function Epidemiology() {
  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <h1>Introduction to Epidemiology/Disease Outbreak and Laboratory Techniques</h1>
        <div className={styles.cards}>
          <div className={styles.serviceCard}>
            <div className={styles.serviceBody}>
              <div className={styles.divider} />
              <p className={styles.serviceDesc}>
                Students become medical laboratory scientists investigating a mysterious disease outbreak. Through hands-on activities, students learn how doctors and scientists use dilution techniques, diagnostic testing, and data analysis to identify illnesses. Students will perform serial dilutions, create mock diagnostic tests, analyze patient samples, and determine the source of an outbreak. No prior biology or chemistry experience required.
              </p>
              <h2>Schedule</h2>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
