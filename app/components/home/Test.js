"use client"
import React, { useState } from 'react'

const Test = () => {
  const content = `
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

`;
  const [con, setcon] = useState(content)
    const obj={
    views: 9,
    title: "MArk sahab has launched its new complany.",
    category: "Politics",
    description: content,
    shares: 0,
    coverImageUrl: "https://res.cloudinary.com/djruzbhto/image/upload/v1747562200/kennedy_gprzd6.jpg",
    likes: 0,
    date: new Date(),
    tags: ["mark", "launched", "company"],
    author: "Arham",
    slug: "mark-launched-company",
}

 const UploadDB=async()=>{
  const res = await fetch('/api/user/arhamoajmal@gmail.com',{
    method:"post",headers:{
      "Content-Type":"application/json",
    }, 
    body:JSON.stringify({liked:[],readLater:[]})
  })
  const data = await res.json();
  console.log(data);
 }
 const UpdateDB=async()=>{//update liked and read later array pf user
  const res = await fetch('/api/user/arhamoajmal@gmail.com',{
    method:"put",headers:{
      "Content-Type":"application/json",
    }, 
    body:JSON.stringify({field:"liked",slug:"future-tech-war"})
  })
  const data = await res.json();
  console.log(data);
  

 }
 const GetDB=async()=>{
  //userdatabase
  const res = await fetch('/api/user/arhamoajmal@gmail.com');
  const data = await res.json();
  console.log(data);//
}
const DeleteDB=async()=>{
  const res = await fetch('/api/user/arhamoajmal@gmail.com',{
    method:"delete",headers:{
      "Content-Type":"application/json",
    }, 
    body:JSON.stringify({field:"liked",slug:"slug3"})
  })
  const data = await res.json();
  console.log(data);
  
}



const GetSpecificDB=async()=>{
  const res = await fetch(`/api/blogs/Health-science`);
  const json = await res.json();
  console.log(json)
  //console.log(json.data);
  //console.log(json.data.title)
}
  return (
    <div>
      <button onClick={UploadDB}>upload data</button>
      <button onClick={UpdateDB}>Update data</button>
      <button onClick={GetDB}>get data</button>
      <button onClick={DeleteDB}>delete data</button>
      <button onClick={GetSpecificDB}>Get specific data</button>
     
    </div>
  )
}

export default Test
