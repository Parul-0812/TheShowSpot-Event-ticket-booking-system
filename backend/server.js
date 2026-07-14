const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const userApi = require("./api/user");
const app = express();
const bookingApi = require("./api/booking");
const eventRoute = require("./api/events");
const eventRequestApi = require("./api/eventRequest");


app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/user", userApi);
app.use("/booking", bookingApi);
app.use("/events",eventRoute);
app.use("/event-request", eventRequestApi);


mongoose.connect("mongodb://127.0.0.1:27017/TheShowSpot")
.then(()=>{
    console.log("MongoDB Connected");
})
.catch((error)=>{
    console.log(error);
});


app.get("/", (req,res)=>{

    res.send("TheShowSpot Backend Running");

});



app.listen(5000, ()=>{

    console.log("Server started on port 5000");

});