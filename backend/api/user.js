const express=require("express");
const User=require("../database/user");
const router=express.Router();

router.post("/register",async(req,res)=>{
try{
const {name,email,phone,password}=req.body;

if(!name||!email||!phone||!password){
return res.json({
success:false,
message:"All fields are required"
});
}

const existingUser=await User.findOne({email});

if(existingUser){
return res.json({
success:false,
message:"Email already registered"
});
}

const newUser=new User({
name,
email,
phone,
password
});

await newUser.save();

res.json({
success:true,
message:"Registration successful"
});
}
catch(error){
console.log(error);
res.status(500).json({
success:false,
message:"Registration failed"
});
}
});

router.post("/login",async(req,res)=>{
const {email,password}=req.body;

try{
const user=await User.findOne({email});

if(!user){
return res.json({
success:false,
message:"User not found"
});
}

if(user.password!==password){
return res.json({
success:false,
message:"Wrong password"
});
}

res.json({
success:true,
message:"Login successful",
user:user
});
}
catch(error){
console.log(error);
res.json({
success:false,
message:"Something went wrong"
});
}
});

module.exports=router;