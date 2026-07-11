import React from "react";
import { Link } from "react-router-dom";
import "../styles/footer.css";

function Footer() {

    return (

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


            <Link to="/homepage" className="footer-link">
                Home
            </Link>

            <Link to="/events" className="footer-link">
                Events
            </Link>

            <Link to="/myBookings" className="footer-link">
                My Tickets
            </Link>

            <Link to="/login" className="footer-link">
                Login
            </Link>


        </div>





        <div className="footer-links">


            <h3>Categories</h3>


            <Link to="/events#concerts" className="footer-link">
                Concerts
            </Link>

            <Link to="/events#shows" className="footer-link">
                Shows
            </Link>

            <Link to="/events#sports" className="footer-link">
                Sports
            </Link>

            <Link to="/events#workshops" className="footer-link">
                Workshops
            </Link>


        </div>



    </div>



    <p className="copyright">

        © 2026 TheShowSpot | All Rights Reserved

    </p>



</footer>



    );

}

export default Footer;