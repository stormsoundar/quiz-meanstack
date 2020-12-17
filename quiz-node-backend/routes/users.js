var express = require("express");
var router = express.Router();

var app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// include user model
const users = require("../model/model");
const submit = require("../model/submit");
const checkAuth = require("../middleware/check-auth");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

/* Sign Up */
router.post("/sign-up", function (req, res) {
  // validate request
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(400).send({
      success: false,
      message: "Please fill all fields!",
    });
  }
  bcrypt.hash(req.body.password, 10).then((hash) => {
    // create a user
    let user = new users({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    });
    // save user in the database.
    user
      .save()
      .then((data) => {
        res.json({
          success: true,
          message: "User successfully created",
          data: data,
        });
      })
      .catch((err) => {
        res.status(500).json({
          success: false,
          message:
            err.message || "Some error occurred while creating the user.",
        });
      });
  });
});

/* Sign In */
router.post("/sign-in", (req, res, next) => {
  let fetchedUser;
  users
    .findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Incorrect Username",
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Incorrect Username or Password",
        });
      }
      const token = jwt.sign(
        { username: fetchedUser.username, userId: fetchedUser._id },
        "secret_this_should_be_longer",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        message: "Login Successfully",
        response: {
          id: fetchedUser._id,
          name: fetchedUser.name,
          email: fetchedUser.email,
        },
      });
    })
    .catch((err) => {
      return res.status(401).json({
        message: "Incorrect Email or Password",
      });
    });
});

router.post("/quiz", checkAuth, function (req, res, next) {
  let submits = new submit({
    _id: req.body._id,
    userName: req.body.userName,
    userEmail: req.body.userEmail,
    totalQuestions: req.body.totalQuestions,
    answered: req.body.answered,
    rightAnswers: req.body.rightAnswers,
    wrongAnswers: req.body.wrongAnswers,
    choosedAnswers: req.body.choosedAnswers,
    testSubmitted: req.body.testSubmitted
  });
  submits
    .save()
    .then(function (data) {
      res.json({
        data: data,
        success: true,
        message: "Test Submitted Successfully",
      });
      // console.log(data);
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message:
          err.message || "Some error occurred while creating the Register.",
      });
    });
});

// Get One
router.get("/score/:id", checkAuth, function (req, res) {
  submit
    .findById(req.params.id)
    .then((data) => {
      if (data) {
        res.json({
          success: true,
          data: data,
        });
      }
      else {
       res.json({
        data: {},
        success: false,
        message: "Data Not Found!"
       })
      }
    })
    /* .catch((error) => {
      res.status(404).json({
        data: {},
        success: false,
        message: error.message || "Data Not Found!",
      });
    }); */
});

module.exports = router;
