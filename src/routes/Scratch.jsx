import styles from './Home.module.css'

export default function Scratch() {
  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <h1>Intro to Scratch Programming</h1>
        <div className={styles.articleIntro}>
          <p><strong>Duration:</strong> 3-hour session</p>
          <p><strong>Recommended age range:</strong> Middle Schoolers (ages 11-14)</p>
          <p><strong>Class description:</strong></p>
        </div>
        <div className={styles.cards}>
          <div className={styles.serviceCard}>
            <div className={styles.serviceBody}>
              <div className={styles.divider} />
              <p className={styles.serviceDesc}>
                Ready to turn your imagination into code? This hands-on workshop invites kids of all ages to step into the developer’s shoes and dive into the colorful world of game design! Scratch is an amazing way for beginners to be introduced to coding, letting you learn by snapping blocks together like digital puzzle pieces to bring your own game to life. Students will be able to learn, create, and showcase the games they make, using skills learned in class.
              </p>
              <h2>Schedule</h2>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
