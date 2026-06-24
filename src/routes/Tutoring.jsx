import shared from '../components/shared.module.css'
import homeStyles from './Home.module.css'

const tutoringStructure = [
  {
    title: 'One-on-One Support',
    description:
      'Students work directly with a tutor who can slow down, review concepts, and build confidence at their own pace.',
  },
  {
    title: 'Flexible Scheduling',
    description:
      'Tutoring sessions are planned around each family\'s needs so students can get consistent support when they need it most.',
  },
  {
    title: 'Goal-Focused Learning',
    description:
      'Every session is guided by the student\'s schoolwork, goals, and areas where they want to grow.',
  },
]

const subjectOfferings = [
  'Math',
  'Science',
  'Engineering',
  'Robotics',
  'SAT Prep',
  'College Readiness',
  'Study Skills',
]

export default function Tutoring() {
  return (
    <div className={shared.page}>
      <section className={`${homeStyles.section} ${homeStyles.sectionAlt}`}>
        <h2>Tutoring</h2>
        <p className={homeStyles.lead}>
          Tutoring at Praxis is built around individual students, with support
          that helps them strengthen understanding, build confidence, and
          explore STEM subjects in a way that fits their goals.
        </p>
        <div className={shared.grid} style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px', marginTop: '24px' }}>
          {tutoringStructure.map((item) => (
            <div key={item.title} className={shared.card}>
              <h3 className={shared.cardTitle}>{item.title}</h3>
              <p className={shared.cardDesc}>{item.description}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <a
            className={shared.btn}
            href="https://docs.google.com/forms/d/e/1FAIpQLSdQjHRNLuEqbR0tuOREmgmqoUmgLiMA_jdovmssCTHE2B8veQ/viewform"
            target="_blank"
            rel="noreferrer noopener"
          >
            Sign Up!
          </a>
        </div>
      </section>

      <section className={`${homeStyles.section} ${homeStyles.sectionAlt}`}>
        <h2>Subject Offerings</h2>
        <p className={homeStyles.lead}>
          We support a wide range of subjects so families can find the right
          fit for academic help and enrichment.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
          {subjectOfferings.map((subject) => (
            <span
              key={subject}
              style={{
                border: '1px solid var(--border)',
                background: 'var(--panel)',
                padding: '10px 14px',
                borderRadius: '999px',
                fontWeight: 600,
                color: 'var(--text-h)',
              }}
            >
              {subject}
            </span>
          ))}
        </div>
      </section>
    </div>
  )
}