import React,{useEffect,useState} from "react";
import axios from "axios";
import "../styles/myBookings.css";
import { QRCodeCanvas } from "qrcode.react";

function MyBookings(){


const [bookings,setBookings]=useState([]);


useEffect(()=>{

    getBookings();

},[]);



const getBookings = async()=>{


    const result = await axios.get(
        "http://localhost:5000/booking/all"
    );


    setBookings(result.data.data);


}



return(

<div className="my-bookings">


<h1>🎟 My Bookings</h1>


<div className="my-list">


{

bookings.map((ticket)=>(


<div className="my-card">


<h2>{ticket.eventName}</h2>


<p>
📍 {ticket.eventLocation}
</p>


<p>
Seats: {ticket.seats.join(", ")}
</p>


<p>
Amount Paid: ₹{ticket.amount}
</p>


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


))

}


</div>


</div>


)


}


export default MyBookings;