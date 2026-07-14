import React, { useState } from "react";
import axios from "axios";
import "../styles/hostevent.css";
import Navbar from "../components/navbar";
import { useNavigate } from "react-router-dom";

function HostEvent() {
    const navigate = useNavigate();
    

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
    const [imageFile, setImageFile] = useState(null);

const [loading, setLoading] = useState(false);
const [submitted, setSubmitted] = useState(false);

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

        setImageFile(file);

        setEventData({

            ...eventData,

            image: URL.createObjectURL(file)

        });

    }

};

    const submitEvent = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

        const formData = new FormData();

        formData.append("name", eventData.eventName);
        formData.append("category", eventData.category);
        formData.append("description", eventData.description);
        formData.append("date", eventData.date);
        formData.append("startTime", eventData.startTime);
        formData.append("endTime", eventData.endTime);
        formData.append("venue", eventData.venue);
        formData.append("city", eventData.city);
        formData.append("address", eventData.address);
        formData.append("ticketPrice", eventData.ticketPrice);
        formData.append("totalSeats", eventData.totalSeats);
        formData.append("organizerName", eventData.organizerName);
        formData.append("email", eventData.email);
        formData.append("phone", eventData.phone);

        if(imageFile){

            formData.append("image", imageFile);

        }

        const response = await axios.post(

            "http://localhost:5000/event-request/submit",

            formData,

            {

                headers:{

                    "Content-Type":"multipart/form-data"

                }

            }

        );

        if(response.data.success){

            setSubmitted(true);

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

            setImageFile(null);

        }

    }

    catch(error){

        console.log(error);

        alert("Unable to Submit Event");

    }

    finally{

        setLoading(false);

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
<option>Shows</option>
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

<h2>Upload Event Poster</h2>

<label className="upload-box">

    <input
        type="file"
        accept="image/*"
        onChange={handleImage}
        hidden
    />

    {
        eventData.image ?

        <img
            src={eventData.image}
            className="upload-preview"
            alt="poster"
        />

        :

        <div className="upload-content">

            <h1>📸</h1>

            <h3>Drag & Drop Poster</h3>

            <p>or Click to Browse</p>


        </div>

    }

</label>

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

<button
className="submit-btn"
disabled={loading}
>

{

loading ?

"Submitting..."

:

"Host My Event"

}

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

📍 {eventData.city || "Venue"}

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
{

submitted && (

<div className="modal-overlay">

<div className="success-modal">

<div className="success-animation">

✅

</div>

<h2>

Event Submitted Successfully!

</h2>

<p>

Thank you for choosing

<strong> TheShowSpot</strong>.

</p>

<p>

Your event has been submitted for review.

Once approved,

it will automatically appear on our platform.

</p>

<div className="modal-buttons">

<button

className="secondary-btn"

onClick={()=>{

setSubmitted(false);

}}

>

Host Another Event

</button>

<button

className="primary-btn"

onClick={()=>navigate("/")}

>

Back to Home

</button>

</div>

</div>

</div>

)

}
</>

    );

}

export default HostEvent;