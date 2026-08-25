import React,{useEffect,useState} from "react";
import {useLocation,useNavigate} from "react-router-dom";
import axios from "axios";
import {load} from "@cashfreepayments/cashfree-js";
import "../styles/payment.css";
import Navbar from "../components/navbar";
import Footer from "../components/Footer";

function Payment(){
const location=useLocation();
const navigate=useNavigate();
const booking=location.state;
const user=JSON.parse(localStorage.getItem("user"));
const [cashfree,setCashfree]=useState(null);
const [step,setStep]=useState("details");
const [error,setError]=useState("");
const [paymentStatus,setPaymentStatus]=useState("");
const [orderId,setOrderId]=useState("");

useEffect(()=>{
const initializeCashfree=async()=>{
try{
const cf=await load({mode:"sandbox"});
setCashfree(cf);
}catch(error){
console.log("Cashfree SDK Error:",error);
setError("Unable to load payment gateway.");
}
};
initializeCashfree();
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
try{
setError("");
setStep("processing");
setPaymentStatus("Preparing secure payment...");

if(!cashfree){
setError("Payment gateway is still loading. Please try again.");
setStep("details");
return;
}

if(!user){
setError("Please login before making a payment.");
setStep("details");
return;
}

const newOrderId=`TSS_${Date.now()}`;
setOrderId(newOrderId);
setPaymentStatus("Creating secure payment order...");

const result=await axios.post("http://localhost:5000/payment/create-cashfree-order",{
orderId:newOrderId,
amount:totalAmount,
customerId:user._id,
customerName:user.name,
customerEmail:user.email,
customerPhone:user.phone||"9999999999"
});

if(!result.data.success||!result.data.paymentSessionId){
throw new Error(result.data.message||"Unable to create payment order");
}

setPaymentStatus("Opening secure checkout...");

const checkoutResult=await cashfree.checkout({
paymentSessionId:result.data.paymentSessionId,
redirectTarget:"_modal"
});

console.log("Cashfree Checkout Result:",checkoutResult);

if(checkoutResult?.error){
console.log("Cashfree Checkout Error:",checkoutResult.error);
setError("Payment was cancelled or could not be completed.");
setStep("details");
return;
}

setPaymentStatus("Verifying payment...");

await checkPaymentStatus(newOrderId);
}catch(error){
console.log("Payment Error:",error);
setError(error.response?.data?.message||error.message||"Unable to process payment.");
setStep("details");
}
};

const checkPaymentStatus=async(cashfreeOrderId)=>{
try{
const result=await axios.get(`http://localhost:5000/payment/cashfree-status/${cashfreeOrderId}`);

if(!result.data.success){
throw new Error(result.data.message||"Unable to check payment status");
}

console.log("Cashfree Order Status:",result.data.orderStatus);

if(result.data.orderStatus==="PAID"){
setPaymentStatus("Payment successful!");
await confirmBooking(cashfreeOrderId);
}else if(result.data.orderStatus==="ACTIVE"){
setError("Payment is still pending. Please try again.");
setStep("details");
}else{
setError("Payment was not completed.");
setStep("details");
}
}catch(error){
console.log("Payment Status Error:",error);
setError("Unable to verify payment status.");
setStep("details");
}
};

const confirmBooking=async(cashfreeOrderId)=>{
try{
setPaymentStatus("Confirming your booking...");

const bookingData={
...booking,
userId:user._id,
amount:totalAmount,
paymentMethod:"Cashfree",
paymentStatus:"Successful",
transactionId:cashfreeOrderId
};

const bookingResult=await axios.post("http://localhost:5000/booking/confirm",bookingData);

if(!bookingResult.data.success){
throw new Error("Booking could not be confirmed.");
}

setPaymentStatus("Booking confirmed!");
setStep("success");

setTimeout(()=>{
navigate("/ticket",{
state:{
eventName:booking.eventName,
eventDate:booking.eventDate,
eventLocation:booking.eventLocation,
seats:booking.seats,
amount:totalAmount,
ticketId:bookingResult.data.ticketId,
transactionId:cashfreeOrderId,
paymentMethod:"Cashfree"
}
});
},2000);
}catch(error){
console.log("Booking Confirmation Error:",error);
setError("Payment was successful, but booking confirmation failed.");
setStep("details");
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
<p>Ticket Amount:<span>₹{booking.amount}</span></p>
<p>Convenience Fee:<span>₹{convenienceFee}</span></p>
<hr/>
<h2>Total:<span>₹{totalAmount}</span></h2>
</div>
<p className="payment-hint">You will complete your payment securely through Cashfree. UPI, Card and Net Banking options will be available in the secure payment window.</p>
{error&&<p className="payment-error">{error}</p>}
<button className="pay-button" onClick={createOrder} disabled={!cashfree}>
{cashfree?`Proceed to Pay ₹${totalAmount}`:"Loading Payment Gateway..."}
</button>
</>
)}
{step==="processing"&&(
<div className="payment-processing">
<div className="loader"></div>
<h2>{paymentStatus}</h2>
<p>Please don't close this window.</p>
<div className="processing-steps">
<p>✓ Booking details received</p>
<p>✓ Secure payment order created</p>
<p>⏳ Waiting for payment confirmation</p>
</div>
</div>
)}
{step==="success"&&(
<div className="payment-success">
<div className="success-icon">✓</div>
<h1>Payment Successful</h1>
<p>Your payment has been processed successfully.</p>
<div className="success-details">
<div><span>Amount Paid</span><strong>₹{totalAmount}</strong></div>
<div><span>Payment Method</span><strong>Cashfree</strong></div>
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