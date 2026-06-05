import { Outlet } from 'react-router-dom'
import Nav from './Nav'
import styles from './Layout.module.css'

/**
 * App shell: header (Nav), routed page content, footer.
 * Used as the parent route element so every page shares the chrome.
 */
export default function Layout() {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Nav />
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <p>
          © {new Date().getFullYear()} Enrichment Center. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
