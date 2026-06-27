import styles from './Home.module.css'

export default function Microscopy() {
  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <h1>Introduction to Microscopy Class</h1>
        <div className={styles.articleIntro}>
          <p><strong>Duration:</strong> 3-hour session</p>
          <p><strong>Recommended age range:</strong> Grades 6-8 / Ages 11-14</p>
        </div>
        <div className={styles.cards}>
          <div className={styles.serviceCard}>
            <div className={styles.serviceBody}>
              <div className={styles.divider} />
              <div className={styles.divider} />
              <h2>Schedule</h2>
              <div className={styles.scheduleSection}>
                <h3>(30 min) Microscopy Overview & Anatomy</h3>
                <ul>
                  <li>What is microscopy and why do we use it?</li>
                  <li>Microscope parts and demo (Eyepiece, stage, focus knobs, objective lenses)</li>
                  <li>Rules of using a microscope</li>
                </ul>
              </div>
              <div className={styles.scheduleSection}>
                <h3>(45 min) Known Slide Walkthrough</h3>
                <ul>
                  <li>Handing out prepared slide sets/allow students to pick out slides, and hand out student lab sheets</li>
                  <li>Walkthrough of adjusting focus step by step</li>
                  <li>Observing and sketching three different slides</li>
                </ul>
              </div>
              <div className={styles.scheduleSection}>
                <h3>(15 min) BREAK</h3>
              </div>
              <div className={styles.scheduleSection}>
                <h3>(1.5 hr) Student Design Activity</h3>
                <ul>
                  <li>Instructor walkthrough: How to make a wet mount slide using a plastic dropper and coverslip without trapping bubbles</li>
                  <li>Students set up slides/stations to find organisms within the slide</li>
                  <li>Using sketches/observations, students will use reference guide to identify organisms and determine whether or not water source is polluted or healthy</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
