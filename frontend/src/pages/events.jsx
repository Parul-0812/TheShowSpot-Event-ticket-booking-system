import "../styles/events.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";


function events(){
    const [events,setEvents] = useState([]);
    const location = useLocation();
    const selectedCity = localStorage.getItem("city");
    const [search,setSearch] = useState("");
const navigate = useNavigate();

const login = localStorage.getItem("isLoggedIn");


const logout = ()=>{

localStorage.removeItem("isLoggedIn");

navigate("/login");

}

useEffect(()=>{


const getEvents = async()=>{


const result = await axios.get(
"http://localhost:5000/events/all"
);


setEvents(result.data.data);


}


getEvents();


},
useEffect(()=>{

    if(location.hash){

        const section = document.querySelector(location.hash);

        if(section){

            section.scrollIntoView({
                behavior:"smooth"
            });

        }

    }

},[location]),[]);

const showEvents = (category)=>{

return events
.filter(event=>event.category===category &&

(
selectedCity === null ||

event.location === selectedCity
) && (
event.name
.toLowerCase()
.includes(search.toLowerCase())

||

event.location
.toLowerCase()
.includes(search.toLowerCase())

||

event.category
.toLowerCase()
.includes(search.toLowerCase())

))
.map((event)=>(

<div className="event-card" key={event._id}>

<img src={event.image}/>

<h3>{event.name}</h3>

<p>📍 {event.location}</p>

<p>📅 {event.date}</p>

<p>⏰ {event.time}</p>

<h4>Starting at {event.price}</h4>


<Link
to="/eventDetails"
state={{event:event}}
>

<button>
View Details
</button>

</Link>


</div>

))

}
const hasEvents = (category)=>{

return events.some(

event =>

event.category===category &&

(
selectedCity===null ||

event.location===selectedCity

)

)

}
    return(
        <>


{/* <!-- ================= NAVBAR ================= --> */}


<header>


    <nav className="navbar">


        <Link to="/" className="logo">

            🎟️ TheShowSpot

        </Link>



        <div className="search-box">


            <input 

type="text"

placeholder="Search events, cities, categories..."

value={search}

onChange={(e)=>setSearch(e.target.value)}

/>


        </div>




        <div className="nav-right">

{/* 
            <p>Select City</p> */}

        {

login

?

<>

<Link to="/myBookings">

<button className="login-btn">
My Tickets
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



<h1>Explore Events
{selectedCity && ` in ${selectedCity}`}

</h1>


<p class="event-heading-text">

    Discover movies, concerts, shows and workshops happening near you.

</p>

{

hasEvents("Movies") &&

<div className="event-category" id="movies">

<h2>🎬 Movies</h2>

<div className="event-container">

{showEvents("Movies")}

</div>

</div>
}


{

hasEvents("Concerts") &&
<div className="event-category" id="concerts">

<h2>🎤 Concerts</h2>

<div className="event-container">

{showEvents("Concerts")}

</div>

</div>

}

{

hasEvents("Shows") &&
<div className="event-category" id="shows">

<h2>🎭 Shows</h2>

<div className="event-container">

{showEvents("Shows")}

</div>

</div>
}


{

hasEvents("Sports") &&
<div className="event-category" id="sports">

<h2>⚽ Sports</h2>

<div className="event-container">

{showEvents("Sports")}

</div>

</div>

}
{

hasEvents("Workshops") &&
<div className="event-category" id="workshops">

<h2>💻 Workshops</h2>

<div className="event-container">

{showEvents("Workshops")}

</div>

</div>
}

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


            <Link to="/events#concerts">Concerts</Link>

            <Link to="/events#shows">Shows</Link>

            <Link to="/events#sports">Sports</Link>

            <Link to="/events#workshops">Workshops</Link>


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