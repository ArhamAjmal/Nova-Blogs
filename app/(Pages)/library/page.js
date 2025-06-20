"use server"
import Profile from '@/app/components/library/profile'
import SettingList from '@/app/components/library/SettingList'
import SignOutWrapper from '@/app/components/library/SignoutWrapper'
import UserAccount from '@/app/components/library/UserAccount'
import React from 'react'

const page = () => {
    console.log("eeeeeeeeee")
  return (
    <main style={{minHeight:"100vh"}}>
      <Profile/>
      <SettingList/>
    </main>
  )
}

export default page
