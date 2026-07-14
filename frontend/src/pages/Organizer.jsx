import React from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/navbar";
import Footer from "../components/footer";

import "../styles/organizer.css";

function Organizer(){

const navigate = useNavigate();

return(

<>

<Navbar/>

{/* ================= HERO ================= */}

<section className="organizer-hero">

<div className="hero-overlay">

<div className="hero-content">

<h1>

Host Your Event

</h1>

<p>

Turn your ideas into unforgettable experiences with
TheShowSpot.

Whether it's a concert, comedy show, workshop,
college fest or sports event, we help you reach
thousands of attendees effortlessly.

</p>

<div className="hero-buttons">

<button
className="primary-btn"
onClick={()=>navigate("/host-event")}
>

Become an Organizer

</button>

<button
className="secondary-btn"
onClick={()=>navigate("/events")}
>

Explore Events

</button>

</div>

</div>

</div>

</section>

{/* ================= WHY HOST ================= */}

<section className="why-host">

<div className="section-title">

<h2>

Why Host With TheShowSpot?

</h2>

<p>

Everything you need to create successful events.

</p>

</div>

<div className="feature-grid">

<div className="feature-card">

<div className="feature-icon">

🎟

</div>

<h3>

Easy Ticketing

</h3>

<p>

Create your event in minutes and let attendees
book tickets instantly.

</p>

</div>

<div className="feature-card">

<div className="feature-icon">

📈

</div>

<h3>

Reach More People

</h3>

<p>

Your event gets exposure to thousands of users
looking for exciting experiences.

</p>

</div>

<div className="feature-card">

<div className="feature-icon">

💳

</div>

<h3>

Secure Payments

</h3>

<p>

Receive bookings through a smooth and secure
payment experience.

</p>

</div>

<div className="feature-card">

<div className="feature-icon">

📊

</div>

<h3>

Real-Time Analytics

</h3>

<p>

Track bookings, attendance and ticket sales
through your organizer dashboard.

</p>

</div>

<div className="feature-card">

<div className="feature-icon">

🎯

</div>

<h3>

Easy Management

</h3>

<p>

Manage your events from one place without any
technical knowledge.

</p>

</div>

<div className="feature-card">

<div className="feature-icon">

🤝

</div>

<h3>

Dedicated Support

</h3>

<p>

Our team helps you throughout the approval
and publishing process.

</p>

</div>

</div>

</section>

{/* ================= STATISTICS ================= */}

<section className="statistics">

<div className="section-title">

<h2>

Trusted by Event Organizers Across India

</h2>

<p>

Growing every day with successful events and happy attendees.

</p>

</div>

<div className="stats-container">


<div className="stat-card">

<h1>15+</h1>

<p>Events Hosted</p>

</div>

<div className="stat-card">

<h1>10+</h1>

<p>Cities Covered</p>

</div>

<div className="stat-card">

<h1>5</h1>

<p>Categories</p>

</div>

</div>

</section>

{/* ================= BENEFITS ================= */}

<section className="benefits">

<div className="benefits-left">

<img

src="/images/organize.webp"

alt="Event Organizer"

/>

</div>

<div className="benefits-right">

<h2>

Everything You Need To Host Successful Events

</h2>

<p>

From publishing your event to managing bookings,
TheShowSpot provides everything required to make your
event a success.

</p>

<div className="benefit-list">

<div className="benefit-item">

<span>✔</span>

<p>Easy Event Creation</p>

</div>

<div className="benefit-item">

<span>✔</span>

<p>Real-Time Booking Management</p>

</div>

<div className="benefit-item">

<span>✔</span>

<p>Secure Online Ticketing</p>

</div>

<div className="benefit-item">

<span>✔</span>

<p>QR Based Ticket Verification</p>

</div>

<div className="benefit-item">

<span>✔</span>

<p>Revenue & Booking Analytics</p>

</div>

</div>

</div>

</section>


{/* ================= FAQ ================= */}

<section className="faq-section">

<div className="section-title">

<h2>

Frequently Asked Questions

</h2>

<p>

Everything you need to know before hosting your event.

</p>

</div>

<div className="faq-container">

<div className="faq-item">

<h3>

How long does event approval take?

</h3>

<p>

Most events are reviewed within 24 hours after submission.
Our team checks all event details before publishing.

</p>

</div>


<div className="faq-item">

<h3>

Do I need to pay to host an event?

</h3>

<p>

No. Hosting your event on TheShowSpot is completely free.

</p>

</div>

<div className="faq-item">

<h3>

When will my event appear on the website?

</h3>

<p>

Immediately after it has been approved by our
administration team.

</p>

</div>

</div>

</section>

{/* ================= FINAL CTA ================= */}

<section className="final-cta">

<div className="cta-overlay">

<h2>

Ready to Create Something Amazing?

</h2>

<p>

Join hundreds of organizers who trust
TheShowSpot for creating unforgettable
experiences.

</p>

<button

className="cta-btn"

onClick={()=>navigate("/host-event")}

>

Start Hosting Today

</button>

</div>

</section>

{/* ================= CONTACT ================= */}

<section className="organizer-contact">

<div className="contact-box">

<h2>

Need Help Before Hosting?

</h2>

<p>

Have questions regarding event approval,
ticketing or event management?

Our support team is always happy to help.

</p>

<div className="contact-details">

<div>

📧 support@theshowspot.com

</div>

<div>

📞  +91 98765 432XX

</div>

<div>

🕒 Mon - Sat | 9 AM - 7 PM

</div>

</div>

</div>

</section>

<Footer/>

</>

);

}

export default Organizer;