import { Link } from 'react-router-dom'
import styles from './Home.module.css'
import heroCountry from '../assets/skec/hero-country.jpg'
import tutorPhoto from '../assets/85.jpeg'
import istockphotoLab from '../assets/istockphoto-1498506722-612x612.jpg'
import smartKids from '../assets/skec/smart-kids.jpg'
import classroomPhoto from '../assets/skec/NRG2025-1.JPG'
import elevatingLearning from '../assets/skec/elevating_learning_stem_projects_for_high_school_students.webp.jpeg'
import outdoorPlay from '../assets/3d-printed-brush-bots-MRRF-scaled.jpg.webp'
import tutoringBanner from '../assets/tutoring-banner-1600x686.jpg'
import mentoringProfDev from '../assets/mentoringprofdevresources.png'
import artLessons from '../assets/skec/art-lessons.jpg'
import imaginativePlay from '../assets/skec/imaginative-play.jpg'

/**
 * Public landing page. The header (logo top-left, Log in / Sign up top-right)
 * comes from the shared Layout/Nav. Copy and imagery below are pulled from the
 * Smart Kids Enrichment Center site as starting content — David can edit it.
 */
export default function Home() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Discover Praxis Enrichment Center
        </h1>
        <p className={styles.heroTagline}>
          Hands-On STEM Classes That Kids Actually Love
        </p>
        <p className={styles.heroSub}>
          <strong>pra·xis</strong> <em>(noun)</em> — the process of putting a theory, lesson, or abstract idea into practical action
        </p>
        <img
          className={styles.missionImg}
          src={classroomPhoto}
          alt="Praxis Enrichment Center mission"
        />
      </section>

      {/* Our Mission moved to Tutors page */}

      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <h2 className={styles.openHouseHeader}>FREE STEM OPEN HOUSE • Saturday, June 27th • Live Demonstrations • Hands-On Activities • Register Today!</h2>
        <p className={styles.lead}>
          Join us for a free, family-friendly Open House and discover how
          learning comes alive at Praxis Enrichment Center! Meet our instructors,
          explore our classrooms, and participate in exciting hands-on STEM
          demonstrations designed for curious minds of all ages.
        </p>
        <p className={styles.lead}>
          <a
            className={styles.openHouseLink}
            href="https://docs.google.com/forms/d/e/1FAIpQLSfzicZLAZmYWDzNV3xT2LMu953BJbDErN50_rL9Nov6I0aKoQ/viewform?usp=publish-editor"
            target="_blank"
            rel="noreferrer noopener"
          >
            Click here to register for the Open House.
          </a>
        </p>
        <div className={styles.offerList}>
          <p className={styles.programCaption}><strong>Experience STEM in Action</strong></p>
          <ul>
            <li><strong>Robotics & Coding</strong> — watch robots come to life and learn how students program them.</li>
            <li><strong>3D Printing</strong> — see a 3D printer in action and take home a sample print.</li>
            <li><strong>Artificial Intelligence</strong> — experience beginner-friendly AI activities and interactive demos.</li>
          </ul>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <h2>Educational Offerings</h2>
        <div className={styles.cards}>
          <div className={styles.programCard}>
            <div className={styles.programHeader}>
              <h3>STEM-focused Day Program</h3>
            </div>
            <img
              className={styles.programImg}
              src={elevatingLearning}
              alt="Elevating learning"
            />
            <p className={styles.programCaption}>
              Instructors guide a classroom full of students to enable them to
              apply STEM knowledge beyond academics.
            </p>
            <Link className={styles.bookBtn} to="/classes">
              View Classes
            </Link>
          </div>
          <div className={styles.programCard}>
            <div className={styles.programHeader}>
              <h3>1-on-1 Tutoring</h3>
            </div>
            <img
              className={styles.programImg}
              src={tutoringBanner}
              alt="Tutoring banner"
            />
            <p className={styles.programCaption}>
              Personalized tutoring sessions designed to support learning goals,
              improve confidence, and build academic skills one student at a time.
            </p>
            <Link className={styles.bookBtn} to="/tutors">
              Meet Our Tutors
            </Link>
          </div>
          <div className={styles.programCard}>
            <div className={styles.programHeader}>
              <h3>Career Mentoring</h3>
            </div>
            <img
              className={styles.programImg}
              src={mentoringProfDev}
              alt="Mentoring and professional development"
            />
            <p className={styles.programCaption}>
              Mentoring and professional development for students ready to
              explore careers in STEM and build real-world readiness.
            </p>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.split}>
          <div className={styles.splitText}>
            <h2>Looking for a personalized tutor for your child?</h2>
            <p>
              Give your child the advantage of learning from a tutor who is actively studying at the <strong>University of Maryland</strong>, one of the nation's leading public research universities. More than just academic support, our tutors serve as relatable role models who can inspire confidence, curiosity, and a love of learning!
            </p>
            <Link to="/tutors" className={styles.secondaryBtn}>
              View Tutors
            </Link>
          </div>
          <img
            className={styles.splitImg}
            src={tutorPhoto}
            alt="Personalized tutoring"
          />
        </div>
      </section>


      {/* Mission and Goals moved to hero area */}

      <section className={`${styles.section} ${styles.contact}`}>
        <h2>Get In Touch</h2>
        <p>9066 Baltimore Ave Unit A, College Park, MD 20740, USA</p>
        <p>Phone: (478) 241-0365</p>
        <p>Email: skagrovers@gmail.com</p>
        <p>Opening Hours: Mon–Fri 9am–6pm · Sat 10am–2pm · Sun Closed</p>
      </section>
    </div>
  )
}
