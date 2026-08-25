import React,{useEffect,useState} from "react";
import {useNavigate} from "react-router-dom";
import "../styles/adminDashboard.css";

function AdminDashboard(){

    const navigate=useNavigate();

    const [stats,setStats]=useState(null);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState("");

    const fetchStats=async()=>{
        try{
            setLoading(true);
            setError("");

            const response=await fetch("http://localhost:5000/admin/stats");
            const result=await response.json();

            if(!result.success){
                throw new Error(result.message||"Unable to load dashboard");
            }

            setStats(result.data);
        }
        catch(error){
            console.log("Dashboard Error:",error);
            setError("Unable to load dashboard data.");
        }
        finally{
            setLoading(false);
        }
    };

    useEffect(()=>{
        fetchStats();
    },[]);

    const logout=()=>{
        localStorage.removeItem("admin");
        navigate("/admin-login");
    };

    if(loading){
        return(
            <div className="admin-dashboard">
                <aside className="admin-sidebar">
                    <div className="admin-brand">
                        <div className="brand-logo">TS</div>
                        <div>
                            <h2>TheShowSpot</h2>
                            <span>Admin Portal</span>
                        </div>
                    </div>
                </aside>

                <main className="admin-main">
                    <div className="admin-loading">
                        <div className="admin-loader"></div>
                        <h2>Loading dashboard...</h2>
                        <p>Fetching the latest data.</p>
                    </div>
                </main>
            </div>
        );
    }

    if(error){
        return(
            <div className="admin-dashboard">
                <aside className="admin-sidebar">
                    <div className="admin-brand">
                        <div className="brand-logo">TS</div>
                        <div>
                            <h2>TheShowSpot</h2>
                            <span>Admin Portal</span>
                        </div>
                    </div>
                </aside>

                <main className="admin-main">
                    <div className="admin-error">
                        <h2>Something went wrong</h2>
                        <p>{error}</p>
                        <button onClick={fetchStats}>Try Again</button>
                    </div>
                </main>
            </div>
        );
    }

    const maxBooking=Math.max(
        ...(stats?.bookingChart||[]).map(item=>item.count),
        1
    );

    return(
        <div className="admin-dashboard">

            <aside className="admin-sidebar">

                <div className="admin-brand">
                    <div className="brand-logo">TS</div>

                    <div>
                        <h2>TheShowSpot</h2>
                        <span>Admin Portal</span>
                    </div>
                </div>

                <nav className="admin-nav">

                    <button className="admin-nav-item active">
                        <span>▦</span>
                        Dashboard
                    </button>

                    <button
                        className="admin-nav-item"
                        onClick={()=>navigate("/admin-events")}
                    >
                        <span>◇</span>
                        Events
                    </button>

                    <button
                        className="admin-nav-item"
                        onClick={()=>navigate("/admin-bookings")}
                    >
                        <span>▣</span>
                        Bookings
                    </button>

                    <button
                        className="admin-nav-item"
                        onClick={()=>navigate("/admin-users")}
                    >
                        <span>♙</span>
                        Users
                    </button>

                    <button
                        className="admin-nav-item"
                        onClick={()=>navigate("/admin-payments")}
                    >
                        <span>₹</span>
                        Payments
                    </button>

                    <button
                        className="admin-nav-item"
                        onClick={()=>navigate("/admin-requests")}
                    >
                        <span>✉</span>
                        Event Requests

                        {stats.pendingRequests>0&&(
                            <span className="nav-badge">
                                {stats.pendingRequests}
                            </span>
                        )}
                    </button>

                </nav>

                <div className="admin-sidebar-bottom">

                    <button
                        className="admin-bottom-item"
                        onClick={fetchStats}
                    >
                        ↻
                        Refresh
                    </button>

                    <button
                        className="admin-bottom-item"
                        onClick={logout}
                    >
                        ↪
                        Logout
                    </button>

                </div>

            </aside>

            <main className="admin-main">

                <header className="admin-header">

                    <div>
                        <span className="header-label">
                            ADMINISTRATION
                        </span>

                        <h1>Dashboard</h1>
                    </div>

                    <div className="admin-profile">

                        <button
                            className="refresh-button"
                            onClick={fetchStats}
                            title="Refresh dashboard"
                        >
                            ↻
                        </button>

                        <div className="profile-divider"></div>

                        <div className="profile-avatar">
                            A
                        </div>

                        <div>
                            <strong>Admin</strong>
                            <span>Administrator</span>
                        </div>

                    </div>

                </header>

                <section className="admin-content">

                    <div className="dashboard-intro">

                        <div>
                            <span className="section-label">
                                OVERVIEW
                            </span>

                            <h2>
                                Welcome back, Admin! 👋
                            </h2>

                            <p>
                                Here's what's happening across
                                TheShowSpot today.
                            </p>
                        </div>

                        <button
                            className="review-button"
                            onClick={()=>navigate("/admin-requests")}
                        >
                            Review Requests
                            <span>→</span>
                        </button>

                    </div>

                    <div className="stats-grid">

                        <div className="stat-card">

                            <div className="stat-icon purple">
                                ♟
                            </div>

                            <div>
                                <span>Total Users</span>

                                <strong>
                                    {stats.totalUsers}
                                </strong>

                                <small>
                                    Active registered users
                                </small>
                            </div>

                        </div>

                        <div className="stat-card">

                            <div className="stat-icon pink">
                                ◈
                            </div>

                            <div>
                                <span>Total Events</span>

                                <strong>
                                    {stats.totalEvents}
                                </strong>

                                <small>
                                    Approved events
                                </small>
                            </div>

                        </div>

                        <div className="stat-card">

                            <div className="stat-icon blue">
                                ▣
                            </div>

                            <div>
                                <span>Successful Bookings</span>

                                <strong>
                                    {stats.successfulBookings}
                                </strong>

                                <small>
                                    Completed bookings
                                </small>
                            </div>

                        </div>

                        <div className="stat-card">

                            <div className="stat-icon green">
                                ₹
                            </div>

                            <div>
                                <span>Total Revenue</span>

                                <strong>
                                    ₹{Number(stats.totalRevenue).toLocaleString("en-IN")}
                                </strong>

                                <small>
                                    From successful payments
                                </small>
                            </div>

                        </div>

                    </div>

                    <div className="dashboard-grid">

                        <div className="dashboard-card booking-card">

                            <div className="card-heading">

                                <div>
                                    <h3>Booking Activity</h3>

                                    <p>
                                        Successful bookings over the last 7 days
                                    </p>
                                </div>

                                <span className="live-badge">
                                    • LIVE
                                </span>

                            </div>

                            <div className="booking-chart">

                                {stats.bookingChart.map(item=>{

                                    const height=item.count===0
                                        ?4
                                        :(item.count/maxBooking)*170;

                                    return(
                                        <div
                                            className="chart-column"
                                            key={item.date}
                                        >

                                            <span className="chart-value">
                                                {item.count}
                                            </span>

                                            <div className="chart-bar-wrapper">

                                                <div
                                                    className="chart-bar"
                                                    style={{
                                                        height:`${height}px`
                                                    }}
                                                ></div>

                                            </div>

                                            <span className="chart-day">
                                                {item.day}
                                            </span>

                                        </div>
                                    );
                                })}

                            </div>

                        </div>

                        <div className="dashboard-card requests-card">

                            <div className="card-heading">

                                <div>
                                    <h3>Event Requests</h3>

                                    <p>
                                        Current approval status
                                    </p>
                                </div>

                                <span className="request-count">
                                    {stats.pendingRequests}
                                </span>

                            </div>

                            <div className="request-summary">

                                <div className="request-circle">

                                    <div>
                                        <strong>
                                            {stats.pendingRequests}
                                        </strong>

                                        <span>Pending</span>
                                    </div>

                                </div>

                                <div className="request-text">

                                    <p>
                                        {stats.pendingRequests===0
                                            ?"No requests need your attention."
                                            :`${stats.pendingRequests} request${stats.pendingRequests===1?"":"s"} need your attention.`
                                        }
                                    </p>

                                    <button
                                        onClick={()=>navigate("/admin-requests")}
                                    >
                                        Review Requests →
                                    </button>

                                </div>

                            </div>

                            <div className="request-stats">

                                <div>
                                    <span className="status-dot approved"></span>
                                    Approved
                                    <strong>
                                        {stats.approvedRequests}
                                    </strong>
                                </div>

                                <div>
                                    <span className="status-dot pending"></span>
                                    Pending
                                    <strong>
                                        {stats.pendingRequests}
                                    </strong>
                                </div>

                                <div>
                                    <span className="status-dot rejected"></span>
                                    Rejected
                                    <strong>
                                        {stats.rejectedRequests}
                                    </strong>
                                </div>

                            </div>

                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default AdminDashboard;