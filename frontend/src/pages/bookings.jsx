import React,{useState,useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/bookings.css";
import { QRCodeCanvas } from "qrcode.react";

function Bookings(){

    const location = useLocation();
    const navigate = useNavigate();

    const event = location.state?.event;

    const [selectedSeats,setSelectedSeats] = useState([]);
    console.log("Selected:", selectedSeats);
    const [bookedSeats,setBookedSeats] = useState([]);

    const seats = [

    {id:"A1", type:"Premium", price:500},
    {id:"A2", type:"Premium", price:500},
    {id:"A3", type:"Premium", price:500},
    {id:"A4", type:"Premium", price:500},
    {id:"A5", type:"Premium", price:500},
    {id:"A6", type:"Premium", price:500},

    {id:"B1", type:"Gold", price:350},
    {id:"B2", type:"Gold", price:350},
    {id:"B3", type:"Gold", price:350},
    {id:"B4", type:"Gold", price:350},
    {id:"B5", type:"Gold", price:350},
    {id:"B6", type:"Gold", price:350},

    {id:"C1", type:"Silver", price:200},
    {id:"C2", type:"Silver", price:200},
    {id:"C3", type:"Silver", price:200},
    {id:"C4", type:"Silver", price:200},
    {id:"C5", type:"Silver", price:200},
    {id:"C6", type:"Silver", price:200}

];
useEffect(()=>{


    const getBookedSeats = async()=>{


        const result = await axios.post(
            "http://localhost:5000/booking/bookedSeats",
            {
                eventName:event.name
            }
        );


        setBookedSeats(result.data.bookedSeats);


    }


    getBookedSeats();


},[]);
const selectSeat = (seat)=>{


    if(selectedSeats.includes(seat.id)){


        setSelectedSeats(

            selectedSeats.filter(
                item => item !== seat.id
            )

        );


    }
    else{


        setSelectedSeats([

            ...selectedSeats,

            seat.id

        ]);


    }


}


    if(!event){
        return(
            <h1>No Booking Selected</h1>
        )
    }

const total = seats
.filter(
seat => selectedSeats.includes(seat.id)
)
.reduce(
(sum,seat)=>sum+seat.price,
0
);



const confirmBooking = ()=>{


if(selectedSeats.length===0){

alert("Please select at least one seat");

return;

}


navigate(
"/payment",
{
state:{


eventName:event.name,
eventDate:event.date,

eventLocation:event.location,

seats:selectedSeats,

amount:total,

user:"Parul"


}

}
);


}

    return(

        <div className="booking-container">


            <h1>🎟 Book Tickets</h1>


            <div className="booking-card">


                <img 
                    src={event.image}
                    className="booking-img"
                />


                <h2>{event.name}</h2>


                <p>
                    📍 {event.location}
                </p>


                <p>
                    📅 {event.date}
                </p>


                <p>
                    ⏰ {event.time}
                </p>


                <h3>
                    Ticket Price: {event.price}
                </h3>



                <h3>Select Seats</h3>


<div className="screen">
STAGE / SCREEN
</div>


<div className="seat-grid">
{
seats.map((seat)=>(

<button

key={seat.id}

disabled={
bookedSeats.includes(seat.id)
}

className={

bookedSeats.includes(seat.id)

?

"seat booked"

:

selectedSeats.includes(seat.id)

?

"seat selected"

:

"seat"

}


onClick={()=>selectSeat(seat)}

>

{seat.id}


</button>


))
}

</div>


<div className="seat-info">

<p>Silver: ₹200</p>

<p>Gold: ₹350</p>

<p>Premium: ₹500</p>

</div>


<h2>
Total Amount: ₹{total}
</h2>


                


<button onClick={confirmBooking}>

    Confirm Booking

</button>


            </div>


        </div>


    )

}

export default Bookings;