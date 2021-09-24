var mongoose = require("mongoose");
const MealsSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "login",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  mealType: {
    type: String,
    require: true,
  },
  mealName: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  calories: {
    type: Number,
    require: true,
    default: 0,
  },
});
module.exports = mongoose.model("Meal", MealsSchema);
