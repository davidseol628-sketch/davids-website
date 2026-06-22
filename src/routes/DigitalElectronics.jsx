import styles from './Home.module.css'

export default function DigitalElectronics() {
  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <h1>Intro to Digital Electronics with Arduinos</h1>
        <div className={styles.articleIntro}>
          <p><strong>Duration:</strong> 3-hour session</p>
          <p><strong>Recommended age range:</strong> High Schoolers (ages 14-17)</p>
          <p><strong>Class description:</strong></p>
        </div>
        <div className={styles.cards}>
          <div className={styles.serviceCard}>
            <div className={styles.serviceBody}>
              <div className={styles.divider} />
              <div className={styles.divider} />
              <h2>Schedule</h2>
              <div className={styles.scheduleSection}>
                <h3>(15 min) What is Digital Electronics?</h3>
                <ul>
                  <li>Show off some circuits</li>
                  <li>Ohm's Law</li>
                </ul>
              </div>
              <div className={styles.scheduleSection}>
                <h3>(1 hr) The Basics</h3>
                <ul>
                  <li>Binary w/ Conversion</li>
                  <li>Gates w/ Truth Tables - on Whiteboard
                    <ul>
                      <li>AND, OR, NOT, NAND, NOR, XOR, XAND</li>
                    </ul>
                  </li>
                  <li>Series, Parallel</li>
                  <li>Small demo with breadboards - maybe up/down counter</li>
                  <li>Might introduce them to TinkerCad for digital breadboard design</li>
                </ul>
              </div>
              <div className={styles.scheduleSection}>
                <h3>(15 min) BREAK</h3>
              </div>
              <div className={styles.scheduleSection}>
                <h3>(1.5 hr) Student Design Activity - Need to Figure This One Out</h3>
                <ul>
                  <li>Activity - Students pair up and choose to do one of the following:
                    <ul>
                      <li>Noise-activated lights</li>
                      <li>Traffic light</li>
                      <li>Blinking light</li>
                      <li>Up/Down Counter</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
