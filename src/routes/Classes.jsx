import { Link } from 'react-router-dom'
import styles from './Home.module.css'
import microscopeLab from '../assets/microscope-lab-hero.jpg'
import brushBot from '../assets/3d-printed-brush-bots-MRRF-scaled.jpg.webp'
import scratchDashboard from '../assets/scratch-dashboard.png'
import mycgMy from '../assets/MyvgMY57Z7DNYqQctU6cKMETCvSPVUWriLULyKKz.jpeg'
import jpegImage from '../assets/jpeg.jpeg'
import researcherAtWork from '../assets/skec/AdobeStock_171882033.jpeg'
import geneticsImage from '../assets/skec/ImageForNews_713424_16523280353336330.jpg.webp'

export default function Classes() {
  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <h1>Our Classes</h1>
        <h2 style={{ marginTop: '24px' }}>Class Schedule</h2>
        <p className={styles.serviceDesc} style={{ textAlign: 'center', marginBottom: '16px' }}><strong>Cost:</strong> $60 per class (3-hour session)</p>
        <div className={styles.scheduleGrid}>
          <div className={styles.scheduleDay}>
            <h3>Tuesday, 6/30</h3>
            <ul>
              <li>3D Printing + CAD - 12:00 PM</li>
              <li>Scratch Programming - 4:00 PM</li>
            </ul>
          </div>
          <div className={styles.scheduleDay}>
            <h3>Wednesday, 7/1</h3>
            <ul>
              <li>Microscopy - 12:00 PM</li>
              <li>Epidemiology - 4:00 PM</li>
            </ul>
          </div>
          <div className={styles.scheduleDay}>
            <h3>Thursday, 7/2</h3>
            <ul>
              <li>3D Printing + CAD - 12:00 PM</li>
              <li>Digital Electronics + Arduino - 4:00 PM</li>
            </ul>
          </div>
          <div className={styles.scheduleDay}>
            <h3>Friday, 7/3</h3>
            <ul>
              <li>Science of Medicines - 12:00 PM</li>
              <li><em>Closes early</em></li>
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Explore Our Classes</h2>
        <div className={styles.serviceCards}>
          <div className={styles.serviceCard}>
            <img className={styles.serviceImg} src={microscopeLab} alt="Microscopy workshop" />
            <div className={styles.serviceBody}>
              <h3>Introduction to Microscopy Class</h3>
              <div className={styles.divider} />
              <p className={styles.serviceDesc}><strong>Duration:</strong> 3-hour session</p>
              <p className={styles.serviceDesc}><strong>Recommended age range:</strong> Grades 6-8 / Ages 11-14</p>
              <p className={styles.serviceDesc}><strong>Class description:</strong></p>
              <p className={styles.serviceDesc}>
                This hands-on workshop introduces middle school students to microscopy through activities that relate to real world application. Students will learn the parts of a microscope, how to use a microscope, and how to identify organisms from their own local freshwater ponds. No prior experience is needed. However, students will be asked to bring a small sample from their own local freshwater ponds that includes sediment, water, and aquatic plant life.
              </p>
              <Link className={styles.bookBtn} to="/classes/microscopy">
                Explore
              </Link>
            </div>
          </div>
          <div className={styles.serviceCard}>
            <img className={styles.serviceImg} src={brushBot} alt="3D-printed brush bot" />
            <div className={styles.serviceBody}>
              <h3>Intro to Computer Aided Design + 3D Printing for Engineering Applications</h3>
              <div className={styles.divider} />
              <p className={styles.serviceDesc}><strong>Duration:</strong> 3-hour session</p>
              <p className={styles.serviceDesc}><strong>Recommended age range:</strong> High schoolers (ages 14-18)</p>
              <p className={styles.serviceDesc}><strong>Class description:</strong></p>
              <p className={styles.serviceDesc}>
                This hands‑on workshop introduces high school students to the world of Computer‑Aided Design (CAD) through fun, challenge‑based modeling activities. Students learn how engineers turn ideas into 3D digital models and practice creative problem‑solving skills such as testing and iteration. By the end of the session, each student will have designed a simple functional model and have their own 3D-printed creation ready to take home. No prior experience needed. Students will be asked to bring their own laptop.
              </p>
              <Link className={styles.bookBtn} to="/classes/cad">
                Explore
              </Link>
            </div>
          </div>
          <div className={styles.serviceCard}>
            <img className={styles.serviceImg} src={scratchDashboard} alt="Scratch dashboard" />
            <div className={styles.serviceBody}>
              <h3>Intro to Scratch Programming</h3>
              <div className={styles.divider} />
              <p className={styles.serviceDesc}><strong>Duration:</strong> 3-hour session</p>
              <p className={styles.serviceDesc}><strong>Recommended age range:</strong> Middle Schoolers (ages 11-14)</p>
              <p className={styles.serviceDesc}><strong>Class description:</strong></p>
              <p className={styles.serviceDesc}>
                Ready to turn your imagination into code? This hands-on workshop invites kids of all ages to step into the developer’s shoes and dive into the colorful world of game design! Scratch is an amazing way for beginners to be introduced to coding, letting you learn by snapping blocks together like digital puzzle pieces to bring your own game to life. Students will be able to learn, create, and showcase the games they make, using skills learned in class.
              </p>
              <Link className={styles.bookBtn} to="/classes/scratch">
                Explore
              </Link>
            </div>
          </div>
          <div className={styles.serviceCard}>
            <img className={styles.serviceImg} src={jpegImage} alt="Outbreak class" />
            <div className={styles.serviceBody}>
              <h3>Introduction to Epidemiology/Disease Outbreak and Laboratory Techniques</h3>
              <div className={styles.divider} />
              <p className={styles.serviceDesc}><strong>Duration:</strong> 3-hour session</p>
              <p className={styles.serviceDesc}><strong>Recommended age range:</strong> Middle School & Early High School (Ages 12–16)</p>
              <p className={styles.serviceDesc}><strong>Class description:</strong></p>
              <p className={styles.serviceDesc}>
                Students become medical laboratory scientists investigating a mysterious disease outbreak. Through hands-on activities, students learn how doctors and scientists use dilution techniques, diagnostic testing, and data analysis to identify illnesses. Students will perform serial dilutions, create mock diagnostic tests, analyze patient samples, and determine the source of an outbreak. No prior biology or chemistry experience required.
              </p>
              <Link className={styles.bookBtn} to="/classes/epidemiology">
                Explore
              </Link>
            </div>
          </div>
          <div className={styles.serviceCard}>
            <img className={styles.serviceImg} src={mycgMy} alt="MycgMY Arduino" />
            <div className={styles.serviceBody}>
              <h3>Intro to Digital Electronics with Arduinos</h3>
              <div className={styles.divider} />
              <p className={styles.serviceDesc}><strong>Duration:</strong> 3-hour session</p>
              <p className={styles.serviceDesc}><strong>Recommended age range:</strong> High Schoolers (ages 14-17)</p>
              <p className={styles.serviceDesc}><strong>Class description:</strong></p>
              <p className={styles.serviceDesc}>
                Want to learn how to design and build circuits? We live surrounded by smart gadgets, but few people know how they’re made. Stay away from the screens and get your hands on real hardware! In this hands-on class, you’ll learn the basics of digital electronics from simple gates to Ohm’s Law. Let's build mini circuits that reflect real-world technology! No prior programming or electronics experience required. Just bring your curiosity, and get ready to code it, wire it, and watch it come alive!
              </p>
              <Link className={styles.bookBtn} to="/classes/digital-electronics">
                Explore
              </Link>
            </div>
          </div>
          <div className={styles.serviceCard}>
            <img className={styles.serviceImg} src={researcherAtWork} alt="Researcher at work in a laboratory" />
            <div className={styles.serviceBody}>
              <h3>The Science of Medicines: Build Your Own Drug Trial</h3>
              <div className={styles.divider} />
              <p className={styles.serviceDesc}><strong>Duration:</strong> 3-hour session</p>
              <p className={styles.serviceDesc}><strong>Recommended age range:</strong> Ages 13-18</p>
              <p className={styles.serviceDesc}><strong>Class description:</strong></p>
              <p className={styles.serviceDesc}>
                Students act as pharmaceutical researchers to design a real-world style drug trial, compare treatment and placebo groups, and analyze mock patient data. They learn how scientists decide whether a new medicine is effective, what side effects matter, and how evidence leads to approval decisions.
              </p>
              <Link className={styles.bookBtn} to="/classes/science-of-medicines">
                Explore
              </Link>
            </div>
          </div>
          <div className={styles.serviceCard}>
            <img className={styles.serviceImg} src={geneticsImage} alt="Science classroom laboratory" />
            <div className={styles.serviceBody}>
              <h3>DNA to Disease: The Genetics Behind Human Health</h3>
              <div className={styles.divider} />
              <p className={styles.serviceDesc}><strong>Duration:</strong> 3-hour session</p>
              <p className={styles.serviceDesc}><strong>Age Range:</strong> Middle School & High School (Ages 12-18)</p>
              <p className={styles.serviceDesc}><strong>Class description:</strong></p>
              <p className={styles.serviceDesc}>
                Students explore how DNA holds the instructions for life and how changes in those instructions can lead to genetic disorders. Through modeling, role-play, and case studies, they learn how DNA is copied, translated into proteins, inherited through families, and used in modern medicine to diagnose disease.
              </p>
              <Link className={styles.bookBtn} to="/classes/dna-to-disease">
                Explore
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
