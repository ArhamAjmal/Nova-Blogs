"use server"
import dbConnect from '@/app/lib/connect';
import BlogModel from '@/app/lib/model';
import UserModel from '@/app/lib/userModel';
import { currentUser } from "@clerk/nextjs/server";
import styles from './savedblogs.module.css'
import FBlogs from '@/app/components/search/FBlogs';
import UserData from '@/app/actions/UserData';
import SigninWrapper from '@/app/components/library/SigninWrapper';
import Footer from '@/app/components/Footer/Footer';

const page = async() => {
      await dbConnect();
      
        const user = await currentUser();
        if(user==null)return(<div style={{minHeight:"100vh"}}><div style={{fontSize:"1.9rem",textAlign:"center",marginTop:"2rem",color:"#727272"}}>No user found</div><SigninWrapper/></div>)
        console.log("User",user)
        //1.fetching data directly from db and then sending to fblogs
      //   const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/${user?.primaryEmailAddress?.emailAddress}`, {
      //    cache:"no-store", // Revalidate every 60 seconds
      //  });
      //   const data = await res.json();
        const data= await UserModel.findOne({email:user?.primaryEmailAddress.emailAddress}).select("readLater");
        console.log("dddddddddddddddd:::",data.readLater)
        // console.log(data.data.liked)
        const readlater=data.readLater || []
        if(!user ||readlater.length==0)return(<div><div className={styles.noresult}>No saved blogs</div><Footer/></div>)
        //2.directly calling mongo
        const blogs = await BlogModel.find({ slug: { $in: data.readLater } }).select("title coverImageUrl slug")//lean gives plain object
        const blogs2=JSON.parse(JSON.stringify(blogs))
        //console.log(blogs)
        console.log("firs:t",blogs2)
  
            const Udata=await UserData()
  return (
    <main>
      <section aria-label="Liked Blogs">
       <h1 className={styles.savedBlogs}>Saved Blogs</h1>
        {/* {user &&
        <FBlogs email={user?.primaryEmailAddress?.emailAddress}/>
        } */}
        {/* <FBlogs likedList={JSON.parse(JSON.stringify(blogs))}/> */}
         <FBlogs savedList={blogs2} userSaved={Udata.readLater}/>
         
</section>
         </main>
  )
}

export default page
