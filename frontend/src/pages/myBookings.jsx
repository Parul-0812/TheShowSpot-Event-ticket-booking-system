import React,{useEffect,useState} from "react";
import axios from "axios";
import "../styles/myBookings.css";


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