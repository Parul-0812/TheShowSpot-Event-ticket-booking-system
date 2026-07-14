import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { Link } from "react-router-dom";
import "../styles/features.css";

function Features(){

return(

<>

<Navbar/>


<div className="features-page">

<div className="features-hero">

<h1>✨ Why Choose TheShowSpot?</h1>

<p>

Your one-stop destination for discovering events, booking tickets
and enjoying unforgettable experiences.

</p>

</div>

<h2 className="section-title">
Our Features
</h2>

<div className="feature-grid">

<div className="feature-card">

<div className="icon">🎫</div>

<h3>Easy Ticket Booking</h3>

<p>

Book tickets for your favourite events in just a few clicks.

</p>

</div>

<div className="feature-card">

<div className="icon">💺</div>

<h3>Seat Selection</h3>

<p>

Choose your preferred seats with live availability.

</p>

</div>

<div className="feature-card">

<div className="icon">📍</div>

<h3>City-wise Events</h3>

<p>

Explore events happening in your selected city.

</p>

</div>



<div className="feature-card">

<div className="icon">📱</div>

<h3>QR Tickets</h3>

<p>

Receive digital QR tickets instantly after booking.

</p>

</div>

<div className="feature-card">

<div className="icon">🎟️</div>

<h3>My Tickets</h3>

<p>

Access all your booked tickets anytime.

</p>

</div>

<div className="feature-card">

<div className="icon">🔔</div>

<h3>Notifications</h3>

<p>

Instant booking confirmations and ticket updates.

</p>

</div>

<div className="feature-card">

<div className="icon">🛡️</div>

<h3>QR Verification</h3>

<p>

Prevent duplicate entries using ticket verification.

</p>

</div>

<div className="feature-card">

<div className="icon">📊</div>

<h3>Admin Dashboard</h3>

<p>

Manage bookings, verify tickets and monitor events.

</p>

</div>

</div>

<h2 className="section-title">

How It Works

</h2>

<div className="timeline">

<div>🔍 Browse Events</div>

<span>➜</span>

<div>🎫 Select Event</div>

<span>➜</span>

<div>💺 Choose Seats</div>

<span>➜</span>

<div>💳 Pay</div>

<span>➜</span>

<div>📱 Get QR Ticket</div>

<span>➜</span>

<div>🎉 Enjoy Event</div>

</div>

<h2 className="section-title">

Platform Highlights

</h2>

<div className="stats">

<div>

<h1>15+</h1>

<p>Events</p>

</div>

<div>

<h1>8+</h1>

<p>Cities</p>

</div>

<div>

<h1>5</h1>

<p>Categories</p>

</div>

<div>

<h1>100%</h1>

<p>Digital Tickets</p>

</div>

</div>

<div className="cta">

<h2>

Ready to Experience Something Amazing?

</h2>

<p>

Explore events, reserve your seats and enjoy unforgettable moments.

</p>

<a href="/events">

<button>

Explore Events

</button>

</a>

</div>

</div>

<Footer/>

</>

)

}

export default Features;