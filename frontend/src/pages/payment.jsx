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

const continuePayment=()=>{
if(!validateDetails())return;

if(method==="UPI"){
setStep("upiVerify");
return;
}

if(method==="Card"){
setStep("otp");
return;
}

if(method==="Net Banking"){
setStep("bankLogin");
return;
}
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

const bankConfirm=()=>{
setStep("otp");
};

const verifyOtp=async()=>{
setError("");

if(otp!=="123456"){
setError("Incorrect OTP. For this demo, use 123456.");
return;
}

setProcessing(true);

setTimeout(async()=>{
try{
const result=await axios.post("http://localhost:5000/booking/confirm",booking);

if(result.data.success){
navigate("/ticket",{
state:{
eventName:booking.eventName,
eventDate:booking.eventDate,
eventLocation:booking.eventLocation,
seats:booking.seats,
amount:booking.amount,
ticketId:result.data.ticketId
}
});
}else{
setError("Payment could not be completed.");
setProcessing(false);
}
}catch(error){
console.log(error);
setError("Unable to complete payment.");
setProcessing(false);
}
},1500);
};

return(
<>
<Navbar/>
<div className="payment-page">
<div className="payment-card">
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

{step==="details"&&(
<>
<h3>Select Payment Method</h3>
<div className="payment-options">
<label className={method==="UPI"?"payment-option active":"payment-option"}>
<input type="radio" checked={method==="UPI"} onChange={()=>changeMethod("UPI")}/>
<span>UPI</span>
</label>
<label className={method==="Card"?"payment-option active":"payment-option"}>
<input type="radio" checked={method==="Card"} onChange={()=>changeMethod("Card")}/>
<span>Card</span>
</label>
<label className={method==="Net Banking"?"payment-option active":"payment-option"}>
<input type="radio" checked={method==="Net Banking"} onChange={()=>changeMethod("Net Banking")}/>
<span>Net Banking</span>
</label>
</div>

{method==="UPI"&&(
<div className="payment-form">
<label>UPI ID</label>
<input type="text" placeholder="example@upi" value={upiId} onChange={(e)=>setUpiId(e.target.value)}/>
<p className="payment-hint">Enter your UPI ID to continue.</p>
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
<p className="payment-hint">You will be redirected to a secure banking screen.</p>
</div>
)}

{error&&<p className="payment-error">{error}</p>}

<button className="pay-button" onClick={continuePayment}>
Continue
</button>
</>
)}

{step==="upiVerify"&&(
<div className="payment-step">
<div className="step-icon">📱</div>
<h2>Verify UPI Payment</h2>
<p>A payment request has been initiated for</p>
<h2>₹{totalAmount}</h2>
<p className="payment-hint">For this simulation, continue to authorization.</p>
<button className="pay-button" onClick={()=>setStep("otp")}>Continue to Authorize</button>
<button className="back-button" onClick={()=>setStep("details")}>Change Payment Method</button>
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
<p className="demo-warning">Demo environment — do not enter real banking credentials.</p>
{error&&<p className="payment-error">{error}</p>}
<button className="pay-button" onClick={bankLogin}>Login & Continue</button>
<button className="back-button" onClick={()=>setStep("details")}>Back</button>
</div>
)}

{step==="bankConfirm"&&(
<div className="payment-step">
<div className="step-icon">🔐</div>
<h2>Confirm Payment</h2>
<p>Bank: {bank}</p>
<p>Merchant: TheShowSpot</p>
<p>Amount: ₹{totalAmount}</p>
<div className="bank-payment-box">
<p>Review the payment details before authorizing.</p>
</div>
<button className="pay-button" onClick={bankConfirm}>Confirm & Continue</button>
<button className="back-button" onClick={()=>setStep("bankLogin")}>Back</button>
</div>
)}

{step==="otp"&&(
<div className="payment-step">
<div className="step-icon">🔐</div>
<h2>Verify Payment</h2>
<p>A verification code has been sent to your registered mobile number.</p>
<label>Enter OTP</label>
<input className="otp-input" type="text" maxLength="6" placeholder="••••••" value={otp} onChange={(e)=>setOtp(e.target.value.replace(/\D/g,""))}/>
<p className="payment-hint">Demo OTP: 123456</p>
{error&&<p className="payment-error">{error}</p>}
<button className="pay-button" onClick={verifyOtp} disabled={processing}>
{processing?"Processing Payment...":`Verify & Pay ₹${totalAmount}`}
</button>
<button className="back-button" onClick={()=>setStep("details")}>Cancel Payment</button>
</div>
)}

</div>
</div>
<Footer/>
</>
);
}

export default Payment;