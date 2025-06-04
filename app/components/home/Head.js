"use client"
import Image from 'next/image'
import React from 'react'
import styles from './home.module.css'
import { useRouter } from 'next/navigation';
const Header = () => {
  const router = useRouter();
  const handleClick = () => {
    router.push('/home');
  };
  return (
    <div className={styles.con}>
    <div className={`${styles.div1}  fade-in`}>
        <h2 style={{ fontFamily: "'Times New Roman', Times, serif" }}>Nova Blogs</h2>
        <p >Your daily dose of fresh perspectives and thought provoking insights for curious minds//</p>
        <button onClick={handleClick}>Learn more</button>
    </div>
    <div className={styles.div2}>
      <div>
        <Image
        src={'/learning.jpg'}
        width={200}
        height={200}
        />
      </div>
    </div>
    </div>
  )
}

export default Header
