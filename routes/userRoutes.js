const express = require("express");
var router = express.Router();

const jwt = require("jsonwebtoken");
jwtKey = "jwt";
const loginModel = require("../models/login");
const bcrypt = require("bcryptjs");
//backend field validation for login/register api
const { check, validationResult, cookie } = require("express-validator");

//middleware to protect routes
const auth = require("../middleware/auth");

router.get("/", (req, res) => {
  res.send("hello node");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/logout", auth, (req, res) => {
  res.clearCookie("token", { path: "/", domain: "localhost" });
  return res.redirect("/user/login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post(
  "/register",
  [
    check("name", "Please Enter name !").not().isEmpty(),
    check("email", "Please Enter valid E-Mail !").isEmail(),
    check(
      "password",
      "Please Enter a password with 6 or more characters !"
    ).isLength({
      min: 6,
    }),
    check("calorieLimit", "Please enter valid data").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password, calorieLimit } = req.body;
    try {
      let user = await loginModel.findOne({ email });
      if (user) {
        // res.redirect("/user/login");
        res.status(400);
        throw new Error("user already exist");
      } else {
        user = new loginModel({
          name: name,
          email: email,
          password: password,
          calorieLimit: calorieLimit,
        });
        console.log(user);
        //encrypt Password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        //Return json Web Token
        const payload = {
          user: {
            id: user.id,
          },
        };
        jwt.sign(
          payload,
          "mySecret",
          {
            expiresIn: 36000,
          },
          (err, token) => {
            if (err) throw err;
            //set cookie
            res.cookie("token", token, {
              expires: new Date(Date.now() + 999999999),
              secure: false, // set to true if your using https
              httpOnly: true,
            });
            res.json({ token }); //giving a response back
          }
        );
        res.redirect("/dashboard");
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Server Error!");
    }
  }
);

router.post(
  "/login",
  [
    check("email", "Please include valid E-Mai!").isEmail(),
    check("password", "Password is required!").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await loginModel.findOne({ email });
      if (!user) {
        //if user is not exist
        res.status(400).json({ errors: [{ msg: "Invalid Credential" }] });
      } else {
        //Match user password and encrypted password.
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          res.status(400).json({
            errors: [{ msg: "Invalid Credentials" }],
          });
        }
        //Return json Web Token
        const payload = {
          user: {
            id: user.id,
          },
        };
        jwt.sign(
          payload,
          "mySecret",
          {
            expiresIn: 36000,
          },
          (err, token) => {
            if (err) throw err;
            // res.json({ token });
            //set cookie
            res.cookie("token", token, {
              expires: new Date(Date.now() + 999999999),
              secure: false, // set to true if your using https
              httpOnly: true,
            });

            res.redirect("/dashboard");
          }
        );
      }
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server Error!");
    }
  }
);

//edit user profile PENDING
router.get("/editProfile", auth, async (req, res) => {
  console.log(`user Profile it is ${req.user}`);

  let user = await loginModel.findOne({ _id: req.user.id }).select("-password");
  res.json({ user });
  if (!user) {
    res.status(400).json({ errors: [{ msg: "Invalid Credential" }] });
  }
});

//delete user profile
router.delete("/deleteProfile/:id", auth, async (req, res) => {
  try {
    const user = await loginModel.findOneAndRemove({ _id: req.params.id });
    res.json(user);
  } catch (error) {
    res.json({ message: error });
    console.log(error);
  }
});
//get all API
router.get("/users", function (req, res) {
  loginModel.find().then((result) => {
    res.status(200).json(result);
  });
});
module.exports = router;
