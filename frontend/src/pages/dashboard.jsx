import React,{useEffect,useState} from "react";
import axios from "axios";
import "../styles/dashboard.css";


function Dashboard(){


    const [bookings,setBookings] = useState([]);
    const [ticketId,setTicketId] = useState("");

const [message,setMessage] = useState("");


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


<h2>
Total Bookings: {bookings.length}
</h2>

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
User: {booking.userName}
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