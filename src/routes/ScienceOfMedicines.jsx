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
          <p>
            Students step into the role of pharmaceutical researchers as they test a new medicine, compare placebo and treatment groups, and analyze patient data like a real clinical team. Along the way, they learn how scientists judge evidence, evaluate side effects, and make decisions about whether a drug should be approved.
          </p>
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
                <h3>(20 min) Why We Need Clinical Trials</h3>
                <ul>
                  <li>Discuss anecdotal evidence vs. scientific evidence</li>
                  <li>Use silly claims to ask how scientists test ideas fairly</li>
                  <li>Introduce control groups, bias, confounding variables, and safety</li>
                </ul>
              </div>
              <div className={styles.scheduleSection}>
                <h3>(45 min) Design the Drug Trial</h3>
                <ul>
                  <li>Teams receive a sample drug or medical device with a claim to test</li>
                  <li>Students decide how many patients to include and who gets included</li>
                  <li>Choose the outcome to measure and define a fair comparison</li>
                </ul>
              </div>
              <div className={styles.scheduleSection}>
                <h3>(15 min) BREAK</h3>
              </div>
              <div className={styles.scheduleSection}>
                <h3>(15 min) Placebo Experiment</h3>
                <ul>
                  <li>Students analyze mock patient data from drug and placebo groups</li>
                  <li>Discuss why placebo patients may still feel better</li>
                  <li>Practice interpreting blinded results without knowing which treatment was given</li>
                </ul>
              </div>
              <div className={styles.scheduleSection}>
                <h3>(60-70 min) Analyze a Clinical Trial</h3>
                <ul>
                  <li>Use a larger dataset with patient age, gender, treatment group, and outcome</li>
                  <li>Work in Excel to calculate average improvement and percent improvement</li>
                  <li>Create bar graphs and compare mean vs. median</li>
                </ul>
              </div>
              <div className={styles.scheduleSection}>
                <h3>(30 min) FDA Approval Meeting</h3>
                <ul>
                  <li>Act as an FDA review committee</li>
                  <li>Evaluate benefits, side effects, and the strength of the evidence</li>
                  <li>Debate whether to approve, approve with warning, require more studies, or reject</li>
                </ul>
              </div>
              <div className={styles.scheduleSection}>
                <h3>(15 min) Medical Ethics Discussion</h3>
                <ul>
                  <li>Discuss who should receive new treatments and when</li>
                  <li>Explore questions about side effects, experimental care, and access for children</li>
                  <li>Connect the activity to real decisions in medicine and research</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}