import React from 'react'
import styles from './Ourteam.module.css'

const Contact = () => {
  return (
     <div className={styles.contactcontainer}>
      <h1>Contact us</h1>
      <div className={styles.contactinfo}>
        <div className={styles.contactblock}>
          <p>123 Anywhere St. Any City</p>
          <p>ST 12345</p>
        </div>
        <div className={styles.contactblock}>
          <p>Telephone: (123) 456-7890</p>
          <p>Mobile: (123) 456-7890</p>
        </div>
        <div className={styles.contactblock}>
          <p>hello@reallygreatsite.com</p>
        </div>
      </div>
      <div className={styles.logoblock}>
        <div className={styles.logobar}></div>
        <span>CodeNova Software & Services</span>
      </div>
    </div>
  )
}

export default Contact
