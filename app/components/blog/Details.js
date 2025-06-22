"use client"
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import styles from './blog.module.css';
import { useUser } from '@clerk/nextjs'
import Test from '../home/Test';
import { FaDeleteLeft } from 'react-icons/fa6';
import { deleteBlog } from '@/app/actions/deleteBlog';
import { useRouter } from 'next/navigation';
import UserData from '@/app/actions/UserData';

const Details = (props) => {
  const [likes, setlikes] = useState(props.likes)
  const [liked, setLiked] = useState(false);
  const [saved, setsaved] = useState(false)
  const [hovered, setHovered] = useState(false);
  const [hovered2, setHovered2] = useState(false);
  const {user, isLoaded} = useUser();//is loaded?
  const r=useRouter()
  const slug=props.slug;
  const admin=props.admin;
  useEffect(() => {
    //2.check if user already liked the slug
    const a=async()=>{
      // const res = await fetch(`/api/user/${user?.primaryEmailAddress?.emailAddress}`);
      // const data = await res.json();
      const data=await UserData()
      console.log("first:::",data)
      // console.log(data.data.liked);//
      if(data.liked.includes(slug)){
        setLiked(true)
      }
      if(data.readLater.includes(slug)){
        setsaved(true)
      }
      console.log(slug,":::::::::::::",data.readLater)
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
   const updateUserSave=async(task)=>{
    const a = task === "save" ? "put" : task === "unsave" ? "delete" : "";
    const res = await fetch(`/api/user/${user?.primaryEmailAddress.emailAddress}`,{
    method:a,headers:{
      "Content-Type":"application/json",
    }, 
    body:JSON.stringify({field:"readLater",slug:slug})
  })
  const data = await res.json();
  console.log(data);

  }
  const handleClick = async(t) => {
    if(user){
    if(t=="Like"){
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
    }else if(t=="Save"){
      console.log("eleeeeeeeeeeeeeeeeeeeeee")
      if(!saved){
      updateUserSave("save")
      setsaved(true)
    }
    else {
      updateUserSave("unsave")
      setsaved(false)
    }
    }
  }else{
    alert("User not exist: Please sign in")
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
      <button onClick={()=>handleClick("Like")} onMouseEnter={() => setHovered(false)} onMouseLeave={() => setHovered(false)} style={{border:'0'}} aria-label="Like blog">
        <Image
        alt='Like Blog'
        width={22}
        height={22}
        src={liked? '/like(2).png' : '/like(1).png'} 
        />{likes}
      </button>
      {/* <button onClick={()=>console.log("shared")} onMouseEnter={() => setHovered2(false)} onMouseLeave={() => setHovered2(false)} style={{border:'0'}} aria-label="Share blog">
        <Image
        alt='Share Blog'
        width={22}
        height={22}
        src={hovered2 ? '/send(2).png' : '/send(1).png'} 
        />{props.shares}
      </button> */}
      <button onClick={()=>handleClick("Save")} style={{border:'0'}} aria-label="Share blog">
        <Image
        alt='Save Blog'
        width={22}
        height={22}
        src={saved ? '/saved.png' : '/save.png'} 
        />
      </button>
      {admin&&<button onClick={()=>handleDelete()} style={{border:'0'}} aria-label="Delete blog">
        <Image
        alt='Delete Blog'
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
