"use client"
import React, { useState } from 'react'
import NotifyAdd from '../components/action/NotifyAdd'

const page = () => {
  const [show, setshow] = useState(false)
 const handleClick = () => {
    setshow(true);
    setTimeout(() => setshow(false), 3000); // Hide after 3s
  };
  return (
    <div style={{height:"110vh"}}>
      <button
        onClick={handleClick}
      >
        Helloaaaa
      </button>

     <NotifyAdd show={show} task={"add"}/>   
</div>
  )
}

export default page
