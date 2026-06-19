import { Link } from 'react-router-dom'
import styles from './Home.module.css'
import heroCountry from '../assets/skec/hero-country.jpg'
import tutorPhoto from '../assets/85.jpeg'
import istockphotoLab from '../assets/istockphoto-1498506722-612x612.jpg'
import smartKids from '../assets/skec/smart-kids.jpg'
import tomLauerman from '../assets/Tom-Lauerman-2-color-clay-printer-in-use.jpg'
import adminAjax from '../assets/admin-ajax.jpg'
import extendedDay from '../assets/210722-D-IM742-1234.JPG.avif'
import classroomPhoto from '../assets/skec/NRG2025-1.JPG'
import elevatingLearning from '../assets/skec/elevating_learning_stem_projects_for_high_school_students.webp.jpeg'
import outdoorPlay from '../assets/3d-printed-brush-bots-MRRF-scaled.jpg.webp'
import tutoringBanner from '../assets/tutoring-banner-1600x686.jpg'
import mentoringProfDev from '../assets/mentoringprofdevresources.png'
import researcherAtWork from '../assets/Researcher_at_work_in_her_laboratory.jpg'
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
        <div className={styles.heroActions}>
          <Link to="/catalog" className={styles.secondaryBtn}>
            See All Available Classes
          </Link>
        </div>
      </section>

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
        <h2>Our Mission</h2>
        <p className={styles.lead}>
          At Praxis Enrichment Center, we believe that knowledge and learning
          should be accessible to everyone. Our mission is to empower students
          through hands-on, engaging educational experiences that transform
          ideas into real-world skills outside of the classroom. By combining
          creativity, innovation, and practical application through our
          courses, we help young students build confidence, curiosity, and a
          passion for discovery.
        </p>
        <img
          className={styles.missionImg}
          src={classroomPhoto}
          alt="Praxis Enrichment Center mission"
        />
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
          </div>
          <div className={styles.programCard}>
            <div className={styles.programHeader}>
              <h3>Career Mentoring</h3>
            </div>
            <img
              className={styles.programImg}
              src={mentoringProfDev}
              alt="Career mentoring"
            />
            <p className={styles.programCaption}>
              Career mentoring paired with a tutor to help students explore
              meaningful career paths and build long-term goals.
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

      <section className={styles.section}>
        <h2>Our Classes</h2>
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
            <img
              className={styles.serviceImg}
              src={adminAjax}
              alt="Environmental science"
            />
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
            <img
              className={styles.serviceImg}
              src={extendedDay}
              alt="Artificial intelligence"
            />
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
            <img
              className={styles.serviceImg}
              src={researcherAtWork}
              alt="Researcher at work"
            />
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

      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={`${styles.split} ${styles.splitReverse}`}>
          <img
            className={styles.splitImg}
            src={istockphotoLab}
            alt="Explore the lab"
          />
          <div className={styles.splitText}>
            <h2>Explore the Lab</h2>
            <p>
              Our learning lab is equipped with modern technology designed to make
              every lesson interactive and exploratory.
            </p>
            <ul className={styles.offerList}>
              <li>
                <strong>Touchscreen Smart Board</strong> — a dynamic display for
                collaborative lessons, digital drawing, and real-time problem
                solving.
              </li>
              <li>
                <strong>Interactive Whiteboard</strong> — a hands-on surface where
                students can write, annotate, and engage directly with lesson
                content.
              </li>
              <li>
                <strong>3-D Printer</strong> — a creative maker tool for turning
                student ideas into tangible models and engineering prototypes.
              </li>
            </ul>
            <Link to="/signup" className={styles.secondaryBtn}>
              Learn More
            </Link>
          </div>
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
