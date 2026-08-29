import React,{useEffect,useMemo,useState} from "react";
import "../styles/adminDashboard.css";
function AdminDashboard(){
    const [activeSection,setActiveSection]=useState("dashboard");
    const [data,setData]=useState(null);
    const [events,setEvents]=useState([]);
    const [requests,setRequests]=useState([]);
    const [bookings,setBookings]=useState([]);
    const [users,setUsers]=useState([]);
    const [payments,setPayments]=useState(null);
    const [analytics,setAnalytics]=useState(null);
    const [loading,setLoading]=useState(true);
    const [actionLoading,setActionLoading]=useState(false);
    const [error,setError]=useState("");
    const [notice,setNotice]=useState("");
    const [eventSearch,setEventSearch]=useState("");
    const [bookingSearch,setBookingSearch]=useState("");
    const [userSearch,setUserSearch]=useState("");
    const [requestFilter,setRequestFilter]=useState("All");
    const [showEventModal,setShowEventModal]=useState(false);
    const [editingEvent,setEditingEvent]=useState(null);
    const [eventForm,setEventForm]=useState({
        name:"",
        category:"",
        description:"",
        date:"",
        startTime:"",
        endTime:"",
        venue:"",
        city:"",
        address:"",
        price:"",
        totalSeats:"",
        image:"",
        organizerName:"",
        email:"",
        phone:""
    });
    const admin=JSON.parse(
        localStorage.getItem("adminUser")||
        '{"username":"admin","role":"admin"}'
    );
    const api="http://localhost:5000";
    const apiGet=async path=>{
        const url=`${api}${path}${path.includes("?")?"&":"?"}_=${Date.now()}`;
        const response=await fetch(url,{cache:"no-store"});
        const result=await response.json();
        if(!response.ok||!result.success){
            throw new Error(result.message||"Request failed");
        }
        return result;
    };
    const fetchStats=async()=>{
        try{
            const result=await apiGet("/admin/stats");
            setData(result.data);
        }catch(error){
            console.log(error);
            setError("Unable to load dashboard data.");
        }
    };
    const fetchEvents=async()=>{
        try{
            const result=await apiGet("/admin/events");
            setEvents(result.data);
        }catch(error){ console.log(error); }
    };
    const fetchRequests=async()=>{
        try{
            const result=await apiGet("/admin/requests");
            setRequests(result.data);
        }catch(error){ console.log(error); }
    };
    const fetchBookings=async()=>{
        try{
            const result=await apiGet("/admin/bookings");
            setBookings(result.data);
        }catch(error){ console.log(error); }
    };
    const fetchUsers=async()=>{
        try{
            const result=await apiGet("/admin/users");
            setUsers(result.data);
        }catch(error){ console.log(error); }
    };
    const fetchPayments=async()=>{
        try{
            const result=await apiGet("/admin/payments");
            setPayments(result.data);
        }catch(error){ console.log(error); }
    };
    const fetchAnalytics=async()=>{
        try{
            const result=await apiGet("/admin/analytics");
            setAnalytics(result.data);
        }catch(error){ console.log(error); }
    };
    const loadAllData=async()=>{
        setLoading(true);
        setError("");
        await Promise.all([fetchStats(),fetchEvents(),fetchRequests(),fetchBookings(),fetchUsers(),fetchPayments(),fetchAnalytics()]);
        setLoading(false);
    };
    const refreshLiveData=async()=>{
        await Promise.all([fetchStats(),fetchBookings(),fetchPayments(),fetchAnalytics(),fetchRequests()]);
    };
    useEffect(()=>{
        if(localStorage.getItem("admin")!=="true"){
            window.location.href="/admin-login";
            return;
        }
        loadAllData();
        const interval=setInterval(refreshLiveData,10000);
        return()=>clearInterval(interval);
    },[]);
    const showNotice=(message)=>{
        setNotice(message);
        setTimeout(()=>{
            setNotice("");
        },3000);
    };
    const logout=()=>{
        localStorage.removeItem("admin");
        localStorage.removeItem("adminUser");
        window.location.href="/admin-login";
    };
    const formatCurrency=(amount)=>{
        return new Intl.NumberFormat(
            "en-IN",
            {
                style:"currency",
                currency:"INR",
                maximumFractionDigits:0
            }
        ).format(amount||0);
    };
    const formatDate=(date)=>{
        if(!date){
            return "—";
        }
        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day:"numeric",
                month:"short",
                year:"numeric"
            }
        );
    };
    const changeSection=(section)=>{
        setActiveSection(section);
    };
    const openAddEvent=()=>{
        setEditingEvent(null);
        setEventForm({
            name:"",
            category:"",
            description:"",
            date:"",
            startTime:"",
            endTime:"",
            venue:"",
            city:"",
            address:"",
            price:"",
            totalSeats:"",
            image:"",
            organizerName:"",
            email:"",
            phone:""
        });
        setShowEventModal(true);
    };
    const openEditEvent=(event)=>{
        setEditingEvent(event);
        setEventForm({
            name:event.name||"",
            category:event.category||"",
            description:event.description||"",
            date:event.date||"",
            startTime:event.startTime||"",
            endTime:event.endTime||"",
            venue:event.venue||"",
            city:event.city||"",
            address:event.address||"",
            price:event.price||"",
            totalSeats:event.totalSeats||"",
            image:event.image||"",
            organizerName:event.organizerName||"",
            email:event.email||"",
            phone:event.phone||""
        });
        setShowEventModal(true);
    };
    const updateEventForm=(field,value)=>{
        setEventForm(prev=>({
            ...prev,
            [field]:value
        }));
    };
    const saveEvent=async(e)=>{
        e.preventDefault();
        try{
            setActionLoading(true);
            const url=editingEvent
                ?`${api}/admin/events/${editingEvent._id}`
                :`${api}/admin/events`;
            const response=await fetch(
                url,
                {
                    method:editingEvent
                        ?"PUT"
                        :"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify(eventForm)
                }
            );
            const result=await response.json();
            if(!result.success){
                throw new Error(
                    result.message||
                    "Unable to save event"
                );
            }
            setShowEventModal(false);
            await Promise.all([
                fetchEvents(),
                fetchStats(),
                fetchAnalytics()
            ]);
            showNotice(
                editingEvent
                ?"Event updated successfully."
                :"Event created successfully."
            );
        }
        catch(error){
            console.log(error);
            setError(error.message);
        }
        finally{
            setActionLoading(false);
        }
    };
    const deleteEvent=async(id)=>{
        const confirmed=window.confirm(
            "Are you sure you want to delete this event?"
        );
        if(!confirmed){
            return;
        }
        try{
            setActionLoading(true);
            const response=await fetch(
                `${api}/admin/events/${id}`,
                {
                    method:"DELETE"
                }
            );
            const result=await response.json();
            if(!result.success){
                throw new Error(
                    result.message||
                    "Unable to delete event"
                );
            }
            await Promise.all([
                fetchEvents(),
                fetchStats()
            ]);
            showNotice(
                "Event deleted successfully."
            );
        }
        catch(error){
            console.log(error);
            setError(error.message);
        }
        finally{
            setActionLoading(false);
        }
    };
    const approveRequest=async(id)=>{
        try{
            setActionLoading(true);
            const response=await fetch(
                `${api}/admin/requests/${id}/approve`,
                {
                    method:"PUT"
                }
            );
            const result=await response.json();
            if(!result.success){
                throw new Error(
                    result.message
                );
            }
            await Promise.all([
                fetchRequests(),
                fetchEvents(),
                fetchStats()
            ]);
            showNotice(
                "Event request approved."
            );
        }
        catch(error){
            console.log(error);
            setError(error.message);
        }
        finally{
            setActionLoading(false);
        }
    };
    const rejectRequest=async(id)=>{
        try{
            setActionLoading(true);
            const response=await fetch(
                `${api}/admin/requests/${id}/reject`,
                {
                    method:"PUT"
                }
            );
            const result=await response.json();
            if(!result.success){
                throw new Error(
                    result.message
                );
            }
            await Promise.all([
                fetchRequests(),
                fetchStats()
            ]);
            showNotice(
                "Event request rejected."
            );
        }
        catch(error){
            console.log(error);
            setError(error.message);
        }
        finally{
            setActionLoading(false);
        }
    };
    const deleteRequest=async(id)=>{
        const confirmed=window.confirm(
            "Delete this event request?"
        );
        if(!confirmed){
            return;
        }
        try{
            setActionLoading(true);
            const response=await fetch(
                `${api}/admin/requests/${id}`,
                {
                    method:"DELETE"
                }
            );
            const result=await response.json();
            if(!result.success){
                throw new Error(
                    result.message
                );
            }
            await Promise.all([
                fetchRequests(),
                fetchStats()
            ]);
            showNotice(
                "Request deleted."
            );
        }
        catch(error){
            console.log(error);
            setError(error.message);
        }
        finally{
            setActionLoading(false);
        }
    };
    const toggleUserStatus=async(user)=>{
        const newStatus=
            user.status==="Blocked"
            ?"Active"
            :"Blocked";
        try{
            setActionLoading(true);
            const response=await fetch(
                `${api}/admin/users/${user._id}/status`,
                {
                    method:"PUT",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        status:newStatus
                    })
                }
            );
            const result=await response.json();
            if(!result.success){
                throw new Error(
                    result.message
                );
            }
            await Promise.all([
                fetchUsers(),
                fetchStats()
            ]);
            showNotice(
                newStatus==="Blocked"
                ?"User blocked."
                :"User unblocked."
            );
        }
        catch(error){
            console.log(error);
            setError(error.message);
        }
        finally{
            setActionLoading(false);
        }
    };
    const filteredEvents=useMemo(()=>{
        return events.filter(event=>{
            const search=eventSearch.toLowerCase();
            return(
                event.name?.toLowerCase().includes(search)||
                event.category?.toLowerCase().includes(search)||
                event.city?.toLowerCase().includes(search)
            );
        });
    },[events,eventSearch]);
    const filteredBookings=useMemo(()=>{
        return bookings.filter(booking=>{
            const search=bookingSearch.toLowerCase();
            return(
                booking.eventName?.toLowerCase().includes(search)||
                booking.userId?.name?.toLowerCase().includes(search)||
                booking.transactionId?.toLowerCase().includes(search)
            );
        });
    },[bookings,bookingSearch]);
    const filteredUsers=useMemo(()=>{
        return users.filter(user=>{
            const search=userSearch.toLowerCase();
            return(
                user.name?.toLowerCase().includes(search)||
                user.email?.toLowerCase().includes(search)||
                user.phone?.includes(search)
            );
        });
    },[users,userSearch]);
    const filteredRequests=useMemo(()=>{
        if(requestFilter==="All"){
            return requests;
        }
        return requests.filter(
            request=>request.status===requestFilter
        );
    },[requests,requestFilter]);
    const maxBookings=Math.max(
        ...(data?.bookingActivity||[]).map(
            item=>item.count
        ),
        1
    );
    const totalActivityBookings=
        data?.bookingActivity?.reduce(
            (total,item)=>
                total+item.count,
            0
        )||0;
    const totalActivityRevenue=
        data?.bookingActivity?.reduce(
            (total,item)=>
                total+item.revenue,
            0
        )||0;
    if(loading&&!data){
        return(
            <div className="admin-loading-screen">
                <div className="admin-loader"></div>
                <h2>Loading TheShowSpot Admin</h2>
                <p>Preparing your control center...</p>
            </div>
        );
    }
    return(
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-brand">
                    <div className="admin-brand-icon">
                        TS
                    </div>
                    <div>
                        <strong>
                            TheShowSpot
                        </strong>
                        <span>
                            Admin Portal
                        </span>
                    </div>
                </div>
                <nav className="admin-navigation">
                    <button
                        className={
                            activeSection==="dashboard"
                            ?"admin-nav-item active"
                            :"admin-nav-item"
                        }
                        onClick={()=>
                            changeSection("dashboard")
                        }
                    >
                        <span>⌂</span>
                        Dashboard
                    </button>
                    <button
                        className={
                            activeSection==="events"
                            ?"admin-nav-item active"
                            :"admin-nav-item"
                        }
                        onClick={()=>
                            changeSection("events")
                        }
                    >
                        <span>◇</span>
                        Events
                    </button>
                    <button
                        className={
                            activeSection==="requests"
                            ?"admin-nav-item active"
                            :"admin-nav-item"
                        }
                        onClick={()=>
                            changeSection("requests")
                        }
                    >
                        <span>✉</span>
                        Event Requests
                        {data?.requests?.Pending>0&&(
                            <b className="nav-badge">
                                {data.requests.Pending}
                            </b>
                        )}
                    </button>
                    <button
                        className={
                            activeSection==="bookings"
                            ?"admin-nav-item active"
                            :"admin-nav-item"
                        }
                        onClick={()=>
                            changeSection("bookings")
                        }
                    >
                        <span>▣</span>
                        Bookings
                    </button>
                    <button
                        className={
                            activeSection==="users"
                            ?"admin-nav-item active"
                            :"admin-nav-item"
                        }
                        onClick={()=>
                            changeSection("users")
                        }
                    >
                        <span>♙</span>
                        Users
                    </button>
                    <button
                        className={
                            activeSection==="payments"
                            ?"admin-nav-item active"
                            :"admin-nav-item"
                        }
                        onClick={()=>
                            changeSection("payments")
                        }
                    >
                        <span>₹</span>
                        Payments
                    </button>
                    <button
                        className={
                            activeSection==="analytics"
                            ?"admin-nav-item active"
                            :"admin-nav-item"
                        }
                        onClick={()=>
                            changeSection("analytics")
                        }
                    >
                        <span>⌁</span>
                        Analytics
                    </button>
                    <button
                        className={
                            activeSection==="settings"
                            ?"admin-nav-item active"
                            :"admin-nav-item"
                        }
                        onClick={()=>
                            changeSection("settings")
                        }
                    >
                        <span>⚙</span>
                        Settings
                    </button>
                </nav>
                <div className="admin-sidebar-bottom">
                    <button
                        className="admin-bottom-item"
                        onClick={loadAllData}
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
                        <h1>
                            {activeSection==="dashboard"
                                ?"Dashboard"
                                :activeSection==="events"
                                ?"Events"
                                :activeSection==="requests"
                                ?"Event Requests"
                                :activeSection==="bookings"
                                ?"Bookings"
                                :activeSection==="users"
                                ?"Users"
                                :activeSection==="payments"
                                ?"Payments"
                                :activeSection==="analytics"
                                ?"Analytics"
                                :"Settings"
                            }
                        </h1>
                    </div>
                    <div className="admin-profile">
                        <button
                            className="header-refresh"
                            onClick={loadAllData}
                            title="Refresh"
                        >
                            ↻
                        </button>
                        <div className="profile-divider"></div>
                        <div className="admin-avatar">
                            {admin.username
                                ?.charAt(0)
                                .toUpperCase()||
                                "A"
                            }
                        </div>
                        <div className="profile-info">
                            <strong>
                                {admin.username||"Admin"}
                            </strong>
                            <span>
                                Administrator
                            </span>
                        </div>
                    </div>
                </header>
                <div className="admin-content">
                    {notice&&(
                        <div className="admin-toast success">
                            ✓ {notice}
                        </div>
                    )}
                    {error&&(
                        <div className="admin-toast error">
                            {error}
                            <button
                                onClick={()=>
                                    setError("")
                                }
                            >
                                ×
                            </button>
                        </div>
                    )}
                    {activeSection==="dashboard"&&(
                        <>
                            <section className="dashboard-intro">
                                <div>
                                    <span className="section-label">
                                        OVERVIEW
                                    </span>
                                    <h2>
                                        Welcome back, Admin! 👋
                                    </h2>
                                    <p>
                                        Here's what's happening across TheShowSpot today.
                                    </p>
                                </div>
                                <button
                                    className="primary-action"
                                    onClick={openAddEvent}
                                >
                                    <span>＋</span>
                                    Add New Event
                                </button>
                            </section>
                            <section className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-icon purple">
                                        ♙
                                    </div>
                                    <div>
                                        <span>
                                            Total Users
                                        </span>
                                        <strong>
                                            {data?.users?.total||0}
                                        </strong>
                                        <small>
                                            {data?.users?.active||0}
                                            {" "}
                                            active
                                        </small>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon pink">
                                        ◇
                                    </div>
                                    <div>
                                        <span>
                                            Total Events
                                        </span>
                                        <strong>
                                            {data?.events?.total||0}
                                        </strong>
                                        <small>
                                            {data?.events?.approved||0}
                                            {" "}
                                            approved
                                        </small>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon blue">
                                        ▣
                                    </div>
                                    <div>
                                        <span>
                                            Successful Bookings
                                        </span>
                                        <strong>
                                            {data?.bookings?.successful||0}
                                        </strong>
                                        <small>
                                            {data?.bookings?.pending||0}
                                            {" "}
                                            pending
                                        </small>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon green">
                                        ₹
                                    </div>
                                    <div>
                                        <span>
                                            Total Revenue
                                        </span>
                                        <strong>
                                            {formatCurrency(
                                                data?.revenue||0
                                            )}
                                        </strong>
                                        <small>
                                            Successful payments
                                        </small>
                                    </div>
                                </div>
                            </section>
                            <section className="quick-actions">
                                <div>
                                    <span className="section-label">
                                        QUICK ACTIONS
                                    </span>
                                    <h3>
                                        Manage TheShowSpot
                                    </h3>
                                </div>
                                <div className="quick-action-buttons">
                                    <button
                                        onClick={openAddEvent}
                                    >
                                        <span>＋</span>
                                        Add Event
                                    </button>
                                    <button
                                        onClick={()=>
                                            changeSection("requests")
                                        }
                                    >
                                        <span>✉</span>
                                        Review Requests
                                    </button>
                                    <button
                                        onClick={()=>
                                            changeSection("users")
                                        }
                                    >
                                        <span>♙</span>
                                        Manage Users
                                    </button>
                                    <button
                                        onClick={()=>
                                            changeSection("bookings")
                                        }
                                    >
                                        <span>▣</span>
                                        View Bookings
                                    </button>
                                </div>
                            </section>
                            <section className="analytics-grid">
                                <div className="dashboard-panel chart-panel">
                                    <div className="panel-header">
                                        <div>
                                            <h3>
                                                Booking Activity
                                            </h3>
                                            <p>
                                                Last 7 days
                                            </p>
                                        </div>
                                        <div className="live-indicator">
                                            <i></i>
                                            LIVE
                                        </div>
                                    </div>
                                    <div className="chart-area">
                                        <div className="chart-bars">
                                            {(
                                                data?.bookingActivity||
                                                []
                                            ).map(item=>{
                                                const height=
                                                    item.count===0
                                                    ?4
                                                    :
                                                    (
                                                        item.count/
                                                        maxBookings
                                                    )*100;
                                                return(
                                                    <div
                                                        className="chart-column"
                                                        key={item.date}
                                                    >
                                                        <div
                                                            className="chart-number"
                                                        >
                                                            {item.count}
                                                        </div>
                                                        <div className="chart-bar-wrap">
                                                            <div
                                                                className="chart-bar"
                                                                style={{
                                                                    height:
                                                                        `${height}%`
                                                                }}
                                                                title={
                                                                    `${item.count} bookings · ${formatCurrency(item.revenue)}`
                                                                }
                                                            ></div>
                                                        </div>
                                                        <span>
                                                            {item.label}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div className="chart-footer">
                                        <div>
                                            <span>
                                                7-day bookings
                                            </span>
                                            <strong>
                                                {totalActivityBookings}
                                            </strong>
                                        </div>
                                        <div>
                                            <span>
                                                7-day revenue
                                            </span>
                                            <strong>
                                                {formatCurrency(
                                                    totalActivityRevenue
                                                )}
                                            </strong>
                                        </div>
                                        <small>
                                            Auto-refreshes every 10 seconds
                                        </small>
                                    </div>
                                </div>
                                <div className="dashboard-panel overview-panel">
                                    <div className="panel-header">
                                        <div>
                                            <h3>
                                                Event Overview
                                            </h3>
                                            <p>
                                                Current event status
                                            </p>
                                        </div>
                                    </div>
                                    <div className="overview-list">
                                        <div>
                                            <span className="overview-icon approved">
                                                ✓
                                            </span>
                                            <span>
                                                Approved Events
                                            </span>
                                            <strong>
                                                {data?.events?.approved||0}
                                            </strong>
                                        </div>
                                        <div>
                                            <span className="overview-icon pending">
                                                !
                                            </span>
                                            <span>
                                                Pending Events
                                            </span>
                                            <strong>
                                                {data?.events?.pending||0}
                                            </strong>
                                        </div>
                                        <div>
                                            <span className="overview-icon rejected">
                                                ×
                                            </span>
                                            <span>
                                                Rejected Events
                                            </span>
                                            <strong>
                                                {data?.events?.rejected||0}
                                            </strong>
                                        </div>
                                        <div>
                                            <span className="overview-icon total">
                                                ◇
                                            </span>
                                            <span>
                                                Total Events
                                            </span>
                                            <strong>
                                                {data?.events?.total||0}
                                            </strong>
                                        </div>
                                    </div>
                                    <button
                                        className="panel-link"
                                        onClick={()=>
                                            changeSection("events")
                                        }
                                    >
                                        Manage Events →
                                    </button>
                                </div>
                            </section>
                            <section className="dashboard-lower-grid">
                                <div className="dashboard-panel">
                                    <div className="panel-header">
                                        <div>
                                            <h3>
                                                Recent Bookings
                                            </h3>
                                            <p>
                                                Latest transactions
                                            </p>
                                        </div>
                                        <button
                                            className="panel-link"
                                            onClick={()=>
                                                changeSection("bookings")
                                            }
                                        >
                                            View All →
                                        </button>
                                    </div>
                                    <div className="recent-list">
                                        {(data?.recentBookings||[])
                                        .slice(0,5)
                                        .map(booking=>(
                                            <div
                                                className="recent-row"
                                                key={booking._id}
                                            >
                                                <div className="recent-icon">
                                                    🎟
                                                </div>
                                                <div className="recent-info">
                                                    <strong>
                                                        {booking.eventName||
                                                        "Unnamed Event"}
                                                    </strong>
                                                    <span>
                                                        {booking.userId?.name||
                                                        "Guest"}
                                                        {" · "}
                                                        {formatDate(
                                                            booking.createdAt
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="recent-value">
                                                    <strong>
                                                        {formatCurrency(
                                                            booking.amount
                                                        )}
                                                    </strong>
                                                    <span>
                                                        {booking.paymentStatus}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                        {(!data?.recentBookings||
                                        data.recentBookings.length===0)&&(
                                            <div className="empty-state">
                                                No bookings yet.
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="dashboard-panel">
                                    <div className="panel-header">
                                        <div>
                                            <h3>
                                                Pending Requests
                                            </h3>
                                            <p>
                                                Organizer submissions
                                            </p>
                                        </div>
                                        <button
                                            className="panel-link"
                                            onClick={()=>
                                                changeSection("requests")
                                            }
                                        >
                                            View All →
                                        </button>
                                    </div>
                                    <div className="recent-list">
                                        {(requests
                                        .filter(
                                            request=>
                                                request.status==="Pending"
                                        )
                                        .slice(0,5))
                                        .map(request=>(
                                            <div
                                                className="recent-row"
                                                key={request._id}
                                            >
                                                <div className="recent-icon request">
                                                    ✉
                                                </div>
                                                <div className="recent-info">
                                                    <strong>
                                                        {request.name}
                                                    </strong>
                                                    <span>
                                                        {request.organizerName}
                                                        {" · "}
                                                        {formatDate(
                                                            request.createdAt
                                                        )}
                                                    </span>
                                                </div>
                                                <span className="status-pill pending">
                                                    Pending
                                                </span>
                                            </div>
                                        ))}
                                        {requests.filter(
                                            request=>
                                                request.status==="Pending"
                                        ).length===0&&(
                                            <div className="empty-state">
                                                No pending requests.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>
                            <section className="activity-panel dashboard-panel">
                                <div className="panel-header">
                                    <div>
                                        <h3>
                                            Recent Activity
                                        </h3>
                                        <p>
                                            Latest activity across your platform
                                        </p>
                                    </div>
                                </div>
                                <div className="activity-list">
                                    {(data?.recentBookings||[])
                                    .slice(0,4)
                                    .map(item=>(
                                        <div
                                            className="activity-item"
                                            key={item._id}
                                        >
                                            <i className="activity-dot booking"></i>
                                            <div>
                                                <strong>
                                                    New booking
                                                </strong>
                                                <span>
                                                    {item.eventName||
                                                    "Event"}
                                                    {" · "}
                                                    {formatCurrency(
                                                        item.amount
                                                    )}
                                                </span>
                                            </div>
                                            <time>
                                                {formatDate(
                                                    item.createdAt
                                                )}
                                            </time>
                                        </div>
                                    ))}
                                    {(data?.recentUsers||[])
                                    .slice(0,3)
                                    .map(user=>(
                                        <div
                                            className="activity-item"
                                            key={user._id}
                                        >
                                            <i className="activity-dot user"></i>
                                            <div>
                                                <strong>
                                                    New user
                                                </strong>
                                                <span>
                                                    {user.name}
                                                </span>
                                            </div>
                                            <time>
                                                {formatDate(
                                                    user.createdAt
                                                )}
                                            </time>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </>
                    )}
                    {activeSection==="events"&&(
                        <section className="management-section">
                            <div className="management-header">
                                <div>
                                    <span className="section-label">
                                        EVENT MANAGEMENT
                                    </span>
                                    <h2>
                                        Events
                                    </h2>
                                    <p>
                                        Create, edit and manage all events.
                                    </p>
                                </div>
                                <button
                                    className="primary-action"
                                    onClick={openAddEvent}
                                >
                                    ＋ Add New Event
                                </button>
                            </div>
                            <div className="filter-bar">
                                <input
                                    value={eventSearch}
                                    onChange={e=>
                                        setEventSearch(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Search events..."
                                />
                                <span>
                                    {filteredEvents.length}
                                    {" "}
                                    events
                                </span>
                            </div>
                            <div className="table-panel">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Event</th>
                                            <th>Category</th>
                                            <th>Date</th>
                                            <th>Price</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredEvents.map(event=>(
                                            <tr key={event._id}>
                                                <td>
                                                    <strong>
                                                        {event.name}
                                                    </strong>
                                                    <small>
                                                        {event.city||
                                                        event.location||
                                                        "Location not set"}
                                                    </small>
                                                </td>
                                                <td>
                                                    {event.category}
                                                </td>
                                                <td>
                                                    {formatDate(
                                                        event.date
                                                    )}
                                                </td>
                                                <td>
                                                    {formatCurrency(
                                                        event.price
                                                    )}
                                                </td>
                                                <td>
                                                    <span
                                                        className={
                                                            `status-pill ${event.status.toLowerCase()}`
                                                        }
                                                    >
                                                        {event.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="table-actions">
                                                        <button
                                                            onClick={()=>
                                                                openEditEvent(
                                                                    event
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="danger"
                                                            onClick={()=>
                                                                deleteEvent(
                                                                    event._id
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {filteredEvents.length===0&&(
                                    <div className="empty-table">
                                        No events found.
                                    </div>
                                )}
                            </div>
                        </section>
                    )}
                    {activeSection==="requests"&&(
                        <section className="management-section">
                            <div className="management-header">
                                <div>
                                    <span className="section-label">
                                        ORGANIZER SUBMISSIONS
                                    </span>
                                    <h2>
                                        Event Requests
                                    </h2>
                                    <p>
                                        Review and manage organizer event submissions.
                                    </p>
                                </div>
                            </div>
                            <div className="filter-tabs">
                                {[
                                    "All",
                                    "Pending",
                                    "Approved",
                                    "Rejected"
                                ].map(status=>(
                                    <button
                                        key={status}
                                        className={
                                            requestFilter===status
                                            ?"active"
                                            :""
                                        }
                                        onClick={()=>
                                            setRequestFilter(
                                                status
                                            )
                                        }
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                            <div className="request-cards">
                                {filteredRequests.map(request=>(
                                    <div
                                        className="request-card"
                                        key={request._id}
                                    >
                                        <div className="request-card-top">
                                            <div>
                                                <span className="request-category">
                                                    {request.category}
                                                </span>
                                                <h3>
                                                    {request.name}
                                                </h3>
                                            </div>
                                            <span
                                                className={
                                                    `status-pill ${request.status.toLowerCase()}`
                                                }
                                            >
                                                {request.status}
                                            </span>
                                        </div>
                                        <p>
                                            {request.description||
                                            "No description provided."}
                                        </p>
                                        <div className="request-meta">
                                            <span>
                                                📅 {formatDate(request.date)}
                                            </span>
                                            <span>
                                                📍 {request.city}
                                            </span>
                                            <span>
                                                ₹{request.ticketPrice}
                                            </span>
                                            <span>
                                                {request.totalSeats}
                                                {" "}
                                                seats
                                            </span>
                                        </div>
                                        <div className="request-actions">
                                            {request.status==="Pending"&&(
                                                <>
                                                    <button
                                                        className="approve-button"
                                                        onClick={()=>
                                                            approveRequest(
                                                                request._id
                                                            )
                                                        }
                                                    >
                                                        ✓ Approve
                                                    </button>
                                                    <button
                                                        className="reject-button"
                                                        onClick={()=>
                                                            rejectRequest(
                                                                request._id
                                                            )
                                                        }
                                                    >
                                                        × Reject
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                className="delete-button"
                                                onClick={()=>
                                                    deleteRequest(
                                                        request._id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {filteredRequests.length===0&&(
                                    <div className="empty-state large">
                                        No requests found.
                                    </div>
                                )}
                            </div>
                        </section>
                    )}
                    {activeSection==="bookings"&&(
                        <section className="management-section">
                            <div className="management-header">
                                <div>
                                    <span className="section-label">
                                        TICKET TRANSACTIONS
                                    </span>
                                    <h2>
                                        Bookings
                                    </h2>
                                    <p>
                                        View every ticket booking on the platform.
                                    </p>
                                </div>
                            </div>
                            <div className="filter-bar">
                                <input
                                    value={bookingSearch}
                                    onChange={e=>
                                        setBookingSearch(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Search user, event or transaction..."
                                />
                                <span>
                                    {filteredBookings.length}
                                    {" "}
                                    bookings
                                </span>
                            </div>
                            <div className="table-panel">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Booking</th>
                                            <th>User</th>
                                            <th>Seats</th>
                                            <th>Amount</th>
                                            <th>Payment</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredBookings.map(
                                            booking=>(
                                                <tr key={booking._id}>
                                                    <td>
                                                        <strong>
                                                            {booking.eventName||
                                                            "Event"}
                                                        </strong>
                                                        <small>
                                                            {booking.transactionId||
                                                            booking._id}
                                                        </small>
                                                    </td>
                                                    <td>
                                                        {booking.userId?.name||
                                                        "Guest"}
                                                        <small>
                                                            {booking.userId?.email||
                                                            ""}
                                                        </small>
                                                    </td>
                                                    <td>
                                                        {booking.seats?.join(
                                                            ", "
                                                        )||
                                                        "—"}
                                                    </td>
                                                    <td>
                                                        {formatCurrency(
                                                            booking.amount
                                                        )}
                                                    </td>
                                                    <td>
                                                        <span
                                                            className={
                                                                `status-pill ${
                                                                    booking.paymentStatus==="Successful"
                                                                    ?"approved"
                                                                    :"pending"
                                                                }`
                                                            }
                                                        >
                                                            {booking.paymentStatus}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {formatDate(
                                                            booking.createdAt
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                                {filteredBookings.length===0&&(
                                    <div className="empty-table">
                                        No bookings found.
                                    </div>
                                )}
                            </div>
                        </section>
                    )}
                    {activeSection==="users"&&(
                        <section className="management-section">
                            <div className="management-header">
                                <div>
                                    <span className="section-label">
                                        USER MANAGEMENT
                                    </span>
                                    <h2>
                                        Users
                                    </h2>
                                    <p>
                                        Manage registered TheShowSpot users.
                                    </p>
                                </div>
                            </div>
                            <div className="filter-bar">
                                <input
                                    value={userSearch}
                                    onChange={e=>
                                        setUserSearch(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Search users..."
                                />
                                <span>
                                    {filteredUsers.length}
                                    {" "}
                                    users
                                </span>
                            </div>
                            <div className="table-panel">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Phone</th>
                                            <th>Role</th>
                                            <th>Status</th>
                                            <th>Joined</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map(
                                            user=>(
                                                <tr key={user._id}>
                                                    <td>
                                                        <strong>
                                                            {user.name}
                                                        </strong>
                                                        <small>
                                                            {user.email}
                                                        </small>
                                                    </td>
                                                    <td>
                                                        {user.phone||
                                                        "—"}
                                                    </td>
                                                    <td>
                                                        {user.role}
                                                    </td>
                                                    <td>
                                                        <span
                                                            className={
                                                                `status-pill ${
                                                                    user.status==="Active"
                                                                    ?"approved"
                                                                    :"rejected"
                                                                }`
                                                            }
                                                        >
                                                            {user.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {formatDate(
                                                            user.createdAt
                                                        )}
                                                    </td>
                                                    <td>
                                                        <button
                                                            className={
                                                                user.status==="Blocked"
                                                                ?"unblock-button"
                                                                :"block-button"
                                                            }
                                                            onClick={()=>
                                                                toggleUserStatus(
                                                                    user
                                                                )
                                                            }
                                                        >
                                                            {user.status==="Blocked"
                                                                ?"Unblock"
                                                                :"Block"
                                                            }
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}
                    {activeSection==="payments"&&(
                        <section className="management-section">
                            <div className="management-header">
                                <div>
                                    <span className="section-label">
                                        PAYMENT CENTER
                                    </span>
                                    <h2>
                                        Payments
                                    </h2>
                                    <p>
                                        Monitor Razorpay transactions and revenue.
                                    </p>
                                </div>
                            </div>
                            <div className="payment-stat-grid">
                                <div>
                                    <span>
                                        Total Revenue
                                    </span>
                                    <strong>
                                        {formatCurrency(
                                            payments?.revenue||0
                                        )}
                                    </strong>
                                </div>
                                <div>
                                    <span>
                                        Successful
                                    </span>
                                    <strong>
                                        {payments?.successfulCount||0}
                                    </strong>
                                </div>
                                <div>
                                    <span>
                                        Pending
                                    </span>
                                    <strong>
                                        {payments?.pendingCount||0}
                                    </strong>
                                </div>
                            </div>
                            <div className="table-panel">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Transaction</th>
                                            <th>User</th>
                                            <th>Event</th>
                                            <th>Amount</th>
                                            <th>Method</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(payments?.payments||[]).map(
                                            payment=>(
                                                <tr key={payment._id}>
                                                    <td>
                                                        <strong>
                                                            {payment.transactionId||
                                                            payment._id}
                                                        </strong>
                                                    </td>
                                                    <td>
                                                        {payment.userId?.name||
                                                        "Guest"}
                                                    </td>
                                                    <td>
                                                        {payment.eventName||
                                                        "Event"}
                                                    </td>
                                                    <td>
                                                        {formatCurrency(
                                                            payment.amount
                                                        )}
                                                    </td>
                                                    <td>
                                                        {payment.paymentMethod||
                                                        "—"}
                                                    </td>
                                                    <td>
                                                        <span
                                                            className={
                                                                `status-pill ${
                                                                    payment.paymentStatus==="Successful"
                                                                    ?"approved"
                                                                    :"pending"
                                                                }`
                                                            }
                                                        >
                                                            {payment.paymentStatus}
                                                        </span>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}
                    {activeSection==="analytics"&&(
                        <section className="management-section">
                            <div className="management-header">
                                <div>
                                    <span className="section-label">
                                        PERFORMANCE
                                    </span>
                                    <h2>
                                        Analytics
                                    </h2>
                                    <p>
                                        Understand what's performing on your platform.
                                    </p>
                                </div>
                            </div>
                            <div className="analytics-large-grid">
                                <div className="dashboard-panel">
                                    <div className="panel-header">
                                        <div>
                                            <h3>
                                                Popular Events
                                            </h3>
                                            <p>
                                                Based on successful bookings
                                            </p>
                                        </div>
                                    </div>
                                    <div className="ranking-list">
                                        {(analytics?.eventBookings||[])
                                        .map((event,index)=>(
                                            <div
                                                className="ranking-row"
                                                key={event._id||index}
                                            >
                                                <b>
                                                    #{index+1}
                                                </b>
                                                <div>
                                                    <strong>
                                                        {event._id||
                                                        "Unnamed Event"}
                                                    </strong>
                                                    <span>
                                                        {event.bookings}
                                                        {" "}
                                                        bookings
                                                    </span>
                                                </div>
                                                <strong>
                                                    {formatCurrency(
                                                        event.revenue
                                                    )}
                                                </strong>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="dashboard-panel">
                                    <div className="panel-header">
                                        <div>
                                            <h3>
                                                Event Categories
                                            </h3>
                                            <p>
                                                Events by category
                                            </p>
                                        </div>
                                    </div>
                                    <div className="category-list">
                                        {(analytics?.categoryStats||[])
                                        .map(category=>(
                                            <div
                                                key={category._id}
                                                className="category-row"
                                            >
                                                <span>
                                                    {category._id||
                                                    "Other"}
                                                </span>
                                                <div className="category-track">
                                                    <div
                                                        style={{
                                                            width:
                                                                `${Math.min(
                                                                    (
                                                                        category.count/
                                                                        Math.max(
                                                                            data?.events?.total||1,
                                                                            1
                                                                        )
                                                                    )*100,
                                                                    100
                                                                )}%`
                                                        }}
                                                    ></div>
                                                </div>
                                                <strong>
                                                    {category.count}
                                                </strong>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}
                    {activeSection==="settings"&&(
                        <section className="management-section">
                            <div className="management-header">
                                <div>
                                    <span className="section-label">
                                        ADMINISTRATION
                                    </span>
                                    <h2>
                                        Settings
                                    </h2>
                                    <p>
                                        Current administrator configuration.
                                    </p>
                                </div>
                            </div>
                            <div className="settings-grid">
                                <div className="settings-card">
                                    <div className="settings-icon">
                                        A
                                    </div>
                                    <div>
                                        <span>
                                            Administrator
                                        </span>
                                        <strong>
                                            {admin.username||"admin"}
                                        </strong>
                                        <small>
                                            Administrator access
                                        </small>
                                    </div>
                                </div>
                                <div className="settings-card">
                                    <div className="settings-icon">
                                        ●
                                    </div>
                                    <div>
                                        <span>
                                            System Status
                                        </span>
                                        <strong>
                                            Operational
                                        </strong>
                                        <small>
                                            MongoDB and dashboard connected
                                        </small>
                                    </div>
                                </div>
                                <div className="settings-card">
                                    <div className="settings-icon">
                                        ↻
                                    </div>
                                    <div>
                                        <span>
                                            Dashboard Updates
                                        </span>
                                        <strong>
                                            Every 10 seconds
                                        </strong>
                                        <small>
                                            Live statistics refresh automatically
                                        </small>
                                    </div>
                                </div>
                            </div>
                            <div className="settings-danger">
                                <div>
                                    <strong>
                                        Admin Session
                                    </strong>
                                    <p>
                                        Sign out of the current administrator session.
                                    </p>
                                </div>
                                <button
                                    onClick={logout}
                                >
                                    Logout
                                </button>
                            </div>
                        </section>
                    )}
                </div>
            </main>
            {showEventModal&&(
                <div
                    className="modal-overlay"
                    onMouseDown={e=>{
                        if(e.target===e.currentTarget){
                            setShowEventModal(false);
                        }
                    }}
                >
                    <div className="event-modal">
                        <div className="modal-header">
                            <div>
                                <span className="section-label">
                                    EVENT MANAGEMENT
                                </span>
                                <h2>
                                    {editingEvent
                                        ?"Edit Event"
                                        :"Create New Event"
                                    }
                                </h2>
                            </div>
                            <button
                                className="modal-close"
                                onClick={()=>
                                    setShowEventModal(false)
                                }
                            >
                                ×
                            </button>
                        </div>
                        <form
                            onSubmit={saveEvent}
                            className="event-form"
                        >
                            <div className="form-section">
                                <h3>
                                    Event Information
                                </h3>
                                <div className="form-grid">
                                    <label>
                                        Event Name *
                                        <input
                                            value={eventForm.name}
                                            onChange={e=>
                                                updateEventForm(
                                                    "name",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                    </label>
                                    <label>
                                        Category *
                                        <select
                                            value={eventForm.category}
                                            onChange={e=>
                                                updateEventForm(
                                                    "category",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        >
                                            <option value="">
                                                Select category
                                            </option>
                                            <option value="Music">
                                                Music
                                            </option>
                                            <option value="Concert">
                                                Concert
                                            </option>
                                            <option value="Comedy">
                                                Comedy
                                            </option>
                                            <option value="Sports">
                                                Sports
                                            </option>
                                            <option value="Theatre">
                                                Theatre
                                            </option>
                                            <option value="Workshop">
                                                Workshop
                                            </option>
                                            <option value="Conference">
                                                Conference
                                            </option>
                                            <option value="Other">
                                                Other
                                            </option>
                                        </select>
                                    </label>
                                    <label className="full">
                                        Description
                                        <textarea
                                            value={
                                                eventForm.description
                                            }
                                            onChange={e=>
                                                updateEventForm(
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            rows="3"
                                        ></textarea>
                                    </label>
                                </div>
                            </div>
                            <div className="form-section">
                                <h3>
                                    Date & Venue
                                </h3>
                                <div className="form-grid">
                                    <label>
                                        Date *
                                        <input
                                            type="date"
                                            value={eventForm.date}
                                            onChange={e=>
                                                updateEventForm(
                                                    "date",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                    </label>
                                    <label>
                                        Start Time
                                        <input
                                            type="time"
                                            value={eventForm.startTime}
                                            onChange={e=>
                                                updateEventForm(
                                                    "startTime",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </label>
                                    <label>
                                        End Time
                                        <input
                                            type="time"
                                            value={eventForm.endTime}
                                            onChange={e=>
                                                updateEventForm(
                                                    "endTime",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </label>
                                    <label>
                                        Venue
                                        <input
                                            value={eventForm.venue}
                                            onChange={e=>
                                                updateEventForm(
                                                    "venue",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </label>
                                    <label>
                                        City
                                        <input
                                            value={eventForm.city}
                                            onChange={e=>
                                                updateEventForm(
                                                    "city",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </label>
                                    <label>
                                        Address
                                        <input
                                            value={eventForm.address}
                                            onChange={e=>
                                                updateEventForm(
                                                    "address",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </label>
                                </div>
                            </div>
                            <div className="form-section">
                                <h3>
                                    Ticket Details
                                </h3>
                                <div className="form-grid">
                                    <label>
                                        Ticket Price *
                                        <input
                                            type="number"
                                            min="1"
                                            value={eventForm.price}
                                            onChange={e=>
                                                updateEventForm(
                                                    "price",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                    </label>
                                    <label>
                                        Total Seats *
                                        <input
                                            type="number"
                                            min="1"
                                            value={eventForm.totalSeats}
                                            onChange={e=>
                                                updateEventForm(
                                                    "totalSeats",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                    </label>
                                    <label className="full">
                                        Event Poster URL
                                        <input
                                            value={eventForm.image}
                                            onChange={e=>
                                                updateEventForm(
                                                    "image",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="https://..."
                                        />
                                    </label>
                                </div>
                            </div>
                            <div className="form-section">
                                <h3>
                                    Organizer Details
                                </h3>
                                <div className="form-grid">
                                    <label>
                                        Organizer Name
                                        <input
                                            value={
                                                eventForm.organizerName
                                            }
                                            onChange={e=>
                                                updateEventForm(
                                                    "organizerName",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </label>
                                    <label>
                                        Email
                                        <input
                                            type="email"
                                            value={eventForm.email}
                                            onChange={e=>
                                                updateEventForm(
                                                    "email",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </label>
                                    <label>
                                        Phone
                                        <input
                                            value={eventForm.phone}
                                            onChange={e=>
                                                updateEventForm(
                                                    "phone",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </label>
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={()=>
                                        setShowEventModal(false)
                                    }
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="primary-action"
                                    disabled={actionLoading}
                                >
                                    {actionLoading
                                        ?"Saving..."
                                        :editingEvent
                                        ?"Save Changes"
                                        :"Create Event"
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
export default AdminDashboard;
