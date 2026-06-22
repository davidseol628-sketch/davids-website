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
        <div className={styles.cards}>
          <div className={styles.serviceCard}>
            <img className={styles.serviceImg} src={tomLauerman} alt="Tom Lauerman 3D printing" />
            <div className={styles.serviceBody}>
              <h3>3D Printing and Design</h3>
              <div className={styles.divider} />
              <p className={styles.serviceDesc}>
                Learn digital design and 3D modeling to bring your creative ideas to life.
              </p>
            </div>
          </div>
          <div className={styles.serviceCard}>
            <img className={styles.serviceImg} src={adminAjax} alt="Environmental science" />
            <div className={styles.serviceBody}>
              <h3>Environmental Science</h3>
              <div className={styles.divider} />
              <p className={styles.serviceDesc}>
                Explore ecosystems, sustainability, and the science behind our changing world.
              </p>
              <p className={styles.price}>&nbsp;</p>
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
