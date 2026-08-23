import React from "react";
import {useNavigate} from "react-router-dom";
import "../styles/userNavbar.css";

function UserNavbar(){

const navigate=useNavigate();
const user=JSON.parse(localStorage.getItem("user"));

const firstLetter=user?.name
?user.name.charAt(0).toUpperCase()
:"U";

return(
<header className="user-navbar">

<div className="dashboard-title">
<button
className="home-button"
onClick={()=>navigate("/")}
>
← Home
</button>
<h2>My Dashboard</h2>
</div>

<div className="user-navbar-right">

<button
className="notification-button"
onClick={()=>navigate("/notifications")}
title="Notifications"
>
🔔
</button>

<button
className="user-profile"
onClick={()=>navigate("/dashboard")}
title="My Dashboard"
>

<div className="user-avatar">
{firstLetter}
</div>

<div className="user-profile-info">
<strong>{user?.name||"User"}</strong>
<span>My Profile</span>
</div>

</button>

</div>

</header>
);
}

export default UserNavbar;