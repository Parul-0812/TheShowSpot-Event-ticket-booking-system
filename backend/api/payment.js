const express=require("express");
const crypto=require("crypto");
const axios=require("axios");
const router=express.Router();
const Booking=require("../database/booking");

const CASHFREE_APP_ID=process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY=process.env.CASHFREE_SECRET_KEY;
const CASHFREE_API_URL="https://sandbox.cashfree.com/pg";
const CASHFREE_API_VERSION="2025-01-01";

const cashfreeHeaders={
"x-client-id":CASHFREE_APP_ID,
"x-client-secret":CASHFREE_SECRET_KEY,
"x-api-version":CASHFREE_API_VERSION,
"Content-Type":"application/json",
"Accept":"application/json"
};

const otpStore=new Map();

function getPaymentMethod(payment){
if(!payment||!payment.payment_method)return"Cashfree";
if(payment.payment_method.upi)return"UPI";
if(payment.payment_method.card)return"Card";
if(payment.payment_method.netbanking)return"Net Banking";
if(payment.payment_method.wallet)return"Wallet";
if(payment.payment_method.app)return"App";
return payment.payment_group||"Cashfree";
}

async function finalizePaidOrder(orderId,paymentData=null){
const booking=await Booking.findOne({transactionId:orderId});

if(!booking){
return{success:false,message:"Booking not found for this payment order"};
}

if(booking.paymentStatus==="Successful"){
return{success:true,alreadyProcessed:true,ticketId:booking._id,paymentMethod:booking.paymentMethod};
}

if(paymentData){
if(paymentData.payment_status!=="SUCCESS"){
return{success:false,message:"Payment is not successful"};
}

if(Number(paymentData.payment_amount)!==Number(booking.amount)){
return{success:false,message:"Payment amount mismatch"};
}

booking.paymentMethod=getPaymentMethod(paymentData);
booking.cfPaymentId=String(paymentData.cf_payment_id||"");
}else{
const paymentsResponse=await axios.get(
`${CASHFREE_API_URL}/orders/${orderId}/payments`,
{headers:cashfreeHeaders}
);

const successfulPayment=paymentsResponse.data.find(
payment=>payment.payment_status==="SUCCESS"
);

if(!successfulPayment){
return{success:false,message:"Successful payment transaction not found"};
}

if(Number(successfulPayment.payment_amount)!==Number(booking.amount)){
return{success:false,message:"Payment amount mismatch"};
}

booking.paymentMethod=getPaymentMethod(successfulPayment);
booking.cfPaymentId=String(successfulPayment.cf_payment_id||"");
}

booking.paymentStatus="Successful";
booking.ticketStatus="Valid";
await booking.save();

return{
success:true,
alreadyProcessed:false,
ticketId:booking._id,
paymentMethod:booking.paymentMethod
};
}

router.post("/send-otp",async(req,res)=>{
try{
const{paymentId}=req.body;
if(!paymentId){
return res.json({success:false,message:"Payment ID is required"});
}
const otp=Math.floor(100000+Math.random()*900000).toString();
otpStore.set(paymentId,{
otp,
expires:Date.now()+5*60*1000
});
console.log("Payment OTP generated:",otp);
res.json({success:true,message:"OTP generated successfully"});
}catch(error){
console.log(error);
res.status(500).json({success:false,message:"Unable to generate OTP"});
}
});

router.post("/verify-otp",async(req,res)=>{
try{
const{paymentId,otp}=req.body;
const stored=otpStore.get(paymentId);

if(!stored){
return res.json({success:false,message:"OTP expired or not found"});
}

if(Date.now()>stored.expires){
otpStore.delete(paymentId);
return res.json({success:false,message:"OTP expired. Please request a new OTP."});
}

if(stored.otp!==otp){
return res.json({success:false,message:"Incorrect OTP"});
}

otpStore.delete(paymentId);
res.json({success:true,message:"OTP verified successfully"});
}catch(error){
console.log(error);
res.status(500).json({success:false,message:"Unable to verify OTP"});
}
});

router.post("/create-cashfree-order",async(req,res)=>{
try{
const{
orderId,
amount,
customerId,
customerName,
customerEmail,
customerPhone,
eventName,
eventDate,
eventLocation,
seats
}=req.body;

if(!orderId||!amount||!customerId||!customerName||!customerEmail||!customerPhone){
return res.status(400).json({
success:false,
message:"Missing payment details"
});
}

const numericAmount=Number(amount);

if(!Number.isFinite(numericAmount)||numericAmount<=0){
return res.status(400).json({
success:false,
message:"Invalid payment amount"
});
}

if(!Array.isArray(seats)||seats.length===0){
return res.status(400).json({
success:false,
message:"No seats selected"
});
}

const existingOrder=await Booking.findOne({transactionId:orderId});

if(existingOrder){
if(existingOrder.paymentStatus==="Successful"){
return res.status(409).json({
success:false,
message:"This payment has already been completed"
});
}

return res.json({
success:true,
orderId,
paymentSessionId:existingOrder.paymentSessionId,
paymentStatus:existingOrder.paymentStatus
});
}

const existingSeats=await Booking.find({
eventName,
seats:{$in:seats},
paymentStatus:"Successful"
});

if(existingSeats.length>0){
const bookedSeats=[...new Set(existingSeats.flatMap(booking=>booking.seats||[]))];
const unavailableSeats=seats.filter(seat=>bookedSeats.includes(seat));

if(unavailableSeats.length>0){
return res.status(409).json({
success:false,
message:`These seats are already booked: ${unavailableSeats.join(", ")}`
});
}
}

const booking=new Booking({
userId:customerId,
eventName,
eventDate,
eventLocation,
seats,
amount:numericAmount,
paymentMethod:"Cashfree",
paymentStatus:"Pending",
transactionId:orderId,
ticketStatus:"Valid"
});

await booking.save();

try{
const response=await axios.post(
`${CASHFREE_API_URL}/orders`,
{
order_id:orderId,
order_amount:numericAmount,
order_currency:"INR",
customer_details:{
customer_id:String(customerId),
customer_name:customerName,
customer_email:customerEmail,
customer_phone:String(customerPhone)
},
order_meta:{
return_url:`http://localhost:5173/payment?order_id=${orderId}`,
notify_url:process.env.CASHFREE_WEBHOOK_URL||undefined
}
},
{headers:cashfreeHeaders}
);

booking.paymentSessionId=response.data.payment_session_id;
await booking.save();

res.json({
success:true,
orderId:response.data.order_id,
paymentSessionId:response.data.payment_session_id
});
}catch(error){
await Booking.deleteOne({_id:booking._id});
throw error;
}
}catch(error){
console.log("Cashfree Create Order Error:");
if(error.response){
console.log(error.response.data);
}else{
console.log(error.message);
}

res.status(500).json({
success:false,
message:"Unable to create Cashfree payment order",
error:error.response?.data||error.message
});
}
});

router.get("/cashfree-status/:orderId",async(req,res)=>{
try{
const{orderId}=req.params;

const response=await axios.get(
`${CASHFREE_API_URL}/orders/${orderId}`,
{headers:cashfreeHeaders}
);

const orderStatus=response.data.order_status;

if(orderStatus==="PAID"){
const finalized=await finalizePaidOrder(orderId);

return res.json({
success:true,
orderStatus,
orderId,
amount:response.data.order_amount,
paymentStatus:"Successful",
ticketId:finalized.ticketId,
paymentMethod:finalized.paymentMethod
});
}

res.json({
success:true,
orderStatus,
orderId,
amount:response.data.order_amount,
paymentStatus:"Pending"
});
}catch(error){
console.log("Cashfree Status Error:");
if(error.response){
console.log(error.response.data);
}else{
console.log(error.message);
}

res.status(500).json({
success:false,
message:"Unable to check Cashfree payment status",
error:error.response?.data||error.message
});
}
});

router.post("/webhook",express.raw({type:"application/json"}),async(req,res)=>{
try{
const signature=req.headers["x-webhook-signature"];
const timestamp=req.headers["x-webhook-timestamp"];

if(!signature||!timestamp){
return res.status(400).send("Missing webhook signature");
}

const rawBody=req.body.toString("utf8");
const expectedSignature=crypto
.createHmac("sha256",CASHFREE_SECRET_KEY)
.update(timestamp+rawBody)
.digest("base64");

if(!crypto.timingSafeEqual(
Buffer.from(expectedSignature),
Buffer.from(signature)
)){
return res.status(400).send("Invalid webhook signature");
}

const payload=JSON.parse(rawBody);
const eventType=payload.type||payload.event_type;
const orderId=payload.data?.order?.order_id;
const payment=payload.data?.payment;

console.log("Cashfree Webhook:",eventType,orderId);

if(!orderId){
return res.status(200).send("Webhook received");
}

if(payment?.payment_status==="SUCCESS"){
const result=await finalizePaidOrder(orderId,payment);
console.log("Payment finalized:",result);
}

return res.status(200).send("Webhook received");
}catch(error){
console.log("Cashfree Webhook Error:",error);
return res.status(500).send("Webhook processing failed");
}
});

module.exports=router;