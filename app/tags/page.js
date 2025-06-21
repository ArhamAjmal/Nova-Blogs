import React from 'react';
import NavBar from '../components/allblogs/NavBar';
import Filter from '../components/categories/Filter';
import FBlogs from '../components/search/FBlogs';
import Footer from '../components/Footer/Footer';
import BlogModel from '../lib/model';
import styles from './tags.module.css'
import dbConnect from '../lib/connect';
import UserData from '../actions/UserData';
export const metadata = {
  title: 'Tagged Blog Results – Nova Blogs',
  description: 'Browse blogs by selected tags such as AI, Healthcare, Innovation, and more.',
  alternates: {
    canonical: 'https://your-domain.com/tags',
  },
  openGraph: {
    title: 'Tagged Blog Results – Nova Blogs',
    description: 'Explore blogs filtered by your selected interests and tags.',
    url: 'https://your-domain.com/tags',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tagged Blog Results – Nova Blogs',
    description: 'Explore blogs filtered by your selected interests and tags.',
  },
  robots: {
    index: false,
    follow: false,
  },
};

// Server Component
const page = async({ searchParams }) => {
  await dbConnect()
  const selected =searchParams?.selected || 'empty';;
  const tagsArray = selected !== 'empty' ? selected.split(',') : [];//// Convert tags string to array
  //here we will fetch blogs on the basis of tags
  let blogs2=[]
  console.log("blogs2.1",blogs2)
  try {
  const blogs=await BlogModel.find({tags:{$in:tagsArray},}).sort({ date: -1 }).limit(9).select("title coverImageUrl slug");
  console.log("blogs",blogs)
  blogs2=JSON.parse(JSON.stringify(blogs))
  } catch (error) {
    console.log(error)
  }
  console.log("blogs2.2",blogs2)
      const Udata=await UserData()

  return (
    <main style={{minHeight:"110vh"}}>
      <NavBar/>
      <Filter aa={selected}/>
      {selected=="empty" && 
      <div style={{width:'100%',fontWeight:'400',fontSize:'1.25rem',marginTop:'0.5rem',fontFamily:"Arial",color:"#5e5e5e",textAlign:"center",minHeight:"100vh",color:"grey",marginLeft:"1rem"}}>No tag selected</div>}
      
      {selected!="empty" && 
      <div className={styles.resultDisplay}>Result:</div>}
        {selected!="empty" &&
      <FBlogs tags={selected} tlist={blogs2} userSaved={Udata.readLater}/>} 
       <Footer/>
    </main>
    
  )
}

export default page
