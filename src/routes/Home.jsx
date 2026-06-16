import { Link } from 'react-router-dom'
import styles from './Home.module.css'
import heroCountry from '../assets/skec/hero-country.jpg'
import smartKids from '../assets/skec/smart-kids.jpg'
import softPlay from '../assets/skec/soft-play.jpg'
import preschoolTour from '../assets/skec/preschool-tour.jpg'
import extendedDay from '../assets/skec/extended-day.jpg'
import outdoorPlay from '../assets/skec/outdoor-play.jpg'
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
            Get started
          </Link>
          <Link to="/catalog" className={styles.secondaryBtn}>
            Browse classes
          </Link>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.split}>
          <div className={styles.splitText}>
            <h2>Find Best Tutors Anywhere</h2>
            <p>
              Finding a tutor has never been easier! With our SKEC service, you
              can discover a qualified tutor anywhere you are. Whether you need
              help with academics, music, languages, or any other subject, our
              platform connects you with experienced tutors who can provide
              personalized guidance and support. Simply specify your location and
              the subject you need assistance with, and we’ll match you with a
              tutor who meets your requirements. Choose from in-person sessions or
              convenient online options to fit your schedule and preferences.
            </p>
            <Link to="/signup" className={styles.secondaryBtn}>
              Get In Touch
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
            <img className={styles.serviceImg} src={softPlay} alt="Soft play" />
            <div className={styles.serviceBody}>
              <h3>3-D Printing</h3>
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
              alt="Preschool tour"
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
              alt="Extended day"
            />
            <div className={styles.serviceBody}>
              <h3>Computer Aided Design</h3>
              <div className={styles.divider} />
              <p className={styles.price}>&nbsp;</p>
              <Link to="/catalog" className={styles.bookBtn}>
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`${styles.split} ${styles.splitReverse}`}>
          <img
            className={styles.splitImg}
            src={smartKids}
            alt="Smart Kids Enrichment Center"
          />
          <div className={styles.splitText}>
            <h2>Our Network</h2>
            <p>
              Discover the power of a vast educational network with SKEC! Our
              organization boasts a large network of expert tutors and educators
              ready to provide top-notch academic support. Whether you need help
              with test preparation, subject tutoring, or college admissions
              guidance, our expansive network ensures that we can connect you
              with the perfect tutor for your needs.
            </p>
            <Link to="/signup" className={styles.secondaryBtn}>
              Get In Touch
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Our Roots</h2>
        <p className={styles.lead}>
          Young children who go to Smart Kids Enrichment Center get the tools and
          support they need for their healthy development. All activities are
          carefully designed to adequately nurture the emotional, intellectual
          and physical growth of our kids. Through stimulating situations and
          hands-on learning opportunities, children are free to develop into
          bright young minds.
        </p>
      </section>

      <section className={styles.section}>
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

      {/* After-school Program section removed per request */}

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
