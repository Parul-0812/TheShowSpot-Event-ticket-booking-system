import React from "react";
import { Link, useLocation } from "react-router-dom";

import {
    FaHome,
    FaClipboardList,
    FaCalendarAlt,
    FaTicketAlt,
    FaQrcode,
    FaSignOutAlt
} from "react-icons/fa";

import "../styles/sidebar.css";

function Sidebar(){

    const location = useLocation();

    return(

        <div className="sidebar">

            <div className="sidebar-logo">

                <h2>TheShowSpot</h2>

                <p>Admin Panel</p>

            </div>

            <div className="sidebar-menu">

                <Link
                    to="/dashboard"
                    className={location.pathname==="/dashboard" ? "active" : ""}
                >
                    <FaHome/>
                    <span>Dashboard</span>
                </Link>

                <Link
                    to="/dashboard#requests"
                >
                    <FaClipboardList/>
                    <span>Event Requests</span>
                </Link>

                <Link
                    to="/events"
                >
                    <FaCalendarAlt/>
                    <span>Live Events</span>
                </Link>

                <Link
                    to="/dashboard#bookings"
                >
                    <FaTicketAlt/>
                    <span>Bookings</span>
                </Link>

                <Link
                    to="/dashboard#verify"
                >
                    <FaQrcode/>
                    <span>QR Verification</span>
                </Link>

            </div>

            <div className="sidebar-bottom">

                <button>

                    <FaSignOutAlt/>

                    <span>Logout</span>

                </button>

            </div>

        </div>

    );

}

export default Sidebar;