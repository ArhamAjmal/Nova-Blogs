import React from 'react'
import styles from './allblogs.module.css'

const Spinner = () => {
  return (
    <div>
      <img className={styles.loading} 
        src="/loading(orange).png" 
        alt="Loading"
        style={{ width: "2rem", height: "2rem" }}
      />
    </div>
  )
}

export default Spinner
