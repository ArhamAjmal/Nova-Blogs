"use client"
import React, { useEffect, useRef, useState } from 'react'
import styles from './Filter.module.css'
import { useRouter } from 'next/navigation'

const CatNames = () => {
  const r=useRouter();
  const reff=useRef()
    const [Cats, setCats] = useState(["Health","Science","Tech","Crypto","Startups","Gudgets","RealEstate","Coding","Ai","Future"])
  
    useEffect(() => {
      const a=()=>{
    const el = reff.current;
    if (el && el.scrollWidth > el.clientWidth) {
            el.classList.remove(styles.red);
    } else if (el) {
            el.classList.add(styles.red)
    }
  }
     // Initial check
     a()
    // Resize event listener
    window.addEventListener("resize", a);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", a);
    };
  }, []);

  return (
    <div className={styles.mainCatNames} >
        <h2>Top Categories</h2>
    <div className={styles.CatNames} ref={reff}>
      {Cats.map((item,ind)=>(
        <div onClick={()=>{r.push(`/categories/${item}`)}} key={ind}>{item}</div>
      ))}
    </div>
    </div>
  )
}

export default CatNames
