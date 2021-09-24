const mongoose = require("mongoose");
const loginSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  calorieLimit: Number,
});
module.exports = mongoose.model("login", loginSchema);
