import React from "react";
import { useLocation, Link } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import "../styles/ticket.css";


function Ticket(){

    const location = useLocation();

    const booking = location.state;


    if(!booking){

        return(
            <h1>No Ticket Found</h1>
        )

    }


    return(

        <div className="ticket-container">


            <div className="ticket-card">


                <h1>🎟 Booking Confirmed</h1>


                <h2>
                    {booking.eventName}
                </h2>


                <p>
                    📍 Location: {booking.eventLocation}
                </p>


                <p>
                    📅 Date: {booking.eventDate}
                </p>


                <p>
                    💺 Seats: {booking.seats.join(", ")}
                </p>


                <h2>
                    Amount Paid: ₹{booking.amount}
                </h2>

                <div className="qr-section">

    <h3>Your Entry QR</h3>


    <QRCodeCanvas

        value={booking.ticketId}

        size={180}

    />


    <p>
        Ticket ID: {booking.ticketId}
    </p>


</div>


                <p className="message">
                    Thank you for booking with TheShowSpot ✨
                </p>



                <Link to="/">

                    <button>
                        Back To Home
                    </button>

                </Link>


            </div>


        </div>

    )

}


export default Ticket;