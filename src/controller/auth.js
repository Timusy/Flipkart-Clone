const User=require("../models/user");
const jwt=require("jsonwebtoken");

exports.signup=function(req,res){
  User.findOne({email: req.body.email}).exec(function(error,user){
    if(user){
      return res.status(404).json({mesaage: "User already exists!"});
    }
    else{
    //  const { firstName, lastName, email, password } = req.body;
      const newUser=new User({
        firstName:req.body.firstName,
        lastName:req.body.lastName,

        email:req.body.email,
        password:req.body.password,
        userName:req.body.userName

      });

      newUser.save(function(err,data){
        if(err){
          return res.status(404).json({mesaage: "Something went wrong!"});
        }
        if(data){
           return res.status(201).json({message: "User created Successfully"});
            //return res.status(201).json({user:data});
        }
      });
    }
  });
}


exports.signin=function(req,res){
User.findOne({email:req.body.email}).exec(function(error,user){
    if(error){
      return res.status(400).json({error});
      console.log("Error");
    }
    if(user){

      if(user.authenticate(req.body.password)) {


          console.log("Hello");
        const token=jwt.sign({_id:user._id},process.env.JWT_SECRETKEY,{expiresIn:'1h'});
        const {_id,firstName,lastName,email,role,fullName}=user;
        return res.status(200).json({
          token,
          user:{_id,firstName,lastName,email,role,fullName}
        });
      }


      else{
        return res.status(400).json({message:"Invalid Password"});
      }

    }
    else{
      return res.status(400).json({message:"Something went wrong"});
    }
});
}

exports.requireSignin=function(req,res,next){
  const token=req.headers.authorization.split(" ")[1];
  const user=jwt.verify(token,process.env.JWT_SECRETKEY);
  //console.log(token);
  req.user=user;
  next();
  //this allows the next call ie status to run in profile router
}
