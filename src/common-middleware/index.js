const jwt = require("jsonwebtoken");
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

exports.upload=multer({storage});

exports.requireSignin = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, process.env.JWT_SECRETKEY);
    req.user = user;
  } else {
    return res.status(400).json({ message: "Authorization required" });
  }
  next();
  //jwt.decode()
};

exports.userMiddleware=function(req,res,next){
  if(req.user.role!="user"){
      return res.status(400).json({message:"User Access Denied"});
  }
  next();
}

exports.adminMiddleware=function(req,res,next){
  if(req.user.role!="admin"){
      return res.status(400).json({message:"Admin Access Denied"});
  }
  next();

}
