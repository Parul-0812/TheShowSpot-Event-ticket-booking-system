const express=require("express");
const router=express.Router();

const otpStore=new Map();

router.post("/send-otp",async(req,res)=>{
try{
const {paymentId}=req.body;

if(!paymentId){
return res.json({
success:false,
message:"Payment ID is required"
});
}

const otp=Math.floor(100000+Math.random()*900000).toString();

otpStore.set(paymentId,{
otp:otp,
expires:Date.now()+5*60*1000
});

console.log("Payment OTP generated:",otp);

res.json({
success:true,
message:"OTP generated successfully"
});
}
catch(error){
console.log(error);
res.status(500).json({
success:false,
message:"Unable to generate OTP"
});
}
});

router.post("/verify-otp",async(req,res)=>{
try{
const {paymentId,otp}=req.body;

const stored=otpStore.get(paymentId);

if(!stored){
return res.json({
success:false,
message:"OTP expired or not found"
});
}

if(Date.now()>stored.expires){
otpStore.delete(paymentId);

return res.json({
success:false,
message:"OTP expired. Please request a new OTP."
});
}

if(stored.otp!==otp){
return res.json({
success:false,
message:"Incorrect OTP"
});
}

otpStore.delete(paymentId);

res.json({
success:true,
message:"OTP verified successfully"
});
}
catch(error){
console.log(error);

res.status(500).json({
success:false,
message:"Unable to verify OTP"
});
}
});

module.exports=router;