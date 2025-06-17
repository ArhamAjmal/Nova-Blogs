import Footer from '@/app/components/Footer/Footer'
import FBlogs from '@/app/components/search/FBlogs'
import { auth, currentUser, EmailAddress } from "@clerk/nextjs/server";
import styles from './like.module.css'
import BlogModel from '@/app/lib/model';
import dbConnect from '@/app/lib/connect';
import UserModel from '@/app/lib/userModel';

const page =async () => {
    await dbConnect();
    const user = await currentUser();
    if(user==null)return(<div style={{minHeight:"100vh",fontSize:"1.9rem",textAlign:"center",marginTop:"2rem",color:"#727272"}}>No user found</div>)
    console.log("User",user)
    //1.fetching data directly from db and then sending to fblogs
  //   const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/${user?.primaryEmailAddress?.emailAddress}`, {
  //    cache:"no-store", // Revalidate every 60 seconds
  //  });
  //   const data = await res.json();
    const data= await UserModel.findOne({email:user?.primaryEmailAddress.emailAddress});
    console.log(data)
    // console.log(data.data.liked)
    const liked=data.liked || []
    if(!user ||liked.length==0)return(<div><div className={styles.noresult}>No liked blogs</div><Footer/></div>)
    //2.directly calling mongo
    const blogs = await BlogModel.find({ slug: { $in: data.liked } }).select("title coverImageUrl slug")//lean gives plain object
    const blogs2=JSON.parse(JSON.stringify(blogs))
    //console.log(blogs)
    console.log("firs:t",blogs2)

  return (
    <main>
      <section aria-label="Liked Blogs">
       <h1 className={styles.likeBlogs}>Liked Blogs</h1>
        {/* {user &&
        <FBlogs email={user?.primaryEmailAddress?.emailAddress}/>
        } */}
        {/* <FBlogs likedList={JSON.parse(JSON.stringify(blogs))}/> */}
         <FBlogs likedList={blogs2}/>
</section>
         </main>
  )
}

export default page
