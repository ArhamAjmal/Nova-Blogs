"use client"
import React from 'react'
import { useEffect, useState } from "react"
import styles from './action.module.css'
import NotifyAdd from "./NotifyAdd"
import { AnimatePresence, motion } from 'framer-motion'

const NotifyList = (props) => {
    // const [list, setlist] = useState(["add","add","remove","add","remove","add","remove"])
    const [list, setlist] = useState(props.list)
    

    useEffect(() => {
      setlist(props.list)
    
    }, [props.list])
    

  return (
    <div className={styles.notList} >
     <AnimatePresence>
        {list.map((item, ind) => (
          <motion.div
            key={ind}
            initial={{ opacity: 1, height: 0, y: 20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: 0 }}
            transition={{ duration: 0.1 }}
          >
            <NotifyAdd task={item}/>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* <button onClick={()=>{setlist(prev => [...prev, "add"])}}>Clicklk</button> */}
    </div>
  )
}

export default NotifyList
