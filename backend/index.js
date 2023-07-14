const express=require("express")
const mongoose = require("mongoose");
require("dotenv").config()
const cors=require("cors")
const  seatRouter  = require("./Router/seat.router")
const PORT = process.env.PORT || 5000;
const mongodb_url = process.env.MONGODB_URL || "mongodb://localhost:27017/booking";
const app = express()

const corsOptions ={
    credentials:true,
}
app.use(cors(corsOptions));
app.use(express.json())

app.use("/seat",seatRouter)
app.get("/",(req,res)=>{
    res.send("Home Page")
})
mongoose.connect(mongodb_url).then(() => {
    app.listen(PORT, () => {
      console.log("server is started on port " + PORT);
    });
  });
