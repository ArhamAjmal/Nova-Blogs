"use client"
import Image from 'next/image';
import React, { useState } from 'react'
import styles from './home.module.css'
import { useRouter } from 'next/navigation';

const Categories = () => {
  const r=useRouter()
  const [data, setdata] = useState(["Health","Tech","Science","Gadgets","Crypto","AI"])
  // const [data, setData] = useState([
  //   {
  //     name: 'Health',
  //     image: '/Health.png'
  //   },
  //   {
  //     name: 'Tech',
  //     image: '/Tech.png'
  //   },
  //   {
  //     name: 'Science',
  //     image: '/Science.png'
  //   },
  //   {
  //     name: 'Gadgets',
  //     image: '/Gadgets.png'
  //   },
  //   {
  //     name: 'Crypto',
  //     image: '/Crypto.png'
  //   },
  //   {
  //     name: 'AI',
  //     image: '/AI.png'
  //   },
  // ]);
    const a=(c)=>{
      if(c=="Health"){
        return("https://res.cloudinary.com/djruzbhto/image/upload/v1748694313/Health-Care-Financial-Consultant-Technology_v4ysx4.png")
      }
      else if(c=="Science"){
        return("https://res.cloudinary.com/djruzbhto/image/upload/v1748694486/Science-and-Technology-2_tl59ra.jpg")
      }
      else if(c=="Tech"){
        return("https://res.cloudinary.com/djruzbhto/image/upload/v1748693988/tech-companies_uc3uoh.jpg")
      }
      else if(c=="Gadgets"){
        return("https://res.cloudinary.com/djruzbhto/image/upload/v1748693410/1__0_8X--FEYoQpz7K6PV8DQ_nxmfc9.jpg")
      }
      else if(c=="Crypto"){
        return("https://res.cloudinary.com/djruzbhto/image/upload/v1748694433/bitcoin-what-is-crypto-scaled_qplqyp.jpg")
      }
      else if(c=="AI"){
        return("https://res.cloudinary.com/djruzbhto/image/upload/v1748772786/what-is-ai_1_ndhun3.jpg")
      }
      else return("/")
     }
  return (
    <>
    <div className={styles.con3}>
      <h2>Categories</h2>
      <li>Navigate through our full range of subjects and topics</li>
      {/* <a href='/'>more</a> */}

    <div className={styles.grid}>
      {
        data.map((item,ind)=>(
          <div onClick={()=>r.push(`/categories/${item}`)} key={ind} >
            <Image
            src={a(item)}
            width={100}
            height={100}
            objectFit='cover'
            />
            <span>{item}</span>
          </div>
        ))
      }
    </div>
    </div>
    </>
  )
}

export default Categories
