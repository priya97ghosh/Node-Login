const express = require("express");
const login = require("../models/login");
var router = express.Router();
var jsonParser = express.json();
const mealModel = require("../models/meals");
const auth = require("../middleware/auth");

router.get("/addMeal", auth, (req, res) => {
  res.render("addmeal");
});
router.get("/getAllMeal", async (req, res) => {
  try {
    const findMeal = await mealModel.find();
    if (findMeal) {
      res.json(findMeal);
    } else {
      res.json({ message: "user doesn't exit" });
    }
  } catch (error) {
    res.json({ message: error });
  }
});
//get meal by date
router.post("/mealDate", auth, async (req, res) => {
  try {
    const getMealByDate = await mealModel.find({
      $and: [{ user: req.user.id }, { date: req.body.date }],
    });

    res.json({ message: getMealByDate });
  } catch (error) {
    res.json({ message: error });
    console.log(error);
  }
});
// CRUD- POST, GET, PUT, DELETE

//add meal
router.post("/addMeal", auth, async (req, res) => {
  console.log(req.body);
  const { date, mealType, mealName, description, calories } = req.body;
  let errors = [];
  if (!date || !mealType || !mealName || !description || !calories) {
    errors.push({ msg: "Please Fill All Fields!" });
  }
  console.log(errors.length);
  if (errors.length > 0) {
    res.json({ msg: errors });
  } else {
    const newMeal = new mealModel({
      user: req.user.id,
      date,
      mealType,
      mealName,
      description,
      calories,
    });
    const mealResult = await mealModel.create(newMeal);
    res.redirect("/dashboard");
  }
});

// find meal
router.get("/getMeal/:id", async (req, res) => {
  try {
    const findMeal = await mealModel.findById(req.params.id);
    if (findMeal) {
      res.json(findMeal);
    } else {
      res.json({ message: "user doesn't exit" });
    }
  } catch (error) {
    res.json({ message: error });
  }
});
//update meal
router.put("/editMeal/:id", async (req, res) => {
  try {
    let editMeal = await mealModel.findById({
      _id: req.params.id,
    });
    const { date, mealType, mealName, description, calories } = req.body;
    const newMeal = {
      date,
      mealType,
      mealName,
      description,
      calories,
    };
    console.log(newMeal);

    if (editMeal) {
      editMeal = await mealModel.findOneAndUpdate(
        req.params.id,
        { $set: newMeal },
        { new: true, upsert: true, setDefaultsOnInsert: true },
        (error, res) => {
          if (error) {
            console.log(error);
          } else {
          }
        }
      );
      res.json({ editMeal });
    }
  } catch (error) {
    console.log(error);
    res.json({ message: error });
  }
});
router.get("/find", async (req, res) => {
  try {
    const findAll = await mealModel.find();
    res.json(findAll);
  } catch (error) {
    res.json({ message: error });
  }
});
//delete meal
router.delete("/delete/:id", async (req, res) => {
  try {
    const removeMeal = await mealModel.findOneAndRemove({ _id: req.params.id });
    res.json(removeMeal);
  } catch (error) {
    res.json({ message: error });
    console.log(error);
  }
});

module.exports = router;
