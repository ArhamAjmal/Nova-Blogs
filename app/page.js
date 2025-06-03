"use client"
import Image from "next/image";
import styles from "./page.module.css";
import Header from "./components/home/Head";
import About from "./components/home/About";
import Categories from "./components/home/Categories";
import Test from "./components/home/Test";
import Footer from "./components/Footer/Footer";
import OurTeam from "./components/home/OurTeam";
import Contact from "./components/home/Contact";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const r=useRouter()
    
 useEffect(() => {
     if (typeof window !== 'undefined') {

 if (window.innerWidth < 720) {
  console.log("eleeeeeeeeeeee")
  r.push('/home')
   return(<></>)
 }
}
   
 }, [])
//  if (window.innerWidth < 720) {
//   return(<></>)
// }

  return (
    <div>  
      {/* <Test/>     */}
      <Header/>
      <About/>
      <Categories/>
      <OurTeam/>
      <Footer/>
    </div>
  );
}
