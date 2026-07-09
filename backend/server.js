const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userApi = require("./api/user");
const app = express();
const bookingApi = require("./api/booking");
const eventRoute = require("./api/events");

// middleware
app.use(express.json());
app.use(cors());
app.use("/user", userApi);
app.use("/booking", bookingApi);
app.use("/events",eventRoute);

// connect database
mongoose.connect("mongodb://127.0.0.1:27017/TheShowSpot")
.then(()=>{
    console.log("MongoDB Connected");
})
.catch((error)=>{
    console.log(error);
});

// checking server
app.get("/", (req,res)=>{

    res.send("TheShowSpot Backend Running");

});


// start server
app.listen(5000, ()=>{

    console.log("Server started on port 5000");

});