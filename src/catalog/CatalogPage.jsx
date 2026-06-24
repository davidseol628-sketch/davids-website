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
    return '11:00am - 4:00pm'
  }
  return 'A hands-on class designed to inspire curiosity and practical learning.'
}

export default function CatalogPage() {
  return (
    <div className={shared.page}>
      <h1>Registration</h1>
      <p className={shared.lead}>Browse our published classes and enroll your child.</p>

      <div className={shared.grid}>
        <div className={shared.card}>
          <div className={shared.spread}>
            <h2 className={shared.cardTitle}>{openHouseItem.title}</h2>
          </div>
          <p className={shared.muted} style={{ marginTop: 8 }}>
            {getClassDescription(openHouseItem.title)}
          </p>
          <p className={shared.lead} style={{ marginTop: 8 }}>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSfzicZLAZmYWDzNV3xT2LMu953BJbDErN50_rL9Nov6I0aKoQ/viewform?usp=publish-editor"
              target="_blank"
              rel="noreferrer noopener"
            >
              Click here to register for the Open House.
            </a>
          </p>
          <p className={shared.muted} style={{ marginTop: 8 }}>
            You can also register by contacting us at{' '}
            <a href="mailto:praxiscenteredu@gmail.com">praxiscenteredu@gmail.com</a>.
          </p>
          <div style={{ marginTop: 12 }}>
            <button type="button" className={shared.btn} disabled>
              View details
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
