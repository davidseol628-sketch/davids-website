import styles from './Home.module.css'

export default function Epidemiology() {
  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <h1>Introduction to Epidemiology/Disease Outbreak and Laboratory Techniques</h1>
        <div className={styles.articleIntro}>
          <p><strong>Duration:</strong> 3-hour session</p>
          <p><strong>Recommended age range:</strong> Middle School & Early High School (Ages 12–16)</p>
          <p><strong>Class description:</strong></p>
        </div>
        <div className={styles.cards}>
          <div className={styles.serviceCard}>
            <div className={styles.serviceBody}>
              <div className={styles.divider} />
              <div className={styles.divider} />
              <h2>Schedule</h2>
              <div className={styles.scheduleSection}>
                <h3>(20 min) Medical Mystery Introduction</h3>
                <ul>
                  <li>What medical lab scientists do</li>
                  <li>Why concentration matters</li>
                  <li>How diseases are tested</li>
                </ul>
              </div>
              <div className={styles.scheduleSection}>
                <h3>(45 min) Serial Dilution Challenge</h3>
                <ul>
                  <li>1:10 dilution, 1:100 dilution, 1:1000 dilution, etc (2 fold, 5 fold, or 10 fold) using colored dye</li>
                  <li>Goal: can students make the lightest solution possible while keeping accurate records?</li>
                  <li>The visual effect is dramatic and easy to understand</li>
                </ul>
              </div>
              <div className={styles.scheduleSection}>
                <h3>(15 min) BREAK</h3>
              </div>
              <div className={styles.scheduleSection}>
                <h3>(45 min) Build a Diagnostic Test</h3>
                <ul>
                  <li>Infected patients have a biomarker (represented by blue dye) in their blood</li>
                  <li>Students are laboratory technicians who must determine whether patient samples are positive or negative</li>
                  <li>Prepare several cups labeled: Patient A-E</li>
                  <li>Diagnostic test: can only detect disease above a certain concentration
                    <ul>
                      <li>Students determine if the concentrations are visible</li>
                      <li>Students examine samples and record: Positive, Negative, Borderline</li>
                    </ul>
                  </li>
                  <li>Students dip a paper strip. A colored band appears only when enough dye is present similar to a lateral flow test. / use a homemade pH indicator / color reference card (for elementary/middle schoolers)</li>
                  <li>Introduces: Detection threshold, False negatives, Early infection</li>
                </ul>
              </div>
              <div className={styles.scheduleSection}>
                <h3>(30 min) Outbreak Investigation (Epidemiology Intro)</h3>
                <ul>
                  <li>Students receive a packet (e.g., Patient A - Fever, Tested positive, Ate at School Cafeteria; Patient B - Fever, Tested negative, ate at school cafeteria)</li>
                  <li>Students begin looking for patterns
                    <ul>
                      <li>Round 1: What do all positive patients have in common?</li>
                      <li>Round 2: give more data (ie school cafeteria menu → common exposure)</li>
                    </ul>
                  </li>
                  <li>End result example: food supplier contaminated pizza sauce</li>
                  <li>Real life example: Can you stop an outbreak before more people get sick? (Measles example)</li>
                </ul>
              </div>
              <div className={styles.scheduleSection}>
                <h3>(15 min) Debrief</h3>
                <ul>
                  <li>COVID testing</li>
                  <li>Hospital laboratories</li>
                  <li>Careers in medicine</li>
                  <li>Public health</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
