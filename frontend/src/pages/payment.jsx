import React,{useState} from "react";
import {useLocation,useNavigate} from "react-router-dom";
import axios from "axios";
import "../styles/payment.css";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

function Payment(){

const location=useLocation();
const navigate=useNavigate();
const booking=location.state;

const [method,setMethod]=useState("UPI");
const [step,setStep]=useState("details");
const [processing,setProcessing]=useState(false);
const [upiId,setUpiId]=useState("");
const [cardName,setCardName]=useState("");
const [cardNumber,setCardNumber]=useState("");
const [expiry,setExpiry]=useState("");
const [cvv,setCvv]=useState("");
const [bank,setBank]=useState("");
const [userId,setUserId]=useState("");
const [password,setPassword]=useState("");
const [otp,setOtp]=useState("");
const [error,setError]=useState("");
const [transactionId]=useState(()=>`TXN-${Math.random().toString(36).substring(2,10).toUpperCase()}`);
const [paymentStatus,setPaymentStatus]=useState("");

const [paymentId]=useState(()=>Date.now().toString());

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

const formatCardNumber=(value)=>{
const numbers=value.replace(/\D/g,"").slice(0,16);
return numbers.replace(/(.{4})/g,"$1 ").trim();
};

const changeMethod=(value)=>{
setMethod(value);
setStep("details");
setError("");
};

const generateOtp=async()=>{
try{
const result=await axios.post("http://localhost:5000/payment/send-otp",{paymentId});
if(result.data.success){
setStep("otp");
setError("");
}else{
setError(result.data.message||"Unable to generate verification code.");
}
}catch(error){
console.log(error);
setError("Unable to connect to payment service.");
}
};

const validateDetails=()=>{
setError("");

if(method==="UPI"){
if(!upiId.trim()){
setError("Please enter your UPI ID.");
return false;
}
if(!upiId.includes("@")){
setError("Please enter a valid UPI ID.");
return false;
}
}

if(method==="Card"){
if(cardName.trim().length<2){
setError("Please enter the name on card.");
return false;
}
if(cardNumber.replace(/\s/g,"").length!==16){
setError("Card number should contain 16 digits.");
return false;
}
if(!expiry){
setError("Please enter the card expiry date.");
return false;
}
if(cvv.length!==3){
setError("CVV should contain 3 digits.");
return false;
}
}

if(method==="Net Banking"){
if(!bank){
setError("Please select your bank.");
return false;
}
}

return true;
};

const continuePayment=async()=>{
if(!validateDetails())return;

if(method==="UPI"){
setStep("upiAuthorize");
return;
}

if(method==="Card"){
await generateOtp();
return;
}

if(method==="Net Banking"){
setStep("bankLogin");
}
};

const authorizeUpi=async()=>{
await generateOtp();
};

const bankLogin=()=>{
setError("");

if(!userId.trim()){
setError("Please enter your User ID.");
return;
}

if(!password.trim()){
setError("Please enter your password.");
return;
}

setStep("bankConfirm");
};

const bankConfirm=async()=>{
await generateOtp();
};

const verifyOtp=async()=>{
setError("");

if(otp.length!==6){
setError("Please enter the 6-digit verification code.");
return;
}

setProcessing(true);

try{
const result=await axios.post(
"http://localhost:5000/payment/verify-otp",
{
paymentId,
otp
}
);

if(!result.data.success){
setError(result.data.message);
setProcessing(false);
return;
}

setStep("processing");
setPaymentStatus("Verifying payment...");

setTimeout(async()=>{
setPaymentStatus("Confirming booking...");

setTimeout(async()=>{
try{
const bookingData={
...booking,
userId:booking.userId,
paymentMethod:method,
paymentStatus:"Successful",
transactionId
};
const bookingResult=await axios.post(
"http://localhost:5000/booking/confirm",
bookingData
);

if(bookingResult.data.success){
setPaymentStatus("Payment successful");
setProcessing(false);
setStep("success");
setTimeout(()=>{
navigate("/ticket",{
state:{
eventName:booking.eventName,
eventDate:booking.eventDate,
eventLocation:booking.eventLocation,
seats:booking.seats,
amount:booking.amount,
ticketId:bookingResult.data.ticketId,
transactionId,
paymentMethod:method
}
});
},2500);
}else{
setError("Payment was verified but booking could not be confirmed.");
setProcessing(false);
setStep("otp");
}
}catch(error){
console.log(error);
setError("Unable to confirm your booking.");
setProcessing(false);
setStep("otp");
}
},1200);
},1200);

}catch(error){
console.log(error);
setError("Unable to verify payment.");
setProcessing(false);
}
};

const resendOtp=async()=>{
setOtp("");
setError("");
await generateOtp();
};

return(
<>
<Navbar/>
<div className="payment-page">
<div className="payment-card">
{step!=="success"&&step!=="processing"&&(
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
<p>Ticket Amount: <span>₹{booking.amount}</span></p>
<p>Convenience Fee: <span>₹{convenienceFee}</span></p>
<hr/>
<h2>Total: <span>₹{totalAmount}</span></h2>
</div>
</>
)}

{step==="details"&&(
<>
<h3>Select Payment Method</h3>
<div className="payment-options">
<label className={method==="UPI"?"payment-option active":"payment-option"}>
<input type="radio" checked={method==="UPI"} onChange={()=>changeMethod("UPI")}/>
<span>📱 UPI</span>
</label>
<label className={method==="Card"?"payment-option active":"payment-option"}>
<input type="radio" checked={method==="Card"} onChange={()=>changeMethod("Card")}/>
<span>💳 Card</span>
</label>
<label className={method==="Net Banking"?"payment-option active":"payment-option"}>
<input type="radio" checked={method==="Net Banking"} onChange={()=>changeMethod("Net Banking")}/>
<span>🏦 Net Banking</span>
</label>
</div>

{method==="UPI"&&(
<div className="payment-form">
<label>UPI ID</label>
<input type="text" placeholder="example@upi" value={upiId} onChange={(e)=>setUpiId(e.target.value)}/>
<p className="payment-hint">Your UPI payment request will be simulated securely.</p>
</div>
)}

{method==="Card"&&(
<div className="payment-form">
<label>Name on Card</label>
<input type="text" placeholder="Enter card holder name" value={cardName} onChange={(e)=>setCardName(e.target.value)}/>
<label>Card Number</label>
<input type="text" placeholder="1234 5678 9012 3456" value={cardNumber} onChange={(e)=>setCardNumber(formatCardNumber(e.target.value))}/>
<div className="card-row">
<div>
<label>Expiry</label>
<input type="month" value={expiry} onChange={(e)=>setExpiry(e.target.value)}/>
</div>
<div>
<label>CVV</label>
<input type="password" placeholder="•••" maxLength="3" value={cvv} onChange={(e)=>setCvv(e.target.value.replace(/\D/g,""))}/>
</div>
</div>
</div>
)}

{method==="Net Banking"&&(
<div className="payment-form">
<label>Select Bank</label>
<select value={bank} onChange={(e)=>setBank(e.target.value)}>
<option value="">Select your bank</option>
<option>State Bank of India</option>
<option>HDFC Bank</option>
<option>ICICI Bank</option>
<option>Punjab National Bank</option>
<option>Axis Bank</option>
<option>Bank of Baroda</option>
<option>Canara Bank</option>
</select>
<p className="payment-hint">You will continue to a secure banking simulation.</p>
</div>
)}

{error&&<p className="payment-error">{error}</p>}

<button className="pay-button" onClick={continuePayment}>
Continue
</button>
</>
)}

{step==="upiAuthorize"&&(
<div className="payment-step">
<div className="step-icon">📱</div>
<h2>Authorize UPI Payment</h2>
<p>TheShowSpot has initiated a payment request.</p>
<div className="authorization-box">
<p>UPI ID</p>
<strong>{upiId}</strong>
<p>Amount</p>
<strong>₹{totalAmount}</strong>
</div>
<p className="payment-hint">Review the payment details and authorize the transaction.</p>
<button className="pay-button" onClick={authorizeUpi}>
Authorize Payment
</button>
<button className="back-button" onClick={()=>setStep("details")}>Back</button>
</div>
)}

{step==="bankLogin"&&(
<div className="payment-step bank-screen">
<div className="bank-logo">🏦</div>
<h2>{bank}</h2>
<p className="secure-text">🔒 Secure Net Banking</p>
<label>User ID</label>
<input type="text" placeholder="Enter User ID" value={userId} onChange={(e)=>setUserId(e.target.value)}/>
<label>Password</label>
<input type="password" placeholder="Enter password" value={password} onChange={(e)=>setPassword(e.target.value)}/>

{error&&<p className="payment-error">{error}</p>}
<button className="pay-button" onClick={bankLogin}>Login & Continue</button>
<button className="back-button" onClick={()=>setStep("details")}>Back</button>
</div>
)}

{step==="bankConfirm"&&(
<div className="payment-step">
<div className="step-icon">🔐</div>
<h2>Confirm Payment</h2>
<div className="authorization-box">
<p>Merchant</p>
<strong>TheShowSpot</strong>
<p>Event</p>
<strong>{booking.eventName}</strong>
<p>Bank</p>
<strong>{bank}</strong>
<p>Amount</p>
<strong>₹{totalAmount}</strong>
</div>
<p className="payment-hint">Review your payment before authorization.</p>
<button className="pay-button" onClick={bankConfirm}>Confirm & Continue</button>
<button className="back-button" onClick={()=>setStep("bankLogin")}>Back</button>
</div>
)}

{step==="otp"&&(
<div className="payment-step">
<div className="step-icon">🔐</div>
<h2>Verify Payment</h2>
<p>Enter the 6-digit verification code to authorize this payment.</p>
<div className="otp-transaction">
<span>Transaction</span>
<strong>{transactionId}</strong>
</div>
<label>Verification Code</label>
<input className="otp-input" type="text" maxLength="6" placeholder="••••••" value={otp} onChange={(e)=>setOtp(e.target.value.replace(/\D/g,""))}/>
{error&&<p className="payment-error">{error}</p>}
<button className="pay-button" onClick={verifyOtp} disabled={processing}>
{processing?"Verifying...":`Verify & Pay ₹${totalAmount}`}
</button>
<button className="back-button" onClick={resendOtp}>Resend Code</button>
<button className="back-button" onClick={()=>{setOtp("");setError("");setStep("details")}}>Cancel Payment</button>
</div>
)}

{step==="processing"&&(
<div className="payment-processing">
<div className="loader"></div>
<h2>{paymentStatus}</h2>
<p>Please don't close this window.</p>
<div className="processing-steps">
<p>✓ Payment details verified</p>
<p>✓ Payment authorization completed</p>
<p>⏳ Confirming your booking</p>
</div>
</div>
)}

{step==="success"&&(
<div className="payment-success">
<div className="success-icon">✓</div>
<h1>Payment Successful</h1>
<p>Your payment has been processed successfully.</p>
<div className="success-details">
<div>
<span>Amount Paid</span>
<strong>₹{totalAmount}</strong>
</div>
<div>
<span>Payment Method</span>
<strong>{method}</strong>
</div>
<div>
<span>Transaction ID</span>
<strong>{transactionId}</strong>
</div>
</div>
<div className="success-message">
✓ Booking confirmed<br/>
Your ticket is being generated...
</div>
</div>
)}
</div>
</div>
<Footer/>
</>
);
}

export default Payment;