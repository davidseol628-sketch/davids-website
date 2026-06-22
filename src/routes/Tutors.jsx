import { Link } from 'react-router-dom'
import shared from '../components/shared.module.css'
import homeStyles from './Home.module.css'

export default function Tutors() {
  return (
    <div className={shared.page}>
      <section className={`${homeStyles.section} ${homeStyles.sectionAlt}`}>
        <h2>Our Mission</h2>
        <p className={homeStyles.lead}>
          At Praxis Enrichment Center, we believe that knowledge and learning
          should be accessible to everyone. Our mission is to empower students
          through hands-on, engaging educational experiences that transform
          ideas into real-world skills outside of the classroom. By combining
          creativity, innovation, and practical application through our
          courses, we help young students build confidence, curiosity, and a
          passion for discovery.
        </p>
      </section>

      <h1>Tutors</h1>
      <p className={shared.lead}>
        Browse our tutor network and connect with skilled educators across a
        range of subjects and specialties.
      </p>
      <div className={`${shared.grid} ${shared.twoColGrid}`} style={{ gap: '24px' }}>
        {[
          {
            name: 'Brandon Le',
            subject: 'STEM Classroom Instructor',
            description:
              'Brandon is an Aerospace Engineering student at the University of Maryland and a researcher in rotorcraft aerodynamics. He is passionate about helping students build strong STEM foundations through engaging and supportive instruction. He enjoys making challenging concepts approachable while helping students develop problem-solving skills that extend beyond the classroom.',
          },
          {
            name: 'David Seol',
            subject: 'STEM Classroom Instructor',
            description:
              'David helps students reach their academic goals through personalized learning strategies, confidence-building support, and practical study skills.',
          },
          {
            name: 'Tien Tran',
            subject: 'STEM Classroom Instructor',
            description:
              'Tien graduated from the University of Maryland with a B.S. in Biological Sciences and is a current graduate student pursuing a Master’s degree in Biotechnology and Management with a strong interest in healthcare and medicine. As a pre-health student, she has gained clinical experience through patient care, volunteering, and healthcare outreach locally and internationally. Her background in clinical settings, research, and education helps her communicate complex concepts clearly, adapt to different learning styles, and build meaningful connections with students.',
            specialties: 'Math, Chemistry, Biology',
          },
          {
            name: 'Thanh Luu',
            subject: 'STEM Classroom Instructor',
            description:
              'Thanh is a Computer Engineering student at the University of Maryland who loves helping students build confidence and succeed in STEM. With a strong background in leading robotics teams and mentoring peers in hands-on engineering projects, he makes math, science, and technology approachable, organized, and fun. Thanh enjoys snowboarding, volleyball, building Legos, and working out.',
            specialties: 'Math, Science, Technology',
          },
          {
            name: 'Vy',
            subject: 'STEM Classroom Instructor',
            description:
              'Vy is a pre-health and Public Health Science student at the University of Maryland dedicated to helping students thrive in math and science. With experience in university biochemistry labs and direct patient care, she focuses on turning intimidating STEM subjects into clear, manageable steps and creating an encouraging, structured learning environment.',
            specialties: 'Biology, Biotechnology, Research, English, Environmental Science',
          },
        ].map((tutor) => (
          <div key={tutor.name} className={shared.card}>
            <h2 className={shared.cardTitle}>{tutor.name}</h2>
            <p className={shared.muted}>{tutor.subject}</p>
            <div style={{ marginTop: '16px' }}>
              <p>{tutor.description}</p>
              {tutor.specialties ? (
                <p className={shared.smallText}>
                  <strong>Specialties:</strong> {tutor.specialties}
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
      <p style={{ marginTop: 18 }}>
        <Link to="/catalog" className={shared.btn}>
          Browse classes instead
        </Link>
      </p>
    </div>
  )
}
