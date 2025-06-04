import BlogTags from '@/app/components/blog/BlogTags'
import Footer from '@/app/components/Footer/Footer'
import FBlogs from '@/app/components/search/FBlogs'
import BlogModel from '@/app/lib/model'
import styles from '../cat.module.css'
import dbConnect from '@/app/lib/connect'
//server
const page =async ({ params }) => {
  await dbConnect()
  //catch route params
   let { slug } =await params; // Extract route param->params should be awaited
   slug=decodeURIComponent(slug)
     //now we will extract the data direclt and pass to blogs page

   //fetching recent blogs
   if(slug.startsWith("Recent")){
    const blogs=await BlogModel.find().sort({ date: -1 }).limit(9).select("title coverImageUrl slug");
    const blogs2=JSON.parse(JSON.stringify(blogs))
    return (
    <div>
        <div style={{width:'fit-content',marginLeft:'5rem',fontWeight:'100',fontSize:'1.6rem',marginTop:'0.5rem'}}>{slug.charAt(0).toUpperCase() + slug.slice(1)}</div>
        {/* <div style={{marginLeft:'0rem',fontWeight:'500',fontSize:'1.6rem',marginTop:'0.5rem',textAlign:"center"}}>{slug.charAt(0).toUpperCase() + slug.slice(1)}</div> */}

        <FBlogs cat={slug.charAt(0).toUpperCase() + slug.slice(1)} catlist={(blogs2)}/>
        {!slug.startsWith("Recent") &&<BlogTags cat={(slug)}/>}
    </div>
  )
   }
    //fetching specific cat blog
    const blogss=await BlogModel.find({ category:slug}).limit(9).sort({ date: -1 }).select("title coverImageUrl slug");//here we are case sensative
    const blogss2=JSON.parse(JSON.stringify(blogss))
  //here well also fetch tags and send to blog tags
  
  return (
    <div>
        <div className={styles.slugDisplay}>{slug.charAt(0).toUpperCase() + slug.slice(1)}</div>
        {/* <div style={{marginLeft:'0rem',fontWeight:'500',fontSize:'1.6rem',marginTop:'0.5rem',textAlign:"center"}}>{slug.charAt(0).toUpperCase() + slug.slice(1)}</div> */}

        <FBlogs cat={slug.charAt(0).toUpperCase() + slug.slice(1)} catlist={(blogss2)}/>
        {!slug.startsWith("Recent") &&<BlogTags cat={(slug)}/>}
    </div>
  )
}

export default page
