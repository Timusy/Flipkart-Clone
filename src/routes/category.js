const express = require("express");
const router=express.Router();
 //removes spaces with -
 const multer  = require('multer'); //for receiving form data and uploading the data

 const shortid=require("shortid");
 const path=require("path");

 const storage = multer.diskStorage({
   destination: function (req, file, cb) {
     //__dirname gets back to parent directory i.e. routes in thus cse and then dirname gives that oarent dir i.e routes which is then joined with uploads in it
     cb(null, path.join(path.dirname(__dirname),'uploads'))
   },
   filename: function (req, file, cb) {
     cb(null, shortid.generate()+"-"+file.originalname)
   }
 })
 const upload=multer({storage});
const {addCategory,getCategories,updateCategories,deleteCategories}=require("../controller/category");
const {requireSignin,adminMiddleware}=require("../common-middleware");

router.post("/category/create",requireSignin,adminMiddleware,upload.single("categoryImage"),addCategory);
router.get("/category/getCategories",getCategories);
router.post("/category/update",upload.array("categoryImage"),updateCategories);
router.post("/category/delete",deleteCategories);




module.exports=router;
