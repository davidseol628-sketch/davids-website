import styles from './Home.module.css'

export default function Microscopy() {
  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <h1>Introduction to Microscopy Class</h1>
        <div className={styles.articleIntro}>
          <p><strong>Duration:</strong> one 3-hour session</p>
          <p><strong>Recommended age range:</strong> Grades 6-8 / Ages 11-14</p>
          <p><strong>Class description:</strong></p>
        </div>
        <div className={styles.cards}>
          <div className={styles.serviceCard}>
            <div className={styles.serviceBody}>
              <div className={styles.divider} />
              <p className={styles.serviceDesc}>
                This hands-on workshop introduces middle school students to microscopy through activities that relate to real world application. Students will learn the parts of a microscope, how to use a microscope, and how to identify organisms from their own local freshwater ponds. No prior experience is needed. However, students will be asked to bring a small sample from their own local freshwater ponds that includes sediment, water, and aquatic plant life.
              </p>
              <h2>Schedule</h2>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
