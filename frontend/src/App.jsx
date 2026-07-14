import { Routes, Route } from "react-router-dom";
import EventDetails from "./pages/eventDetails";

import Login from "./pages/login";

import Register from "./pages/register";
import Home from "./pages/homepage";
import Events from "./pages/events";
import Bookings from "./pages/bookings";
import Ticket from "./pages/ticket";
import Dashboard from "./pages/dashboard";
import MyBookings from "./pages/myBookings";
import Notifications from "./pages/notifications";
import Payment from "./pages/payment";
import AdminLogin from "./pages/adminLogin";
import HostEvent from "./pages/HostEvent";
import Features from "./pages/Features";

function App(){


    return(


        <Routes>

            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/login" element={<Login />} />
            <Route path="/payment" element={<Payment/>}/>
            <Route path="/admin" element={<AdminLogin/>}/>


            <Route path="/register" element={<Register />} />
            <Route path="/eventDetails" element={<EventDetails />} />
            <Route path="/booking" element={<Bookings/>}/>
            <Route path="/ticket" element={<Ticket/>}/>
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/myBookings" element={<MyBookings/>}/>
            <Route path="/host-event" element={<HostEvent />} />
            <Route path="/notifications" element={<Notifications/>}/>
            <Route
path="/features"
element={<Features/>}
/>
            


        </Routes>


    )


}



export default App;