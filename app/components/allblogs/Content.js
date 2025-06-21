"use client"
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import styles from './allblogs.module.css'
import Link from 'next/link';
import CatList from '../categories/CatList';
// import { useRouter } from 'next/navigation';
import Spinner from './Spinner';
import Footer from '../Footer/Footer';
import Spinner2 from './Spinner2';
import getLimitedBlogs from '@/app/actions/getLimitedBlogs';
import BlogCard from './BlogCard';
import { useUser } from '@clerk/nextjs';
const Content = (props) => {//lazyloading+catch
  const scrollRefs = useRef({});
  const {user, isLoaded} = useUser();//is loaded?
  const [saved, setsaved] = useState(props.saved)
//  const router = useRouter();
  // const handleClick = () => {
  //   router.push('/blogs/a');
  // };
 const scroll = (category, direction) => {
  const container = scrollRefs.current[category];
  if (container) {
    const scrollAmount = 500;
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
  const [isHovered, setIsHovered] = useState(false);
  //getting recent blogs
  useEffect(() => {
      const fetchRecent = async () => {
    //  const res = await fetch(`/api/blogs/category/limited?category=Recent`);
    //   const data = await res.json();
      const d=await getLimitedBlogs("Recent")
      // console.log("Hiiiiiiiiiiiiiiii",d.data)
      setAllblogs({"Recent Blogs":d.data})
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
    const obj={}     
    const b=async() => {
      for (let c of cat) {  //console.log(c)->categoy
      // const res = await fetch(`/api/blogs/category/limited?category=${c}`);
      // const data = await res.json();
      const d=await getLimitedBlogs(c)
      obj[c]=d.data
      // console.log("objjjjjjjjj:",obj)
      /*/game for giving it 4 list until cat==allcat
      setAllblogs(prev => ({
           ...prev,        // Copy existing properties
           [c]:d.data  // Add new array
          }))
      }*/
    }
     setAllblogs(prev => ({//means ab loop complete one k bad data mile ga
           ...prev,        // Copy existing properties
           ...obj  // Add new array
          }))
        // console.log("first:",Allblogs)
      }
    // setAllblogs(prev =>[...prev,obj])
      

    b();
  }, [cat])

  const a=()=>{
    setcat(prev => [
      ...prev,
      ...allCat.slice(cat.length, cat.length+4)
    ])
  }
  const isSaved=(s)=>{
    // console.log("first",s)
    // const res = await fetch(`/api/user/${user?.primaryEmailAddress?.emailAddress}`);
    //  const data = await res.json();
    // //   console.log(data?.data?.readLater?.includes(s))

      if (saved.includes(s)) {
        return(true)
      }
      else return false
  }


  if ((Object.keys(Allblogs).length<4 && cat.length!=allCat.length) || (cat.length==0) || Object.keys(Allblogs).length<=1 ){
    return(<div style={{minHeight:"110vh"}}><Spinner/></div>)
  }
  return (
    <section className={styles.allList}>
      {/* {Object.keys(Allblogs).length==0 && <Spinner/>} */}
    
      {Object.entries(Allblogs).map(([category, blogs])=>(
      
      <article key={category} className={styles.mainlist}>
       <h2>{category}</h2>
      <div className={styles.secmainlist}>
      <Link href={`/categories/${category}`} >more</Link>

    <nav ref={(el) => (scrollRefs.current[category] = el)} className={styles.list} aria-label={`${category} scrollable blog list`}>
     <button onClick={() => scroll(category, 'left')}><Image height={25} width={25} alt="Scroll Left" src={'https://res.cloudinary.com/djruzbhto/image/upload/v1749240844/next_4_vndtsl.png'} /></button>

      { blogs.map((item,ind)=>(
        <BlogCard key={ind} item={item} saved={isSaved(item.slug)}/>
      
    // <Link key={ind} href={`/blog/${item.slug}`} className={styles.linkWrapper}>
    //     <article  key={ind} className={styles.listItem}>
    //     <Image
    //         alt={item.title}
    //         src={item.coverImageUrl}
    //         width={200}
    //         height={150}
    //         style={{objectFit:"fill"}}
    //         />
    //       <span>{item.title}</span>
    //       <button onMouseEnter={() => setIsHovered(true)}
    //               onMouseLeave={() => setIsHovered(false)}
    //       ><Image height={50} width={50} src={isHovered ? "/saved.png" : "/save2.png"} style={{width:"1rem",height:"1rem"}}/></button>
    //       </article>
    //  </Link>
      ))}
          <button onClick={() => scroll(category, 'right')}><Image height={25} width={25} alt="Scroll Left" src={'https://res.cloudinary.com/djruzbhto/image/upload/v1749240839/next_4_dqze8s.png'}/></button>
    </nav>
    </div>

</article>
))
}
    {(Object.keys(Allblogs).length>2 && cat.length!=allCat.length) &&<button onClick={a} style={{marginBottom:"0.4rem"}}>more</button>}
    {cat.length!=(Object.keys(Allblogs).length-1) && <Spinner2/>}
    </section>
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