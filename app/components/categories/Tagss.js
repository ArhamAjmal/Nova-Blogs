"use client"
import React, { useEffect, useState } from 'react'
import styles from './Filter.module.css'
import { useRouter } from 'next/navigation'
import Spinner from '../allblogs/Spinner'

const Tags = (props) => {
  const router=useRouter()
  
  const [alltags, setalltags] = useState([])
  const selectedtags=props.tags
  /*const [alltags, setalltags] = useState([
    // A
    'Army', 'apple', 'arms', 'Ant', 'Arrow', 'Art',
    'Army', 'apple', 'arms', 'Ant', 'Arrow', 'Art',
    'Army', 'apple', 'arms', 'Ant', 'Arrow', 'Art',
    // B
    'Ball', 'banana', 'bat', 'Boat', 'Bottle', 'Bridge',
    'Ball', 'banana', 'bat', 'Boat', 'Bottle', 'Bridge',
    // C
    'cat', 'cup', 'car', 'Cake', 'Camera', 'Chair',
    'cat', 'cup', 'car', 'Cake', 'Camera', 'Chair',
    // D
    'dog', 'duck', 'drum', 'Desk', 'Dance', 'Drive',
    'dog', 'duck', 'drum', 'Desk', 'Dance', 'Drive',
    // E
    'elephant', 'eagle', 'Egg', 'Engine', 'Earth', 'Energy',
    'elephant', 'eagle', 'Egg', 'Engine', 'Earth', 'Energy',
    //F
    'fish',"ginger"
  ])*/
  const [groupedTags, setGroupedTags] = useState({});//->{A:["Arham",Areeb],B:[Bomb,Brake],,,,,,}
  useEffect(() => {
    //fetching all tags in setting tags
    const a=async()=>{
      const res = await fetch("/api/allTags");
      const data = await res.json();
      setalltags(data.data);
    }
    a();
  
  }, [])
  
  useEffect(() => {

    const group = {};
    alltags.forEach(tag => {
      const firstLetter = tag[0].toUpperCase();
      if (!group[firstLetter]) {
        group[firstLetter] = [];
      }
      group[firstLetter].push(tag);
    });

    setGroupedTags(group);
  }, [alltags]); // re-group tags if prop changes

  const sortedLetters = Object.keys(groupedTags).sort();//yhan hum sirf grouped tags ki keys ko alphabetically sort karen ge
  //inside sorted letters ["A","H","I"...]->only those keys which are peresent in grouped tags
  const handletagclick=(tag)=>{
    if(selectedtags.includes(tag)){
      props.settags(prevTags => prevTags.filter(taga => taga !== tag));
      //router.push(`/tags?selected=${selectedtags}`)
    }
    else{
      props.settags(prevItems => [...prevItems,tag])
      //router.push(`/tags?selected=${selectedtags}`)
    }

  }
  return (
    <div onMouseLeave={props.onleave} ref={props.ref} className={styles.alltags}>
      {sortedLetters.length==0 && <Spinner/>}
      {sortedLetters.map(letter => (
        <div className={styles.lettercon} key={letter}>
          <h3>{letter}</h3>

          <div className={styles.tags}>
            {groupedTags[letter].map(tag => (
              <div style={{backgroundColor:selectedtags.includes(tag) ? "orange" : "#eee",color: selectedtags.includes(tag) ? "#fff" : "#000",}} onClick={()=>{handletagclick(tag)}} key={tag}>{tag}</div>
            ))}
          </div>

        </div>
      ))}
  </div>
  )
}

export default Tags
//1.List of tags
//2.loop of A to Z(filter+remove)
//3.inside loop->heading of Alphabet+container of tags