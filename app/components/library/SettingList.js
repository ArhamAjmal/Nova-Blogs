"use client"
import React, { useState } from 'react'
import styles from './library.module.css'
import Link from 'next/link'
import Image from 'next/image'

const SettingList = () => {
    const [list, setlist] = useState(["Liked Blogs","Saved Blogs","Authors","About us","Contact"])
    const formatSlug = (text) =>
  typeof text === "string" ? text.toLowerCase().replace(/\s+/g, "") : "";

     const a=(c)=>{
      if(c=="Liked Blogs"){
        return("/like(4).png")
      }
      else if(c=="Saved Blogs"){
        return("/bookmark.png")
      }
      else if(c=="Authors"){
        return("/quill-pen.png")
      }
      else if(c=="About us"){
        return("/info.png")
      }
      else if(c=="Contact"){
        return("/phone2.png")
      }
      else return("/home.png")
     }
  return (
    <section className={styles.settinglist}>
      <ul>
        {list.map((item,ind)=>(
          <Link key={ind} href={`/${formatSlug(item)}`}><li>
            <Image width={100} height={100} src={a(item)} style={{height:"1.65rem",width:"1.65rem",padding:"0.2rem"}}/>
            {item}
          </li></Link>
        ))}
      </ul>
    </section>
  )
}

export default SettingList
