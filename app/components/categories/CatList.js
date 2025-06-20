"use client"
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import styles from './Filter.module.css'
import { useRouter } from 'next/navigation';
import Spinner from '../allblogs/Spinner';
import { catImageCloud } from '@/app/actions/catImageCloud';
import Link from 'next/link';

const CatList = (props) => {
  const router=useRouter();
  // const [imageMap, setImageMap] = useState(props.imgmap|| {}); // key: category, value: image url
// console.log(props.imgmap)
     const [allcategories, setallcategories] = useState(props.cat);
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
      else return("/")
     }
  return (
    <div style={{minHeight:"100vh"}}>
      {allcategories.length==0 && <Spinner/>}
      <div className={styles.Catlist}>
        {/* <button onClick={()=>console.log(allcategories)}>Click</button> */}
      { allcategories.map((item,ind)=>(
        <Link key={ind}  href={`/categories/${item}`} className='linkWrapper'>
        <div className={styles.listItem}>
        <Image
            alt={item}
            src={a(item)}
            width={200}
            height={150}
            objectFit='cover'
            loading="lazy"
            />
          <span>{item}</span>
          </div>
          </Link>
      ))}
    </div>
    </div>
  )//https://res.cloudinary.com/djruzbhto/image/upload/v1748624161/Science_hhz1fl.webp
}//https://res.cloudinary.com/djruzbhto/image/upload/v1746197178/my_uploads/gdt2zkro25mnjrsgitlr.png

export default CatList

/*const [data, setData] = useState([
          {
            name: 'Health',
            image: '/learning.jpg'
          },
          {
            name: 'Science',
            image: '/work.jpg'
          },
          {
            name: 'Technology',
            image: '/work.jpg'
          },
          {
            name: 'Teach',
            image: '/work.jpg'
          },
          {
            name: 'Teach',
            image: '/work.jpg'
          },
          {
            name: 'Teach',
            image: '/work.jpg'
          },
        ]);*/