import { Link } from 'react-router-dom'
import shared from '../components/shared.module.css'

export default function Tutors() {
  return (
    <div className={shared.page}>
      <h1>Tutors</h1>
      <p className={shared.lead}>
        Browse our tutor network and connect with skilled educators across a
        range of subjects and specialties.
      </p>
      <div className={shared.grid}>
        {[
          { name: 'Brandon Le', subject: 'STEM Mentor' },
          { name: 'David Seol', subject: 'Learning Coach' },
          { name: 'Tien Tran', subject: 'Science Educator' },
          { name: 'Minh Hong', subject: 'Math Specialist' },
          { name: 'Avery Minion', subject: 'Creative Tutor' },
          { name: 'Thanh Luu', subject: 'Career Advisor' },
        ].map((tutor) => (
          <div key={tutor.name} className={shared.card}>
            <h2 className={shared.cardTitle}>{tutor.name}</h2>
            <p className={shared.muted}>{tutor.subject}</p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
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
