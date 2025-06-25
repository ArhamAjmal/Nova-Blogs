"use client"
import React, { useEffect, useRef, useState } from 'react'
import styles from './Filter.module.css'
import Tags from './Tagss'
import { useRouter } from 'next/navigation'
const Filter = (props) => {
  const router=useRouter()
  // const [tags, settags] = useState(["Healthh","Techh","Medicine"])
  const [tags, settags] = useState([])//list of selected tags
  const [open, setOpen] = useState(false);//isi boolean ki base me hum alert ko visible or invisible kren ge
  const aa=props.aa?.split(',') || [];
  const modalRef = useRef(null);
  useEffect(() => {
    // console.log(aa)
    if(aa.length!=0 && aa!="empty")settags([...aa])
  }, [])
    const removeTag = (indexToRemove) => {
    settags(prev => prev.filter((_, index) => index !== indexToRemove));///?
  };
  // Close on outside click
  useEffect(() => {//This hook runs every time open changes (because it's in the dependency array)
    
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {//event.target is the actual HTML element the user clicked on.
        //.current point to the element linked to modalRef ->in if make sure that modalRef is connected to a dom element
        //2nd condition insure that the click was not on modalRef.current
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);//single click on document->anywhere
    } else {
      document.removeEventListener("mousedown", handleClickOutside);//This prevents memory leaks and ensures we don’t check clicks unnecessarily.
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      /**This is the cleanup function.
         React automatically calls this function before running the effect again or when the component unmounts.
         We remove the event listener to prevent multiple instances piling up. */
    };
  }, [open]);
  //updating tags on query if tag change in tag filter
  useEffect(() => {
    if(tags.length!=0)router.push(`/tags?selected=${tags}`)
    else if(tags.length==0 && window.location.pathname=="/tags")router.push(`/tags?selected=empty`)
  //console.log("TAgs loc:",window.location.pathname)
  }, [tags])
  
  
  return (
    <div className={styles.mainTags}>
      {/* <h2>Tags:</h2> */}
      <div className={styles.tagscon}>
        {tags.length==0 && <span>Add tags#</span>}
        {/* <div>Medicine<button>x</button></div> */}
        {tags.map((item,ind)=>(
          <div key={ind}>{item}
          <button onClick={() => removeTag(ind)} >x</button></div>
        ))}
      </div>
      {/* <button onClick={()=>{settags(prev => [...prev, "arham"])}}>+</button>*???? */}
      <button onClick={()=>setOpen(true)}>+</button>{/**????*/}
   
        {open && <Tags ref={modalRef} onleave={()=>{setOpen(false)}} settags={settags} tags={tags}/>}

    </div>
  )
}

export default Filter
