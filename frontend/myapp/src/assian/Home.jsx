import React, { useState } from 'react'
import styles from './style/Navbar.module.css';
const Home = () => {
    const [seatNum,setSeatNum] = useState([])
    const handleChange = (e)=>{
        console.log(e.target.value)
        setSeatNum(e.target.value)
    }
    const handleClick = ()=>{
        
    }
  return (
    <div className={styles.Home}>
        <h1>Booking</h1>
        <input className={styles.Input} type="number" placeholder='Fill Seats' onChange={(e)=>{handleChange(e)}}/>
        <button className={styles.Button} onClick={handleClick}>Book Now</button>
    </div>
  )
}

export default Home