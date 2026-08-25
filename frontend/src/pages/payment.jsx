import React,{useEffect,useState} from "react";
import {useLocation,useNavigate} from "react-router-dom";
import axios from "axios";
import "../styles/payment.css";
import Navbar from "../components/navbar";
import Footer from "../components/Footer";

function Payment(){
const location=useLocation();
const navigate=useNavigate();
const booking=location.state;
const user=JSON.parse(localStorage.getItem("user"));
const [razorpayLoaded,setRazorpayLoaded]=useState(false);
const [step,setStep]=useState("details");
const [error,setError]=useState("");
const [paymentStatus,setPaymentStatus]=useState("");
const [orderId,setOrderId]=useState("");
const [processing,setProcessing]=useState(false);

useEffect(()=>{
const loadRazorpay=()=>{
if(window.Razorpay){
setRazorpayLoaded(true);
return;
}
const script=document.createElement("script");
script.src="https://checkout.razorpay.com/v1/checkout.js";
script.onload=()=>setRazorpayLoaded(true);
script.onerror=()=>setError("Unable to load secure payment gateway.");
document.body.appendChild(script);
};
loadRazorpay();
},[]);

if(!booking){
return(
<>
<Navbar/>
<div className="payment-page">
<div className="payment-card">
<h2>No Payment Details Found</h2>
<button onClick={()=>navigate("/events")}>Go To Events</button>
</div>
</div>
<Footer/>
</>
);
}

const convenienceFee=20;
const totalAmount=Number(booking.amount)+convenienceFee;

const createOrder=async()=>{
if(processing)return;
try{
setError("");
setProcessing(true);
setStep("processing");
setPaymentStatus("Preparing your secure payment...");
if(!razorpayLoaded){
throw new Error("Payment gateway is still loading. Please try again.");
}
if(!user){
throw new Error("Please login before making a payment.");
}
if(!user._id){
throw new Error("User information is incomplete. Please login again.");
}
const result=await axios.post("http://localhost:5000/payment/create-razorpay-order",{
amount:totalAmount,
customerId:user._id,
customerName:user.name||"TheShowSpot Customer",
customerEmail:user.email,
customerPhone:user.phone||"9999999999",
eventName:booking.eventName,
eventDate:booking.eventDate,
eventLocation:booking.eventLocation,
seats:booking.seats
});
if(!result.data.success){
throw new Error(result.data.message||"Unable to create payment order.");
}
const razorpayOrderId=result.data.razorpayOrderId;
setOrderId(razorpayOrderId);
setPaymentStatus("Opening secure Razorpay checkout...");
const options={
key:result.data.keyId,
amount:result.data.amount,
currency:result.data.currency,
name:"TheShowSpot",
description:`Ticket booking for ${booking.eventName}`,
order_id:razorpayOrderId,
prefill:{
name:user.name||"",
email:user.email||"",
contact:user.phone||""
},
notes:{
event:booking.eventName,
seats:booking.seats.join(", ")
},
theme:{
color:"#e91e63"
},
modal:{
ondismiss:()=>{
setProcessing(false);
setStep("details");
setError("Payment was cancelled. Your booking has not been confirmed.");
}
},
handler:async(response)=>{
await verifyPayment(response,razorpayOrderId);
}
};
const razorpay=new window.Razorpay(options);
razorpay.on("payment.failed",(response)=>{
console.log("Razorpay Payment Failed:",response.error);
setProcessing(false);
setStep("details");
setError(response.error?.description||"Payment failed. Please try again.");
});
razorpay.open();
}catch(error){
console.log("Payment Error:",error);
setProcessing(false);
setStep("details");
setError(error.response?.data?.message||error.message||"Unable to start payment.");
}
};

const verifyPayment=async(response,razorpayOrderId)=>{
try{
setStep("processing");
setPaymentStatus("Verifying your payment securely...");
const result=await axios.post("http://localhost:5000/payment/verify-razorpay-payment",{
razorpay_payment_id:response.razorpay_payment_id,
razorpay_order_id:razorpayOrderId,
razorpay_signature:response.razorpay_signature
});
if(!result.data.success){
throw new Error(result.data.message||"Payment verification failed.");
}
setPaymentStatus("Payment verified successfully!");
setTimeout(()=>{
setPaymentStatus("Confirming your booking...");
},500);
setTimeout(()=>{
setStep("success");
setProcessing(false);
setPaymentStatus("Booking confirmed!");
},1200);
setTimeout(()=>{
navigate("/ticket",{
state:{
eventName:booking.eventName,
eventDate:booking.eventDate,
eventLocation:booking.eventLocation,
seats:booking.seats,
amount:totalAmount,
ticketId:result.data.ticketId,
transactionId:razorpayOrderId,
paymentId:result.data.paymentId,
paymentMethod:result.data.paymentMethod||"Razorpay"
}
});
},2500);
}catch(error){
console.log("Payment Verification Error:",error);
setProcessing(false);
setStep("details");
setError(error.response?.data?.message||error.message||"Payment verification failed. Please contact support if money was deducted.");
}
};

return(
<>
<Navbar/>
<div className="payment-page">
<div className="payment-card">
{step==="details"&&(
<>
<h1>Checkout 🎟️</h1>
<div className="summary-box">
<h2>{booking.eventName}</h2>
<p>📍 {booking.eventLocation}</p>
<p>📅 {booking.eventDate}</p>
<p>💺 Seats: {booking.seats.join(", ")}</p>
</div>
<div className="amount-box">
<h3>Payment Summary</h3>
<p>Ticket Amount:<span>₹{Number(booking.amount).toFixed(2)}</span></p>
<p>Convenience Fee:<span>₹{convenienceFee.toFixed(2)}</span></p>
<hr/>
<h2>Total:<span>₹{totalAmount.toFixed(2)}</span></h2>
</div>
<div className="payment-hint">
<p>🔒 <strong>Secure Payment</strong></p>
<p>You will be redirected to Razorpay's secure checkout where you can pay using UPI, Card, Net Banking and other supported payment methods.</p>
</div>
{error&&<p className="payment-error">{error}</p>}
<button className="pay-button" onClick={createOrder} disabled={!razorpayLoaded||processing}>
{!razorpayLoaded?"Loading Secure Checkout...":`🔐 Proceed to Pay ₹${totalAmount.toFixed(2)}`}
</button>
<p className="payment-security">🔒 Secured by Razorpay • Test Mode</p>
</>
)}
{step==="processing"&&(
<div className="payment-processing">
<div className="loader"></div>
<h2>{paymentStatus}</h2>
<p>Please don't close or refresh this page.</p>
<div className="processing-steps">
<p>✓ Booking details received</p>
<p>✓ Secure payment order created</p>
<p>✓ Razorpay checkout completed</p>
<p>⏳ Verifying payment securely</p>
</div>
</div>
)}
{step==="success"&&(
<div className="payment-success">
<div className="success-icon">✓</div>
<h1>Payment Successful!</h1>
<p>Your payment has been verified and your booking is confirmed.</p>
<div className="success-details">
<div><span>Amount Paid</span><strong>₹{totalAmount.toFixed(2)}</strong></div>
<div><span>Payment Method</span><strong>Razorpay</strong></div>
<div><span>Order ID</span><strong>{orderId}</strong></div>
</div>
<div className="success-message">✓ Booking confirmed<br/>Your ticket is being generated...</div>
</div>
)}
</div>
</div>
<Footer/>
</>
);
}

export default Payment;