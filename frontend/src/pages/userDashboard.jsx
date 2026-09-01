import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import UserSidebar from "../components/userSidebar";
import UserNavbar from "../components/userNavbar";

import "../styles/userDashboard.css";


function UserDashboard() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user")
    );


    const [bookings, setBookings] = useState([]);

    const [events, setEvents] = useState([]);

    const [hostedRequests, setHostedRequests] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [
        selectedHostedEvent,
        setSelectedHostedEvent
    ] = useState(null);


    // ===============================
    // Fetch Dashboard Data
    // ===============================

    useEffect(() => {

        if(!user?._id) {

            navigate("/login");

            return;

        }


        const fetchData = async () => {

            try {

                const [
                    bookingResult,
                    eventResult,
                    hostedResult
                ] = await Promise.all([

                    axios.get(
                        `http://localhost:5000/booking/user/${user._id}`
                    ),

                    axios.get(
                        "http://localhost:5000/events/all"
                    ),

                    axios.get(
                        `http://localhost:5000/event-request/user/${user._id}`
                    )

                ]);


                setBookings(
                    bookingResult.data.data || []
                );


                setEvents(
                    eventResult.data.data || []
                );


                setHostedRequests(
                    hostedResult.data.data || []
                );

            }

            catch(error) {

                console.log(
                    "Dashboard Error:",
                    error
                );

            }

            finally {

                setLoading(false);

            }

        };


        fetchData();

    }, [user?._id, navigate]);


    // ===============================
    // Ticket Calculations
    // ===============================

    const validTickets = bookings.filter(
        booking =>
            booking.ticketStatus === "Valid"
    );


    const usedTickets = bookings.filter(
        booking =>
            booking.ticketStatus === "Used"
    );


    const totalSpent = bookings

        .filter(
            booking =>
                booking.paymentStatus ===
                "Successful"
        )

        .reduce(
            (sum, booking) =>
                sum +
                Number(booking.amount || 0) +
                20,
            0
        );


    // ===============================
    // Event Status
    // ===============================

    const getEventStatus = (booking) => {

        const eventDate =
            new Date(booking.eventDate);

        const now = new Date();


        if(
            booking.ticketStatus ===
            "Used"
        ) {
            return "Used";
        }


        if(
            booking.ticketStatus ===
            "Cancelled"
        ) {
            return "Cancelled";
        }


        if(eventDate < now) {

            return "Expired";

        }


        return "Valid";

    };


    const upcomingBookings =
        validTickets.filter(
            booking =>
                getEventStatus(booking) ===
                "Valid"
        );


    // ===============================
    // Discover Events
    // ===============================

    const discoverEvents = events

        .filter(event => {

            const eventDate =
                new Date(event.date);

            return eventDate >= new Date();

        })

        .slice(0, 4);


    // ===============================
    // Find Approved Event
    // ===============================

    const getApprovedEvent = (request) => {

        return events.find(
            event =>
                event.userId?.toString() ===
                    request.userId?.toString() &&
                event.name === request.name &&
                event.date === request.date
        );

    };


    // ===============================
    // Get Event Tickets
    // ===============================

    const getHostedEventStats = (event) => {

        if(!event) {

            return {
                ticketsSold: 0,
                revenue: 0
            };

        }


        const eventBookings =
            bookings.filter(
                booking =>
                    booking.eventName ===
                        event.name &&
                    booking.paymentStatus ===
                        "Successful"
            );


        const ticketsSold =
            eventBookings.reduce(
                (total, booking) =>
                    total +
                    (booking.seats?.length || 0),
                0
            );


        const revenue =
            ticketsSold *
            Number(event.price || 0);


        return {
            ticketsSold,
            revenue
        };

    };


    // ===============================
    // Loading
    // ===============================

    if(loading) {

        return (

            <div className="dashboard-loading">

                Loading your dashboard...

            </div>

        );

    }


    return (

        <div className="user-dashboard-layout">

            <UserSidebar />


            <div className="user-dashboard-main">

                <UserNavbar />


                <div className="user-dashboard-content">


                    {/* ===============================
                        WELCOME
                    =============================== */}

                    <div className="dashboard-welcome">

                        <div>

                            <p className="welcome-small">
                                Welcome back
                            </p>

                            <h1>
                                {user?.name || "User"} 👋
                            </h1>

                            <p>
                                Ready for your next experience?
                            </p>

                        </div>


                        <button
                            onClick={() =>
                                navigate("/events")
                            }
                        >
                            Explore Events
                        </button>

                    </div>


                    {/* ===============================
                        STATS
                    =============================== */}

                    <div className="dashboard-stats">


                        <div className="dashboard-stat-card">

                            <span>
                                🎟️
                            </span>

                            <div>

                                <h3>
                                    {bookings.length}
                                </h3>

                                <p>
                                    Total Bookings
                                </p>

                            </div>

                        </div>


                        <div className="dashboard-stat-card">

                            <span>
                                📅
                            </span>

                            <div>

                                <h3>
                                    {upcomingBookings.length}
                                </h3>

                                <p>
                                    Upcoming Events
                                </p>

                            </div>

                        </div>


                        <div className="dashboard-stat-card">

                            <span>
                                🎫
                            </span>

                            <div>

                                <h3>
                                    {usedTickets.length}
                                </h3>

                                <p>
                                    Used Tickets
                                </p>

                            </div>

                        </div>


                        <div className="dashboard-stat-card">

                            <span>
                                💰
                            </span>

                            <div>

                                <h3>
                                    ₹{totalSpent}
                                </h3>

                                <p>
                                    Total Spent
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* ===============================
                        UPCOMING EVENTS
                    =============================== */}

                    <div className="dashboard-section">

                        <div className="section-heading">

                            <h2>
                                Upcoming Events
                            </h2>

                            <button
                                onClick={() =>
                                    navigate("/my-tickets")
                                }
                            >
                                View All →
                            </button>

                        </div>


                        {upcomingBookings.length === 0 ? (

                            <div className="empty-dashboard">

                                <h3>
                                    No upcoming events
                                </h3>

                                <p>
                                    Discover an event and
                                    make your next memory.
                                </p>

                                <button
                                    onClick={() =>
                                        navigate("/events")
                                    }
                                >
                                    Explore Events
                                </button>

                            </div>

                        ) : (

                            <div className="dashboard-ticket-grid">

                                {upcomingBookings
                                    .slice(0, 3)
                                    .map(booking => (

                                    <div
                                        className="dashboard-ticket-card"
                                        key={booking._id}
                                    >

                                        <div className="ticket-status valid">
                                            🟢 VALID
                                        </div>


                                        <h3>
                                            {booking.eventName}
                                        </h3>


                                        <p>
                                            📅 {booking.eventDate}
                                        </p>


                                        <p>
                                            📍 {booking.eventLocation}
                                        </p>


                                        <p>
                                            💺 {booking.seats?.join(", ")}
                                        </p>


                                        <div className="dashboard-ticket-bottom">

                                            <strong>
                                                ₹
                                                {Number(
                                                    booking.amount
                                                ) + 20}
                                            </strong>


                                            <button
                                                onClick={() => {

                                                    navigate(
                                                        "/ticket",
                                                        {
                                                            state: {
                                                                ...booking,
                                                                ticketId:
                                                                    booking._id
                                                            }
                                                        }
                                                    );

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


                    {/* ===============================
                        RECENT ACTIVITY
                    =============================== */}

                    <div className="dashboard-section">

                        <div className="section-heading">

                            <h2>
                                Recent Activity
                            </h2>

                            <button
                                onClick={() =>
                                    navigate("/my-bookings")
                                }
                            >
                                View All →
                            </button>

                        </div>


                        {bookings.length === 0 ? (

                            <div className="empty-dashboard">

                                <p>
                                    Your booking history
                                    will appear here.
                                </p>

                            </div>

                        ) : (

                            <div className="recent-bookings">

                                {bookings
                                    .slice(0, 5)
                                    .map(booking => (

                                    <div
                                        className="recent-booking"
                                        key={booking._id}
                                    >

                                        <div>

                                            <h4>
                                                {booking.eventName}
                                            </h4>

                                            <p>
                                                {booking.eventDate}
                                            </p>

                                        </div>


                                        <div>

                                            <strong>
                                                ₹
                                                {Number(
                                                    booking.amount
                                                ) + 20}
                                            </strong>


                                            <span
                                                className={
                                                    booking.paymentStatus ===
                                                    "Successful"
                                                        ? "booking-payment-success"
                                                        : "booking-payment-failed"
                                                }
                                            >
                                                {booking.paymentStatus ||
                                                    "Pending"}
                                            </span>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                    </div>


                    {/* ==================================================
                        MY HOSTED EVENTS
                    ================================================== */}

                    <div className="dashboard-section hosted-events-section">


                        <div className="section-heading">

                            <div>

                                <h2>
                                    My Hosted Events
                                </h2>

                                <p className="hosted-section-subtitle">
                                    Manage the events you've
                                    submitted and track their
                                    performance.
                                </p>

                            </div>


                            <button
                                className="host-event-dashboard-btn"
                                onClick={() =>
                                    navigate("/host-event")
                                }
                            >
                                + Host an Event
                            </button>

                        </div>


                        {hostedRequests.length === 0 ? (

                            <div className="hosted-empty">

                                <div className="hosted-empty-icon">
                                    🎪
                                </div>

                                <h3>
                                    You haven't hosted an event yet
                                </h3>

                                <p>
                                    Turn your idea into an
                                    experience and create
                                    something memorable with
                                    TheShowSpot.
                                </p>

                                <button
                                    onClick={() =>
                                        navigate("/host-event")
                                    }
                                >
                                    Host Your First Event
                                </button>

                            </div>

                        ) : (

                            <div className="hosted-events-grid">

                                {hostedRequests.map(request => {

                                    const approvedEvent =
                                        request.status ===
                                        "Approved"
                                            ? getApprovedEvent(request)
                                            : null;


                                    const stats =
                                        getHostedEventStats(
                                            approvedEvent
                                        );


                                    return (

                                        <div
                                            className="hosted-event-card"
                                            key={request._id}
                                        >


                                            <div className="hosted-event-image">

                                                {request.image ? (

                                                    <img
                                                        src={`http://localhost:5000/uploads/${request.image}`}
                                                        alt={request.name}
                                                    />

                                                ) : (

                                                    <div className="hosted-event-no-image">
                                                        🎪
                                                    </div>

                                                )}


                                                <span
                                                    className={`hosted-status ${request.status.toLowerCase()}`}
                                                >
                                                    {request.status ===
                                                        "Approved"
                                                        ? "🟢 Approved"
                                                        : request.status ===
                                                          "Rejected"
                                                            ? "🔴 Rejected"
                                                            : "🟡 Pending"
                                                    }
                                                </span>

                                            </div>


                                            <div className="hosted-event-info">


                                                <h3>
                                                    {request.name}
                                                </h3>


                                                <p>
                                                    🎭 {request.category}
                                                </p>


                                                <p>
                                                    📅 {request.date}
                                                </p>


                                                <p>
                                                    📍 {request.city}
                                                </p>


                                                {request.status ===
                                                    "Approved" && (

                                                    <div className="hosted-mini-stats">

                                                        <div>

                                                            <strong>
                                                                {stats.ticketsSold}
                                                            </strong>

                                                            <span>
                                                                Tickets Sold
                                                            </span>

                                                        </div>


                                                        <div>

                                                            <strong>
                                                                ₹
                                                                {stats.revenue}
                                                            </strong>

                                                            <span>
                                                                Revenue
                                                            </span>

                                                        </div>

                                                    </div>

                                                )}


                                                <button
                                                    className="hosted-view-btn"
                                                    onClick={() =>
                                                        setSelectedHostedEvent(
                                                            {
                                                                request,
                                                                event:
                                                                    approvedEvent,
                                                                stats
                                                            }
                                                        )
                                                    }
                                                >
                                                    View Details
                                                </button>

                                            </div>

                                        </div>

                                    );

                                })}

                            </div>

                        )}

                    </div>


                    {/* ===============================
                        DISCOVER EVENTS
                    =============================== */}

                    <div className="dashboard-section">

                        <div className="section-heading">

                            <h2>
                                Discover Events
                            </h2>

                            <button
                                onClick={() =>
                                    navigate("/events")
                                }
                            >
                                View All →
                            </button>

                        </div>


                        <div className="discover-grid">

                            {discoverEvents.map(event => (

                                <div
                                    className="discover-card"
                                    key={event._id}
                                >

                                    <img
                                        src={event.image}
                                        alt={event.name}
                                    />


                                    <div className="discover-card-info">

                                        <h3>
                                            {event.name}
                                        </h3>


                                        <p>
                                            📍 {event.location}
                                        </p>


                                        <p>
                                            📅 {event.date}
                                        </p>


                                        <strong>
                                            ₹{event.price}
                                        </strong>


                                        <button
                                            onClick={() => {

                                                navigate(
                                                    "/event-details",
                                                    {
                                                        state: {
                                                            event
                                                        }
                                                    }
                                                );

                                            }}
                                        >
                                            View Event
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    </div>


                    {/* ===============================
                        ACCOUNT
                    =============================== */}

                    <div className="dashboard-account">

                        <div>

                            <h2>
                                Your Account
                            </h2>

                            <p>
                                👤 {user?.name}
                            </p>

                            <p>
                                ✉️ {user?.email}
                            </p>

                            <p>
                                📱
                                {user?.phone ||
                                    "Phone number not added"}
                            </p>

                        </div>


                        <button
                            onClick={() =>
                                navigate("/settings")
                            }
                        >
                            Manage Account
                        </button>

                    </div>

                </div>

            </div>


            {/* ==================================================
                HOSTED EVENT DETAILS MODAL
            ================================================== */}

            {selectedHostedEvent && (

                <div
                    className="hosted-modal-overlay"
                    onClick={() =>
                        setSelectedHostedEvent(null)
                    }
                >

                    <div
                        className="hosted-modal"
                        onClick={e =>
                            e.stopPropagation()
                        }
                    >

                        <button
                            className="hosted-modal-close"
                            onClick={() =>
                                setSelectedHostedEvent(null)
                            }
                        >
                            ×
                        </button>


                        <div className="hosted-modal-header">

                            <div>

                                <span
                                    className={`hosted-modal-status ${selectedHostedEvent.request.status.toLowerCase()}`}
                                >
                                    {selectedHostedEvent.request.status}
                                </span>

                                <h2>
                                    {selectedHostedEvent.request.name}
                                </h2>

                                <p>
                                    🎭
                                    {" "}
                                    {selectedHostedEvent.request.category}
                                </p>

                            </div>

                        </div>


                        <div className="hosted-modal-details">

                            <div className="hosted-detail-item">

                                <span>
                                    📅
                                </span>

                                <div>

                                    <small>
                                        Date
                                    </small>

                                    <strong>
                                        {selectedHostedEvent.request.date}
                                    </strong>

                                </div>

                            </div>


                            <div className="hosted-detail-item">

                                <span>
                                    🕐
                                </span>

                                <div>

                                    <small>
                                        Time
                                    </small>

                                    <strong>
                                        {
                                            selectedHostedEvent.request.startTime
                                        }
                                        {" - "}
                                        {
                                            selectedHostedEvent.request.endTime
                                        }
                                    </strong>

                                </div>

                            </div>


                            <div className="hosted-detail-item">

                                <span>
                                    📍
                                </span>

                                <div>

                                    <small>
                                        Venue
                                    </small>

                                    <strong>
                                        {
                                            selectedHostedEvent.request.venue
                                        },
                                        {" "}
                                        {
                                            selectedHostedEvent.request.city
                                        }
                                    </strong>

                                </div>

                            </div>


                            <div className="hosted-detail-item">

                                <span>
                                    🏠
                                </span>

                                <div>

                                    <small>
                                        Address
                                    </small>

                                    <strong>
                                        {
                                            selectedHostedEvent.request.address
                                        }
                                    </strong>

                                </div>

                            </div>


                            <div className="hosted-detail-item">

                                <span>
                                    🎟️
                                </span>

                                <div>

                                    <small>
                                        Ticket Price
                                    </small>

                                    <strong>
                                        ₹
                                        {
                                            selectedHostedEvent.request.ticketPrice
                                        }
                                    </strong>

                                </div>

                            </div>


                            <div className="hosted-detail-item">

                                <span>
                                    💺
                                </span>

                                <div>

                                    <small>
                                        Total Seats
                                    </small>

                                    <strong>
                                        {
                                            selectedHostedEvent.request.totalSeats
                                        }
                                    </strong>

                                </div>

                            </div>

                        </div>


                        <div className="hosted-modal-description">

                            <h3>
                                About the Event
                            </h3>

                            <p>
                                {
                                    selectedHostedEvent.request.description
                                }
                            </p>

                        </div>


                        {selectedHostedEvent.request.status ===
                            "Approved" && (

                            <div className="hosted-performance">

                                <h3>
                                    Event Performance
                                </h3>


                                <div className="hosted-performance-grid">

                                    <div>

                                        <span>
                                            🎟️
                                        </span>

                                        <strong>
                                            {
                                                selectedHostedEvent
                                                    .stats
                                                    .ticketsSold
                                            }
                                        </strong>

                                        <small>
                                            Tickets Sold
                                        </small>

                                    </div>


                                    <div>

                                        <span>
                                            💰
                                        </span>

                                        <strong>
                                            ₹
                                            {
                                                selectedHostedEvent
                                                    .stats
                                                    .revenue
                                            }
                                        </strong>

                                        <small>
                                            Revenue Generated
                                        </small>

                                    </div>

                                </div>

                            </div>

                        )}


                        {selectedHostedEvent.request.status ===
                            "Pending" && (

                            <div className="hosted-status-message pending">

                                🕐 Your event is currently
                                awaiting admin approval.

                            </div>

                        )}


                        {selectedHostedEvent.request.status ===
                            "Rejected" && (

                            <div className="hosted-status-message rejected">

                                ❌ Unfortunately, this event
                                was not approved by the
                                administrator.

                            </div>

                        )}

                    </div>

                </div>

            )}

        </div>

    );

}


export default UserDashboard;