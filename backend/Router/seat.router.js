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
    const numSeats = req.body.numSeats;

    if (numSeats > 7) {
      return res.status(400).json({ error: 'Maximum 7 seats can be booked at a time' });
    }

    if (numSeats <= 0) {
      return res.status(400).json({ error: 'Number of seats must be greater than 0' });
    }



    // Find available seats in one row
    const availableSeatsInOneRow = await seatModel.aggregate([
      { $match: { isBooked: false } },
      { $group: { _id: "$row", count: { $sum: 1 } } },
      { $match: { count: { $gte: numSeats } } },
      { $sort: { _id: 1 } },
      { $lookup: { from: "seats", localField: "_id", foreignField: "row", as: "seats" } },
      { $unwind: "$seats" },
      { $match: { "seats.isBooked": false } },
      { $sort: { "seats.seatNumber": 1 } },
      { $limit: numSeats }
    ]);

    if (availableSeatsInOneRow.length >= numSeats) {
      // Reserve seats in one row
      let temp=[]
      const seatIds = availableSeatsInOneRow.map(seat => seat.seats._id);
      await seatModel.updateMany({ _id: { $in: seatIds } }, { $set: { isBooked: true } });
      availableSeatsInOneRow.map((seat)=>{
        temp.push(seat.seats.seatNumber)
      });
      // return res.json({ message: 'Seats reserved successfully' });
      return res.json({ message: temp});
    }

    // Reserve seats in nearby rows
    const lastReservedRow = await seatModel.findOne({ isBooked: true }).sort({ row: -1 });
    const nextRow = lastReservedRow ? lastReservedRow.row + 1 : 1;

    const availableSeatsNearby = await seatModel.aggregate([
      { $match: { isBooked: false, row: nextRow } },
      { $sort: { seatNumber: 1 } },
      { $limit: numSeats }
    ]);

    if (availableSeatsNearby.length >= numSeats) {
      // Reserve seats in nearby rows
      let temp=[]
      const seatIds = availableSeatsNearby.map(seat => seat._id);
      await seatModel.updateMany({ _id: { $in: seatIds } }, { $set: { isBooked: true } });
      awail
      availableSeatsInOneRow.map((seat)=>{
        temp.push(seat.seats.seatNumber)
      });
      // return res.json({ message: 'Seats reserved successfully' });
      return res.json({ message: temp});
    }

    if (availableSeatsInOneRow.length >= numSeats) {
      // Reserve seats in one row
      let temp=[]
      const seatIds = availableSeatsInOneRow.map(seat => seat.seats._id);
      await seatModel.updateMany({ _id: { $in: seatIds } }, { $set: { isBooked: true } });
      availableSeatsInOneRow.map((seat)=>{
        temp.push(seat.seats.seatNumber)
      });
      // return res.json({ message: 'Seats reserved successfully' });
      return res.json({ message: temp});
      // return res.json({ message: 'Seats reserved successfully' });
    } 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

module.exports = seatRouter;