import "../styles/events.css";
import { Link } from "react-router-dom";

function events(){

    return(
        <>


{/* <!-- ================= NAVBAR ================= --> */}


<header>


    <nav className="navbar">


        <Link to="/" className="logo">

            🎟️ TheShowSpot

        </Link>



        <div className="search-box">


            <input type="text" placeholder="Search events, venues, artists..."/>


        </div>




        <div className="nav-right">


            <p>Select City</p>

        <Link to="/login">
            <button className="login-btn">

                Login

            </button>
        </Link>

        </div>



    </nav>





    <div className="category-bar">


        <Link to="#movies" className="category-link">
            Movies
        </Link>

        <Link to="#concerts" className="category-link">
            Concerts
        </Link>

        <Link to="#shows" className="category-link">
            Shows
        </Link>

        <Link to="#sports" className="category-link">
            Sports
        </Link>

        <Link to="#workshops" className="category-link">
            Workshops
        </Link>


    </div>



</header>







{/* <!-- ================= EVENTS ================= --> */}


<section className="all-events-section">



<h1>Explore Events</h1>


<p class="event-heading-text">

    Discover movies, concerts, shows and workshops happening near you.

</p>








{/* <!-- ================= MOVIES ================= --> */}


<div className="event-category" id="movies">


<h2>🎬 Movies</h2>


<div className="event-container">







<div className="event-card">


<img src="images/animated movie night.jpg"/>


<h3>Animated Movie Night</h3>


<p>📍 Hyderabad</p>

<p>📅 8 September 2026</p>

<p>⏰ 4:00 PM</p>


<h4>₹249</h4>


<Link
to="/eventDetails"
state={{
 event:{
   image:"images/animated movie night.jpg",
   name:"Animated Movie Night",
   location:"Hyderabad",
   date:"8 September 2026",
   time:"4:00 PM",
   price:"249"
 }
}}
>
    <button>
        View Details
    </button>
</Link>


</div>





<div className="event-card">


<img src="images/classical cinema.avif"/>


<h3>Classic Cinema Evening</h3>


<p>📍 Chennai</p>

<p>📅 12 September 2026</p>

<p>⏰ 5:30 PM</p>


<h4>₹199</h4>

<Link
to="/eventDetails"
state={{
 event:{
   image:"images/movie2.jpg",
   name:"Animated Movie Night",
   location:"Hyderabad",
   date:"8 September 2026",
   time:"4:00 PM",
   price:"₹249"
 }
}}
>
    <button>
        View Details
    </button>
</Link>


</div>




</div>


</div>









{/* <!-- ================= CONCERTS ================= --> */}


<div className="event-category" id="concerts">


<h2>🎤 Concerts</h2>


<div className="event-container">



<div className="event-card">


<img src="images/midnight music fest.jpg"/>


<h3>Midnight Music Fest</h3>


<p>📍 Mumbai</p>

<p>📅 15 August 2026</p>

<p>⏰ 7 PM</p>


<h4>₹999</h4>

<Link
to="/eventDetails"
state={{
 event:{
   image:"images/movie2.jpg",
   name:"Animated Movie Night",
   location:"Hyderabad",
   date:"8 September 2026",
   time:"4:00 PM",
   price:"₹249"
 }
}}
>
    <button>
        View Details
    </button>
</Link>


</div>







<div className="event-card">


<img src="images/rock beats live.jpg"/>


<h3>Rock Beats Live</h3>


<p>📍 Bangalore</p>

<p>📅 20 August 2026</p>

<p>⏰ 8 PM</p>


<h4>₹799</h4>


<Link
to="/eventDetails"
state={{
 event:{
   image:"images/movie2.jpg",
   name:"Animated Movie Night",
   location:"Hyderabad",
   date:"8 September 2026",
   time:"4:00 PM",
   price:"₹249"
 }
}}
>
    <button>
        View Details
    </button>
</Link>

</div>




</div>


</div>






{/* <!-- ================= SHOWS ================= --> */}


<div className="event-category" id="shows">


<h2>🎭 Shows</h2>


<div className="event-container">



<div className="event-card">


<img src="images/magic show.jpg"/>


<h3>Magic Moments Show</h3>


<p>📍 Delhi</p>

<p>📅 22 August 2026</p>


<h4>₹499</h4>

<Link
to="/eventDetails"
state={{
 event:{
   image:"images/movie2.jpg",
   name:"Animated Movie Night",
   location:"Hyderabad",
   date:"8 September 2026",
   time:"4:00 PM",
   price:"₹249"
 }
}}
>
    <button>
        View Details
    </button>
</Link>


</div>





<div className="event-card">


<img src="images/theatre night.jpg"/>


<h3>Theatre Night</h3>


<p>📍 Kolkata</p>

<p>📅 25 August 2026</p>


<h4>₹399</h4>

<Link
to="/eventDetails"
state={{
 event:{
   image:"images/movie2.jpg",
   name:"Animated Movie Night",
   location:"Hyderabad",
   date:"8 September 2026",
   time:"4:00 PM",
   price:"₹249"
 }
}}
>
    <button>
        View Details
    </button>
</Link>


</div>



</div>


</div>









{/* <!-- ================= SPORTS ================= --> */}


<div className="event-category" id="sports">


<h2>⚽ Sports</h2>


<div className="event-container">



<div className="event-card">


<img src="images/football.jpg"/>


<h3>Football League Match</h3>


<p>📍 Delhi</p>

<p>📅 20 September 2026</p>


<h4>₹599</h4>

<Link
to="/eventDetails"
state={{
 event:{
   image:"images/movie2.jpg",
   name:"Animated Movie Night",
   location:"Hyderabad",
   date:"8 September 2026",
   time:"4:00 PM",
   price:"₹249"
 }
}}
>
    <button>
        View Details
    </button>
</Link>


</div>






<div className="event-card">


<img src="images/hockey.webp"/>


<h3>Hockey Championship</h3>


<p>📍 Chandigarh</p>

<p>📅 25 September 2026</p>


<h4>₹499</h4>

<Link
to="/eventDetails"
state={{
 event:{
   image:"images/movie2.jpg",
   name:"Animated Movie Night",
   location:"Hyderabad",
   date:"8 September 2026",
   time:"4:00 PM",
   price:"₹249"
 }
}}
>
    <button>
        View Details
    </button>
</Link>

</div>




</div>


</div>










{/* <!-- ================= WORKSHOPS ================= --> */}


<div className="event-category" id="workshops">


<h2>💻 Workshops</h2>


<div className="event-container">



<div className="event-card">


<img src="images/webdev.jpg"/>


<h3>Web Development Workshop</h3>


<p>📍 Bangalore</p>

<p>📅 15 September 2026</p>


<h4>₹399</h4>

<Link
to="/eventDetails"
state={{
 event:{
   image:"images/movie2.jpg",
   name:"Animated Movie Night",
   location:"Hyderabad",
   date:"8 September 2026",
   time:"4:00 PM",
   price:"₹249"
 }
}}
>
    <button>
        View Details
    </button>
</Link>


</div>






<div className="event-card">


<img src="images/digital art.avif"/>


<h3>Digital Art Workshop</h3>


<p>📍 Shillong</p>

<p>📅 18 September 2026</p>


<h4>₹299</h4>


<Link
to="/eventDetails"
state={{
 event:{
   image:"images/movie2.jpg",
   name:"Animated Movie Night",
   location:"Hyderabad",
   date:"8 September 2026",
   time:"4:00 PM",
   price:"₹249"
 }
}}
>
    <button>
        View Details
    </button>
</Link>


</div>



</div>


</div>




</section>






{/* <!-- ================= FOOTER ================= --> */}


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


            <Link to="/">Home</Link>

            <Link to="/events">Events</Link>

            <Link to="/tickets">My Tickets</Link>

            <Link to="/login">Login</Link>


        </div>





        <div className="footer-links">


            <h3>Categories</h3>


            <Link to="/concerts">Concerts</Link>

            <Link to="/comedy">Comedy</Link>

            <Link to="/sports">Sports</Link>

            <Link to="/workshops">Workshops</Link>


        </div>



    </div>



    <p className="copyright">

        © 2026 TheShowSpot | All Rights Reserved

    </p>




</footer>


</>
    )
}

export default events;