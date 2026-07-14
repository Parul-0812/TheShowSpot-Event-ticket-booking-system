import React from "react";
import { FaBell, FaUserCircle, FaChevronDown } from "react-icons/fa";
import "../styles/adminNavbar.css";

function AdminNavbar(){

    return(

        <div className="admin-navbar">

            <div className="admin-navbar-left">

                <h2>Dashboard</h2>

                <p>
                    Welcome back! Here's what's happening with your events.
                </p>

            </div>

            <div className="admin-navbar-right">

                <div className="notification">

                    <FaBell className="nav-icon"/>

                    <span className="notification-count">
                        3
                    </span>

                </div>

                <div className="admin-profile">

                    <div className="profile-avatar">

                        A

                    </div>

                    <div className="profile-info">

                        <h4>Admin</h4>

                        <p>Administrator</p>

                    </div>

                    <FaChevronDown className="dropdown-icon"/>

                </div>

            </div>

        </div>

    );

}

export default AdminNavbar;