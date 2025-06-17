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
            src={`/${item}.png`}
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