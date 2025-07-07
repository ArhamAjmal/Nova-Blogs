"use client"
import React, { useEffect, useRef, useState } from 'react'
import styles from './Filter.module.css'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { scale } from 'framer-motion'

const CatNames = () => {
  const r=useRouter();
  const pathname = usePathname();
 const activeStyle = {
    backgroundColor: 'orange',
    // border: '2px solid gray',
    color: 'white',
    transform:'scale(1.06)',
  };
  // Example logic
  const isHome = pathname === '/home';
  const isCategoryPage = pathname.startsWith('/category');
  const isBlogDetail = pathname.includes('/blog/');

  const reff=useRef()
    const [Cats, setCats] = useState(["Health","Science","Tech","Crypto","Gadgets","Startups","RealEstate","Coding","AI","Future"])
  
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

  useEffect(() => {
    console.log(pathname)
  
  }, [pathname])
  

  return (
    <section className={styles.mainCatNames} >
        <h2>
          <Image height={100} width={100} src={'/trend.png'} style={{height:"1.4rem",width:"1.4rem"}}/>
          Top Categories
        </h2>
    <nav className={styles.CatNames} ref={reff} aria-label="Category Navigation">
      {Cats.map((item,ind)=>(
        <Link key={ind} href={`/categories/${item}`} className='linkWrapper'>
        <div key={ind} style={(pathname==`/categories/${item}`)?activeStyle:undefined}>{item}</div>
</Link>
      ))}
    </nav>
    </section>
  )
}

export default CatNames
