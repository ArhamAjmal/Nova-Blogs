import UserAccount from '@/app/components/library/UserAccount'
import React from 'react'
import NavBar from '../components/allblogs/NavBar'
import Footer from '../components/Footer/Footer'

const page = () => {
  return (
    <main style={{minHeight:"110vh"}}>
      <NavBar/>
      <UserAccount/>
      <Footer/>
    </main>
  )
}

export default page
