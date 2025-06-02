
import NavBar from '../../components/allblogs/NavBar'
import Filter from '../../components/categories/Filter';
import CatNames from '../../components/categories/CatNames';
import CatList from '../../components/categories/CatList';
import Footer from '../../components/Footer/Footer';
import dbConnect from '@/app/lib/connect';
import BlogModel from '@/app/lib/model';
import styles from './cat.module.css'

import { catImageCloud } from '@/app/actions/catImageCloud';
//server
const page =async() => {
    dbConnect();
    const categories = await BlogModel.distinct("category");//fetching all categories and caching them
    const categories2=JSON.parse(JSON.stringify(categories))
    //console.log(categories2)
    
    /*/now here we will fetch map then send directly
      //1. All cat list
          const map = {};
      // const b = async () => {
        // const map = {};
        for (const cat of categories2) {

          const url = await catImageCloud(cat);
          
          map[cat] = url;
          // setImageMap(prev => ({ ...prev, [cat]: url }));
        }*/
        // console.log(map)
     // }
      // b()
  return (
    <div>
    <div className={styles.CategoriesTitle}>Categories</div>
    {/* <div style={{marginLeft:'0rem',fontWeight:'600',fontSize:'1.6rem',marginTop:'0.5rem',textAlign:"center"}}>Categories</div> */}
    <CatList cat={categories2} /*imgmap={map}*//>
    </div>
  )
}

export default page
