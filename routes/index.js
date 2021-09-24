const express = require("express");
var router = express.Router();
const auth = require("../middleware/auth");
const mealModel = require("../models/meals");
const mongoose = require("mongoose");
const loginModel = require("../models/login");

router.get("/", (req, res) => {
  res.render("landing");
});

// router.get("/dashboard", auth, (req, res) => {
//   res.render("dashboard");
// });

router.get("/dashboard", auth, async (req, res) => {
  const date = new Date();
  let finalDate = date.toISOString().slice(0, 10);
  console.log(finalDate);

  let user = await loginModel.findOne({ _id: req.user.id });
  console.log(user);

  const userCalorieLimit = user.calorieLimit;

  let userId = mongoose.Types.ObjectId(req.user.id);

  const aggregate = await mealModel.aggregate([
    {
      $match: {
        $and: [{ user: userId }, { date: new Date(finalDate) }],
      },
    },
    { $group: { _id: "$user", total: { $sum: "$calories" } } },
  ]);

  const calories =
    aggregate && aggregate[0] && aggregate[0].total ? aggregate[0].total : 0;

  const percentage = Math.round((calories / userCalorieLimit) * 100);
  console.log(`${percentage}%`);

  console.log(calories);
  console.log(aggregate);
  res.render("dashboard", {
    percentage: `${percentage.toString()}%`,
  });
});

module.exports = router;
