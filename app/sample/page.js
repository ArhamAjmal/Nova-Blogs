import React from 'react'
import Tags from '../components/categories/Tagss'
import Details from '../components/blog/Details'
import Footer from '../components/Footer/Footer'
import Spinner from '../components/allblogs/Spinner'
import Test from '../components/home/Test'
import MdxEditor from '../components/admin/MdxEditor'
import NotFoundPage from '../components/action/NotFoundPage'
import Spinner2 from '../components/allblogs/Spinner2'

const page = () => {
  return (
    <div style={{height:"110vh"}}>
      <Spinner2/>
      <NotFoundPage/>
      <Footer/>
      </div>
  )
}

export default page
