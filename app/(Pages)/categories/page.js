
import NavBar from '../../components/allblogs/NavBar'
import Filter from '../../components/categories/Filter';
import CatNames from '../../components/categories/CatNames';
import CatList from '../../components/categories/CatList';
import Footer from '../../components/Footer/Footer';
import dbConnect from '@/app/lib/connect';
import BlogModel from '@/app/lib/model';
import styles from './cat.module.css'
export const dynamic = 'force-dynamic'; // This disables static generation


import { catImageCloud } from '@/app/actions/catImageCloud';
import allCategories from '@/app/actions/allCategories';
import Image from 'next/image';
//server
export const metadata = {
  title: 'Explore Blog Categories – YourSite',
  description: 'Browse all our blog categories including technology, innovation, AI, lifestyle, healthcare, and more.',
  alternates: {
    canonical: 'https://your-domain.com/categories',
  },
  openGraph: {
    title: 'Explore Blog Categories – YourSite',
    description: 'Discover blog content organized by category. Dive into topics like tech, AI, and more.',
    url: 'https://your-domain.com/categories',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Explore Blog Categories – YourSite',
    description: 'Discover blog content organized by category. Dive into topics like tech, AI, and more.',
  },
};
const page =async() => {
    await dbConnect();

    // const categories = await BlogModel.distinct("category");//fetching all categories and caching them
    // const categories2=JSON.parse(JSON.stringify(categories))
      const cat=await allCategories()
   
  
  return (
    <div>
    <div className={styles.CategoriesTitle}>
      <Image width={100} height={100} src={'/categories.png'} style={{height:"1.3rem",width:"1.35rem"}}/>
      Categories</div>
    {/* <div style={{marginLeft:'0rem',fontWeight:'600',fontSize:'1.6rem',marginTop:'0.5rem',textAlign:"center"}}>Categories</div> */}
    <CatList list={cat} auth={false}/*imgmap={map}*//>
    </div>
  )
}

export default page
