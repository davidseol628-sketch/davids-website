import shared from '../components/shared.module.css'
import homeStyles from './Home.module.css'
import brandonPhoto from '../assets/skec/C9BE7B76-8CA7-4409-8A55-1676F738A23B.jpeg'
import tienPhoto from '../assets/skec/9C2051D2-7839-4D98-814E-E7FBCA619633.jpeg'
import vyPhoto from '../assets/skec/2AA70290-3048-4E9D-B2D8-90A70C03342D.jpeg'

const tutors = [
  {
    name: 'Brandon Le',
    subject: 'STEM Classroom Instructor',
    photo: brandonPhoto,
    description:
      'Brandon is an Aerospace Engineering student at the University of Maryland and a researcher in rotorcraft aerodynamics. He is passionate about helping students build strong STEM foundations through engaging and supportive instruction. He enjoys making challenging concepts approachable while helping students develop problem-solving skills that extend beyond the classroom.',
    specialties: 'Engineering, Physics, Aerospace',
  },
  {
    name: 'Dillon',
    subject: 'STEM Classroom Instructor',
    // photo removed
    description:
      'Dillon is studying Civil Engineering at the University of Maryland and is currently a Field Engineer Intern at a marine construction company. He loves teaching and explaining engineering and physics fundamentals, with a particular focus on the thought process and reasoning behind solutions. His goal is to help students build a strong foundation in critical thinking and logical reasoning.',
    specialties: 'Engineering, Physics, CAD Documentation',
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
    // photo removed
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
    // photo removed
    description:
      'Minh is a Mechanical Engineering student at the University of Maryland and the Workshops Executive Chair for the UMD Engineers without Borders Chapter. He is also a Project Lead the Way Biomedical Program graduate. He is passionate about helping students learn and explore engineering and STEM subjects.',
    specialties: 'Mechanical Engineering, Biomedical Engineering, Project Design',
  },
]

export default function AboutUs() {
  return (
    <div className={shared.page}>
      <section className={`${homeStyles.section} ${homeStyles.sectionAlt}`}>
        <h2>Our Mission Statement</h2>
        <p className={homeStyles.lead}>
          At Praxis Enrichment Center, we believe that knowledge and learning
          should be accessible to everyone. Our mission is to empower students
          through hands-on, engaging educational experiences that transform
          ideas into real-world skills outside of the classroom. By combining
          creativity, innovation, and practical application through our
          courses, we help young students build confidence, curiosity, and a
          passion for discovery.
        </p>
        <p className={homeStyles.lead}>
          Meet the team behind Praxis and learn about the people who help our
          students grow in STEM.
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
