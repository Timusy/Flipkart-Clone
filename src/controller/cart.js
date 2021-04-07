const Cart=require("../models/cart");
// const app=require("express");


exports.addItemToCart=function(req,res){
Cart.findOne({user:req.user._id}).exec(function(err,cart){
  if(err){
    return res.status(400).json({err});
  }
  if(cart){
    //if card already exists,update it then
    //  return res.status(200).json({message:cart});
    const product=req.body.cartItems.product;
    const item=cart.cartItems.find(function(c){
      return c.product==product;
    });
    var condition,update;
    if(item){
      condition={user:req.user._id,"cartItems.product":product};
      update={
        $set:{
          "cartItems.$":{
            ...req.body.cartItems,
            quantity:item.quantity+req.body.cartItems.quantity
          }
        }
      };
      // Cart.findOneAndUpdate({user:req.user._id,"cartItems.product":product},{
      //   $set:{
      //     "cartItems.$":{
      //       ...req.body.cartItems,
      //       quantity:item.quantity+req.body.cartItems.quantity
      //     }
      //   }
      // }).exec(function(err,_cart){
      //   if(err){
      //     return res.status(400).json({err});
      //   }
      //   if(_cart){
      //     return res.status(201).json({cart:_cart});
      //   }
      // });
    }
    else{
      condition={user:req.user._id};
      update={
        $push:{
          "cartItems":req.body.cartItems
        }
      };

    }
    Cart.findOneAndUpdate(condition,update).exec(function(err,_cart){
      if(err){
        return res.status(400).json({err});
      }
      if(_cart){
        return res.status(201).json({cart:_cart});
      }
    });

  }
  else{
    //if card doesn't exist create the card
    const cart = new Cart({
            user: req.user._id,
            cartItems:[req.body.cartItems]
          });
          cart.save((error, cart) => {
            if (error) return res.status(400).json({ error });
            if (cart) {
              return res.status(201).json({ cart });
            }
          });
  }
});


};
