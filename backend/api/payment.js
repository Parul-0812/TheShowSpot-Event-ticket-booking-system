const express=require("express");
const crypto=require("crypto");
const Razorpay=require("razorpay");
const router=express.Router();
const Booking=require("../database/booking");

const razorpay=new Razorpay({
key_id:process.env.RAZORPAY_KEY_ID,
key_secret:process.env.RAZORPAY_KEY_SECRET
});

function getPaymentMethod(payment){
if(!payment)return"Razorpay";
if(payment.method==="upi")return"UPI";
if(payment.method==="card")return"Card";
if(payment.method==="netbanking")return"Net Banking";
if(payment.method==="wallet")return"Wallet";
if(payment.method==="emi")return"EMI";
if(payment.method==="bank_transfer")return"Bank Transfer";
return payment.method||"Razorpay";
}

router.post("/create-razorpay-order",async(req,res)=>{
try{
const{
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

if(!amount||!customerId||!customerName||!customerEmail||!customerPhone){
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

const internalReceipt=`TSS_${Date.now()}_${Math.floor(Math.random()*10000)}`;

const razorpayOrder=await razorpay.orders.create({
amount:Math.round(numericAmount*100),
currency:"INR",
receipt:internalReceipt,
notes:{
customer_id:String(customerId),
event_name:String(eventName),
seats:seats.join(",")
}
});

const booking=new Booking({
userId:customerId,
eventName,
eventDate,
eventLocation,
seats,
amount:numericAmount,
paymentMethod:"Razorpay",
paymentStatus:"Pending",
transactionId:razorpayOrder.id,
ticketStatus:"Valid"
});

await booking.save();

res.json({
success:true,
razorpayOrderId:razorpayOrder.id,
amount:razorpayOrder.amount,
currency:razorpayOrder.currency,
keyId:process.env.RAZORPAY_KEY_ID,
bookingId:booking._id
});
}catch(error){
console.log("Razorpay Create Order Error:",error);

res.status(500).json({
success:false,
message:"Unable to create Razorpay payment order"
});
}
});

router.post("/verify-razorpay-payment",async(req,res)=>{
try{
const{
razorpay_payment_id,
razorpay_order_id,
razorpay_signature
}=req.body;

if(!razorpay_payment_id||!razorpay_order_id||!razorpay_signature){
return res.status(400).json({
success:false,
message:"Incomplete payment verification details"
});
}

const booking=await Booking.findOne({
transactionId:razorpay_order_id
});

if(!booking){
return res.status(404).json({
success:false,
message:"Booking not found for this payment"
});
}

if(booking.paymentStatus==="Successful"){
return res.json({
success:true,
message:"Payment already verified",
ticketId:booking._id,
paymentMethod:booking.paymentMethod
});
}

const generatedSignature=crypto
.createHmac("sha256",process.env.RAZORPAY_KEY_SECRET)
.update(`${booking.transactionId}|${razorpay_payment_id}`)
.digest("hex");

const receivedBuffer=Buffer.from(razorpay_signature);
const generatedBuffer=Buffer.from(generatedSignature);

if(
receivedBuffer.length!==generatedBuffer.length||
!crypto.timingSafeEqual(receivedBuffer,generatedBuffer)
){
return res.status(400).json({
success:false,
message:"Payment verification failed"
});
}

const payment=await razorpay.payments.fetch(razorpay_payment_id);

if(payment.order_id!==booking.transactionId){
return res.status(400).json({
success:false,
message:"Payment order mismatch"
});
}

if(Number(payment.amount)!==Math.round(Number(booking.amount)*100)){
return res.status(400).json({
success:false,
message:"Payment amount mismatch"
});
}

if(payment.status!=="captured"){
return res.status(400).json({
success:false,
message:`Payment is not captured. Current status: ${payment.status}`
});
}

booking.paymentStatus="Successful";
booking.paymentMethod=getPaymentMethod(payment);
booking.transactionId=razorpay_order_id;

if(booking.razorpayPaymentId!==undefined){
booking.razorpayPaymentId=razorpay_payment_id;
}

if(booking.paymentSignature!==undefined){
booking.paymentSignature=razorpay_signature;
}

await booking.save();

res.json({
success:true,
message:"Payment verified successfully",
ticketId:booking._id,
paymentMethod:booking.paymentMethod,
paymentId:razorpay_payment_id,
orderId:razorpay_order_id
});
}catch(error){
console.log("Razorpay Verification Error:",error);

res.status(500).json({
success:false,
message:"Unable to verify payment"
});
}
});

router.get("/razorpay-status/:razorpayOrderId",async(req,res)=>{
try{
const{razorpayOrderId}=req.params;

const booking=await Booking.findOne({
transactionId:razorpayOrderId
});

if(!booking){
return res.status(404).json({
success:false,
message:"Booking not found"
});
}

const order=await razorpay.orders.fetch(razorpayOrderId);

res.json({
success:true,
orderId:order.id,
orderStatus:order.status,
paymentStatus:booking.paymentStatus,
amount:order.amount,
ticketId:booking.paymentStatus==="Successful"?booking._id:null
});
}catch(error){
console.log("Razorpay Status Error:",error);

res.status(500).json({
success:false,
message:"Unable to check payment status"
});
}
});

module.exports=router;