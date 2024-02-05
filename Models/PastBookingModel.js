const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  sid: String,
  car_no: String,
  uid: String,
  start_date: String,
  drop_date: String,
  amount: String,
});
const PastBookingModel = mongoose.model("PastBookings", Schema);
module.exports = { PastBookingModel };
