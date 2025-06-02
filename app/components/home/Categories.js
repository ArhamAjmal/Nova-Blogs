"use client"
import Image from 'next/image';
import React, { useState } from 'react'
import styles from './home.module.css'
import { useRouter } from 'next/navigation';

const Categories = () => {
  const r=useRouter()
  const [data, setData] = useState([
    {
      name: 'Health',
      image: '/Health.png'
    },
    {
      name: 'Tech',
      image: '/Tech.png'
    },
    {
      name: 'Science',
      image: '/Science.png'
    },
    {
      name: 'Gadgets',
      image: '/Gadgets.png'
    },
    {
      name: 'Crypto',
      image: '/Crypto.png'
    },
    {
      name: 'AI',
      image: '/AI.png'
    },
  ]);
  return (
    <>
    <div className={styles.con3}>
      <h2>Categories</h2>
      <li>Navigate through our full range of subjects and topics</li>
      {/* <a href='/'>more</a> */}

    <div className={styles.grid}>
      {
        data.map((item,ind)=>(
          <div onClick={()=>r.push(`/categories/${item.name}`)} key={ind} >
            <Image
            src={item.image}
            width={100}
            height={100}
            objectFit='cover'
            />
            <span>{item.name}</span>
          </div>
        ))
      }
    </div>
    </div>
    </>
  )
}

export default Categories
