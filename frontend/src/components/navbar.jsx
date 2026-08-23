import React,{useState} from "react";
import {Link,useNavigate} from "react-router-dom";
import "../styles/navbar.css";

function Navbar(){

const navigate=useNavigate();

const login=localStorage.getItem("isLoggedIn");
const user=JSON.parse(localStorage.getItem("user"));
const city=localStorage.getItem("city")||"Select City";

const [showProfile,setShowProfile]=useState(false);

const logout=()=>{
localStorage.removeItem("isLoggedIn");
localStorage.removeItem("user");
navigate("/login");
};

return(
<header>

<nav className="navbar">

<div className="nav-left">

<Link to="/" className="logo">
🎟️ TheShowSpot
</Link>

</div>

<div className="nav-right">

<p className="selected-city">
{city}
</p>

{login?
<>

{/* <Link to="/myBookings">
<button className="login-btn">
My Tickets
</button>
</Link> */}

<Link to="/notifications">
<button className="login-btn">
🔔
</button>
</Link>

<div className="profile-wrapper">

<button
className="profile-btn"
onClick={()=>setShowProfile(!showProfile)}
>
<span className="profile-avatar">
{user?.name?.charAt(0).toUpperCase()||"U"}
</span>

<span className="profile-name">
{user?.name||"User"}
</span>

<span className="profile-arrow">
⌄
</span>
</button>

{showProfile&&(
<div className="profile-dropdown">

<div className="profile-header">

<div className="profile-avatar large">
{user?.name?.charAt(0).toUpperCase()||"U"}
</div>

<div>
<strong>{user?.name||"User"}</strong>
<p>{user?.email||""}</p>
</div>

</div>

<div className="profile-divider"></div>

<button
onClick={()=>{
setShowProfile(false);
navigate("/dashboard");
}}
>
📊 My Dashboard
</button>

<button
onClick={()=>{
setShowProfile(false);
navigate("/myBookings");
}}
>
🎟️ My Tickets
</button>

<div className="profile-divider"></div>

<button
className="dropdown-logout"
onClick={logout}
>
🚪 Logout
</button>

</div>
)}

</div>

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
);
}

export default Navbar;