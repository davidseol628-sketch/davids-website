import { Link } from 'react-router-dom'
import shared from '../components/shared.module.css'

export default function Tutors() {
  return (
    <div className={shared.page}>
      <h1>Find Tutors</h1>
      <p className={shared.lead}>
        Browse our tutor network and connect with skilled educators across a
        range of subjects and specialties.
      </p>
      <div className={shared.card}>
        <p>
          This page is a starting point for your tutors directory. We can add a
          searchable list of available tutors, filters for subject and availability,
          and a direct contact or booking action here.
        </p>
        <p className={shared.muted}>
          Use the Catalog to explore classes and the Tutors page to meet our
          instructors.
        </p>
      </div>
      <p style={{ marginTop: 18 }}>
        <Link to="/catalog" className={shared.btn}>
          Browse classes instead
        </Link>
      </p>
    </div>
  )
}
