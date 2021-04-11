const express = require("express");
const {validateSignupRequest,validateSigninRequest,isRequestValidated}= require("../../validators/auth")
const router=express.Router();
const {signup,signin,signout}=require("../../controller/admin/auth");
const {requireSignin}=require("../../common-middleware");

//router is used for handling requests ...similar to const app=express()
router.post("/admin/signup",validateSignupRequest,isRequestValidated,signup);

router.post("/admin/signin",validateSigninRequest,isRequestValidated,signin);

router.post("/admin/signout",requireSignin,signout);
//exporting the router for use
module.exports=router;
