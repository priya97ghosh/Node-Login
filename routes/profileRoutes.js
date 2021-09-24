const express = require("express");
var router = express.Router();
var jsonParser = express.json();
// const mealModel = require("../models/meals");

router.get("/userProfile", (req, res) => {
  res.render("profile");
});

module.exports = router;
