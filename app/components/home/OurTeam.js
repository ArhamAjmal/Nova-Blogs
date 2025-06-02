import React from 'react'
import styles from './Ourteam.module.css'
import Image from 'next/image'

const OurTeam = () => {

  return (
    <div className={styles.salestrainers}>
      <h1>
        Our <span className={styles.highlight}>team</span>
      </h1>
      <div className={styles.trainercard}>
         <Image
          src={'/Me2.jpg'}
          width={150}
          height={150}
          objectFit='cover'
        />     
        <div className="trainer-info">
          <h2>Arham Ajmal</h2>
          <span className={styles.role}>Seniour Developer</span>
          <ul>
            <li>Builds and maintains scalable web applications using Next.js framework</li>
            <li>Ensures SEO optimization and dynamic routing for better user experience</li>
          </ul>
        </div>
      </div>
      <div className={styles.trainercard}>
        <Image
          src={'/Her.jpg'}
          width={150}
          height={150}
          objectFit='cover'
        />       
         <div className="trainer-info">
          <h2>Tuba Arif</h2>
          <span className={styles.role}>Content Strategist</span>
          <ul>
            <li>Creates engaging and SEO-friendly content for websites and blogs</li>
            <li>Edits and proofreads content to maintain clarity and brand voice</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default OurTeam
