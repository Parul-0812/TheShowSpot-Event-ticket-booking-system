import React,{useEffect,useState} from "react";
import axios from "axios";
import "../styles/notifications.css";
import { Link } from "react-router-dom";

function Notifications(){


const [notifications,setNotifications]=useState([]);


useEffect(()=>{

    getNotifications();

},[]);



const getNotifications=async()=>{


const result = await axios.get(
"http://localhost:5000/booking/all"
);


setNotifications(result.data.data);


}



return(

<div className="notification-page">


<h1>🔔 Dear User,</h1>


{

notifications.map((item)=>(


<div className="notification-card">


<h2>
Booking Confirmed ✅
</h2>


<p>
Your ticket for {item.eventName} is confirmed.
</p>


<p>
Seats: {item.seats.join(", ")}
</p>


<p>
Amount Paid: ₹{item.amount}
</p>
<Link
to="/ticket"
state={{

eventName:item.eventName,

eventDate:item.eventDate,

eventLocation:item.eventLocation,

seats:item.seats,

amount:item.amount,

ticketId:item._id

}}
>


<button className="download-ticket-btn">

View / Download Ticket 🎟️

</button>


</Link>

</div>


))


}


</div>


)


}


export default Notifications;