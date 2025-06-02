import React, { useEffect, useState } from 'react'
import styles from './allblogs.module.css'
import { useRouter } from 'next/navigation'

const Suggestions = (props) => {
   const r=useRouter()
   const [show, setshow] = useState(true)
  // const [list, setlist] = useState(["Drug on human body and its side effects","Effect of drug on human body and its side effects","Body and its side effects",])
  const [list, setlist] = useState([...props.suggestions])
  //console.log("Suggejbsakbda",props.suggestions)
  useEffect(() => {
    setlist(props.suggestions)
  }, [props.suggestions])
  const handleclick=(i)=>{
     r.push(`/search?q=${i}`)
     setshow(false)
     props.iref.current.blur()
  }
  if(!show)return(<div></div>)
  return (//mousedown for click->you are stopping the browser from changing focus during the mousedown phase.The input keeps its focus
    <div onMouseDown={(e) => e.preventDefault()} ref={props.modalref} className={styles.suggList}>
      {list.map((item,ind)=>(
      <div onClick={()=>handleclick(item)} style={{margin:0,...(ind == list.length - 1 && { border: '0' })}}>{item}</div>
      ))}
   
    </div>
  )
}

export default Suggestions
