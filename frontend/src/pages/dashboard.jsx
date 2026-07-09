import React,{useEffect,useState} from "react";
import axios from "axios";
import "../styles/dashboard.css";


function Dashboard(){


    const [bookings,setBookings] = useState([]);
    const [ticketId,setTicketId] = useState("");

const [message,setMessage] = useState("");
const totalRevenue = bookings.reduce(
(sum,item)=>sum+item.amount,
0
);


const bookedSeats = bookings.reduce(
(total,item)=>total+item.seats.length,
0
);


const totalSeats = 180;


const availableSeats = totalSeats - bookedSeats;


const validTickets = bookings.filter(
item=>item.ticketStatus==="Valid"
).length;


const usedTickets = bookings.filter(
item=>item.ticketStatus==="Used"
).length;


    useEffect(()=>{

        getBookings();

    },[]);



    const getBookings = async()=>{


        try{

            const result = await axios.get(
                "http://localhost:5000/booking/all"
            );


            setBookings(result.data.data);

        }

        catch(error){

            console.log(error);

        }

    }

const verifyTicket = async()=>{


    const result = await axios.post(
        "http://localhost:5000/booking/verify",
        {
            ticketId:ticketId
        }
    );


    setMessage(result.data.message);


    getBookings();


}

return(

<div className="dashboard">


<h1>Admin Dashboard</h1>


<div className="dashboard-stats">


<div className="stat-card">

<h3>Total Bookings</h3>

<h1>{bookings.length}</h1>

</div>



<div className="stat-card">

<h3>Total Revenue</h3>

<h1>₹{totalRevenue}</h1>

</div>



<div className="stat-card">

<h3>Booked Seats</h3>

<h1>{bookedSeats}</h1>

</div>



<div className="stat-card">

<h3>Available Seats</h3>

<h1>{availableSeats}</h1>

</div>



<div className="stat-card">

<h3>Valid Tickets</h3>

<h1>{validTickets}</h1>

</div>



<div className="stat-card">

<h3>Used Tickets</h3>

<h1>{usedTickets}</h1>

</div>


</div>

<div className="verify-box">


<h2>
QR Ticket Verification
</h2>


<input

type="text"

placeholder="Enter Ticket ID"

value={ticketId}

onChange={(e)=>setTicketId(e.target.value)}

/>


<button onClick={verifyTicket}>

Verify Ticket

</button>


<h3>
{message}
</h3>


</div>

<div className="booking-list">


{

bookings.map((booking)=>(


<div className="admin-card">


<h2>
{booking.eventName}
</h2>


<p>
User: {booking.user}
</p>


<p>
Location: {booking.eventLocation}
</p>


<p>
Seats: {booking.seats.join(", ")}
</p>


<p>
Amount: ₹{booking.amount}
</p>


<p className="valid">

Ticket Status: {booking.ticketStatus}

</p>


</div>


))

}


</div>


</div>


)


}


export default Dashboard;