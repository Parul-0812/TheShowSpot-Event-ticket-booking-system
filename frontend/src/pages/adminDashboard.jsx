import React,{useEffect,useState} from "react";
import {useNavigate} from "react-router-dom";
import "../styles/adminDashboard.css";

function AdminDashboard(){
    const navigate=useNavigate();

    const [data,setData]=useState(null);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState("");

    const fetchDashboard=async()=>{
        try{
            setLoading(true);
            setError("");

            const response=await fetch("http://localhost:5000/admin/stats");
            const result=await response.json();

            if(!result.success){
                throw new Error(result.message||"Unable to load dashboard");
            }

            setData(result.data);
        }
        catch(error){
            console.log(error);
            setError("Unable to load dashboard data.");
        }
        finally{
            setLoading(false);
        }
    };

    useEffect(()=>{
        const admin=localStorage.getItem("admin");

        if(admin!=="true"){
            navigate("/admin-login");
            return;
        }

        fetchDashboard();
    },[]);

    const logout=()=>{
        localStorage.removeItem("admin");
        navigate("/admin-login");
    };

    const formatCurrency=(amount)=>{
        return new Intl.NumberFormat("en-IN",{
            style:"currency",
            currency:"INR",
            maximumFractionDigits:0
        }).format(amount||0);
    };

    const formatDate=(date)=>{
        if(!date) return "—";

        return new Date(date).toLocaleDateString("en-IN",{
            day:"numeric",
            month:"short",
            year:"numeric"
        });
    };

    const getMaxBookings=()=>{
        if(!data?.bookingActivity?.length) return 1;

        return Math.max(
            ...data.bookingActivity.map(item=>item.count),
            1
        );
    };

    if(loading){
        return(
            <div className="admin-layout">
                <aside className="admin-sidebar">
                    <div className="admin-brand">
                        <div className="admin-brand-icon">TS</div>
                        <div>
                            <strong>TheShowSpot</strong>
                            <span>Admin Portal</span>
                        </div>
                    </div>

                    <div className="admin-loading-sidebar"></div>
                </aside>

                <main className="admin-main">
                    <div className="admin-loading">
                        <div className="admin-loader"></div>
                        <h2>Loading dashboard</h2>
                        <p>Fetching the latest data from TheShowSpot.</p>
                    </div>
                </main>
            </div>
        );
    }

    if(error){
        return(
            <div className="admin-layout">
                <aside className="admin-sidebar">
                    <div className="admin-brand">
                        <div className="admin-brand-icon">TS</div>
                        <div>
                            <strong>TheShowSpot</strong>
                            <span>Admin Portal</span>
                        </div>
                    </div>

                    <button
                        className="admin-nav-item active"
                        onClick={fetchDashboard}
                    >
                        ↻ &nbsp; Refresh
                    </button>
                </aside>

                <main className="admin-main">
                    <div className="admin-error-page">
                        <div className="error-icon">!</div>
                        <h2>Something went wrong</h2>
                        <p>{error}</p>
                        <button
                            className="primary-button"
                            onClick={fetchDashboard}
                        >
                            Try Again
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    const maxBookings=getMaxBookings();

    return(
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-brand">
                    <div className="admin-brand-icon">TS</div>

                    <div>
                        <strong>TheShowSpot</strong>
                        <span>Admin Portal</span>
                    </div>
                </div>

                <nav className="admin-navigation">
                    <button
                        className="admin-nav-item active"
                        onClick={()=>navigate("/admin-dashboard")}
                    >
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
                        {data.requests.Pending>0&&(
                            <span className="nav-badge">
                                {data.requests.Pending}
                            </span>
                        )}
                    </button>
                </nav>

                <div className="admin-sidebar-bottom">
                    <button
                        className="admin-bottom-item"
                        onClick={fetchDashboard}
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
                        <span className="header-label">ADMINISTRATION</span>
                        <h1>Dashboard</h1>
                    </div>

                    <div className="admin-profile">
                        <button
                            className="header-refresh"
                            onClick={fetchDashboard}
                            title="Refresh dashboard"
                        >
                            ↻
                        </button>

                        <div className="profile-divider"></div>

                        <div className="admin-avatar">A</div>

                        <div className="profile-info">
                            <strong>Admin</strong>
                            <span>Administrator</span>
                        </div>
                    </div>
                </header>

                <div className="admin-content">
                    <section className="dashboard-intro">
                        <div>
                            <span className="section-label">OVERVIEW</span>
                            <h2>Welcome back, Admin! 👋</h2>
                            <p>
                                Here's what's happening across TheShowSpot today.
                            </p>
                        </div>

                        <button
                            className="review-button"
                            onClick={()=>navigate("/admin-requests")}
                        >
                            Review Requests
                            <span>→</span>
                        </button>
                    </section>

                    <section className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon users-icon">♟</div>

                            <div className="stat-content">
                                <span>Total Users</span>
                                <strong>{data.users.total}</strong>
                                <small>
                                    <b>↗</b> {data.users.active} active users
                                </small>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon events-icon">◇</div>

                            <div className="stat-content">
                                <span>Total Events</span>
                                <strong>{data.events.total}</strong>
                                <small>
                                    <b>↗</b> {data.events.approved} approved events
                                </small>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon bookings-icon">▣</div>

                            <div className="stat-content">
                                <span>Successful Bookings</span>
                                <strong>{data.bookings.successful}</strong>
                                <small>
                                    <b>↗</b> completed bookings
                                </small>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon revenue-icon">₹</div>

                            <div className="stat-content">
                                <span>Total Revenue</span>
                                <strong>{formatCurrency(data.revenue)}</strong>
                                <small>
                                    <b>↗</b> successful payments
                                </small>
                            </div>
                        </div>
                    </section>

                    <section className="analytics-grid">
                        <div className="analytics-card booking-chart-card">
                            <div className="analytics-header">
                                <div>
                                    <h3>Booking Activity</h3>
                                    <p>Successful bookings over the last 7 days</p>
                                </div>

                                <span className="live-badge">
                                    <i></i>
                                    LIVE
                                </span>
                            </div>

                            <div className="chart">
                                <div className="chart-values">
                                    {data.bookingActivity.map((item,index)=>(
                                        <span key={index}>
                                            {item.count}
                                        </span>
                                    ))}
                                </div>

                                <div className="chart-bars">
                                    {data.bookingActivity.map((item,index)=>{
                                        const height=item.count===0
                                            ?4
                                            :(item.count/maxBookings)*100;

                                        return(
                                            <div
                                                className="chart-column"
                                                key={item.date}
                                            >
                                                <div className="bar-wrapper">
                                                    <div
                                                        className="chart-bar"
                                                        style={{
                                                            height:`${height}%`
                                                        }}
                                                        title={`${item.count} booking${item.count!==1?"s":""} · ${formatCurrency(item.revenue)}`}
                                                    ></div>
                                                </div>

                                                <span>{item.label}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="chart-summary">
                                <div>
                                    <span>7-day bookings</span>
                                    <strong>
                                        {data.bookingActivity.reduce(
                                            (total,item)=>total+item.count,
                                            0
                                        )}
                                    </strong>
                                </div>

                                <div>
                                    <span>7-day revenue</span>
                                    <strong>
                                        {formatCurrency(
                                            data.bookingActivity.reduce(
                                                (total,item)=>total+item.revenue,
                                                0
                                            )
                                        )}
                                    </strong>
                                </div>
                            </div>
                        </div>

                        <div className="analytics-card requests-card">
                            <div className="analytics-header">
                                <div>
                                    <h3>Event Requests</h3>
                                    <p>Current approval status</p>
                                </div>

                                <span className="request-count">
                                    {data.requests.Pending}
                                </span>
                            </div>

                            <div className="request-overview">
                                <div className="donut">
                                    <div className="donut-center">
                                        <strong>{data.requests.Pending}</strong>
                                        <span>Pending</span>
                                    </div>
                                </div>

                                <div className="request-message">
                                    {data.requests.Pending>0 ? (
                                        <>
                                            <strong>
                                                {data.requests.Pending} request
                                                {data.requests.Pending!==1?"s":""}
                                            </strong>

                                            <p>
                                                need your attention.
                                            </p>

                                            <button
                                                onClick={()=>navigate("/admin-requests")}
                                            >
                                                Review Requests →
                                            </button>
                                        </>
                                    ):(
                                        <>
                                            <strong>No requests</strong>
                                            <p>need your attention.</p>
                                            <button
                                                onClick={()=>navigate("/admin-requests")}
                                            >
                                                View Requests →
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="request-legend">
                                <span>
                                    <i className="approved-dot"></i>
                                    Approved
                                    <b>{data.requests.Approved}</b>
                                </span>

                                <span>
                                    <i className="pending-dot"></i>
                                    Pending
                                    <b>{data.requests.Pending}</b>
                                </span>

                                <span>
                                    <i className="rejected-dot"></i>
                                    Rejected
                                    <b>{data.requests.Rejected}</b>
                                </span>
                            </div>
                        </div>
                    </section>

                    <section className="dashboard-lower-grid">
                        <div className="dashboard-panel">
                            <div className="panel-header">
                                <div>
                                    <h3>Recent Bookings</h3>
                                    <p>Latest successful transactions</p>
                                </div>

                                <button
                                    onClick={()=>navigate("/admin-bookings")}
                                >
                                    View All →
                                </button>
                            </div>

                            <div className="booking-list">
                                {data.recentBookings.length===0 ? (
                                    <div className="empty-state">
                                        <span>🎟️</span>
                                        <strong>No bookings yet</strong>
                                        <p>
                                            Successful bookings will appear here.
                                        </p>
                                    </div>
                                ):(
                                    data.recentBookings.map(booking=>(
                                        <div
                                            className="booking-row"
                                            key={booking._id}
                                        >
                                            <div className="booking-event-icon">
                                                🎟️
                                            </div>

                                            <div className="booking-info">
                                                <strong>
                                                    {booking.eventName||"Unnamed Event"}
                                                </strong>

                                                <span>
                                                    {booking.userId?.name||"Guest"}
                                                    {" · "}
                                                    {formatDate(booking.createdAt)}
                                                </span>
                                            </div>

                                            <div className="booking-amount">
                                                <strong>
                                                    {formatCurrency(booking.amount)}
                                                </strong>

                                                <span>Successful</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="dashboard-panel">
                            <div className="panel-header">
                                <div>
                                    <h3>Event Requests</h3>
                                    <p>Latest organizer submissions</p>
                                </div>

                                <button
                                    onClick={()=>navigate("/admin-requests")}
                                >
                                    View All →
                                </button>
                            </div>

                            <div className="request-list">
                                {data.recentRequests.length===0 ? (
                                    <div className="empty-state">
                                        <span>📋</span>
                                        <strong>No event requests</strong>
                                        <p>
                                            New organizer requests will appear here.
                                        </p>
                                    </div>
                                ):(
                                    data.recentRequests.map(request=>(
                                        <div
                                            className="request-row"
                                            key={request._id}
                                        >
                                            <div className="request-info">
                                                <strong>
                                                    {request.name}
                                                </strong>

                                                <span>
                                                    {request.organizerName}
                                                    {" · "}
                                                    {formatDate(request.createdAt)}
                                                </span>
                                            </div>

                                            <span
                                                className={`status-pill ${request.status.toLowerCase()}`}
                                            >
                                                {request.status}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </section>

                    <section className="quick-actions">
                        <div>
                            <span className="section-label">QUICK ACTIONS</span>
                            <h3>Manage TheShowSpot</h3>
                        </div>

                        <div className="quick-action-buttons">
                            <button onClick={()=>navigate("/admin-events")}>
                                <span>◇</span>
                                Manage Events
                            </button>

                            <button onClick={()=>navigate("/admin-users")}>
                                <span>♙</span>
                                Manage Users
                            </button>

                            <button onClick={()=>navigate("/admin-bookings")}>
                                <span>▣</span>
                                View Bookings
                            </button>

                            <button onClick={()=>navigate("/admin-requests")}>
                                <span>✉</span>
                                Event Requests
                            </button>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default AdminDashboard;