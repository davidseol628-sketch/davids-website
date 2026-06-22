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
              <div className={styles.divider} />
              <h2>Schedule</h2>
              <div className={styles.scheduleSection}>
                <h3>(15 min) Scratch Overview: What is Coding? And Why Start with Scratch?</h3>
                <ul>
                  <li>Scratch demo</li>
                  <li>Applications of programming</li>
                  <li>Show example student-made games</li>
                </ul>
              </div>
              <div className={styles.scheduleSection}>
                <h3>(1 hr) Scratch Walkthrough</h3>
                <ul>
                  <li>Set up student laptops</li>
                  <li>Wi-Fi</li>
                  <li>Scratch basics</li>
                  <li>Core Concepts (if, else, while, interactives, sprites, etc.)</li>
                  <li>Guided activity - code along as a class</li>
                  <li>Mini Project (prolly combined with guided activity)</li>
                </ul>
              </div>
              <div className={styles.scheduleSection}>
                <h3>(15 min) BREAK</h3>
              </div>
              <div className={styles.scheduleSection}>
                <h3>(1.5 hr) Student Design Activity - Creative Liberty</h3>
                <ul>
                  <li>Students get to design their own game, either based on a class example or start from scratch</li>
                  <li>Ask 3 before me</li>
                  <li>Near the end of class, students will be able to have a showcase</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
