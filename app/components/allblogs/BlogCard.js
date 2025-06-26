import { useEffect, useState } from 'react';
import styles from './allblogs.module.css'
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@clerk/nextjs';

const BlogCard = (props) => {
  const item=props.item
  const saved=props.saved
  const [isHovered, setIsHovered] = useState(false);
  const {user, isLoaded} = useUser();//is loaded?
  const [savedd, setsaved] = useState(saved ||false)
  const mobile=props.mobile || false

  const funToSetNot=props.setNot;
  const funToSetNotTask=props.setTaskNot;
  //funToSetNot(false)

  useEffect(() => {
    setsaved(saved)
  
  }, [saved])
  
  const updateUsersaved=async(task)=>{
    const a = task === "save" ? "put" : task === "unsave" ? "delete" : "";
    const res = await fetch(`/api/user/${user?.primaryEmailAddress.emailAddress}`,{
    method:a,headers:{
      "Content-Type":"application/json",
    }, 
    body:JSON.stringify({field:"readLater",slug:item.slug})
  })
  const data = await res.json();
  }

  const saveBlog=(s)=>{
    if(!user){
      alert("User not exist: Please Sign in")
      return
    }
    if(!savedd){
      setsaved(true)
      updateUsersaved("save")
      funToSetNotTask("add")
      funToSetNot(true)
      setTimeout(() => funToSetNot(false), 2000); // Hide after 3s
    }
      else {
        setsaved(false)
        updateUsersaved("unsave")
        funToSetNotTask("remove")
        funToSetNot(true)
        setTimeout(() => funToSetNot(false), 2000); // Hide after 3s
      }
  }
  return (
    
    <Link href={`/blog/${item.slug}`} className={styles.linkWrapper}>
      <article className={`${styles.listItem} ${mobile ? styles.mobile : ""}`} >
        <Image
          alt={item.title}
          src={item.coverImageUrl}
          width={200}
          height={150}
          style={{ objectFit: "fill"  }}
        />
        <span>{item.title}</span>
        <button
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={(e)=>{e.stopPropagation();e.preventDefault();saveBlog(item.slug)}}
        >
          <Image
            height={50}
            width={50}
            src= {(savedd)? "/saved.png" : "/save2.png"}
            style={{ width: "1rem", height: "1rem" }}
            alt="Save Icon"
          />
        </button>
      </article>
    </Link>
  );
};
export default BlogCard
