import React,{useState,useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/bookings.css";
import { QRCodeCanvas } from "qrcode.react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

function Bookings(){

    const location = useLocation();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const event = location.state?.event;
    const basePrice = event ? Number(event.price.replace("₹","")):0;

    const [selectedSeats,setSelectedSeats] = useState([]);
    console.log("Selected:", selectedSeats);
    const [bookedSeats,setBookedSeats] = useState([]);

    const seats = [

    {id:"A1", type:"Premium", price:basePrice+200},
    {id:"A2", type:"Premium", price:basePrice+200},
    {id:"A3", type:"Premium", price:basePrice+200},
    {id:"A4", type:"Premium", price:basePrice+200},
    {id:"A5", type:"Premium", price:basePrice+200},
    {id:"A6", type:"Premium", price:basePrice+200},

    {id:"B1", type:"Gold", price:basePrice+100},
    {id:"B2", type:"Gold", price:basePrice+100},
    {id:"B3", type:"Gold", price:basePrice+100},
    {id:"B4", type:"Gold", price:basePrice+100},
    {id:"B5", type:"Gold", price:basePrice+100},
    {id:"B6", type:"Gold", price:basePrice+100},

    {id:"C1", type:"Silver", price:basePrice},
    {id:"C2", type:"Silver", price:basePrice},
    {id:"C3", type:"Silver", price:basePrice},
    {id:"C4", type:"Silver", price:basePrice},
    {id:"C5", type:"Silver", price:basePrice},
    {id:"C6", type:"Silver", price:basePrice}

];
useEffect(() => {

    if(!event) return;

    const getBookedSeats = async () => {

        try{

            const result = await axios.post(
                "http://localhost:5000/booking/bookedSeats",
                {
                    eventName: event.name
                }
            );

            console.log("Event:", event.name);
            console.log("Booked Seats:", result.data.bookedSeats);

            setBookedSeats(result.data.bookedSeats);

        }
        catch(error){

            console.log(error);

        }

    }

    getBookedSeats();

}, [event]);
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

user:user.name


}

}
);


}

    return(
        <>
        <Navbar />

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
Starting From: {event.price}
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

<p>
Silver: ₹{basePrice}
</p>


<p>
Gold: ₹{basePrice+100}
</p>


<p>
Premium: ₹{basePrice+200}
</p>

</div>


<h2>
Total Amount: ₹{total}
</h2>


                


<button onClick={confirmBooking}>

    Confirm Booking

</button>


            </div>


        </div>
        <Footer />
</>

    )

}

export default Bookings;