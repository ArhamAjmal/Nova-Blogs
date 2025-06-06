"use client"
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import styles from './allblogs.module.css'
import Link from 'next/link';
import CatList from '../categories/CatList';
import { useRouter } from 'next/navigation';
import Spinner from './Spinner';
import Footer from '../Footer/Footer';
const Content = () => {//lazyloading+catch
  const scrollRefs = useRef({});
 const router = useRouter();
  // const handleClick = () => {
  //   router.push('/blogs/a');
  // };
 const scroll = (category, direction) => {
  const container = scrollRefs.current[category];
  if (container) {
    const scrollAmount = 400;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  }
};

   //const [cat,setcat]=useState(["Recent Blogs","Science","Technology"])
  const [allCat, setallCat] = useState([])
  const [cat,setcat]=useState([])
  const [Allblogs, setAllblogs] = useState({})
  //getting recent blogs
  useEffect(() => {
      const fetchRecent = async () => {
     const res = await fetch(`/api/blogs/category/limited?category=Recent`);
      const data = await res.json();
      setAllblogs({"Recent Blogs":data.data})
    }
    fetchRecent()
  
  }, [])
  
  //1. All cat list
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("/api/Allcategories");
      const data = await res.json();
      setallCat(data.data);
      setcat(data.data.slice(0,3))//4 ki limit
    };
    fetchCategories();
  }, []);

  //2.fetching data on the basis of list
  useEffect(() => {
    //loop of allcategories     
    const b=async() => {
      for (let c of cat) {  //console.log(c)->categoy
      const res = await fetch(`/api/blogs/category/limited?category=${c}`);
      const data = await res.json();
      //console.log("DATA: ",data.data)
      setAllblogs(prev => ({
           ...prev,        // Copy existing properties
           [c]:data.data  // Add new array
          }))
      }
    }
    b();
  }, [cat])
  const a=()=>{
    setcat(prev => [
      ...prev,
      ...allCat.slice(cat.length, cat.length+4)
    ])
  }
  
  if (Object.keys(Allblogs).length<3) {
    return(<div style={{minHeight:"110vh"}}><Spinner/></div>)
  }
  console.log(cat.length,Object.keys(Allblogs).length-1)
  console.log(cat.length!=(Object.keys(Allblogs).length-1))
  return (
    <div className={styles.allList}>
      {/* {Object.keys(Allblogs).length==0 &&<div style={{textAlign:"center",marginTop:"2rem"}}>Loading...</div>} */}
      {/* {Object.keys(Allblogs).length==0 && <Spinner/>} */}
    
      {Object.entries(Allblogs).map(([category, blogs])=>(
      
      <div key={category} className={styles.mainlist}>
       <h2>{category}</h2>
      <div className={styles.secmainlist}>
      <Link href={`/categories/${category}`}>more</Link>

    {/* <button onClick={() => scroll(category, 'left')}><Image height={30} width={30} src={'/next.png'}/></button> */}
    <div ref={(el) => (scrollRefs.current[category] = el)} className={styles.list}>
     <button onClick={() => scroll(category, 'left')}><Image height={30} width={30} src={'https://res.cloudinary.com/djruzbhto/image/upload/v1749240844/next_4_vndtsl.png'}/></button>

      { blogs.map((item,ind)=>(
    
        <div onClick={()=>{router.push(`/blog/${item.slug}`)}} key={ind} className={styles.listItem}>
        <Image
            alt='myimage'
            src={item.coverImageUrl}
            width={200}
            height={150}
            objectFit='cover'
            />
          <span>{item.title}</span>
          </div>
      ))}
          <button onClick={() => scroll(category, 'right')}><Image height={30} width={30} src={'https://res.cloudinary.com/djruzbhto/image/upload/v1749240839/next_4_dqze8s.png'}/></button>
    </div>
    {/* <button onClick={() => scroll(category, 'right')}><Image height={30} width={30} src={'/next.png'}/></button> */}
    </div>

</div>
))
}
    {(Object.keys(Allblogs).length>2 && cat.length!=allCat.length) &&<button onClick={a}>more</button>}
    {cat.length!=(Object.keys(Allblogs).length-1) && <Spinner/>}
    </div>
  )
}

export default Content
/**Allblogs logic
 * 1.All cetegories list(hard coded or fetch)
 * 2.bari bari sari list ki item ki query lgk blogs ki list fetch hok ae gi
 * 
 */
/*
// Create object with two array properties
const myObject = {
  A1: ["1","2","3"],
  A2: ["3","6","7"]
};
myObject.A3 = ["w","2"]; // or myObject['A3'] = [];
console.log(myObject.A3);

//Push new items to arrays
myObject.A1.push('4');
 */
/*const [data, setData] = useState([//1. list of blogs on the basis of cats
      {
        name: 'Main issue with our country and how to tacke it..',
        image: '/learning.jpg'
      },
      {
        name: 'Teach issue in huma socity we',
        image: '/work.jpg'
      },
      {
        name: 'Science',
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