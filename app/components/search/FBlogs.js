"use client"
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import styles from './SBlogs.module.css'
import { useRouter } from 'next/navigation';
import Spinner from '../allblogs/Spinner';
import Footer from '../Footer/Footer';
import Spinner2 from '../allblogs/Spinner2';
import Link from 'next/link';
import BlogCard from '../allblogs/BlogCard';
import UserData from '@/app/actions/UserData';

const FBlogs = (props) => {//props will decide
  const minheight=props.minheight
  const router=useRouter();
  const slug=props.cat;
  const query=props.query;
  const tags=props.tags;
  const related=props.related;
  const likedList=props.likedList;//for specific liked lists
  const savedList=props.savedList;//for specific savedblog lists
  const catlist=props.catlist;
  const qlist=props.qlist;
  const tlist=props.tlist;
  const trendlist=props.trendlist;
  const [userSaved, setuserSaved] = useState(props.userSaved || [])
  //const userSaved=props.userSaved || [];

  const [success, setsuccess] = useState(true)

  const [data2, setdata2] = useState([])
  const [finish, setfinish] = useState(false)
  const [showSpinner, setshowSpinner] = useState(false)

  useEffect(() => {
   //console.log("first")
   setshowSpinner(false)
  }, [data2.length])
  
        useEffect(() => {
            const a=async()=>{
            //for specifi cat
            if(slug!=null && query==null &&tags==null){
              /*if(slug.startsWith("Recent")){
                // const res = await fetch(`/api/blogs/category/recent`);
                // const data = await res.json();
                setdata2(catlist)
                //setfinish(data.finish)
                // console.log("REcent:",data)
              }
              else{
                // const res = await fetch(`/api/blogs/category?category=${slug}`);
                // const data = await res.json();
                //setdata2(data.data)
                setdata2(catlist)
                //setfinish(data.finish)
                //console.log(catlist)
              }*/
              if(catlist.length==0)setsuccess(false)
              if(catlist.length<9)setfinish(true)
              setdata2(catlist)

            }//for search
             else if(query!=null && slug==null &&tags==null){
            const res = await fetch(`/api/blogs/search?q=${query}`);
            const data = await res.json();
              setdata2(qlist)
              console.log(qlist.length)
              if(qlist.length==0){
                setsuccess(false)
                setfinish(true)
              }else if(qlist.length<4){
                setfinish(true)
                setsuccess(true)
              }
              else {setfinish(false);setsuccess(true)}
              // setsuccess(data.success)
              // setdata2(data.data)
              // setfinish(data.finish)
              //console.log("dataaaaaa:",data.success)
            }
            else if(tags!=null && slug==null && query==null){
            //if(tags!="empty"){console.log("www",tags)}
            // const res = await fetch(`/api/blogs/tags?selected=${tags}`);
            // const data = await res.json();
              console.log(tlist)
              setdata2(tlist)
              if(tlist.length<9)setfinish(true)
                else setfinish(false)
            }
             else if(related!=null && slug==null && query==null &&tags==null){
               const a=async()=>{
                 const res = await fetch(`/api/blogs/category/related?tags=${related}&&skip=${props.ss}`);
                 const data = await res.json();
                 if(data.data.length==0){setsuccess(false)
                  return
                 }
                 const d=await UserData()
                 setuserSaved(d.readLater)
                 setdata2(data.data)
                }
                a();
              // setdata2([
              //   {title:"AI Analyzes Elon Musk’s Public Health Advice",coverImageUrl:"https://res.cloudinary.com/djruzbhto/image/upload/v1747562193/190142-landscapes-nature-trees_mflqw6.jpg",slug:"slug"},
              //   {title:"AI Analyzes Elon Musk’s Public Health Advice",coverImageUrl:"https://res.cloudinary.com/djruzbhto/image/upload/v1747562193/190142-landscapes-nature-trees_mflqw6.jpg",slug:"slug"},
              //   {title:"AI Analyzes Elon Musk’s Public Health Advice",coverImageUrl:"https://res.cloudinary.com/djruzbhto/image/upload/v1747562193/190142-landscapes-nature-trees_mflqw6.jpg",slug:"slug"},
              //   {title:"AI Analyzes Elon Musk’s Public Health Advice",coverImageUrl:"https://res.cloudinary.com/djruzbhto/image/upload/v1747562193/190142-landscapes-nature-trees_mflqw6.jpg",slug:"slug"},
              //   {title:"AI Analyzes Elon Musk’s Public Health Advice",coverImageUrl:"https://res.cloudinary.com/djruzbhto/image/upload/v1747562193/190142-landscapes-nature-trees_mflqw6.jpg",slug:"slug"},
              // ])
              
              setfinish(true)
             }
              else if (likedList != null && related == null && slug == null && query == null && tags == null) {
                if(likedList.length==0){
                  return(<div className={styles.noresult}>No Like selected</div>)
                }
                // console.log("Likedddddddddd",likedList)
                setdata2(likedList)
                setfinish(true)
              }
              else if (savedList!=null && likedList == null && related == null && slug == null && query == null && tags == null) {
                if(savedList.length==0){
                  return(<div className={styles.noresult}>No saved blogs</div>)
                }
                // console.log("Likedddddddddd",likedList)
                setdata2(savedList)
                setfinish(true)
              }
              else if (trendlist!=null && likedList == null && related == null && slug == null && query == null && tags == null) {
                console.log("Trend",trendlist)
                setdata2(trendlist)
                setfinish(true)
                //setsuccess(false)
              }
          }
            a();
          
        }, [tags,slug,query,likedList,savedList])
        const b=async()=>{
          setshowSpinner(true)
          //relacing  spinner with more
          //for specifi cat
            if(slug!=null && query==null &&tags==null){
              if(slug.startsWith("Recent")){
                const res = await fetch(`/api/blogs/category/recent?skip=${data2.length}`);
                const data = await res.json();
                setdata2(prev => [...prev, ...data.data]);
                setfinish(data.finish)
              }
              else{
                const res = await fetch(`/api/blogs/category?category=${slug}&skip=${data2.length}`);
                const data = await res.json();
                setdata2(prev => [...prev, ...data.data]);
                setfinish(data.finish)
              }
           
            }//for search
             else if(query!=null && slug==null &&tags==null){
            const res = await fetch(`/api/blogs/search?q=${query}&skip=${data2.length}`);
            const data = await res.json();
              setdata2(prev => [...prev, ...data.data]);
              setfinish(data.finish)
            }
            else if(tags!=null && slug==null && query==null){
            const res = await fetch(`/api/blogs/tags?selected=${tags}&skip=${data2.length}`);
            const data = await res.json();
            // console.log(data.finish)
            setdata2(prev => [...prev, ...data.data]);
              setfinish(data.finish)
            }
            

      }
      const isSaved=(s)=>{
    // console.log("first",s)
    // const res = await fetch(`/api/user/${user?.primaryEmailAddress?.emailAddress}`);
    //  const data = await res.json();
    // //   console.log(data?.data?.readLater?.includes(s))

      if (userSaved.includes(s)) {
        return(true)
      }
      else return false
  }
      //if(tags!=null )return(<div>i am tags {query}</div>)
      // useEffect(() => {
      //   if(tags.length==0)router.push("/tags?selected=empty")
      // }, [tags])
      if(!success && related!=null)return(<div style={{fontSize:"1.5rem",textAlign:"center",marginTop:"2rem",color:"grey"}}>No Related Blogs</div>)
      if(!success)return(<div  className={styles.noresult}>No result found</div>)

  return (
    <section style={{minHeight:minheight?"0vh":"90vh"}} className={styles.listcon} aria-label="Blog List">
    {data2.length==0 &&<Spinner/>}
   <ul className={styles.list}>
      { data2.map((item,ind)=>(
        <li key={item.slug}>
        {/* <Link href={`/blog/${item.slug}`} className={styles.linkWrapper}>
        <article className={styles.listItem}>
        <Image
            src={item.coverImageUrl}
            alt={item.title}
            width={300}
            height={200}
            style={{ objectFit: 'fill' }}
            />
          <span>{item.title}</span>
          </article>
          </Link> */}
          <BlogCard item={item} saved={isSaved(item.slug)} mobile={true}/>
          </li>
      ))}
    </ul>
    {showSpinner &&<div style={{marginTop:"0.7rem",marginBottom:"0.3rem"}}><Spinner2/></div> } 
{(data2.length!=0 && (!finish) && !showSpinner) &&<button onClick={b} style={{width:"fit-content",alignSelf:'center',border:"0",color:"grey",margin:"0.7rem",cursor:"pointer",background:"transparent"}}>more</button>}    
</section>
  )
}

export default FBlogs
 /*const [data, setData] = useState([
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
    