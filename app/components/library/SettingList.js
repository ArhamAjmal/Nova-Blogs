"use client"
import React, { useState } from 'react'
import styles from './library.module.css'
import Link from 'next/link'

const SettingList = () => {
    const [list, setlist] = useState(["Liked Blogs","Saved Blogs","Authors","About us","Feedback","Dark Mode"])
    const formatSlug = (text) =>
  typeof text === "string" ? text.toLowerCase().replace(/\s+/g, "") : "";
  return (
    <section className={styles.settinglist}>
      <ul>
        {list.map((item,ind)=>(
          <Link key={ind} href={`/${formatSlug(item)}`}><li>{item}</li></Link>
        ))}
      </ul>
    </section>
  )
}

export default SettingList
