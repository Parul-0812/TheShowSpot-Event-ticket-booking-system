const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({

    // ===============================
    // Host / User
    // ===============================

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },

    // ===============================
    // Event Information
    // ===============================

    name: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    // ===============================
    // Date & Time
    // ===============================

    date: {
        type: String,
        required: true
    },

    startTime: {
        type: String
    },

    endTime: {
        type: String
    },

    // ===============================
    // Venue
    // ===============================

    venue: {
        type: String
    },

    city: {
        type: String
    },

    address: {
        type: String
    },

    location: {
        type: String
    },

    // ===============================
    // Ticket Details
    // ===============================

    price: {
        type: Number,
        required: true
    },

    totalSeats: {
        type: Number
    },

    // ===============================
    // Event Poster
    // ===============================

    image: {
        type: String
    },

    // ===============================
    // Organizer Details
    // ===============================

    organizerName: {
        type: String
    },

    email: {
        type: String
    },

    phone: {
        type: String
    },

    // ===============================
    // Approval Status
    // ===============================

    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Event", eventSchema);