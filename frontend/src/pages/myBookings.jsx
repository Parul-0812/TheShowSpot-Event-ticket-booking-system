import React,{useEffect,useState} from "react";
import axios from "axios";
import "../styles/myBookings.css";
import {QRCodeCanvas} from "qrcode.react";
import {useNavigate} from "react-router-dom";

function MyBookings(){

const [bookings,setBookings]=useState([]);
const navigate=useNavigate();
const user=JSON.parse(localStorage.getItem("user"));

useEffect(()=>{

if(!user?._id){
navigate("/login");
return;
}

const getBookings=async()=>{

try{

const result=await axios.get(
`http://localhost:5000/booking/user/${user._id}`
);

if(result.data.success){
setBookings(result.data.data);
}

}catch(error){

console.log(error);

}

};

getBookings();

},[user?._id,navigate]);

return(

<div className="my-bookings">

<h1>🎟 My Bookings</h1>

{bookings.length===0?(
<div className="no-bookings">
<h2>No Bookings Yet</h2>
<p>You haven't booked any events yet.</p>
<button onClick={()=>navigate("/events")}>
Discover Events
</button>
</div>
):(

<div className="my-list">

{bookings.map((ticket)=>(

<div className="my-card" key={ticket._id}>

<h2>{ticket.eventName}</h2>

<p>📍 {ticket.eventLocation}</p>

<p>📅 {ticket.eventDate}</p>

<p>💺 Seats: {ticket.seats.join(", ")}</p>

<p>Amount Paid: ₹{ticket.amount}</p>

<div className="qr-box">

<QRCodeCanvas
value={ticket._id}
size={120}
/>

</div>

<p className="ticket-id">
Ticket ID:
<br/>
{ticket._id}
</p>

<p>
Status: {ticket.ticketStatus}
</p>

</div>

))}

</div>

)}

</div>

);

}

export default MyBookings;