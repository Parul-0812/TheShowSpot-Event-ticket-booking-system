import React from "react";
import "../styles/eventDetails.css";
import { useLocation, Link } from "react-router-dom";
import {useNavigate} from "react-router-dom";

function EventDetails(){
    const navigate = useNavigate();
    const location = useLocation();

    const event = location.state?.event;
    console.log("LOCATION DATA:", location.state);
console.log("EVENT DATA:", event);


    if(!event){
        return(
            <h1>No Event Selected</h1>
        )
    }


    return(

        <div className="details-container">

        <button 
className="back-btn"
onClick={()=>navigate(-1)}
>

← Back

</button>
            <div className="details-card">


                <img src={event.image} className="details-img"
                />


                <div className="details-info">

                    <h1>{event.name}</h1>


                    <p>
                        📍 {event.location}
                    </p>


                    <p>
                        🗓 {event.date}
                    </p>


                    <p>
                        ⏰ {event.time}
                    </p>


                    <h2>
                        {event.price}
                    </h2>


                    <p>
                    Experience an amazing event with TheShowSpot.
                    Enjoy unforgettable moments with your friends
                    and family.
                    </p>



                    <Link to="/booking" state={{ event }}
>

                        <button>
                            Book Tickets
                        </button>

                    </Link>


                </div>


            </div>


        </div>

    )

}


export default EventDetails;