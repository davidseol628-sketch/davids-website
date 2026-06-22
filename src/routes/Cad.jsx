import styles from './Home.module.css'

export default function Cad() {
  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <h1>Intro to CAD + 3D Printing for Engineering Applications</h1>
        <div className={styles.articleIntro}>
          <p><strong>Duration:</strong> one 3 hour session</p>
          <p><strong>Recommended age range:</strong> High schoolers (ages 14-18)</p>
          <p><strong>Class description:</strong></p>
        </div>
        <div className={styles.cards}>
          <div className={styles.serviceCard}>
            <div className={styles.serviceBody}>
              <div className={styles.divider} />
              <p className={styles.serviceDesc}>
                This hands‑on workshop introduces high school students to the world of Computer‑Aided Design (CAD) through fun, challenge‑based modeling activities. Students learn how engineers turn ideas into 3D digital models and practice creative problem‑solving skills such as testing and iteration. By the end of the session, each student will have designed a simple functional model and have their own 3D-printed creation ready to take home. No prior experience needed. Students will be asked to bring their own laptop.
              </p>
              <h2>Schedule</h2>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
