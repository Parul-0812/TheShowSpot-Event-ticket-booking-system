import React from "react";
import {useLocation,Link} from "react-router-dom";
import {QRCodeCanvas} from "qrcode.react";
import "../styles/ticket.css";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

function Ticket(){

const location=useLocation();
const booking=location.state;

if(!booking){
return(
<>
<Navbar/>
<div className="ticket-container">
<div className="ticket-card">
<h1>No Ticket Found</h1>
<Link to="/events">
<button>Browse Events</button>
</Link>
</div>
</div>
<Footer/>
</>
);
}

return(
<>
<Navbar/>
<div className="ticket-container">
<div className="ticket-card">
<div className="ticket-success">
<div className="success-check">✓</div>
<h1>Booking Confirmed</h1>
<p>Your ticket has been successfully booked.</p>
</div>

<div className="ticket-header">
<h2>🎟️ TheShowSpot</h2>
<span>ENTRY TICKET</span>
</div>

<div className="event-ticket-info">
<h2>{booking.eventName}</h2>
<p>📍 {booking.eventLocation}</p>
<p>📅 {booking.eventDate}</p>
</div>

<div className="ticket-details">
<div>
<span>Seats</span>
<strong>{booking.seats.join(", ")}</strong>
</div>
<div>
<span>Amount Paid</span>
<strong>₹{Number(booking.amount)+20}</strong>
</div>
<div>
<span>Payment Method</span>
<strong>{booking.paymentMethod||"Online Payment"}</strong>
</div>
<div>
<span>Payment Status</span>
<strong className="payment-success-text">✓ Successful</strong>
</div>
<div>
<span>Transaction ID</span>
<strong>{booking.transactionId||"N/A"}</strong>
</div>
</div>

<div className="ticket-divider"></div>

<div className="qr-section">
<h3>Scan to Verify Entry</h3>
<QRCodeCanvas value={booking.ticketId} size={180}/>
<p>Ticket ID</p>
<strong>{booking.ticketId}</strong>
</div>

<div className="ticket-note">
<p>Present this QR code at the event entrance.</p>
<p>Keep this ticket safe until entry.</p>
</div>

<p className="message">
Thank you for booking with TheShowSpot ✨
</p>

<Link to="/">
<button>Back To Home</button>
</Link>

</div>
</div>
<Footer/>
</>
);
}

export default Ticket;