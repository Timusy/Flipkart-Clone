const express = require("express");
const {validateSignupRequest,validateSigninRequest,isRequestValidated}= require("../validators/auth")
const router=express.Router();

const {signup,signin,requireSignin, profile}=require("../controller/auth");


//router is used for handling requests ...similar to const app=express()
router.post("/signup",validateSignupRequest,isRequestValidated,signup);

router.post("/signin",validateSigninRequest,isRequestValidated,signin);

router.post("/profile",requireSignin,profile);

//exporting the router for use
module.exports=router;
