const mongoose = require("mongoose");

const eventRequestSchema = new mongoose.Schema({

    // Event Information
    name: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    // Date & Time
    date: {
        type: String,
        required: true
    },

    startTime: {
        type: String,
        required: true
    },

    endTime: {
        type: String,
        required: true
    },

    // Venue Details
    venue: {
        type: String,
        required: true
    },

    city: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    // Ticket Details
    ticketPrice: {
        type: Number,
        required: true
    },

    totalSeats: {
        type: Number,
        required: true
    },

    // Organizer Details
    organizerName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    // Event Poster
    image: {
        type: String,
        default: ""
    },

    // Request Status
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending"
    }

},
{
    timestamps: true
});

module.exports = mongoose.model("EventRequest", eventRequestSchema);