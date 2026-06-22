import styles from './Home.module.css'

export default function Cad() {
  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <h1>Intro to CAD + 3D Printing for Engineering Applications</h1>
        <div className={styles.articleIntro}>
          <p><strong>Duration:</strong> 3-hour session</p>
          <p><strong>Recommended age range:</strong> High schoolers (ages 14-18)</p>
          <p><strong>Class description:</strong></p>
        </div>
        <div className={styles.cards}>
          <div className={styles.serviceCard}>
            <div className={styles.serviceBody}>
              <div className={styles.divider} />
              <div className={styles.divider} />
              <h2>Schedule</h2>
              <div className={styles.scheduleSection}>
                <h3>(15 min) CAD Overview: What is CAD, Why CAD?</h3>
                <ul>
                  <li>CAD model demo</li>
                  <li>Applications of CAD</li>
                  <li>Show example 3D prints</li>
                </ul>
              </div>
              <div className={styles.scheduleSection}>
                <h3>(1 hr) CAD Walkthrough</h3>
                <ul>
                  <li>Set up student laptops
                    <ul>
                      <li>Wifi</li>
                      <li>Software (probably Onshape or maybe Tinkercad)</li>
                    </ul>
                  </li>
                  <li>Sketching</li>
                  <li>Extruding</li>
                  <li>Engineering drawings</li>
                </ul>
              </div>
              <div className={styles.scheduleSection}>
                <h3>(15 min) BREAK</h3>
              </div>
              <div className={styles.scheduleSection}>
                <h3>(1.5 hr) Student Design Activity</h3>
                <ul>
                  <li>Instructor gives 'keyhole'</li>
                  <li>Students use calipers to design a 'key'</li>
                  <li>Sketch paper and pencils provided</li>
                  <li>Export designs to STL + 3D printing</li>
                  <li>Testing + design iteration</li>
                  <li>While printing, discuss how to slice for 3D printing</li>
                </ul>
              </div>
              <div className={styles.scheduleSection}>
                <p><strong>Additional Topics:</strong> Supports, infill, layer height, shell, raft, etc.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
