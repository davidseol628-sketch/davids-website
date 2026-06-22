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
              <p className={styles.serviceDesc}>
                Want to learn how to design and build circuits? We live surrounded by smart gadgets, but few people know how they’re made. Stay away from the screens and get your hands on real hardware! In this hands-on class, you’ll learn the basics of digital electronics from simple gates to Ohm’s Law. Let's build mini circuits that reflect real-world technology! No prior programming or electronics experience required. Just bring your curiosity, and get ready to code it, wire it, and watch it come alive!
              </p>
              <h2>Schedule</h2>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
