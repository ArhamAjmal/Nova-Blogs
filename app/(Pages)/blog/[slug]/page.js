"use client"
import { useSearchParams, useParams } from 'next/navigation';

import { useEffect, useState } from 'react';
import { MDXRemote } from 'next-mdx-remote'; // ✅ Client version
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import styles from './blog.module.css';
import { mdxComponents } from '@/app/components/blog/Cimage';
import Details from '@/app/components/blog/Details';
import BlogTags from '@/app/components/blog/BlogTags';
import FBlogs from '@/app/components/search/FBlogs';
import Spinner from '@/app/components/allblogs/Spinner';
import fetchBlog from '@/app/actions/fetchBlog';
import { FaPen, FaPencil } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import NotFoundPage from '@/app/components/action/NotFoundPage';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
const Blogpage = () => {
  const {user, isLoaded} = useUser();//is loaded?
  const adminEmail1 = "arhamoajmal@gmail.com";
  const adminEmail2 = "tubaarif3905@gmail.com";
  const admin=(isLoaded && (user?.primaryEmailAddress.emailAddress === adminEmail1||user?.primaryEmailAddress.emailAddress === adminEmail2))?true:false


  const [blog, setblog] = useState("")
  const r=useRouter()
  const [success, setsuccess] = useState(true)
//const searchParams = useSearchParams();//q params
 //const page = searchParams.get('page');
  const params = useParams();//rout params

  const { slug } = params;
  // console.log("slug:",slug)
  const [mdxSource, setMdxSource] = useState(null);

 /* useEffect(() => {
    //console.log("eleeeeeeeeee")
    //1.fetch blog using slug
    const a=async()=>{
      const res = await fetch(`/api/blogs/${slug}`);
      const data = await res.json();
      // console.log(data.data.title)
      // console.log(data.success)
      if(data.success){
        //2.sending des to fun which change it to html
        parseMDX(data.data.description);
        setblog(data.data)
      }
      else{
        parseMDX("# 404 Page not found");
      }
    }
    a()
   
  }, [])*/
  useEffect(() => {
    const b=async()=>{
      const data=await fetchBlog(slug)
      setsuccess(data.success)
      setblog(data.data)
      parseMDX(data.data.description)
      
      
      
    }
    b()
  }, [])
  

   const parseMDX = async (content) => {//changing mdx to html
        const result = await serialize(content, {
          mdxOptions: { remarkPlugins: [remarkGfm] }
        });
        setMdxSource(result);
      };

      if(!success)return(<NotFoundPage/>)
      else if(!mdxSource) return(<div><Spinner/><div style={{height:"110vh"}}></div> </div>)


  return (
    <div>
    {/* {!mdxSource &&<p  style={{textAlign:"center",marginTop:"2rem"}}>Loading...</p>} */}
    <div className={styles.container}>
      <div style={{display:"flex",justifyContent:"center"}}>
        <h1>{blog.title}</h1>
  {admin&&<button
      onClick={() => r.push(`/admin/edit?slug=${blog.slug}`)}
      style={{
        border: 'none',
        fontSize: '1.2rem',
        cursor: 'pointer',
        padding: '0px',
        marginBottom:"1rem",
        marginTop:"0.5rem",
        marginLeft:"-15px",
        height:"fit-content",
        borderRadius:"5px"
      }}
    >
      <FaPen size={20} color='grey'/>
    </button>      }
      </div>
       <Image
        height={400}
        width={400}
        src={blog.coverImageUrl}
         style={{
            height:'270px',
            maxWidth: '400px', // Responsive width
            maxHeight: '650px', // Your desired max height
            margin:'0px auto 20px auto',
            display:'flex',
            objectFit:'cover',
            border:"solid 2px",
          }}/>
      {/* <Description des={blog.description}/> */}
      {mdxSource && <MDXRemote {...mdxSource} components={mdxComponents} />}
    </div>
    <Details likes={blog.likes?blog.likes:0} shares={blog.shares?blog.shares:0} aa={blog.author} date={blog.date} slug={blog.slug} admin={admin}/>
    <BlogTags tags={blog.tags}/>
    <div style={{width:'fit-content',marginLeft:'3.4rem',marginTop:"1rem",fontWeight:'400',fontSize:'1.3rem',marginTop:'0.5rem'}}>Related Blogs</div>
    <FBlogs related={blog.tags} ss={blog.slug} minheight={true}/>
    </div>
  )
}

export default Blogpage;


 /*useEffect(() => {
      const parseMDX = async () => {
        const result = await serialize(content, {
          mdxOptions: { remarkPlugins: [remarkGfm] }
        });
        setMdxSource(result);
      };
      parseMDX();
    }, []);*/

       /* const content = `
# Health and Technology: A Powerful Partnership for the Future

## Introduction

In a world where innovation is at the forefront of every industry, the intersection of **healthcare and technology** is shaping up to be one of the most impactful partnerships of the 21st century. From wearable devices that monitor our heart rates to AI-powered diagnostic tools, technology is not just supporting healthcare it's **transforming** it.
![Alt Text for img](https://res.cloudinary.com/djruzbhto/image/upload/v1746201573/Screenshot_239_zvz41i.png)

<span>This is an Image of a saudi minister finding peace in dubai.</span>


## How Technology is Revolutionizing Healthcare

### 1. Wearables and Personal Health Monitoring

Wearable devices like smartwatches and fitness trackers have changed how individuals manage their health. These tools help users:

- Track steps and calories
- Monitor heart rate and sleep quality
- Receive health alerts in real-time

> “Your watch knows more about your heart than your doctor does during a regular visit.”

---

### 2. Artificial Intelligence in Diagnosis

AI is helping doctors diagnose diseases **faster and more accurately** than ever before.

#### Common AI Applications:
- Detecting cancer in radiology scans
- Predicting heart disease based on patterns
- Analyzing patient records to suggest treatments

\`\`\`js
// Example: Predicting diabetes risk with AI
function predictRisk(bmi, age) {
  if (bmi > 30 && age > 45) return "High Risk";
  return "Low Risk";
}
\`\`\`

---

### 3. Telemedicine and Remote Care

During the COVID-19 pandemic, telemedicine became a lifeline. It allows:

- Patients to consult doctors from home
- Rural populations to access specialists
- Lower healthcare costs and faster service

#### Telemedicine Platforms
| Platform     | Country | Specialty      |
|--------------|---------|----------------|
| Teladoc      | USA     | General Health |
| Sehat Kahani | Pakistan| Women’s Health |
| Practo       | India   | Multispecialty |

---

## Health Data and Privacy

With great data comes great responsibility.

- Health apps collect sensitive information like location, vitals, and habits
- Ensuring **data encryption** and **user consent** is essential
- Governments are now implementing strict **data protection laws** (e.g., HIPAA, GDPR)

> “Tech should heal, not harm.”

---

## Robotics and Surgery

Robots are assisting doctors in **minimally invasive surgeries**.

- More precision, less scarring
- Shorter hospital stays
- Faster recovery times

Famous robotic systems like **Da Vinci** are used globally for complex procedures in urology, gynecology, and cardiology.

---

## Benefits of Tech in Health

- Early disease detection
- Personalized treatment plans
- Real-time monitoring and alerts
- Greater accessibility and affordability

---

## Challenges We Still Face

1. **Digital Divide** : Not everyone has access to devices or internet
2. **Privacy Risks** : Health data leaks can be dangerous
3. **Over-reliance on AI** : Machines should support, not replace, doctors
--- 

## Conclusion

Technology is reshaping the health industry at a rapid pace. From mobile apps to machine learning, we are stepping into an era where **personalized, predictive, and preventive** healthcare becomes the norm. However, this transformation must be handled with care — prioritizing **ethics, privacy, and equity**.

#### “Health and tech together can save lives, but only if guided by humanity.”

---

## Further Reading

- [WHO: Digital Health Guidelines](https://www.who.int/publications/i/item/9789241550505)
- [Harvard Health Blog on AI in Medicine](https://www.health.harvard.edu)
- [OpenAI’s Role in Medical Research](https://openai.com/research)

`;*/
/*const contentt = `
# H1 (me v h1 ka hissa)
## H2
### H3 (...H6)
This is a simple text
**bold**  
*italic*  
~~Strikethrough~~
> Blockquote \n
[OpenAI Link](https://openai.com)\n
![king image](https://res.cloudinary.com/djruzbhto/image/upload/v1746201573/Screenshot_239_zvz41i.png)
<span}>Image of king looking at the glass</span>

---
### Unordered List
- Apple  
- Banana  
- Cherry
* Mango
### Ordered List
1. First  
2. Second  
3. Third
### Task Lists
- [x] Task One
- [ ] Task Two
- [ ] Task Three
---
## Table

| Name  | Age | City   |
|-------|-----|--------|
| Alice | 24  | Lahore |
| Bob   | 29  | Karachi|

---

## ✅ Code Blocks

\`\`\`js
function greet(name) {
  return "Hello, " + name;
}
\`\`\`
`;*/
 