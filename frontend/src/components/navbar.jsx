import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";

function Navbar() {

    const navigate = useNavigate();

    const login = localStorage.getItem("isLoggedIn");

    const city = localStorage.getItem("city") || "Select City";

    const logout = () => {

        localStorage.removeItem("isLoggedIn");

        navigate("/login");

    }

    return (

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

                    {

                        login

                        ?

                        <>

                            <Link to="/myBookings">

                                <button className="login-btn">

                                    My Tickets

                                </button>

                            </Link>


                            <Link to="/notifications">

                                <button className="login-btn">

                                    🔔

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
            <div className="page-navbar">

    <Link to="/">Home</Link>

    <Link to="/events">Events</Link>

    <Link to="/hostEvent">Host Event</Link>

    <a href="/#features">Features</a>

</div>


            

        </header>

    )

}

export default Navbar;