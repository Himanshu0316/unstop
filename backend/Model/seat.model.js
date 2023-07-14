const { Schema, model } = require("mongoose");

const seatSchema = Schema({
    seatNumber: Number,
    row: Number,
    isBooked: Boolean,
    },{
        versionKey:false
    });
const seatModel = model("seats",seatSchema)
module.exports = seatModel;