import { Link } from 'react-router-dom'
import styles from './Home.module.css'

/**
 * Public landing page. The header (logo top-left, Log in / Sign up top-right)
 * comes from the shared Layout/Nav. The body below is filler marketing copy
 * marked with [Filler] so David can find and edit it quickly.
 */
export default function Home() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          [Filler] Helping every student reach their potential
        </h1>
        <p className={styles.heroSub}>
          [Filler] A short, punchy subheadline about the enrichment center and
          what makes it special. Replace this copy with your own message.
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
        <h2>[Filler] About us</h2>
        <p>
          [Filler] A paragraph about the history, mission, and people behind the
          enrichment center. Talk about who you are and why parents trust you.
        </p>
      </section>

      <section className={styles.section}>
        <h2>[Filler] What we offer</h2>
        <div className={styles.cards}>
          <div className={styles.card}>
            <h3>[Filler] Tutoring</h3>
            <p>[Filler] Short description of your tutoring programs.</p>
          </div>
          <div className={styles.card}>
            <h3>[Filler] Enrichment classes</h3>
            <p>[Filler] Short description of enrichment offerings.</p>
          </div>
          <div className={styles.card}>
            <h3>[Filler] Test prep</h3>
            <p>[Filler] Short description of test prep programs.</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>[Filler] Our approach</h2>
        <p>
          [Filler] Describe your teaching philosophy and what sets your approach
          apart. Mention small class sizes, personalized plans, etc.
        </p>
      </section>

      <section className={styles.section}>
        <h2>[Filler] Contact us</h2>
        <p>[Filler] Address line, city, state ZIP</p>
        <p>[Filler] Phone: (000) 000-0000</p>
        <p>[Filler] Email: hello@example.com</p>
      </section>
    </div>
  )
}
