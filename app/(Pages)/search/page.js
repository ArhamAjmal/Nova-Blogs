import React from 'react'
import NavBar from '../../components/allblogs/NavBar'
import Filter from '../../components/categories/Filter'
import FBlogs from '../../components/search/FBlogs'
import Shead from '../../components/search/Shead'
import Footer from '../../components/Footer/Footer'
import BlogModel from '@/app/lib/model'
import dbConnect from '@/app/lib/connect'

const page = async({ params, searchParams }) => {
  await dbConnect()
  //const userId = params.id;//[id]
  const query =searchParams.q;
  // console.log(query)
  //fetching data on q basis
  const sBlogs = await BlogModel.find({title:{$regex: query, $options: "i" }}).sort({ date: -1 }).limit(9).select("title coverImageUrl slug"); // Searching
  const sBlogs2=JSON.parse(JSON.stringify(sBlogs))
  console.log(sBlogs2)
  return (
    <div>
    <Shead query={query}/>
    <FBlogs query={query} qlist={sBlogs2}/>
    </div>
  )
}

export default page
