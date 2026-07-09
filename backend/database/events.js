const mongoose = require("mongoose");


const eventSchema = new mongoose.Schema({

    name:{
        type:String
    },

    category:{
        type:String
    },

    location:{
        type:String
    },

    date:{
        type:String
    },

    time:{
        type:String
    },

    price:{
        type:String
    },

    image:{
        type:String
    }

},
{
    timestamps:true
});


module.exports = mongoose.model(
    "Event",
    eventSchema
);