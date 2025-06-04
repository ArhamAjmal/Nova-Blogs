import React from 'react';
import NavBar from '../components/allblogs/NavBar';
import Filter from '../components/categories/Filter';
import FBlogs from '../components/search/FBlogs';
import Footer from '../components/Footer/Footer';
import BlogModel from '../lib/model';
import styles from './tags.module.css'

// Server Component
const page = async({ searchParams }) => {
  const selected =searchParams?.selected || 'empty';;
  const tagsArray = selected !== 'empty' ? selected.split(',') : [];//// Convert tags string to array
  //here we will fetch blogs on the basis of tags
  let blogs2=[]
  try {
  const blogs=await BlogModel.find({tags:{$in:tagsArray},}).sort({ date: -1 }).limit(9).select("title coverImageUrl slug");
  console.log("blogs",blogs)
  blogs2=JSON.parse(JSON.stringify(blogs))
  } catch (error) {
    console.log(error)
  }
  console.log("blogs",blogs)
  console.log("blogs2",blogs2)
  
  return (
    <div style={{minHeight:"110vh"}}>
      <NavBar/>
      <Filter aa={selected}/>
      {selected=="empty" && 
      <div style={{width:'100%',fontWeight:'100',fontSize:'1.25rem',marginTop:'0.5rem',fontFamily:"Arial",color:"#5e5e5e",textAlign:"center",minHeight:"100vh",color:"grey",marginLeft:"1rem"}}>No tag selected</div>}
      
      {selected!="empty" && 
      <div className={styles.resultDisplay}>Result:</div>}
        {selected!="empty" &&
      <FBlogs tags={selected} tlist={blogs2}/>} 
       <Footer/>
    </div>
    /* width: fit-content;
    margin-left: 4rem;
    font-family:Arial, Helvetica, sans-serif;
    margin-top: 0.5rem;
    font-weight: 100;
    font-size: 1.25rem;
    color: #5e5e5e; */
  )
}

export default page
