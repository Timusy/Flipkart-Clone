const express = require("express");
const router=express.Router();
const {signup,signin,requireSignin}=require("../controller/auth");


//router is used for handling requests ...similar to const app=express()
router.post("/signup",signup);

router.post("/signin",signin);

router.post("/profile",requireSignin,function(req,res){
  res.status(200).json({user:"profile"});
});
//exporting the router for use
module.exports=router;
