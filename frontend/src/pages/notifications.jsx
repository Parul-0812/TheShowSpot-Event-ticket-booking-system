import React,{useEffect,useState} from "react";
import axios from "axios";
import "../styles/notifications.css";
import {Link,useNavigate} from "react-router-dom";

function Notifications(){

const [notifications,setNotifications]=useState([]);
const navigate=useNavigate();
const user=JSON.parse(localStorage.getItem("user"));

useEffect(()=>{

if(!user?._id){
navigate("/login");
return;
}

const getNotifications=async()=>{

try{

const result=await axios.get(
`http://localhost:5000/booking/user/${user._id}`
);

if(result.data.success){
setNotifications(result.data.data);
}

}catch(error){

console.log(error);

}

};

getNotifications();

},[user?._id,navigate]);

return(

<div className="notification-page">

<h1>🔔 Dear {user?.name || "User"},</h1>

{notifications.length===0?(
<div className="no-notifications">
<h2>No Notifications</h2>
<p>You don't have any booking notifications yet.</p>
<Link to="/events">
<button>Discover Events</button>
</Link>
</div>
):(

notifications.map((item)=>(

<div className="notification-card" key={item._id}>

<h2>
Booking Confirmed ✅
</h2>

<p>
Your ticket for {item.eventName} is confirmed.
</p>

<p>
📅 {item.eventDate}
</p>

<p>
📍 {item.eventLocation}
</p>

<p>
💺 Seats: {item.seats.join(", ")}
</p>

<p>
💰 Amount Paid: ₹{item.amount}
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
View Ticket 🎟️
</button>

</Link>

</div>

))

)}

</div>

);

}

export default Notifications;