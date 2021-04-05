const express = require("express");
const {validateSignupRequest,validateSigninRequest,isRequestValidated}= require("../../validators/auth")
const router=express.Router();
const {signup,signin,requireSignin}=require("../../controller/admin/auth");


//router is used for handling requests ...similar to const app=express()
router.post("/admin/signup",validateSignupRequest,isRequestValidated,signup);

router.post("/admin/signin",validateSigninRequest,isRequestValidated,signin);


//exporting the router for use
module.exports=router;
