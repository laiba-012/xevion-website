require("dotenv").config();

const mongoose=require("mongoose");

const User=require("../models/User");

mongoose.connect(process.env.MONGO_URI);

const createAdmin=async()=>{

const exist=await User.findOne({

email:"admin@gmail.com"

});

if(exist){

console.log("Admin Already Exists");

process.exit();

}

const admin=new User({

name:"Super Admin",

email:"admin@gmail.com",

password:"123456",

role:"admin"

});

await admin.save();

console.log("Admin Created");

process.exit();

};

createAdmin();