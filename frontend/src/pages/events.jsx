import "../styles/events.css";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/navbar";

function Events() {

    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState("");

    const location = useLocation();

    const selectedCity = localStorage.getItem("city");


    // ==========================================
    // FETCH EVENTS
    // ==========================================

    useEffect(() => {

        const getEvents = async () => {

            try {

                const result = await axios.get(
                    "http://localhost:5000/events/all"
                );

                setEvents(result.data.data || []);

            }

            catch (error) {

                console.log("Error fetching events:", error);

            }

        };

        getEvents();

    }, []);


    // ==========================================
    // SCROLL TO CATEGORY
    // ==========================================

    useEffect(() => {

        if (location.hash) {

            const section = document.querySelector(location.hash);

            if (section) {

                setTimeout(() => {

                    section.scrollIntoView({
                        behavior: "smooth"
                    });

                }, 100);

            }

        }

    }, [location]);


    // ==========================================
    // IMAGE HANDLER
    // Supports old + hosted + future S3 images
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


        // Already an absolute frontend image path
        if (image.startsWith("/images/")) {

            return image;

        }


        // "images/filename.jpg"
        if (image.startsWith("images/")) {

            return `/${image}`;

        }


        // Already an uploads path
        if (image.startsWith("/uploads/")) {

            return `http://localhost:5000${image}`;

        }


        // "uploads/filename.jpg"
        if (image.startsWith("uploads/")) {

            return `http://localhost:5000/${image}`;

        }


        // Filename only
        // This is what HostEvent currently stores
        return `http://localhost:5000/uploads/${image}`;

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

        e.target.src = "/images/event-placeholder.webp";

    };


    // ==========================================
    // TIME HANDLER
    // Supports old + new events
    // ==========================================

    const getEventTime = (event) => {

        // New hosted events
        if (event.startTime) {

            if (event.endTime) {

                return `${event.startTime} - ${event.endTime}`;

            }

            return event.startTime;

        }


        // Older events may have a "time" field
        if (event.time) {

            return event.time;

        }


        // Other possible old field
        if (event.eventTime) {

            return event.eventTime;

        }


        return "Time not provided";

    };


    // ==========================================
    // LOCATION HANDLER
    // ==========================================

    const getEventLocation = (event) => {

        return event.location || event.city || "Location not provided";

    };


    // ==========================================
    // SEARCH + FILTER
    // ==========================================

    const showEvents = (category) => {

        return events

            .filter((event) => {

                const eventLocation = getEventLocation(event);

                const eventName =
                    event.name || "";

                const eventCategory =
                    event.category || "";

                const matchesCategory =
                    eventCategory === category;


                const matchesCity =
                    selectedCity === null ||
                    selectedCity === "" ||
                    eventLocation === selectedCity;


                const searchValue =
                    search.toLowerCase();


                const matchesSearch =

                    eventName
                        .toLowerCase()
                        .includes(searchValue)

                    ||

                    eventLocation
                        .toLowerCase()
                        .includes(searchValue)

                    ||

                    eventCategory
                        .toLowerCase()
                        .includes(searchValue);


                return (
                    matchesCategory &&
                    matchesCity &&
                    matchesSearch
                );

            })

            .map((event) => (

                <div
                    className="event-card"
                    key={event._id}
                >

                    {/* EVENT IMAGE */}

                    <img
                        src={getEventImage(event.image)}
                        alt={event.name}
                        onError={handleImageError}
                    />


                    {/* EVENT NAME */}

                    <h3>
                        {event.name}
                    </h3>


                    {/* LOCATION */}

                    <p>
                        📍 {getEventLocation(event)}
                    </p>


                    {/* DATE */}

                    <p>
                        📅 {event.date || "Date not provided"}
                    </p>


                    {/* TIME */}

                    <p>
                        ⏰ {getEventTime(event)}
                    </p>


                    {/* PRICE */}

                    <h4>
                        Starting at ₹{event.price ?? event.ticketPrice ?? 0}
                    </h4>


                    {/* VIEW DETAILS */}

                    <Link
                        to="/eventDetails"
                        state={{
                            event: event
                        }}
                    >

                        <button>
                            View Details
                        </button>

                    </Link>

                </div>

            ));

    };


    // ==========================================
    // CHECK IF CATEGORY HAS EVENTS
    // ==========================================

    const hasEvents = (category) => {

        return events.some((event) => {

            const eventLocation =
                getEventLocation(event);


            const matchesCity =
                selectedCity === null ||
                selectedCity === "" ||
                eventLocation === selectedCity;


            return (
                event.category === category &&
                matchesCity
            );

        });

    };


    return (

        <>

            <Navbar />


            {/* ==========================================
                CATEGORY BAR
            ========================================== */}

            <div className="category-bar">

                <Link to="/events#movies">
                    Movies
                </Link>

                <Link to="/events#concerts">
                    Concerts
                </Link>

                <Link to="/events#shows">
                    Shows
                </Link>

                <Link to="/events#sports">
                    Sports
                </Link>

                <Link to="/events#workshops">
                    Workshops
                </Link>

            </div>


            {/* ==========================================
                EVENTS SECTION
            ========================================== */}

            <section className="all-events-section">


                <h1>

                    Explore Events

                    {selectedCity &&
                        ` in ${selectedCity}`
                    }

                </h1>


                <p className="event-heading-text">

                    Discover movies, concerts, shows
                    and workshops happening near you.

                </p>


                {/* ==========================================
                    SEARCH
                ========================================== */}

                <div className="event-search">

                    <input
                        type="text"
                        placeholder="Search events..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>


                {/* ==========================================
                    MOVIES
                ========================================== */}

                {hasEvents("Movies") && (

                    <div
                        className="event-category"
                        id="movies"
                    >

                        <h2>
                            🎬 Movies
                        </h2>


                        <div className="event-container">

                            {showEvents("Movies")}

                        </div>

                    </div>

                )}


                {/* ==========================================
                    CONCERTS
                ========================================== */}

                {hasEvents("Concerts") && (

                    <div
                        className="event-category"
                        id="concerts"
                    >

                        <h2>
                            🎤 Concerts
                        </h2>


                        <div className="event-container">

                            {showEvents("Concerts")}

                        </div>

                    </div>

                )}


                {/* ==========================================
                    SHOWS
                ========================================== */}

                {hasEvents("Shows") && (

                    <div
                        className="event-category"
                        id="shows"
                    >

                        <h2>
                            🎭 Shows
                        </h2>


                        <div className="event-container">

                            {showEvents("Shows")}

                        </div>

                    </div>

                )}


                {/* ==========================================
                    SPORTS
                ========================================== */}

                {hasEvents("Sports") && (

                    <div
                        className="event-category"
                        id="sports"
                    >

                        <h2>
                            ⚽ Sports
                        </h2>


                        <div className="event-container">

                            {showEvents("Sports")}

                        </div>

                    </div>

                )}


                {/* ==========================================
                    WORKSHOPS
                ========================================== */}

                {hasEvents("Workshops") && (

                    <div
                        className="event-category"
                        id="workshops"
                    >

                        <h2>
                            💻 Workshops
                        </h2>


                        <div className="event-container">

                            {showEvents("Workshops")}

                        </div>

                    </div>

                )}


                {/* ==========================================
                    NO EVENTS
                ========================================== */}

                {events.length > 0 &&

                    !events.some((event) => {

                        const eventLocation =
                            getEventLocation(event);

                        const matchesCity =
                            selectedCity === null ||
                            selectedCity === "" ||
                            eventLocation === selectedCity;

                        const searchValue =
                            search.toLowerCase();

                        return (

                            matchesCity &&

                            (
                                (event.name || "")
                                    .toLowerCase()
                                    .includes(searchValue)

                                ||

                                eventLocation
                                    .toLowerCase()
                                    .includes(searchValue)

                                ||

                                (event.category || "")
                                    .toLowerCase()
                                    .includes(searchValue)
                            )

                        );

                    }) && (

                    <div className="no-events">

                        <h2>
                            No events found
                        </h2>

                        <p>
                            Try searching for another event
                            or explore a different category.
                        </p>

                    </div>

                )}

            </section>


            {/* ==========================================
                FOOTER
            ========================================== */}

            <footer className="footer">

                <div className="footer-content">


                    <div className="footer-about">

                        <h2>
                            🎟️ TheShowSpot
                        </h2>

                        <p>
                            Discover events, book tickets
                            and enjoy amazing experiences
                            with easy digital booking.
                        </p>

                    </div>


                    <div className="footer-links">

                        <h3>
                            Quick Links
                        </h3>

                        <Link to="/">
                            Home
                        </Link>

                        <Link to="/events">
                            Events
                        </Link>

                        <Link to="/tickets">
                            My Tickets
                        </Link>

                        <Link to="/login">
                            Login
                        </Link>

                    </div>


                    <div className="footer-links">

                        <h3>
                            Categories
                        </h3>

                        <Link to="/events#concerts">
                            Concerts
                        </Link>

                        <Link to="/events#shows">
                            Shows
                        </Link>

                        <Link to="/events#sports">
                            Sports
                        </Link>

                        <Link to="/events#workshops">
                            Workshops
                        </Link>

                    </div>


                </div>


                <p className="copyright">

                    © 2026 TheShowSpot | All Rights Reserved

                </p>


            </footer>

        </>

    );

}


export default Events;