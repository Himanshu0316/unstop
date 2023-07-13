import React, { useEffect, useState } from 'react'
import styles from './style/Navbar.module.css';
import axios from "axios";
const Home = () => {
    const [seats, setSeats] = useState([]);
    const [numSeats, setNumSeats] = useState("");
    const [book, setBook] = useState([])
    const [msg, setMsg] = useState("")
    const handleClick = async () => {
        const payload = {
            "numSeats":Number(numSeats)
        }
        console.log(payload)
        try {
            
            await axios.post("http://localhost:5000/seat/seatbook", payload).then((res) => {
                console.log("hii")
                console.log("res1",res.data.message);
                if (res.data.message) {
                    setBook(res.data.message)
                }
                console.log(res)
            });
            await axios.get("http://localhost:5000/seat")
            .then((res)=>{
               function compare(a,b){
                   return a.seatNumber-b.seatNumber
               }
               
               let y=res
               console.log("resy",y)
                // y.sort(compare)
               setSeats(y);
               setNumSeats('');
               setMsg("")
            }).catch((e)=>{
                console.log("error",e)
            });
             
           }catch(error){
             console.error(error.response.data.error);
             setMsg(error.response.data.error)
             console.log("reserr",error.response.data.error)
             alert(msg)
             setBook([])
           }
    };
    
    useEffect(() => {
        const fetchSeats = async () => {
        
            try {
                await axios.get("http://localhost:5000/seat")
                .then((res)=>{
                    console.log(res)
                    function compare(a,b){
                        return a.seatNumber-b.seatNumber
                    }
        
                    let y=res.data.seats
                   y.sort(compare)
                    setSeats(y);
                    console.log("g",y)
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
        <div className={styles.Box}>
        <div className={styles.Home}>
            <h1>Booking</h1>
            <input className={styles.Input}
                type="number"
                placeholder='Fill Seats'
                id="numSeats"
                value={numSeats}
                onChange={(e) => setNumSeats(e.target.value)} />
            <button className={styles.Button} onClick={handleClick}>Book Now</button>
            
        </div>
        <div className={styles.Home}>
        <div style={{display:"flex",gap:"10px",alignItems:"center"}}>
            <h4> Booked Seats No:-</h4>
            <p>f</p>
            <p>g</p>
            {
          book.map((el)=>(
            
           <p>{el}</p>
             
            ))}
           </div>
           <div className={styles.Grids}>
                {seats.map((seat) => (

                    <div key={seat._id} className={styles.Griddiv} style={{ backgroundColor: seat.isBooked ? "red" : "yellow" }}>

                        <p>{seat.seatNumber}</p>
                    </div>

                ))}
            </div>
        </div>
        </div>
    )
}

export default Home