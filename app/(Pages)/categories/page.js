
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
//server
const page =async() => {
       await dbConnect();
    let categories2 = []; // <-- define outside
  try {
    const categories = await BlogModel.distinct("category");//fetching all categories and caching them
    categories2=JSON.parse(JSON.stringify(categories))
  } catch (error) {
    console.log(error)
  }
   
  
  return (
    <div>
    <div className={styles.CategoriesTitle}>Categories</div>
    {/* <div style={{marginLeft:'0rem',fontWeight:'600',fontSize:'1.6rem',marginTop:'0.5rem',textAlign:"center"}}>Categories</div> */}
    <CatList cat={categories2} /*imgmap={map}*//>
    </div>
  )
}

export default page
