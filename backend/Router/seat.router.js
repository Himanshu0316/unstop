const express=require("express")
const seatModel = require("../Model/seat.model")
const seatRouter = express.Router()

seatRouter.get('/', async (req, res) => {
    try {
      const seats = await seatModel.find();
      res.send({seats});
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

seatRouter.post("/seatbook",async(req,res)=>{

  try {
    const requiredSeats = req.body.numSeats;
     
    if (requiredSeats > 7) {
      return res.status(400).json({ error: 'Maximum 7 seats can be booked at a time' });
    }

    if (requiredSeats <= 0) {
      return res.status(400).json({ error: 'Number of seats must be greater than 0' });
    }
    
    const seats = await seatModel.find();
          console.log(seats);
    let reserved = [];

    // Code below check that number of seats require to book are available in a single row or not, if available then it will store the seat number in the reserved array and update the status of the seat.
     console.log(seats[0].seatNumber)
    let i = 0;
    while (i<seats.length && i<=71){
        let empty = 0;
        for (let j=i;j<i+7;j++){                //  Counting the number of seats available in a single row. 
            if (seats[j].isBooked===false){
                empty++;
            }
        }

        if (empty>=requiredSeats){
            empty = requiredSeats;
            for (let j=i;j<i+7;j++){            // Booking the required number of seats in a single row. 
                if (seats[j].isBooked===false && empty>0){
                    reserved.push(seats[j].seatNumber);
                    await seatModel.findByIdAndUpdate({_id : seats[j]._id}, {isBooked : true});
                    empty--;
                }
            }

            break;
        } else {
            i+=7;
        }
    };

    if (reserved.length>0){
        res.status(200).send(reserved);     // Response to the request with seat numbers which has been booked.
    } else {
        // Code below check that number of seats require to book are available with the least distance between them or not, if available then it will store the seat number in the reserved array and update the status of the seat.

        const isEmpty = await seatModel.find({"isBooked" : false}).sort({"seatNumber" : 1});

        if (isEmpty.length<requiredSeats){              // Checking if the require seats are available
            res.status(400).send({ "message" : "Sorry, we don't have enough seats to book." }) ;    // Error response due to unavailability of the require seats.
        } else if (isEmpty.length===requiredSeats){    
            for (let j=0;j<isEmpty.length;j++){
                reserved.push(isEmpty[j].seatNumber);
                await seatModel.findByIdAndUpdate({_id : isEmpty[j]._id}, {isBooked : true});
            };

            res.status(200).send(reserved);         // Response to the request with seat numbers which has been booked.
        }

        let difference = [];
        let a = 0;
        while (a<=isEmpty.length-requiredSeats){            // Finding the difference between first and last seat of the require seats and storing them in difference array.
            let first = isEmpty[a].seatNumber;
            let last = isEmpty[a+requiredSeats-1].seatNumber;

            difference.push(last-first);
            a+=requiredSeats;
        };

        let least = Math.min(...difference);            // Finding the least difference from the difference array.
        let index = difference.indexOf(least) || 1;     // Finding the index value of the least difference.

        for (let j=requiredSeats*index;j<requiredSeats*index+requiredSeats;j++){        // Booking the seats with the least difference between them by updating the 'isBooked' status.
            console.log(isEmpty[j].seatNumber);
            reserved.push(isEmpty[j].seatNumber);
            await seatModel.findByIdAndUpdate({_id : isEmpty[j]._id}, {isBooked : true});
        }

        res.status(200).send(reserved);     // Response to the request with seat numbers which has been booked.
    }
 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
})
//return res.json({ message: temp});
module.exports = seatRouter;