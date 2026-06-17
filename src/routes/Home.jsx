import { Link } from 'react-router-dom'
import styles from './Home.module.css'
import heroCountry from '../assets/skec/hero-country.jpg'
import smartKids from '../assets/skec/smart-kids.jpg'
import softPlay from '../assets/skec/soft-play.jpg'
import preschoolTour from '../assets/skec/preschool-tour.jpg'
import extendedDay from '../assets/skec/extended-day.jpg'
import outdoorPlay from '../assets/3d-printed-brush-bots-MRRF-scaled.jpg.webp'
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
        <p className={styles.heroSub}>
          <strong>pra·xis</strong> <em>(noun)</em> — the process of putting a theory, lesson, or abstract idea into practical action
        </p>
        <div className={styles.heroActions}>
          <Link to="/signup" className={styles.primaryBtn}>
            Log In/Sign Up
          </Link>
          <Link to="/catalog" className={styles.secondaryBtn}>
            Browse classes
          </Link>
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
      </section>

      <section className={styles.section}>
        <h2>Who We Are</h2>
        <p className={styles.lead}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ac
          felis sit amet eros vulputate faucibus. Duis et lorem sit amet velit
          tincidunt vehicula. Phasellus sed urna sit amet neque varius
          pellentesque.
        </p>
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
              src={outdoorPlay}
              alt="Children playing outdoors"
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
              src={artLessons}
              alt="Children drawing with markers"
            />
            <p className={styles.programCaption}>
              Hands-on creative projects that nurture imagination and fine motor
              skills.
            </p>
          </div>
          <div className={styles.programCard}>
            <div className={styles.programHeader}>
              <h3>Career Mentoring</h3>
            </div>
            <img
              className={styles.programImg}
              src={imaginativePlay}
              alt="Children blowing bubbles"
            />
            <p className={styles.programCaption}>
              Guided, open-ended play that grows curiosity and problem-solving.
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
            src={heroCountry}
            alt="A teacher reading to children at Smart Kids Enrichment Center"
          />
        </div>
      </section>

      <section className={styles.section}>
        <h2>Our Classes</h2>
        <div className={styles.cards}>
          <div className={styles.serviceCard}>
            <img className={styles.serviceImg} src={softPlay} alt="3D printing lab" />
            <div className={styles.serviceBody}>
              <h3>3D Printing and Design</h3>
              <div className={styles.divider} />
              <p className={styles.price}>$25</p>
              <Link to="/catalog" className={styles.bookBtn}>
                Book Now
              </Link>
            </div>
          </div>
          <div className={styles.serviceCard}>
            <img
              className={styles.serviceImg}
              src={preschoolTour}
              alt="Environmental science"
            />
            <div className={styles.serviceBody}>
              <h3>Environmental Science</h3>
              <div className={styles.divider} />
              <p className={styles.price}>&nbsp;</p>
              <Link to="/catalog" className={styles.bookBtn}>
                Book Now
              </Link>
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
              <p className={styles.price}>&nbsp;</p>
              <Link to="/catalog" className={styles.bookBtn}>
                Book Now
              </Link>
            </div>
          </div>
          <div className={styles.serviceCard}>
            <img
              className={styles.serviceImg}
              src={artLessons}
              alt="Research methods and discovery"
            />
            <div className={styles.serviceBody}>
              <h3>Research Methods & Discovery</h3>
              <div className={styles.divider} />
              <p className={styles.price}>&nbsp;</p>
              <Link to="/catalog" className={styles.bookBtn}>
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={`${styles.split} ${styles.splitReverse}`}>
          <img
            className={styles.splitImg}
            src={smartKids}
            alt="Smart Kids Enrichment Center"
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
