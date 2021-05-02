const mongoose=require("mongoose");
const bcrypt = require('bcrypt');

const saltRounds = 10;

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

//trim=true removes spaces leading and trailing
const userSchema=new mongoose.Schema({
  firstName :{
    type:String,
    required:[true,"First name not Specifeid"],
    trim: true
  },

  lastName : {
    type:String,

    trim: true
  },

  userName :{
    type:String,
  //  required:[true,"User name is required"],
    trim: true,
    unique: true,
    index: true
  },

  email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required:[true,'Email address is required'],
        validate:[validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },

  hash_password:{
    type: String,
    required:[true,"Password is required"],

  },

  role:{
    type: String,
    enum: ["user","admin"],
    default: "user"
  },

  contactNumber:{
    type: String,
    min:10,
    max:10
  } ,

  profilePicture:{
    type:String
  }

},{timestamps: true});

//creating virtual fields
// userSchema.virtual('password').set(function(password){
//   this.hash_password=bcrypt.hashSync(password,10);
// });

userSchema.virtual('fullName').get(function(){
  return `${this.firstName} ${this.lastName}`;
});

userSchema.methods = {
  authenticate:async function(password) {
    return await bcrypt.compare(password,this.hash_password);

  }
};

module.exports=mongoose.model("User",userSchema);
