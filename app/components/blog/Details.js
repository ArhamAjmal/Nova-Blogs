"use client"
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import styles from './blog.module.css';
import { useUser } from '@clerk/nextjs'
import Test from '../home/Test';
import { FaDeleteLeft } from 'react-icons/fa6';
import { deleteBlog } from '@/app/actions/deleteBlog';
import { useRouter } from 'next/navigation';

const Details = (props) => {
  const [likes, setlikes] = useState(props.likes)
  const [liked, setLiked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hovered2, setHovered2] = useState(false);
  const {user, isLoaded} = useUser();//is loaded?
  const r=useRouter()
  const slug=props.slug;
  const admin=props.admin;
  useEffect(() => {
    //2.check if user already liked the slug
    const a=async()=>{
      const res = await fetch(`/api/user/${user?.primaryEmailAddress?.emailAddress}`);
      const data = await res.json();
      // console.log(data.data.liked);//
      if(data.data.liked.includes(slug)){
        console.log("yes inclueddddddddd")
        setLiked(true)
      }
    }
    if(user){//1.if user islogined then
       a()
    }
  
  }, [isLoaded])
  
  const updateBlogLikes = async (task) => {
    const res = await fetch(`/api/blogs/${slug}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: task }),
    });
    const data = await res.json();
    console.log(data);
  }
  const updateUserLikes=async(task)=>{
    const a = task === "like" ? "put" : task === "dislike" ? "delete" : "";
    const res = await fetch(`/api/user/${user?.primaryEmailAddress.emailAddress}`,{
    method:a,headers:{
      "Content-Type":"application/json",
    }, 
    body:JSON.stringify({field:"liked",slug:slug})
  })
  const data = await res.json();
  console.log(data);

  }
  const handleClick = async() => {
    if(!liked){//1.if not liked then like on click
      setLiked(true)
      setlikes(likes+1)
      //2.updatinf like slug on blog like
      updateBlogLikes("like")
      //3. updating user like slug
      updateUserLikes("like")
    }
    else {
      setLiked(false)
      setlikes(likes-1)
      updateBlogLikes("dislike")
      updateUserLikes("dislike")
    }
  

  };
  const handleDelete=()=>{
    const c=confirm(`Do you to delete the blog: ${slug}`)
    if(c){
      // console.log("ele")
      const a=deleteBlog(slug)
      if(a){
        alert("Blog Deleted")
        r.push("/home")
      }
    }else{
      // console.log("hi")
    }
  }
  return (
    <div className={styles.main}>
       <div className={styles.detaildiv}>
        <span>Author: {props.aa}</span>
        <span>Publish Date : {new Date(props.date).toLocaleDateString()}</span>
      </div>

      <div className={styles.buttondiv}>
      <button onClick={handleClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{border:'0'}}>
        <Image
        width={22}
        height={22}
        src={liked? '/like(2).png' : '/like(1).png'} 
        />{likes}
      </button>
      <button onClick={()=>console.log("shared")} onMouseEnter={() => setHovered2(true)} onMouseLeave={() => setHovered2(false)} style={{border:'0'}}>
        <Image
        width={22}
        height={22}
        src={hovered2 ? '/send(2).png' : '/send(1).png'} 
        />{props.shares}
      </button>
      {admin&&<button onClick={()=>handleDelete()} style={{border:'0'}}>
        <Image
        width={20}
        height={20}
        src={'/delete.png'} 
        />
      </button>}
      </div>
    </div>
  )
}

export default Details
