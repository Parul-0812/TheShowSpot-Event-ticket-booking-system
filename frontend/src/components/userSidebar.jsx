import React from "react";
import {NavLink,useNavigate} from "react-router-dom";
import "../styles/userSidebar.css";

function UserSidebar(){

const navigate=useNavigate();

const logout=()=>{
localStorage.removeItem("isLoggedIn");
localStorage.removeItem("user");
navigate("/login");
};

return(
<aside className="user-sidebar">

<button
className="user-logo"
onClick={()=>navigate("/")}
>
🎟️ TheShowSpot
</button>

<nav>

<NavLink to="/dashboard">
🏠 Dashboard
</NavLink>

<NavLink to="/myTickets">
🎟️ My Tickets
</NavLink>

<NavLink to="/myBookings">
📋 My Bookings
</NavLink>

</nav>

<div className="sidebar-bottom">

<button
className="discover-button"
onClick={()=>navigate("/events")}
>
🔍 Discover Events
</button>

<button
className="sidebar-logout"
onClick={logout}
>
🚪 Logout
</button>

</div>

</aside>
);
}

export default UserSidebar;