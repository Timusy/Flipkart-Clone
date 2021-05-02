const User=require("../../models/user");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");

exports.signup=function(req,res){
  User.findOne({email: req.body.email}).exec(async function(error,user){
    if(user){
      return res.status(404).json({mesaage: "Admin already exists!"});
    }


    else{
      const {
        firstName,
        lastName,
        email,
        password
      } = req.body;
      const hash_password=await bcrypt.hash(password,10);
      const newUser=new User({
        firstName,
        lastName,
        email,
        hash_password,
        userName:req.body.userName,
        role: "admin"

      });

      newUser.save(function(err,data){
        if(err){
          return res.status(404).json({mesaage: "Something went wrong!"});
        }
        if(data){
           return res.status(201).json({message: "Admin created Successfully"});
            //return res.status(201).json({user:data});
        }
      });
    }
  });
}


exports.signin=function(req,res){
User.findOne({email:req.body.email}).exec(async function(error,user){
    if(error){
      return res.status(400).json({error});
      console.log("Error");
    }
    if(user){
        const isPassword= await user.authenticate(req.body.password);
        //console.log({isPassword});
      if(isPassword && user.role==="admin") {


        //  console.log("Hello");
        const token=jwt.sign({_id:user._id, role:user.role},process.env.JWT_SECRETKEY,{expiresIn:'100d'});
        const {_id,firstName,lastName,email,role,fullName}=user;
        res.cookie("token",token,{expiresIn:"100d"});
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

exports.signout=function(req,res){
   res.clearCookie("token");
   res.status(200).json({message:"Signout Successfull"});
}

exports.requireSignin=function(req,res,next){
  const token=req.headers.authorization.split(" ")[1];
  const user=jwt.verify(token,process.env.JWT_SECRETKEY);
  //console.log(token);
  req.user=user;
  next();
  //this allows the next call ie status to run in profile router
}
