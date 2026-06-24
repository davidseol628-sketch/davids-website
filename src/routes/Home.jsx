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

      {/* Our Mission moved to Tutoring page */}

      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <h2 className={styles.openHouseHeader}>
          <span className={styles.openHouseTitle}>FREE STEM OPEN HOUSE • Saturday, June 27th</span>
        </h2>
        <p className={styles.lead}>
          Come and go at your own pace in a welcoming fair-style setup with
          activity tables for each class, take-home materials, and live demos
          throughout the afternoon!
        </p>
        <p className={styles.lead}>
          Where? - 9066 Baltimore Ave Unit A, College Park, MD 20740
        </p>
        <p className={styles.lead}>
          <strong>12 people signed up</strong> • <strong>11:00 AM to 4:00 PM</strong>
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
        <div className={styles.openHouseHighlights}>
          <div className={styles.openHouseHighlight}>
            <h3>Why Attend:</h3>
            <p>
              Tour the Praxis space, meet our team, and explore tutoring and
              hands-on STEM enrichment designed for middle and high school
              students.
            </p>
          </div>
          <div className={styles.openHouseHighlight}>
            <h3>What to Expect:</h3>
            <p>
              The open house will be set up fair-style, with class and program
              stations to explore at your own pace plus short featured
              demonstrations throughout the day.
            </p>
          </div>
          <div className={styles.openHouseHighlight}>
            <h3>Special Offer!</h3>
            <p>
              Students who visit every station and collect a stamp at each one
              will receive 50% off their first Praxis class.
            </p>
          </div>
        </div>

        <div className={styles.scheduleSection}>
          <h3>Live demonstrations every hour!</h3>
          <p className={styles.programCaption}>
            Each demonstration is about 15 minutes long, so families can sample
            multiple classes during the day.
          </p>
          <div className={styles.openHouseSchedule}>
            <div className={styles.openHouseSlot}>
              <strong>11:30 AM</strong>
              <span>Scratch Programming - Create interactive projects and learn the basics of block-based coding</span>
            </div>
            <div className={styles.openHouseSlot}>
              <strong>12:30 PM</strong>
              <span>Microscopy - Investigate the microscopic world through guided observation</span>
            </div>
            <div className={styles.openHouseSlot}>
              <strong>1:30 PM</strong>
              <span>3D printing - See how digital designs become real physical objects</span>
            </div>
            <div className={styles.openHouseSlot}>
              <strong>2:30 PM</strong>
              <span>Epidemiology - Explore how data and science are used to understand the spread of disease</span>
            </div>
            <div className={styles.openHouseSlot}>
              <strong>3:30 PM</strong>
              <span>Arduino - Discover simple circuits, sensors, and programming through hands-on electronics</span>
            </div>
          </div>
          <p className={styles.programCaption}>
            Questions? Contact us at praxiscenteredu@gmail.com
          </p>
          <p className={styles.programCaption}>
            Cant make it? Reach out to learn more about tutoring and upcoming
            programs
          </p>
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
            <Link className={styles.bookBtn} to="/tutoring">
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
            <div className={styles.ctaRow}>
              <Link to="/tutoring" className={styles.secondaryBtn}>
                View Tutors
              </Link>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSdQjHRNLuEqbR0tuOREmgmqoUmgLiMA_jdovmssCTHE2B8veQ/viewform?usp=publish-editor"
                className={styles.primaryBtn}
                target="_blank"
                rel="noreferrer noopener"
              >
                Sign Up!
              </a>
            </div>
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
        <p>Email: praxiscenteredu@gmail.com</p>
        <p>Opening Hours: Mon-Sat 12pm to 8 pm · Sun Closed (closed on July 4th)</p>
      </section>
    </div>
  )
}
