import shared from '../components/shared.module.css'
import homeStyles from './Home.module.css'
import brandonPhoto from '../assets/skec/C9BE7B76-8CA7-4409-8A55-1676F738A23B.jpeg'
import minhPhoto from '../assets/skec/1000052134.JPG'
import tienPhoto from '../assets/skec/9C2051D2-7839-4D98-814E-E7FBCA619633.jpeg'
import thanh from '../assets/skec/IMG_0152.jpg'
import vyPhoto from '../assets/skec/2AA70290-3048-4E9D-B2D8-90A70C03342D.jpeg'

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

const tutors = [
  {
    name: 'Brandon Le',
    subject: 'STEM Classroom Instructor',
    photo: brandonPhoto,
    fullPhoto: true,
    description:
      'Brandon is an Aerospace Engineering student at the University of Maryland and a researcher in rotorcraft aerodynamics. He is passionate about helping students build strong STEM foundations through engaging and supportive instruction. He enjoys making challenging concepts approachable while helping students develop problem-solving skills that extend beyond the classroom.',
    specialties: 'Engineering, Physics, Robotics',
  },
  {
    name: 'Tien Tran',
    subject: 'STEM Classroom Instructor',
    photo: tienPhoto,
    description:
      'Tien graduated from the University of Maryland with a B.S. in Biological Sciences and is a current graduate student pursuing a Master’s degree in Biotechnology and Management with a strong interest in healthcare and medicine. As a pre-health student, she has gained clinical experience through patient care, volunteering, and healthcare outreach locally and internationally. Her background in clinical settings, research, and education helps her communicate complex concepts clearly, adapt to different learning styles, and build meaningful connections with students.',
    specialties: 'Math, Chemistry, Biology',
  },
  {
    name: 'Thanh Luu',
    subject: 'STEM Classroom Instructor',
    photo: thanh,
    description:
      'Thanh is a Computer Engineering student at the University of Maryland who loves helping students build confidence and succeed in STEM. With a strong background in leading robotics teams and mentoring peers in hands-on engineering projects, he makes math, science, and technology approachable, organized, and fun. Thanh enjoys snowboarding, volleyball, building Legos, and working out.',
    specialties: 'Math, Science, Technology',
  },
  {
    name: 'Vy Huynh',
    subject: 'STEM Classroom Instructor',
    photo: vyPhoto,
    description:
      'Vy is a pre-health and Public Health Science student at the University of Maryland dedicated to helping students thrive in math and science. With experience in university biochemistry labs and direct patient care, she focuses on turning intimidating STEM subjects into clear, manageable steps and creating an encouraging, structured learning environment.',
    specialties: 'Biology, Biotechnology, Research, English, Environmental Science',
  },
  {
    name: 'David Seol',
    subject: 'STEM Classroom Instructor',
    description:
      'David is a Microbiology student at the University of Maryland, currently pursuing Dentistry. He has worked on a research team in an endodontics lab at the University of Maryland School of Dentistry and shadowed under Dr. Jun Park at Jun Park Dentistry for two years. For tutoring, David has experience teaching SAT prep and advising students on college readiness and applications.',
    specialties: 'SAT Prep, College Readiness, Microbiology',
  },
  {
    name: 'Minh',
    subject: 'STEM Classroom Instructor',
    photo: minhPhoto,
    description:
      'Minh is a Mechanical Engineering student at the University of Maryland and the Workshops Executive Chair for the UMD Engineers without Borders Chapter. He is also a Project Lead the Way Biomedical Program graduate. He is passionate about helping students learn and explore engineering and STEM subjects.',
    specialties: 'Mechanical Engineering, Biomedical Engineering, Project Design',
  },
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

      <section className={`${homeStyles.section} ${homeStyles.sectionAlt}`}>
        <h2>Meet the Tutors</h2>
        <p className={homeStyles.lead}>
          Our tutors combine subject knowledge with practical mentoring so
          students can learn from relatable role models.
        </p>
      </section>

      <div className={`${shared.grid} ${shared.twoColGrid}`} style={{ gap: '24px' }}>
        {tutors.map((tutor) => (
          <div key={tutor.name} className={shared.card}>
            {tutor.photo ? (
              <img
                className={`${shared.cardImage} ${tutor.fullPhoto ? shared.cardImageContain : ''}`.trim()}
                src={tutor.photo}
                alt={tutor.name}
              />
            ) : null}
            <h2 className={shared.cardTitle}>{tutor.name}</h2>
            <p className={shared.muted}>{tutor.subject}</p>
            <div style={{ marginTop: '16px' }}>
              <p className={shared.cardDesc}>{tutor.description}</p>
              {tutor.specialties ? (
                <p className={shared.smallText}>
                  <strong>Specialties:</strong> {tutor.specialties}
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
