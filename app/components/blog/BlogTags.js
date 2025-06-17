"use client"
import React, { useEffect, useState } from 'react'
import styles from './blog.module.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const BlogTags = (props) => {
    const router=useRouter()
    // const [list, setlist] = useState(['Army', 'apple', 'arms', 'Ant', 'Arrow', 'Art'])
    // const [list, setlist] = useState([...props.tags])
    const [list, setlist] = useState([])
    const tags=props.tags
    const cat=props.cat
    useEffect(() => {
      if(tags!=null && cat==null){
        setlist([...tags])
      }
      else if(cat!=null && tags==null){
        const a=async()=>{
        const res = await fetch(`/api/allTags?category=${cat}`);
        const data = await res.json();
        console.log(data)
        setlist(data.data)
      }
        a();
      }
    
      
      
    }, [])
    
  return (
    <div style={{marginTop:false?"2rem":"1rem"}} className={styles.tagscon}>
      Tags: 
      {list.map((item,ind)=>(
        <Link key={ind} href={`/tags?selected=${item}`} className='linkWrapper'>
        <div  key={ind}>{item}</div>
        </Link>
      ))}
    </div>
  )
}

export default BlogTags
