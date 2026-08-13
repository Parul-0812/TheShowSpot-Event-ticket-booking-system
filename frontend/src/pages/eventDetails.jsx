import React from "react";
import "../styles/eventDetails.css";
import {useLocation,useNavigate} from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

function EventDetails(){

const navigate=useNavigate();
const location=useLocation();
const event=location.state?.event;

if(!event){
return(
<>
<Navbar/>
<h1>No Event Selected</h1>
<Footer/>
</>
);
}

const handleBooking=()=>{
const isLoggedIn=localStorage.getItem("isLoggedIn");

if(isLoggedIn==="true"){
navigate("/booking",{state:{event}});
}else{
navigate("/login",{state:{event,returnTo:"/booking"}});
}
};

return(
<>
<Navbar/>
<div className="details-container">
<button className="back-btn" onClick={()=>navigate(-1)}>
← Back
</button>
<div className="details-card">
<img src={event.image} className="details-img" alt={event.name}/>
<div className="details-info">
<h1>{event.name}</h1>
<p>📍 {event.location}</p>
<p>🗓 {event.date}</p>
<p>⏰ {event.time}</p>
<h2>₹{event.price}</h2>
<p>
Experience an amazing event with TheShowSpot.
Enjoy unforgettable moments with your friends
and family.
</p>
<button onClick={handleBooking}>
Book Tickets
</button>
</div>
</div>
</div>
<Footer/>
</>
);
}

export default EventDetails;