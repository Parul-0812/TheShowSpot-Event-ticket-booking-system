import React from "react";
import {useNavigate} from "react-router-dom";
import "../styles/userNavbar.css";

function UserNavbar(){

const navigate=useNavigate();
const user=JSON.parse(localStorage.getItem("user"));

return(
<div className="user-navbar">
<div className="user-navbar-title">
My Dashboard
</div>

<div className="user-navbar-right">
<button className="notification-button">
🔔
</button>

<button className="user-profile-button" onClick={()=>navigate("/dashboard")}>
<div className="user-avatar">
{user?.name?.charAt(0).toUpperCase()||"U"}
</div>
<span>{user?.name||"User"}</span>
</button>
</div>
</div>
);
}

export default UserNavbar;