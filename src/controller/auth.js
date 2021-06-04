const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const shortid = require("shortid");
const env = require("dotenv");

env.config();

const generateJwtToken = (_id, role) => {
  return jwt.sign({ _id, role }, process.env.JWT_SECRET, {
    expiresIn: "100d",
  });
};

exports.signup = function (req, res) {

  User.findOne({ email: req.body.email }).exec(async function (error, user) {
    if (user) {
      return res.status(404).json({ mesaage: "User already exists!" });
    }
    else {
      const { firstName, lastName, email, password } = req.body;
      const hash_password = await bcrypt.hash(password, 10);

      const newUser = new User({
        firstName,
        lastName,

        email,
        hash_password,
        userName: shortid.generate()

      });

      newUser.save(function (err, data) {
        if (err) {
          return res.status(404).json({ mesaage: "Something went wrong!" });
        }
        if (data) {
          // const token = generateJwtToken(data._id, data.role);
          const { _id, firstName, lastName, email, role, fullName } = data;
          return res.status(201).json({

            user: { _id, firstName, lastName, email, role, fullName },
            message: "User created Successfully"
          });
        }
      });
    }
  });
}


exports.signin = function (req, res) {
  User.findOne({ email: req.body.email }).exec(async function (error, user) {
    if (error) {
      return res.status(400).json({ error });
      console.log("Error");
    }
    if (user) {
      const isPassword = await user.authenticate(req.body.password);
      if (isPassword && user.role === "user") {


        // console.log("Hello");
        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRETKEY, { expiresIn: '100d' });
        const { _id, firstName, lastName, email, role, fullName } = user;
        return res.status(200).json({
          token,
          user: { _id, firstName, lastName, email, role, fullName }
        });
      }


      else {
        return res.status(400).json({ message: "Invalid Password" });
      }

    }
    else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  });
}

exports.requireSignin = function (req, res, next) {
  
  const token = req.headers.authorization.split(" ")[1];
  try{
  const user = jwt.verify(token, process.env.JWT_SECRETKEY);
  //console.log(token);
  req.user = user;
  next();
  }
  catch(err){  

  
    return res.status(404).json({
      error:err,
      message:"User not found"
    });
  };

  //this allows the next call ie status to run in profile router
}

exports.profile = async function (req, res) {

  const user = await User.findById(req.user._id);

  if (user) {
    return res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullname: user.fullName,
      email: user.email,
      userName: user.userName

    });
  }
  else {
    return res.status(404), json(
      { mesaage: "User not found" }
    );

  }

}
