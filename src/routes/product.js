const express = require("express");
const router=express.Router();
 //removes spaces with -
const {createProduct,getProductBySlug, getProductDetailsById, deleteProductById,
  getProducts,}=require("../controller/product");
const {requireSignin,adminMiddleware}=require("../common-middleware");
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

//upload.single me we are uploading a single file of productPicture
router.post("/product/create",requireSignin,adminMiddleware,upload.array("productPicture"),createProduct);
router.get("/products/:slug",getProductBySlug);
router.get("/product/:productId", getProductDetailsById);
router.delete(
  "/product/deleteProductById",
  requireSignin,
  adminMiddleware,
  deleteProductById
);
router.post(
  "/product/getProducts",
  requireSignin,
  adminMiddleware,
  getProducts
);

//router.get("/category/getCategories",getCategories);


module.exports=router;
