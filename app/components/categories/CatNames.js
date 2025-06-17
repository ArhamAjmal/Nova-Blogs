"use client"
import React, { useEffect, useRef, useState } from 'react'
import styles from './Filter.module.css'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const CatNames = () => {
  const r=useRouter();
  const reff=useRef()
    const [Cats, setCats] = useState(["Health","Science","Tech","Crypto","Gadgets","Startups","RealEstate","Coding","Ai","Future"])
  
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
    <section className={styles.mainCatNames} >
        <h2>Top Categories</h2>
    <nav className={styles.CatNames} ref={reff} aria-label="Category Navigation">
      {Cats.map((item,ind)=>(
        <Link key={ind} href={`/categories/${item}`} className='linkWrapper'>
        <div key={ind}>{item}</div>
</Link>
      ))}
    </nav>
    </section>
  )
}

export default CatNames
