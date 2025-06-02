import Image from 'next/image'
import React from 'react'
import styles from './home.module.css'
const About = () => {
  return (
    <div className={styles.con2}>
         <Image
              src={'/work.jpg'}
              width={200}
              height={200}
              className='fade-in'
              />
              <div>
              <h2>Explore What Matters</h2>
              <p>Stay informed and inspired with our blog your go-to source for clear, practical insights on technology, health, and finance. We simplify complex topics so you can live smarter, healthier, and financially stronger.</p>
              </div>
      </div>
  )
}

export default About
