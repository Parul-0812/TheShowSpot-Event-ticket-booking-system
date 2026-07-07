import "../styles/homepage.css";
import { Link, useNavigate } from "react-router-dom";
import React,{useState} from "react";

function homepage(){
    const navigate = useNavigate();
const [city,setCity] = useState("Select City");

const [showCity,setShowCity] = useState(false);
const login = localStorage.getItem("isLoggedIn");


const logout = ()=>{

    localStorage.removeItem("isLoggedIn");

    navigate("/login");

}

    return(

        <>
{/* <!-- ================= CITY SELECTION POPUP ================= --> */}
{

showCity &&

<div className="city-popup">
        <div className="city-box">
            <h1>Welcome to TheShowSpot 🎟️</h1>
            <p>Select your city to discover amazing events near you</p>


            <input type="text" placeholder="Search for your city..." className="city-search"/>

            <h3>Popular Cities</h3>

            <div className="city-list">

                <div 
className="city"

onClick={()=>{

setCity("Mumbai");

setShowCity(false);

}}

>
                    <img src="/images/bombay.png" alt="Mumbai"/>
                    <p>Mumbai</p>
                </div>

                <div 
className="city"

onClick={()=>{

setCity("New Delhi");

setShowCity(false);

}}

>
                    <img src="/images/new delhi.png" alt="New Delhi"/>
                    <p>New Delhi</p>
                </div>

                <div className="city" onClick={()=>{setCity("Hyderabad"); setShowCity(false);}}>
                    <img src="/images/hyderabad-charminar.png" alt="Hyderabad"/>
                    <p>Hyderabad</p>
                </div>

                <div className="city" onClick={()=>{setCity("Kolkata"); setShowCity(false);}}>
                    <img src="/images/kolkata.png" alt="Kolkata"/>
                    <p>Kolkata</p>
                </div>

                <div className="city" onClick={()=>{setCity("Pune"); setShowCity(false);}}>
                    <img src="/images/pune.png" alt="Pune"/>
                    <p>Pune</p>
                </div>

                <div className="city" onClick={()=>{setCity("Shimla"); setShowCity(false);}}>
                    <img src="/images/shimla.png" alt="Shimla"/>
                    <p>Shimla</p>
                </div>

                <div className="city" onClick={()=>{setCity("Chandigarh"); setShowCity(false);}}>
                    <img src="/images/chandigarh.png" alt="Chandigarh"/>
                    <p>Chandigarh</p>
                </div>

                <div className="city" onClick={()=>{setCity("Jalandhar"); setShowCity(false);}}>
                    <img src="/images/jalandhar.png" alt="Jalandhar"/>
                    <p>Jalandhar</p>
                </div>

                <div className="city" onClick={()=>{setCity("Gangtok"); setShowCity(false);}}>
                    <img src="/images/gangtok.png" alt="Gangtok"/>
                    <p>Gangtok</p>
                </div>

            </div>
        </div>
    </div>
}
{/* <!-- Navigation Bar --> */}

<header>

    <nav className="navbar">

        <Link to="/" className="logo">

🎟️ TheShowSpot

</Link>


        <div className="search-box">

            <input type="text" placeholder="Search events, venues, artists..."/>

        </div>

        <div className="nav-right">

            <p 
className="selected-city"
onClick={()=>setShowCity(true)}
>

{city}

</p>

        {

login

?

<>

<Link to="/myBookings">

<button className="login-btn">
My Tickets
</button>

</Link>


<Link to="/notifications">

<button className="login-btn">
🔔
</button>

</Link>


<button 
className="login-btn"
onClick={logout}
>

Logout

</button>


</>


:


<Link to="/login">

<button className="login-btn">
Login
</button>

</Link>


}
        </div>
    </nav>

    <div className="category-bar">


    <Link to="/events">Concerts</Link>

    <Link to="/events">Comedy</Link>

    <Link to="/events">Sports</Link>

    <Link to="/events">Festivals</Link>

    <Link to="/events">Workshops</Link>


</div>
</header>

    {/* <!-- Homepage sections will start below this later --> */}

    {/* ================= HERO SECTION ================= */}


<section className="main-section">

    <div className="main-content">
        <h1>
            Discover Events That Match Your Vibe
        </h1>

        <p>
            Explore concerts, comedy shows, sports events, festivals and workshops happening near you. Book your tickets easily and enjoy unforgettable experiences.
        </p>

        <Link to="/events">

            <button className="explore-btn">

                Explore Events

            </button>

        </Link>

    </div>

    {/* <!-- Right side image --> */}
    <div className="main-image">
        <img src="/images/event illustrations.avif" alt="Event Illustration"/>
    </div>

</section>


{/* </main> */}


{/* // <!-- ============== EVENTS SECTION ============== --> */}


<section className="events-section">


    <h2>Popular Events</h2>



    <div className="event-container">



        <div className="event-card">


            <img src="/images/music night.webp" alt="Concert"/>


            <h3>Music Night Live</h3>


            <p>Concert</p>

            <p>📍 Chandigarh</p>

            <p>📅 20 July 2026</p>


            <h4>₹799</h4>


            <a href="event-details.html">

    <button>

        Book Now

    </button>

</a>


        </div>





        <div className="event-card">


            <img src="/images/standup.jpg" alt="Comedy"/>


            <h3>Stand Up Evening</h3>


            <p>Comedy Show</p>

            <p>📍 Delhi</p>

            <p>📅 25 July 2026</p>


            <h4>₹499</h4>


            <Link to="event-details.html">

    <button>

        Book Now

    </button>

</Link>


        </div>





        <div className="event-card">


            <img src="/images/workshop.jpg" alt="Workshop"/>


            <h3>Web Development Workshop</h3>


            <p>Workshop</p>

            <p>📍 Bangalore</p>

            <p>📅 1 August 2026</p>


            <h4>₹299</h4>


            <Link to="event-details.html">

    <button>

        Book Now

    </button>

</Link>


        </div>



    </div>



</section>

{/* <!--working?--> */}


<section className="steps-section">


    <h2>How TheShowSpot Works</h2>



    <div className="steps-container">



        {/* <!-- Explore Events --> */}


        <Link to="/events" className="step-card">


            <h1>🔍</h1>


            <h3>Explore Events</h3>


            <p>

                Browse concerts, comedy shows, sports events
                and workshops happening near you.

            </p>


        </Link>






        {/* <!-- Book Tickets --> */}


        <Link to="/events" className="step-card">


            <h1>🎟️</h1>


            <h3>Book Tickets</h3>


            <p>

                Choose your event, select tickets and complete
                your booking easily.

            </p>


        </Link>







        {/* <!-- QR Pass --> */}


        <Link to="/ticket" className="step-card">


            <h1>📱</h1>


            <h3>Get QR Pass</h3>


            <p>

                Receive your digital ticket and verify entry
                using QR code scanning.

            </p>


        </Link>




    </div>



</section>

{/* <!--footer--> */}


<footer className="footer">


    <div className="footer-content">


        <div className="footer-about">


            <h2>🎟️ TheShowSpot</h2>


            <p>
                Discover events, book tickets and enjoy amazing experiences with easy digital booking.
            </p>


        </div>





        <div className="footer-links">


            <h3>Quick Links</h3>


            <Link to="/" className="footer-link">
                Home
            </Link>

            <Link to="/events" className="footer-link">
                Events
            </Link>

            <Link to="/ticket" className="footer-link">
                My Tickets
            </Link>

            <Link to="/login" className="footer-link">
                Login
            </Link>


        </div>





        <div className="footer-links">


            <h3>Categories</h3>


            <Link to="/categories/concerts" className="footer-link">
                Concerts
            </Link>

            <Link to="/categories/comedy" className="footer-link">
                Comedy
            </Link>

            <Link to="/categories/sports" className="footer-link">
                Sports
            </Link>

            <Link to="/categories/workshops" className="footer-link">
                Workshops
            </Link>


        </div>



    </div>



    <p className="copyright">

        © 2026 TheShowSpot | All Rights Reserved

    </p>



</footer>


        </>

    )


}


export default homepage;