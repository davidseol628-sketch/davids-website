import { Link } from 'react-router-dom'
import styles from './Home.module.css'
import microscopeLab from '../assets/microscope-lab-hero.jpg'
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
            <img className={styles.serviceImg} src={microscopeLab} alt="Microscopy workshop" />
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
            <img className={styles.serviceImg} src={extendedDay} alt="Scratch programming" />
            <div className={styles.serviceBody}>
              <h3>Intro to Scratch Programming</h3>
              <div className={styles.divider} />
              <p className={styles.serviceDesc}>
                Ready to turn your imagination into code? This hands-on workshop invites kids of all ages to step into the developer’s shoes and dive into the colorful world of game design! Scratch is an amazing way for beginners to be introduced to coding, letting you learn by snapping blocks together like digital puzzle pieces to bring your own game to life. Students will be able to learn, create, and showcase the games they make, using skills learned in class.
              </p>
              <Link className={styles.bookBtn} to="/classes/scratch">
                Explore
              </Link>
            </div>
          </div>
          <div className={styles.serviceCard}>
            <img className={styles.serviceImg} src={researcherAtWork} alt="Lab scientist" />
            <div className={styles.serviceBody}>
              <h3>Introduction to Epidemiology/Disease Outbreak and Laboratory Techniques</h3>
              <div className={styles.divider} />
              <p className={styles.serviceDesc}>
                Students become medical laboratory scientists investigating a mysterious disease outbreak. Through hands-on activities, students learn how doctors and scientists use dilution techniques, diagnostic testing, and data analysis to identify illnesses. Students will perform serial dilutions, create mock diagnostic tests, analyze patient samples, and determine the source of an outbreak. No prior biology or chemistry experience required.
              </p>
              <Link className={styles.bookBtn} to="/classes/epidemiology">
                Explore
              </Link>
            </div>
          </div>
          <div className={styles.serviceCard}>
            <img className={styles.serviceImg} src={researcherAtWork} alt="Researcher at work" />
            <div className={styles.serviceBody}>
              <h3>Intro to Digital Electronics with Arduinos</h3>
              <div className={styles.divider} />
              <p className={styles.serviceDesc}>
                Want to learn how to design and build circuits? We live surrounded by smart gadgets, but few people know how they’re made. Stay away from the screens and get your hands on real hardware! In this hands-on class, you’ll learn the basics of digital electronics from simple gates to Ohm’s Law. Let's build mini circuits that reflect real-world technology! No prior programming or electronics experience required. Just bring your curiosity, and get ready to code it, wire it, and watch it come alive!
              </p>
              <Link className={styles.bookBtn} to="/classes/digital-electronics">
                Explore
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
