const express = require("express");
const axios = require("axios");
const router = express.Router();
const Booking = require("../database/booking");

const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
const CASHFREE_API_URL = "https://sandbox.cashfree.com/pg";
const CASHFREE_API_VERSION = "2025-01-01";

router.post("/confirm", async (req, res) => {
    try {
        const {
            eventName,
            eventDate,
            eventLocation,
            seats,
            amount,
            userId,
            transactionId,
            paymentMethod
        } = req.body;

        if (
            !eventName ||
            !eventDate ||
            !eventLocation ||
            !seats ||
            !userId ||
            !transactionId
        ) {
            return res.status(400).json({
                success: false,
                message: "Missing booking details"
            });
        }

        // ================= VERIFY CASHFREE PAYMENT =================

        const cashfreeResponse = await axios.get(
            `${CASHFREE_API_URL}/orders/${transactionId}`,
            {
                headers: {
                    "x-client-id": CASHFREE_APP_ID,
                    "x-client-secret": CASHFREE_SECRET_KEY,
                    "x-api-version": CASHFREE_API_VERSION,
                    "Accept": "application/json"
                }
            }
        );

        const cashfreeStatus = cashfreeResponse.data.order_status;

        console.log(
            "Cashfree Order:",
            transactionId,
            "Status:",
            cashfreeStatus
        );

        if (cashfreeStatus !== "PAID") {
            return res.status(400).json({
                success: false,
                message: "Payment has not been completed",
                paymentStatus: cashfreeStatus
            });
        }

        // ================= CHECK DUPLICATE PAYMENT =================

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

        // ================= CHECK SEAT AVAILABILITY =================

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

        // ================= CREATE BOOKING =================

        const booking = new Booking({
            userId: userId,
            eventName: eventName,
            eventDate: eventDate,
            eventLocation: eventLocation,
            seats: seats,
            amount: amount,
            paymentMethod: paymentMethod || "Cashfree",
            paymentStatus: "Successful",
            transactionId: transactionId,
            ticketStatus: "Valid"
        });

        await booking.save();

        res.json({
            success: true,
            message: "Booking Confirmed",
            ticketId: booking._id
        });

    } catch (error) {
        console.log("Booking Confirmation Error:");

        if (error.response) {
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }

        res.status(500).json({
            success: false,
            message: "Unable to confirm booking"
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
    } catch (error) {
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

        res.json({
            success: true,
            bookedSeats
        });

    } catch (error) {
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

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Verification Failed"
        });
    }
});

module.exports = router;