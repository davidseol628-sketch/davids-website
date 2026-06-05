import { Outlet } from 'react-router-dom'

// Signup is the layout for the signup flow (chooser + the two signup forms).
// It renders the matched nested route via <Outlet/>.
export default function Signup() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px' }}>
      <Outlet />
    </div>
  )
}
