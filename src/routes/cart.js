const express = require("express");
const router=express.Router();
 //removes spaces with -
const {addItemToCart,
  addToCart,
  getCartItems,
  removeCartItems}=require("../controller/cart");
const {requireSignin,userMiddleware}=require("../common-middleware");
router.post("/user/cart/addtocart",requireSignin,userMiddleware,addItemToCart);
router.post("/user/getCartItems", requireSignin, userMiddleware, getCartItems);
router.post(
  "/user/cart/removeItem",
  requireSignin,
  userMiddleware,
  removeCartItems
);



module.exports=router;
