import React from "react";
import {NavLink} from "react-router-dom";
import "../styles/userSidebar.css";

function UserSidebar(){

return(
<div className="user-sidebar">
<div className="user-sidebar-logo">
🎟️ TheShowSpot
</div>

<nav>
<NavLink to="/dashboard">🏠 Dashboard</NavLink>
<NavLink to="/my-tickets">🎟️ My Tickets</NavLink>
<NavLink to="/my-bookings">📋 My Bookings</NavLink>
<NavLink to="/settings">⚙️ Settings</NavLink>
</nav>

<div className="user-sidebar-bottom">
<button onClick={()=>{
localStorage.removeItem("isLoggedIn");
localStorage.removeItem("user");
window.location.href="/login";
}}>
🚪 Logout
</button>
</div>
</div>
);
}

export default UserSidebar;