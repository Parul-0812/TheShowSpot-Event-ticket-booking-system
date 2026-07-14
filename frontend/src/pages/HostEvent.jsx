import React, { useState } from "react";
import axios from "axios";
import "../styles/hostevent.css";
import Navbar from "../components/navbar";

function HostEvent() {
    

    const [eventData, setEventData] = useState({

        eventName: "",
        category: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        venue: "",
        city: "",
        address: "",
        totalSeats: "",
        ticketPrice: "",
        organizerName: "",
        email: "",
        phone: "",
        image: ""

    });

    const handleChange = (e) => {

        const { name, value } = e.target;

        setEventData({

            ...eventData,
            [name]: value

        });

    };

    const handleImage = (e) => {

        const file = e.target.files[0];

        if(file){

            setEventData({

                ...eventData,
                image: URL.createObjectURL(file)

            });

        }

    };

    const submitEvent = async(e)=>{

        e.preventDefault();

        try{

            await axios.post("http://localhost:5000/events/add",eventData);

            alert("Event Submitted Successfully!");

            setEventData({

                eventName:"",
                category:"",
                description:"",
                date:"",
                startTime:"",
                endTime:"",
                venue:"",
                city:"",
                address:"",
                totalSeats:"",
                ticketPrice:"",
                organizerName:"",
                email:"",
                phone:"",
                image:""

            });

        }

        catch(error){

            alert("Unable to Submit Event");

        }

    };

    return(
        <>
        <Navbar />

<div className="host-page">

<div className="host-hero">

<h1>Host Your Event</h1>

<p>

Bring your ideas to life and reach thousands of attendees through TheShowSpot.

</p>

</div>


<div className="host-container">

<form className="event-form" onSubmit={submitEvent}>

<h2>Event Information</h2>

<input
type="text"
placeholder="Event Name"
name="eventName"
value={eventData.eventName}
onChange={handleChange}
required
/>

<select
name="category"
value={eventData.category}
onChange={handleChange}
required
>

<option value="">Select Category</option>

<option>Movies</option>
<option>Concert</option>
<option>Comedy</option>
<option>Sports</option>
<option>Workshop</option>

</select>

<textarea

placeholder="Event Description"
name="description"
rows="5"
value={eventData.description}
onChange={handleChange}

/>

<h2>Date & Time</h2>

<input

type="date"
name="date"
value={eventData.date}
onChange={handleChange}

/>

<div className="time-row">

<input

type="time"
name="startTime"
value={eventData.startTime}
onChange={handleChange}

/>

<input

type="time"
name="endTime"
value={eventData.endTime}
onChange={handleChange}

/>

</div>

<h2>Venue Details</h2>

<input

type="text"
placeholder="Venue Name"
name="venue"
value={eventData.venue}
onChange={handleChange}

/>

<input

type="text"
placeholder="City"
name="city"
value={eventData.city}
onChange={handleChange}

/>

<input

type="text"
placeholder="Full Address"
name="address"
value={eventData.address}
onChange={handleChange}

/>

<h2>Ticket Details</h2>

<div className="ticket-row">

<input

type="number"
placeholder="Total Seats"
name="totalSeats"
value={eventData.totalSeats}
onChange={handleChange}

/>

<input

type="number"
placeholder="Ticket Price"
name="ticketPrice"
value={eventData.ticketPrice}
onChange={handleChange}

/>

</div>

<h2>Upload Poster</h2>

<input
type="file"
accept="image/*"
onChange={handleImage}
/>

<h2>Organizer Details</h2>

<input

type="text"
placeholder="Organizer Name"
name="organizerName"
value={eventData.organizerName}
onChange={handleChange}

/>

<input

type="email"
placeholder="Email"
name="email"
value={eventData.email}
onChange={handleChange}

/>

<input type="text" placeholder="Phone Number" name="phone" value={eventData.phone} onChange={handleChange}/>

<button className="submit-btn">

Host My Event

</button>

</form>



<div className="preview-card">

<h2>Live Preview</h2>

{

eventData.image ?

<img src={eventData.image} alt="preview"/>

:

<div className="placeholder">

Upload Event Poster

</div>

}

<h3>

{

eventData.eventName || "Event Name"

}

</h3>

<p>

📅 {eventData.date || "Date"}

</p>

<p>

📍 {eventData.venue || "Venue"}

</p>

<p>

🎟 ₹{eventData.ticketPrice || "0"}

</p>

<p>

👥 {eventData.totalSeats || "0"} Seats

</p>

<p>

🎭 {eventData.category || "Category"}

</p>

</div>

</div>

</div>
</>

    );

}

export default HostEvent;