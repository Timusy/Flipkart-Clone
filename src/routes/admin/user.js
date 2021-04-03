const express = require("express");
const router=express.Router();
const {signup,signin,requireSignin}=require("../../controller/admin/auth");


//router is used for handling requests ...similar to const app=express()
router.post("/admin/signup",signup);

router.post("/admin/signin",signin);


//exporting the router for use
module.exports=router;
