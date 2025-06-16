import React from 'react'
import styles from './allblogs.module.css'

const Spinner2 = () => {
  return (
    <div>
      <img className={styles.loading2} 
        src="/loading(orange).png" 
        alt="Loading"
        style={{ width: "1.7rem", height: "1.7rem" }}
      />
    </div>
  )
}

export default Spinner2
