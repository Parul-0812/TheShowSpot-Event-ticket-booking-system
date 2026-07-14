import React,{useEffect,useState} from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import AdminNavbar from "../components/AdminNavbar";

import "../styles/dashboard.css";

function Dashboard(){

const [bookings,setBookings]=useState([]);
const [requests,setRequests]=useState([]);
const [selectedRequest,setSelectedRequest]=useState(null);

const [ticketId,setTicketId]=useState("");
const [message,setMessage]=useState("");

const totalRevenue=bookings.reduce(
(sum,item)=>sum+item.amount,
0
);

const bookedSeats=bookings.reduce(
(total,item)=>total+item.seats.length,
0
);

const totalSeats=180;

const availableSeats=totalSeats-bookedSeats;

const pendingRequests=requests.filter(
item=>item.status==="Pending"
).length;

const validTickets=bookings.filter(
item=>item.ticketStatus==="Valid"
).length;

const usedTickets=bookings.filter(
item=>item.ticketStatus==="Used"
).length;

useEffect(()=>{

getBookings();

getRequests();

},[]);

const getBookings=async()=>{

try{

const result=await axios.get(
"http://localhost:5000/booking/all"
);

setBookings(result.data.data);

}

catch(error){

console.log(error);

}

};

const getRequests=async()=>{

try{

const result=await axios.get(
"http://localhost:5000/event-request/all"
);

setRequests(result.data.data);

}

catch(error){

console.log(error);

}

};

const verifyTicket=async()=>{

const result=await axios.post(

"http://localhost:5000/booking/verify",

{

ticketId

}

);

setMessage(result.data.message);

getBookings();

};

const approveRequest=async(id)=>{

await axios.put(

`http://localhost:5000/event-request/approve/${id}`

);

getRequests();

};

const rejectRequest=async(id)=>{

await axios.put(

`http://localhost:5000/event-request/reject/${id}`

);

getRequests();

};

return(

<div className="dashboard-layout">

<Sidebar/>

<div className="dashboard-content">

<AdminNavbar/>

<div className="dashboard">

<div className="dashboard-stats">

<div className="stat-card">

<h3>Total Bookings</h3>

<h1>{bookings.length}</h1>

</div>

<div className="stat-card">

<h3>Total Revenue</h3>

<h1>₹{totalRevenue}</h1>

</div>

<div className="stat-card">

<h3>Pending Requests</h3>

<h1>{pendingRequests}</h1>

</div>

<div className="stat-card">

<h3>Available Seats</h3>

<h1>{availableSeats}</h1>

</div>

</div>
{/*==========================
    PENDING EVENT REQUESTS
===========================*/}

<div className="request-section" id="requests">

<h2>Pending Event Requests</h2>

<div className="request-grid">

{

requests.length===0 ?

(

<h3>No Pending Requests</h3>

)

:

requests.map((request)=>(

<div className="request-card" key={request._id}>

<img
src={`http://localhost:5000/uploads/${request.image}`}
alt={request.name}
/>

<h2>{request.name}</h2>

<p><strong>Category:</strong> {request.category}</p>

<p><strong>City:</strong> {request.city}</p>

<p><strong>Organizer:</strong> {request.organizerName}</p>

<p>

<strong>Status:</strong>

<span className="pending">

{request.status}

</span>

</p>

<div className="request-buttons">

<button
className="view-btn"
onClick={()=>setSelectedRequest(request)}
>

View

</button>

<button
className="approve-btn"
onClick={()=>approveRequest(request._id)}
>

Approve

</button>

<button
className="reject-btn"
onClick={()=>rejectRequest(request._id)}
>

Reject

</button>

</div>

</div>

))

}

</div>

</div>

{/*==========================
        VIEW DETAILS MODAL
===========================*/}

{

selectedRequest && (

<div className="modal-overlay">

<div className="details-modal">

<button
className="close-btn"
onClick={()=>setSelectedRequest(null)}
>

✕

</button>

<img
src={`http://localhost:5000/uploads/${selectedRequest.image}`}
alt={selectedRequest.name}
/>

<h2>{selectedRequest.name}</h2>

<p><strong>Category:</strong> {selectedRequest.category}</p>

<p><strong>Description:</strong></p>

<p>{selectedRequest.description}</p>

<p><strong>Date:</strong> {selectedRequest.date}</p>

<p><strong>Time:</strong> {selectedRequest.startTime} - {selectedRequest.endTime}</p>

<p><strong>Venue:</strong> {selectedRequest.venue}</p>

<p><strong>City:</strong> {selectedRequest.city}</p>

<p><strong>Address:</strong> {selectedRequest.address}</p>

<p><strong>Total Seats:</strong> {selectedRequest.totalSeats}</p>

<p><strong>Ticket Price:</strong> ₹{selectedRequest.ticketPrice}</p>

<hr/>

<h3>Organizer Details</h3>

<p><strong>Name:</strong> {selectedRequest.organizerName}</p>

<p><strong>Email:</strong> {selectedRequest.email}</p>

<p><strong>Phone:</strong> {selectedRequest.phone}</p>

<div className="modal-actions">

<button
className="approve-btn"
onClick={()=>{

approveRequest(selectedRequest._id);

setSelectedRequest(null);

}}
>

Approve

</button>

<button
className="reject-btn"
onClick={()=>{

rejectRequest(selectedRequest._id);

setSelectedRequest(null);

}}
>

Reject

</button>

</div>

</div>

</div>

)
}
<div className="verify-box" id="verify">

<h2>QR Ticket Verification</h2>

<div className="verify-input">

<input
type="text"
placeholder="Enter Ticket ID"
value={ticketId}
onChange={(e)=>setTicketId(e.target.value)}
/>

<button onClick={verifyTicket}>
Verify Ticket
</button>

</div>

{message && <h3 className="verify-message">{message}</h3>}

</div>

<div className="booking-list" id="bookings">

<h2>Recent Bookings</h2>

<table className="booking-table">

<thead>

<tr>

<th>Event</th>

<th>User</th>

<th>Location</th>

<th>Seats</th>

<th>Amount</th>

<th>Status</th>

</tr>

</thead>

<tbody>

{

bookings.map((booking)=>(

<tr key={booking._id}>

<td>{booking.eventName}</td>

<td>{booking.user}</td>

<td>{booking.eventLocation}</td>

<td>{booking.seats.join(", ")}</td>

<td>₹{booking.amount}</td>

<td>

<span
className={
booking.ticketStatus==="Valid"
?
"status-valid"
:
"status-used"
}
>

{booking.ticketStatus}

</span>

</td>

</tr>

))

}

</tbody>

</table>

</div>

</div>

</div>

</div>

);

}

export default Dashboard;