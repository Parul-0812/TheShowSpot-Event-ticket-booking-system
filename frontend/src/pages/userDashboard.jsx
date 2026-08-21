import React,{useEffect,useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import UserSidebar from "../components/userSidebar";
import UserNavbar from "../components/userNavbar";
import "../styles/userDashboard.css";

function UserDashboard(){

const navigate=useNavigate();
const user=JSON.parse(localStorage.getItem("user"));
const [bookings,setBookings]=useState([]);
const [events,setEvents]=useState([]);
const [loading,setLoading]=useState(true);

useEffect(()=>{
if(!user?._id){
navigate("/login");
return;
}

const fetchData=async()=>{
try{
const [bookingResult,eventResult]=await Promise.all([
axios.get(`http://localhost:5000/booking/user/${user._id}`),
axios.get("http://localhost:5000/events/all")
]);

setBookings(bookingResult.data.data||[]);
setEvents(eventResult.data.data||[]);
}catch(error){
console.log(error);
}finally{
setLoading(false);
}
};

fetchData();
},[user?._id,navigate]);

const validTickets=bookings.filter(
booking=>booking.ticketStatus==="Valid"
);

const usedTickets=bookings.filter(
booking=>booking.ticketStatus==="Used"
);

const totalSpent=bookings
.filter(booking=>booking.paymentStatus==="Successful")
.reduce((sum,booking)=>sum+Number(booking.amount||0)+20,0);

const getEventStatus=(booking)=>{
const eventDate=new Date(booking.eventDate);
const now=new Date();

if(booking.ticketStatus==="Used")return"Used";
if(booking.ticketStatus==="Cancelled")return"Cancelled";
if(eventDate<now)return"Expired";
return"Valid";
};

const upcomingBookings=validTickets.filter(
booking=>getEventStatus(booking)==="Valid"
);

const discoverEvents=events
.filter(event=>{
const eventDate=new Date(event.date);
return eventDate>=new Date();
})
.slice(0,4);

if(loading){
return(
<div className="dashboard-loading">
Loading your dashboard...
</div>
);
}

return(
<div className="user-dashboard-layout">
<UserSidebar/>

<div className="user-dashboard-main">
<UserNavbar/>

<div className="user-dashboard-content">

<div className="dashboard-welcome">
<div>
<p className="welcome-small">Welcome back</p>
<h1>{user?.name||"User"} 👋</h1>
<p>Ready for your next experience?</p>
</div>

<button onClick={()=>navigate("/events")}>
Explore Events
</button>
</div>

<div className="dashboard-stats">

<div className="dashboard-stat-card">
<span>🎟️</span>
<div>
<h3>{bookings.length}</h3>
<p>Total Bookings</p>
</div>
</div>

<div className="dashboard-stat-card">
<span>📅</span>
<div>
<h3>{upcomingBookings.length}</h3>
<p>Upcoming Events</p>
</div>
</div>

<div className="dashboard-stat-card">
<span>🎫</span>
<div>
<h3>{usedTickets.length}</h3>
<p>Used Tickets</p>
</div>
</div>

<div className="dashboard-stat-card">
<span>💰</span>
<div>
<h3>₹{totalSpent}</h3>
<p>Total Spent</p>
</div>
</div>

</div>

<div className="dashboard-section">

<div className="section-heading">
<h2>Upcoming Events</h2>
<button onClick={()=>navigate("/my-tickets")}>
View All →
</button>
</div>

{upcomingBookings.length===0?(
<div className="empty-dashboard">
<h3>No upcoming events</h3>
<p>Discover an event and make your next memory.</p>
<button onClick={()=>navigate("/events")}>
Explore Events
</button>
</div>
):(
<div className="dashboard-ticket-grid">
{upcomingBookings.slice(0,3).map(booking=>(
<div className="dashboard-ticket-card" key={booking._id}>

<div className="ticket-status valid">
🟢 VALID
</div>

<h3>{booking.eventName}</h3>

<p>📅 {booking.eventDate}</p>
<p>📍 {booking.eventLocation}</p>
<p>💺 {booking.seats?.join(", ")}</p>

<div className="dashboard-ticket-bottom">
<strong>₹{Number(booking.amount)+20}</strong>

<button onClick={()=>{
navigate("/ticket",{
state:{
...booking,
ticketId:booking._id
}
});
}}>
View Ticket
</button>
</div>

</div>
))}
</div>
)}

</div>

<div className="dashboard-section">

<div className="section-heading">
<h2>Recent Activity</h2>
<button onClick={()=>navigate("/my-bookings")}>
View All →
</button>
</div>

{bookings.length===0?(
<div className="empty-dashboard">
<p>Your booking history will appear here.</p>
</div>
):(
<div className="recent-bookings">

{bookings.slice(0,5).map(booking=>(
<div className="recent-booking" key={booking._id}>

<div>
<h4>{booking.eventName}</h4>
<p>{booking.eventDate}</p>
</div>

<div>
<strong>₹{Number(booking.amount)+20}</strong>
<span className={
booking.paymentStatus==="Successful"
?"booking-payment-success"
:"booking-payment-failed"
}>
{booking.paymentStatus||"Pending"}
</span>
</div>

</div>
))}

</div>
)}

</div>

<div className="dashboard-section">

<div className="section-heading">
<h2>Discover Events</h2>
<button onClick={()=>navigate("/events")}>
View All →
</button>
</div>

<div className="discover-grid">

{discoverEvents.map(event=>(
<div className="discover-card" key={event._id}>

<img
src={event.image}
alt={event.name}
/>

<div className="discover-card-info">

<h3>{event.name}</h3>

<p>📍 {event.location}</p>

<p>📅 {event.date}</p>

<strong>₹{event.price}</strong>

<button onClick={()=>{
navigate("/event-details",{
state:{event}
});
}}>
View Event
</button>

</div>

</div>
))}

</div>

</div>

<div className="dashboard-account">

<div>
<h2>Your Account</h2>
<p>👤 {user?.name}</p>
<p>✉️ {user?.email}</p>
<p>📱 {user?.phone||"Phone number not added"}</p>
</div>

<button onClick={()=>navigate("/settings")}>
Manage Account
</button>

</div>

</div>
</div>
</div>
);
}

export default UserDashboard;