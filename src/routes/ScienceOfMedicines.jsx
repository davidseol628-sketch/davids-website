import styles from './Home.module.css'
import researcherAtWork from '../assets/Researcher_at_work_in_her_laboratory.jpg'

export default function ScienceOfMedicines() {
  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <h1>The Science of Medicines: Build Your Own Drug Trial</h1>
        <div className={styles.articleIntro}>
          <p><strong>Duration:</strong> 3-hour session</p>
          <p><strong>Recommended age range:</strong> Ages 13-18</p>
          <p><strong>Class description:</strong></p>
        </div>
        <div className={styles.cards}>
          <div className={styles.serviceCard}>
            <img
              className={styles.serviceImg}
              src={researcherAtWork}
              alt="Researcher at work in a laboratory"
            />
            <div className={styles.serviceBody}>
              <div className={styles.divider} />
              <div className={styles.divider} />
              <h2>Schedule</h2>
              <div className={styles.scheduleSection}>
                <h3>(20 min) Medicine Research Introduction</h3>
                <ul>
                  <li>How new medicines are discovered and evaluated</li>
                  <li>What makes a drug trial fair and reliable</li>
                  <li>Safety, dosage, and effectiveness as key research goals</li>
                </ul>
              </div>
              <div className={styles.scheduleSection}>
                <h3>(45 min) Design the Drug Trial</h3>
                <ul>
                  <li>Students choose variables, controls, and outcome measures</li>
                  <li>Teams build a mock trial plan and predict results</li>
                  <li>Practice identifying bias and evaluating experimental design</li>
                </ul>
              </div>
              <div className={styles.scheduleSection}>
                <h3>(15 min) BREAK</h3>
              </div>
              <div className={styles.scheduleSection}>
                <h3>(45 min) Analyze Patient Data</h3>
                <ul>
                  <li>Review mock patient outcomes and symptom tracking data</li>
                  <li>Compare treatment and placebo groups</li>
                  <li>Decide whether the drug is effective, ineffective, or inconclusive</li>
                </ul>
              </div>
              <div className={styles.scheduleSection}>
                <h3>(30 min) Research Debrief</h3>
                <ul>
                  <li>Discuss ethics in medicine and clinical testing</li>
                  <li>Connect the activity to real pharmaceutical research careers</li>
                  <li>Reflect on how evidence guides medical decisions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}