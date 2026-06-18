import { Link } from 'react-router-dom'
import shared from '../components/shared.module.css'

const openHouseItem = {
  id: 'static-open-house',
  title: 'OPEN HOUSE- June 27th',
  capacity: 20,
  student_ids: [],
}

function getClassDescription(title) {
  const normalized = title?.trim().toLowerCase()
  if (normalized.includes('open house')) {
    return '11:00am - 3:00pm · Free Snacks Provided!'
  }
  return 'A hands-on class designed to inspire curiosity and practical learning.'
}

export default function CatalogPage() {
  const title = openHouseItem.title
  const enrolled = (openHouseItem.student_ids || []).length
  const seatsLeft = Math.max(0, (openHouseItem.capacity || 0) - enrolled)

  return (
    <div className={shared.page}>
      <h1>Registration</h1>
      <p className={shared.lead}>Browse our published classes and enroll your child.</p>

      <div className={shared.grid}>
        <div className={shared.card}>
          <div className={shared.spread}>
            <h2 className={shared.cardTitle}>{title}</h2>
          </div>
          <p className={shared.muted} style={{ marginTop: 8 }}>
            {getClassDescription(title)}
          </p>
          <p className={shared.muted} style={{ marginTop: 8 }}>
            {`${seatsLeft} seat${seatsLeft === 1 ? '' : 's'} left`}
          </p>
          <div style={{ marginTop: 12 }}>
            <Link to={`/sections/${openHouseItem.id}`} className={shared.btn}>
              View &amp; enroll
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
