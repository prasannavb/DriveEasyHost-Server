const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  Fuel: Array,
  Model: Array,
  Make: Array,
  Type: Array,
});

const CarMetaData = mongoose.model("carMetadata", Schema);

module.exports = { CarMetaData };
