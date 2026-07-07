import React,{useState} from "react";
import {useLocation,useNavigate} from "react-router-dom";
import axios from "axios";
import "../styles/payment.css";


function Payment(){


const location = useLocation();

const navigate = useNavigate();


const booking = location.state;


const [method,setMethod]=useState("UPI");


const makePayment = async()=>{


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


}


return(

<div className="payment-page">


<div className="payment-card">


<h1>💳 Payment</h1>


<h2>
Amount: ₹{booking.amount}
</h2>


<select

value={method}

onChange={(e)=>setMethod(e.target.value)}

>

<option>UPI</option>

<option>Credit Card</option>

<option>Debit Card</option>

</select>



<button onClick={makePayment}>

Pay Now

</button>


</div>


</div>


)


}


export default Payment;