import styles from './Home.module.css'

export default function ContactUs() {
  return (
    <div className={styles.page}>
      <section className={`${styles.section} ${styles.contact}`}>
        <h2>Get In Touch</h2>
        <p>9066 Baltimore Ave Unit A, College Park, MD 20740, USA</p>
        <p>Email: praxiscenteredu@gmail.com</p>
        <p>Opening Hours: Mon-Sat 12pm to 8 pm · Sun Closed (closed on July 4th)</p>
      </section>
    </div>
  )
}