import React from "react";
import "../styles/eventDetails.css";
import { useLocation, useNavigate } from "react-router-dom";

import Navbar from "../components/navbar";
import Footer from "../components/footer";

function EventDetails() {

  const navigate = useNavigate();
  const location = useLocation();

  const event = location.state?.event;

  if (!event) {
    return (
      <>
        <Navbar />

        <h1>No Event Selected</h1>

        <Footer />
      </>
    );
  }

  // ==========================================
  // IMAGE HANDLER
  // Supports old + hosted events
  // ==========================================

  const getEventImage = (image) => {

    if (!image) {
      return "/images/event-placeholder.webp";
    }

    // Full URL
    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    // Frontend image
    if (image.startsWith("/images/")) {
      return image;
    }

    if (image.startsWith("images/")) {
      return `/${image}`;
    }

    // Backend uploads
    if (image.startsWith("/uploads/")) {
      return `https://theshowspot-backend.onrender.com${image}`;
    }

    if (image.startsWith("uploads/")) {
      return `https://theshowspot-backend.onrender.com/${image}`;
    }

    // Hosted event stores filename only
    return `https://theshowspot-backend.onrender.com/uploads/${image}`;
  };


  // ==========================================
  // TIME HANDLER
  // Supports old + hosted events
  // ==========================================

  const getEventTime = () => {

    if (event.startTime) {

      if (event.endTime) {
        return `${event.startTime} - ${event.endTime}`;
      }

      return event.startTime;
    }

    if (event.time) {
      return event.time;
    }

    if (event.eventTime) {
      return event.eventTime;
    }

    return "Time not provided";
  };


  // ==========================================
  // LOCATION HANDLER
  // ==========================================

  const getEventLocation = () => {
    return event.location || event.city || "Location not provided";
  };


  // ==========================================
  // IMAGE FALLBACK
  // ==========================================

  const handleImageError = (e) => {

    if (
      e.target.src.includes("event-placeholder.webp")
    ) {
      return;
    }

    e.target.onerror = null;

    e.target.src =
      "/images/event-placeholder.webp";
  };


  // ==========================================
  // BOOKING
  // ==========================================

  const handleBooking = () => {

    const isLoggedIn =
      localStorage.getItem("isLoggedIn");

    if (isLoggedIn === "true") {

      navigate("/booking", {
        state: { event }
      });

    } else {

      navigate("/login", {
        state: {
          event,
          returnTo: "/booking"
        }
      });

    }
  };


  return (
    <>
      <Navbar />

      <div className="details-container">

        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>


        <div className="details-card">

          <img
            src={getEventImage(event.image)}
            className="details-img"
            alt={event.name}
            onError={handleImageError}
          />


          <div className="details-info">

            <h1>
              {event.name}
            </h1>


            <p>
              📍 {getEventLocation()}
            </p>


            <p>
              🗓 {event.date || "Date not provided"}
            </p>


            <p>
              ⏰ {getEventTime()}
            </p>


            <h2>
              ₹{event.price ?? event.ticketPrice ?? 0}
            </h2>


            <p>
              {event.description ||
                "Experience an amazing event with TheShowSpot. Enjoy unforgettable moments with your friends and family."
              }
            </p>


            <button onClick={handleBooking}>
              Book Tickets
            </button>

          </div>

        </div>

      </div>

      <Footer />
    </>
  );
}

export default EventDetails;