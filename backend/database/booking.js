const mongoose = require("mongoose");


const bookingSchema = new mongoose.Schema({

    userName:{
        type:String
    },

    eventName:{
        type:String
    },

    eventDate:{
        type:String
    },

    eventLocation:{
        type:String
    },

    seats:{
        type:Array
    },

    amount:{
        type:Number
    },
    ticketStatus:{
    type:String,
    default:"Valid"
}

});


module.exports = mongoose.model("Booking", bookingSchema);