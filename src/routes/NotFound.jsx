import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '64px 24px', textAlign: 'center' }}>
      <h1>404</h1>
      <p>That page doesn’t exist.</p>
      <p>
        <Link to="/">Go home</Link>
      </p>
    </div>
  )
}
