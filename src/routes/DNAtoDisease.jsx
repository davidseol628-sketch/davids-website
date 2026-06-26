import styles from './Home.module.css'
import geneticsImage from '../assets/skec/ImageForNews_713424_16523280353336330.jpg.webp'

export default function DNAtoDisease() {
  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <h1>DNA to Disease: The Genetics Behind Human Health</h1>
        <div className={styles.articleIntro}>
          <p><strong>Duration:</strong> 3-hour session</p>
          <p><strong>Age Range:</strong> Middle School & High School (Ages 12-18)</p>
          <p><strong>Class description:</strong></p>
          <p>
            Students explore how DNA contains the instructions for life and how changes in those instructions can lead to genetic disorders. Through hands-on modeling activities, role-playing exercises, and medical case studies, students learn how DNA is copied, translated into proteins, inherited through families, and used in modern medicine to diagnose disease.
          </p>
          <p><strong>No prior biology experience required.</strong></p>
        </div>
        <div className={styles.cards}>
          <div className={styles.serviceCard}>
            <img
              className={styles.serviceImg}
              src={geneticsImage}
              alt="Science classroom laboratory"
            />
            <div className={styles.serviceBody}>
              <div className={styles.divider} />
              <div className={styles.divider} />
              <h2>Schedule</h2>
              <div className={styles.scheduleSection}>
                <h3>(45 min) DNA Structure: Building the Blueprint of Life</h3>
                <ul>
                  <li>Mini lesson on what DNA is, what genes are, and why DNA matters</li>
                  <li>Examples of eye color, lactose intolerance, and genetic diseases</li>
                  <li>Hands-on DNA building with candy or beads using complementary base pairs</li>
                  <li>Mutation challenge: compare an original strand to a point mutation</li>
                  <li>Discuss natural variation, man-made edits, and examples like CRISPR</li>
                </ul>
              </div>
              <div className={styles.scheduleSection}>
                <h3>(45 min) Protein Synthesis: How DNA Becomes Protein</h3>
                <ul>
                  <li>Introduce the central dogma: DNA → RNA → Protein</li>
                  <li>Run a human protein factory game with DNA, RNA polymerase, mRNA, ribosome, and amino acids</li>
                  <li>Repeat the process with a mutation and compare the protein results</li>
                  <li>Discuss silent, missense, and nonsense mutations</li>
                </ul>
              </div>
              <div className={styles.scheduleSection}>
                <h3>(15 min) BREAK</h3>
              </div>
              <div className={styles.scheduleSection}>
                <h3>(10-15 min) Bioinformatics Demonstration</h3>
                <ul>
                  <li>Show how scientists compare normal and mutated DNA sequences with NCBI BLAST</li>
                  <li>Explain how researchers identify mutations and how doctors use genetic testing</li>
                  <li>Let students try a simple sequence search</li>
                </ul>
              </div>
              <div className={styles.scheduleSection}>
                <h3>(45 min) Genetics Challenge</h3>
                <ul>
                  <li>Intro to dominant traits, recessive traits, and carriers</li>
                  <li>Rotate through mystery stations using Punnett squares and pedigrees</li>
                  <li>Solve cases that increase in difficulty, including simple dominant, recessive, and X-linked inheritance</li>
                </ul>
              </div>
              <div className={styles.scheduleSection}>
                <h3>(30 min) Medical Genetics Case Study</h3>
                <ul>
                  <li>Students act as clinical geneticists using symptoms, family history, a pedigree, and a DNA sequence snippet</li>
                  <li>Determine the disease, inheritance pattern, mutation type, and possible treatments</li>
                  <li>Cases can include cystic fibrosis, sickle cell disease, Huntington disease, hemophilia, or color blindness</li>
                </ul>
              </div>
              <div className={styles.scheduleSection}>
                <h3>(15 min) Kahoot Championship</h3>
                <ul>
                  <li>Review DNA structure, protein synthesis, mutations, inheritance, and genetic disorders</li>
                  <li>Use a fast-paced quiz to reinforce the major ideas from the class</li>
                </ul>
              </div>
              <div className={styles.scheduleSection}>
                <h3>Skills Learned</h3>
                <ul>
                  <li>DNA structure and function</li>
                  <li>Base pairing rules</li>
                  <li>Transcription and translation</li>
                  <li>Mutations and genetic variation</li>
                  <li>Pedigree analysis</li>
                  <li>Probability and inheritance</li>
                  <li>Genetic disease diagnosis</li>
                  <li>Bioinformatics basics</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}