const { Schema, model } = require("mongoose");

const seatSchema = Schema({
    seatNumber: Number,
    row: Number,
    isBooked: Boolean,
    });
const seatModel = model("seats",seatSchema)
module.exports = seatModel;