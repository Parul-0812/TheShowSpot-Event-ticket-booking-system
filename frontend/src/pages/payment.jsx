import React,{useState} from "react";
import {useLocation,useNavigate} from "react-router-dom";
import axios from "axios";
import "../styles/payment.css";


function Payment(){


const location = useLocation();

const navigate = useNavigate();


const booking = location.state;


const [method,setMethod]=useState("UPI");
const [processing,setProcessing] = useState(false);

const makePayment = async()=>{


setProcessing(true);


setTimeout(async()=>{


const result = await axios.post(
"http://localhost:5000/booking/confirm",
booking
);


alert("Payment Successful ✅");


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


},1500);


}



return(

<div className="payment-page">


<div className="payment-card">


<h1>Checkout 🎟️</h1>


<div className="summary-box">


<h2>
{booking.eventName}
</h2>


<p>
📍 {booking.eventLocation}
</p>


<p>
📅 {booking.eventDate}
</p>


<p>
💺 Seats: {booking.seats.join(", ")}
</p>


</div>



<div className="amount-box">


<h3>Payment Summary</h3>


<p>
Ticket Amount: ₹{booking.amount}
</p>


<p>
Convenience Fee: ₹20
</p>


<h2>
Total: ₹{booking.amount+20}
</h2>


</div>




<h3>Select Payment Method</h3>


<div className="payment-options">


<label>

<input

type="radio"

checked={method==="UPI"}

onChange={()=>setMethod("UPI")}

/>

UPI

</label>



<label>

<input

type="radio"

checked={method==="Card"}

onChange={()=>setMethod("Card")}

/>

Card

</label>




<label>

<input

type="radio"

checked={method==="Net Banking"}

onChange={()=>setMethod("Net Banking")}

/>

Net Banking

</label>


</div>




<button 
onClick={makePayment}
disabled={processing}
>


{
processing
?
"Processing..."
:
"Complete Payment"
}


</button>



</div>


</div>

)


}


export default Payment;