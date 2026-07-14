import "../styles/homepage.css";
import { Link, useNavigate } from "react-router-dom";
import React,{useState} from "react";
import Footer from "../components/Footer";
// import Navbar from "../components/navbar";

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

setCity("Select City");

localStorage.removeItem("city");

setShowCity(false);

}}

>
<img src="/images/all cities.png" alt="All Cities"/>
<p>All Cities</p>

</div>

                <div className="city" onClick={()=>{setCity("Mumbai"); localStorage.setItem("city","Mumbai"); setShowCity(false);}}>
                    <img src="/images/bombay.png" alt="Mumbai"/>
                    <p>Mumbai</p>
                </div>

                <div className="city" onClick={()=>{setCity("Delhi"); localStorage.setItem("city","Delhi"); setShowCity(false);}}>
                    <img src="/images/new delhi.png" alt="New Delhi"/>
                    <p>New Delhi</p>
                </div>

                <div className="city" onClick={()=>{setCity("Hyderabad"); localStorage.setItem("city","Hyderabad"); setShowCity(false);}}>
                    <img src="/images/hyderabad-charminar.png" alt="Hyderabad"/>
                    <p>Hyderabad</p>
                </div>

                <div className="city" onClick={()=>{setCity("Kolkata"); localStorage.setItem("city","Kolkata"); setShowCity(false);}}>
                    <img src="/images/kolkata.png" alt="Kolkata"/>
                    <p>Kolkata</p>
                </div>


                <div className="city" onClick={()=>{setCity("Shimla"); localStorage.setItem("city","Shimla"); setShowCity(false);}}>
                    <img src="/images/shimla.png" alt="Shimla"/>
                    <p>Shimla</p>
                </div>

                <div className="city" onClick={()=>{setCity("Chandigarh"); localStorage.setItem("city","Chandigarh"); setShowCity(false);}}>
                    <img src="/images/chandigarh.png" alt="Chandigarh"/>
                    <p>Chandigarh</p>
                </div>
                <div className="city" onClick={()=>{setCity("Shillong"); localStorage.setItem("city","Shillong"); setShowCity(false);}}>
                    <img src="/images/shillong.png" alt="Shillong"/>
                    <p>Shillong</p>
                </div>

                <div className="city" onClick={()=>{setCity("Gangtok"); localStorage.setItem("city","Gangtok"); setShowCity(false);}}>
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

    <div className="page-navbar">
    
        <Link to="/">Home</Link>
    
        <Link to="/events">Events</Link>
        <Link to="/organizer">Host Your Event</Link>
    
        <Link to="/features" className="nav-link">
            Features
        </Link>
    
    </div>
    
</header>

    {/* <!-- Homepage sections will start below this later --> */}

    {/* ================= HERO SECTION ================= */}

<section className="hero">


<div className="hero-content">


<h1>
Discover Events That Match Your Vibe
</h1>


<p>

Explore concerts, comedy shows, sports events, festivals and workshops
happening near you. Book your tickets easily and create unforgettable memories.

</p>


<Link to="/events">

<button>
Explore Events
</button>

</Link>


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


            <Link
to="/eventDetails"
state={{
 event:{
   image:"/images/music night.webp",
   name:"Music Night Live",
   category:"Concert",
   location:"Chandigarh",
   date:"20 July 2026",
   time:"8 PM",
   price:"₹799"
 }
}}
>

<button>

Book Now

</button>

</Link>


        </div>





        <div className="event-card">


            <img src="/images/standup.jpg" alt="Comedy"/>


            <h3>Stand Up Evening</h3>


            <p>Comedy Show</p>

            <p>📍 Delhi</p>

            <p>📅 25 July 2026</p>


            <h4>₹499</h4>


            <Link
to="/eventDetails"
state={{
 event:{
   image:"/images/standup.jpg",
   name:"Stand Up Evening",
   category:"Comedy",
   location:"Delhi",
   date:"25 July 2026",
   time:"8 PM",
   price:"₹499"
 }
}}
>

<button>

Book Now

</button>

</Link>


        </div>

<div className="event-card">


            <img src="/images/badminton.jpg" alt="Sports"/>


            <h3>Badminton Premiere League</h3>


            <p>Sports</p>

            <p>📍 Kolkata</p>

            <p>📅 10 October 2026</p>


            <h4>₹399</h4>


            <Link
to="/eventDetails"
state={{
 event:{
   image:"/images/badminton.jpg",
   name:"Badminton Premiere League",
   category:"Sports",
   location:"Kolkata",
   date:"10 October 2026",
   time:"2 PM",
   price:"₹399"
 }
}}
>

<button>

Book Now

</button>

</Link>


        </div>





        <div className="event-card">


            <img src="/images/workshop.jpg" alt="Workshop"/>


            <h3>Web Development Workshop</h3>


            <p>Workshop</p>

            <p>📍 Mumbai</p>

            <p>📅 1 August 2026</p>


            <h4>₹299</h4>


            <Link
to="/eventDetails"
state={{
 event:{
   image:"/images/workshop.jpg",
   name:"Web Development Workshop",
   category:"Workshop",
   location:"Mumbai",
   date:"1 August 2026",
   time:"10 AM",
   price:"₹299"
 }
}}
>

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


        <Link to="/myBookings" className="step-card">


            <h1>📱</h1>


            <h3>Get QR Pass</h3>


            <p>

                Receive your digital ticket and verify entry
                using QR code scanning.

            </p>


        </Link>




    </div>



</section>
<section className="about-section">


<h2>
About TheShowSpot
</h2>


<h3>
Your gateway to unforgettable experiences
</h3>


<p>

From exciting concerts and movies to sports events and learning workshops,
TheShowSpot helps users discover events, reserve seats and enjoy a smooth
digital booking experience with secure QR based tickets.

</p>



<div className="about-stats">

    <div className="about-stat">
        <h1>15+</h1>
        <p>Events</p>
    </div>

    <div className="about-stat">
        <h1>8+</h1>
        <p>Cities</p>
    </div>

    <div className="about-stat">
        <h1>24/7</h1>
        <p>Digital Access</p>
    </div>

</div>



<div className="contact">

<span>📧 support@theshowspot.com</span>

<span>📞 +91 98765 432XX</span>


</div>



</section>
{/* <!--footer--> */}


<Footer />

        </>

    )


}


export default homepage;