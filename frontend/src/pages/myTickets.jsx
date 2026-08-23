import React,{useEffect,useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import UserSidebar from "../components/userSidebar";
import UserNavbar from "../components/userNavbar";
import "../styles/myTickets.css";

function MyTickets(){

const navigate=useNavigate();
const user=JSON.parse(localStorage.getItem("user"));

const [tickets,setTickets]=useState([]);
const [loading,setLoading]=useState(true);

useEffect(()=>{

if(!user?._id){
navigate("/login");
return;
}

const getTickets=async()=>{
try{

const result=await axios.get(
`http://localhost:5000/booking/user/${user._id}`
);

if(result.data.success){
setTickets(result.data.data);
}

}catch(error){
console.log(error);
}finally{
setLoading(false);
}
};

getTickets();

},[user?._id,navigate]);

const validTickets=tickets.filter(
ticket=>ticket.ticketStatus==="Valid"
);

const usedTickets=tickets.filter(
ticket=>ticket.ticketStatus==="Used"
);

if(loading){
return(
<div className="dashboard-loading">
Loading your tickets...
</div>
);
}

return(
<div className="user-dashboard">

<UserSidebar/>

<div className="user-dashboard-main">

<UserNavbar/>

<div className="tickets-page">

<div className="page-heading">
<h1>My Tickets</h1>
<p>Manage all your event tickets in one place.</p>
</div>

<div className="ticket-tabs">
<span className="active-tab">
Upcoming ({validTickets.length})
</span>

<span>
Used ({usedTickets.length})
</span>
</div>

{tickets.length===0?(
<div className="empty-tickets">
<div>🎟️</div>
<h2>No Tickets Yet</h2>
<p>
You haven't booked any events yet.
</p>
<button onClick={()=>navigate("/events")}>
Discover Events
</button>
</div>
):(
<div className="tickets-list">

{tickets.map(ticket=>(

<div className="full-ticket" key={ticket._id}>

<div className="full-ticket-info">

<span className={
ticket.ticketStatus==="Valid"
?"status-valid"
:"status-used"
}>
{ticket.ticketStatus==="Valid"
?"🟢 VALID"
:"🔴 USED"}
</span>

<h2>{ticket.eventName}</h2>

<p>📅 {ticket.eventDate}</p>

<p>📍 {ticket.eventLocation}</p>

<p>💺 {ticket.seats?.join(", ")}</p>

</div>

<div className="full-ticket-right">

<h3>₹{ticket.amount}</h3>

<button
onClick={()=>{
navigate("/ticket",{
state:{
...ticket,
ticketId:ticket._id
}
});
}}
>
View Ticket
</button>

</div>

</div>

))}

</div>
)}

</div>

</div>

</div>
);
}

export default MyTickets;