import { Link } from 'react-router-dom'
import styles from './Home.module.css'
import tomLauerman from '../assets/Tom-Lauerman-2-color-clay-printer-in-use.jpg'
import adminAjax from '../assets/admin-ajax.jpg'
import extendedDay from '../assets/210722-D-IM742-1234.JPG.avif'
import researcherAtWork from '../assets/Researcher_at_work_in_her_laboratory.jpg'

export default function Classes() {
  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <h1>Our Classes</h1>
        <div className={styles.serviceCards}>
          <div className={styles.serviceCard}>
            <img className={styles.serviceImg} src={tomLauerman} alt="Microscopy workshop" />
            <div className={styles.serviceBody}>
              <h3>Introduction to Microscopy Class</h3>
              <div className={styles.divider} />
              <p className={styles.serviceDesc}>
                Recommended Age Range: Grades 6-8 / Ages 11-14. Duration: one 3 hour session. Recommended age range: Middle schoolers (ages 11-14). This hands-on workshop introduces middle school students to microscopy through activities that relate to real world application. Students will learn the parts of a microscope, how to use a microscope, and how to identify organisms from their own local freshwater ponds. No prior experience is needed. However, students will be asked to bring a small sample from their own local freshwater ponds that includes sediment, water, and aquatic plant life.
              </p>
              <Link className={styles.bookBtn} to="/classes/microscopy">
                Explore
              </Link>
            </div>
          </div>
          <div className={styles.serviceCard}>
            <img className={styles.serviceImg} src={adminAjax} alt="Computer aided design and 3D printing" />
            <div className={styles.serviceBody}>
              <h3>Intro to Computer Aided Design + 3D Printing for Engineering Applications</h3>
              <div className={styles.divider} />
              <p className={styles.serviceDesc}>
                This hands‑on workshop introduces high school students to the world of Computer‑Aided Design (CAD) through fun, challenge‑based modeling activities. Students learn how engineers turn ideas into 3D digital models and practice creative problem‑solving skills such as testing and iteration. By the end of the session, each student will have designed a simple functional model and have their own 3D-printed creation ready to take home. No prior experience needed. Students will be asked to bring their own laptop.
              </p>
              <Link className={styles.bookBtn} to="/classes/cad">
                Explore
              </Link>
            </div>
          </div>
          <div className={styles.serviceCard}>
            <img className={styles.serviceImg} src={extendedDay} alt="Artificial intelligence" />
            <div className={styles.serviceBody}>
              <h3>Introduction to Artificial Intelligence</h3>
              <div className={styles.divider} />
              <p className={styles.serviceDesc}>
                Learn the basics of intelligent systems, pattern recognition, and problem solving.
              </p>
              <p className={styles.price}>&nbsp;</p>
            </div>
          </div>
          <div className={styles.serviceCard}>
            <img className={styles.serviceImg} src={researcherAtWork} alt="Researcher at work" />
            <div className={styles.serviceBody}>
              <h3>Research Methods & Discovery</h3>
              <div className={styles.divider} />
              <p className={styles.serviceDesc}>
                Build curiosity through inquiry, experimentation, and evidence-based discovery.
              </p>
              <p className={styles.price}>&nbsp;</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
