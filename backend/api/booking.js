const express = require("express");
const router = express.Router();
const Booking = require("../database/booking");

router.post("/confirm", async (req, res) => {
    try {
        const {
            eventName,
            seats,
            userId,
            transactionId,
            paymentStatus
        } = req.body;

        if (!eventName || !seats || !userId || !transactionId) {
            return res.status(400).json({
                success: false,
                message: "Missing booking details"
            });
        }

        if (paymentStatus !== "Successful") {
            return res.status(400).json({
                success: false,
                message: "Payment has not been completed"
            });
        }

        const existingBooking = await Booking.findOne({
            transactionId: transactionId
        });

        if (existingBooking) {
            return res.json({
                success: true,
                message: "Booking already confirmed",
                ticketId: existingBooking._id
            });
        }

        const existingBookings = await Booking.find({
            eventName: eventName
        });

        const alreadyBookedSeats = [];

        existingBookings.forEach((booking) => {
            alreadyBookedSeats.push(...booking.seats);
        });

        const conflictingSeats = seats.filter((seat) =>
            alreadyBookedSeats.includes(seat)
        );

        if (conflictingSeats.length > 0) {
            return res.status(409).json({
                success: false,
                message: `These seats are already booked: ${conflictingSeats.join(", ")}`
            });
        }

        const booking = new Booking(req.body);

        await booking.save();

        res.json({
            success: true,
            message: "Booking Confirmed",
            ticketId: booking._id
        });
    }
    catch (error) {
        console.log("Booking Confirmation Error:", error);

        res.status(500).json({
            success: false,
            message: "Booking Failed"
        });
    }
});

router.get("/user/:userId", async (req, res) => {
    try {
        const bookings = await Booking.find({
            userId: req.params.userId
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            data: bookings
        });
    }
    catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch user bookings"
        });
    }
});

router.post("/bookedSeats", async (req, res) => {
    try {
        const { eventName } = req.body;

        console.log("Received Event Name:", eventName);

        const bookings = await Booking.find({
            eventName: eventName
        });

        let bookedSeats = [];

        bookings.forEach((booking) => {
            bookedSeats = [
                ...bookedSeats,
                ...booking.seats
            ];
        });

        console.log("Booked Seats:", bookedSeats);

        res.json({
            success: true,
            bookedSeats
        });
    }
    catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Error fetching seats"
        });
    }
});

router.post("/verify", async (req, res) => {
    try {
        const { ticketId } = req.body;

        const ticket = await Booking.findById(ticketId);

        if (!ticket) {
            return res.json({
                success: false,
                message: "Fake Ticket ❌"
            });
        }

        if (ticket.ticketStatus === "Used") {
            return res.json({
                success: false,
                message: "Ticket Already Used ❌"
            });
        }

        ticket.ticketStatus = "Used";

        await ticket.save();

        res.json({
            success: true,
            message: "Entry Allowed ✅"
        });
    }
    catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Verification Failed"
        });
    }
});

module.exports = router;