import React, { useEffect, useState } from 'react'
import styles from './style/Navbar.module.css';
import axios from "axios";
const Home = () => {
    const [seats, setSeats] = useState([]);
    const [numSeats, setNumSeats] = useState("");
    const [book, setBook] = useState([])
    const [msg, setMsg] = useState("")
    const handleClick = async () => {
        console.log("hii")
        try {
            await axios.post(`/seat/seatbook`, {
                numSeats: parseInt(numSeats)
            }).then((res) => {
                console.log(res.data.message);
                if (res.data.message) {
                    setBook(res.data.message)
                }
                console.log(res)
            });
            await axios.get(`/seat`)
            .then((res)=>{
               function compare(a,b){
                   return a.seatNumber-b.seatNumber
               }
       
               let y=res.data.seats
                y.sort(compare)
               setSeats(y);
               setNumSeats('');
               setMsg("")
            })
             
           }catch(error){
             console.error(error.response.data.error);
             setMsg(error.response.data.error)
             alert(msg)
             setBook([])
           }
    };
    
    useEffect(() => {
        const fetchSeats = async () => {
        
            try {
                await axios.get(`/seat`)
                .then((res)=>{
                    console.log(res)
                    function compare(a,b){
                        return a.seatNumber-b.seatNumber
                    }
        
                    let y=res.data.seats
                   y.sort(compare)
                    setSeats(y);
                    console.log("g",seats)
                })
               
              } catch (error) {
                console.error(error);
                console.log("e",seats)
                
              }
        };
        fetchSeats();
    }, []);
        console.log(seats)
    return (
        <div className={styles.Home}>
            <h1>Booking</h1>
            <div style={{display:"flex",gap:"10px",marginTop:"20px"}}>
            <h4> Booked Seats No:-</h4>
            {
          book.map((el)=>(
            
           <p>{el}</p>
             
            ))}
           </div>

           <div></div>
            <input className={styles.Input}
                type="number"
                placeholder='Fill Seats'
                id="numSeats"
                value={numSeats}
                onChange={(e) => setNumSeats(e.target.value)} />
            <button className={styles.Button} onClick={handleClick}>Book Now</button>
            <div className={styles.Grids}>
                {seats.map((seat) => (

                    <div key={seat._id} className={styles.Griddiv} style={{ backgroundColor: seat.isBooked ? "red" : "yellow" }}>

                        <p>{seat.seatNumber}</p>
                    </div>

                ))}
            </div>
        </div>
    )
}

export default Home