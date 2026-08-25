const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    eventName: {
        type: String,
        required: true
    },

    eventDate: {
        type: String,
        required: true
    },

    eventLocation: {
        type: String,
        required: true
    },

    seats: {
        type: [String],
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    paymentMethod: {
        type: String,
        required: true
    },

    paymentStatus: {
        type: String,
        enum: ["Pending", "Successful", "Failed"],
        default: "Pending"
    },

    transactionId: {
        type: String,
        unique: true,
        sparse: true
    },

    ticketStatus: {
        type: String,
        enum: ["Valid", "Used", "Cancelled", "Expired"],
        default: "Valid"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Booking", bookingSchema);