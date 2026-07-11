const express = require("express");

const router = express.Router();

const Booking = require("../database/booking");



router.post("/confirm", async(req,res)=>{

    try{

        const booking = new Booking(req.body);

await booking.save();


res.json({

    success:true,

    message:"Booking Confirmed",

    ticketId: booking._id

})


    }
    catch(error){

        res.json({
            success:false,
            message:"Booking Failed"
        })

    }

})

router.get("/all", async(req,res)=>{

    try{

        const bookings = await Booking.find();


        res.json({
            success:true,
            data:bookings
        })

    }
    catch(error){

        res.json({
            success:false,
            message:"Unable to fetch bookings"
        })

    }

})

router.post("/bookedSeats", async (req, res) => {

    try{

        const { eventName } = req.body;

        console.log("Received Event Name:", eventName);

        const allBookings = await Booking.find();

        console.log("All Bookings:", allBookings);

        const bookings = await Booking.find({
            eventName: eventName
        });

        console.log("Matching Bookings:", bookings);

        let bookedSeats = [];

        bookings.forEach((booking)=>{
            bookedSeats = [
                ...bookedSeats,
                ...booking.seats
            ];
        });

        console.log("Booked Seats:", bookedSeats);

        res.json({
            success:true,
            bookedSeats
        });

    }
    catch(error){

        console.log(error);

        res.json({
            success:false,
            message:"Error fetching seats"
        });

    }

});

router.post("/verify", async(req,res)=>{


    try{


        const {ticketId} = req.body;


        const ticket = await Booking.findById(ticketId);


        if(!ticket){


            return res.json({

                success:false,

                message:"Fake Ticket ❌"

            })

        }



        if(ticket.ticketStatus==="Used"){


            return res.json({

                success:false,

                message:"Ticket Already Used ❌"

            })


        }



        ticket.ticketStatus="Used";


        await ticket.save();



        res.json({

            success:true,

            message:"Entry Allowed ✅"

        })



    }
    catch(error){


        res.json({

            success:false,

            message:"Verification Failed"

        })


    }


})

module.exports = router;