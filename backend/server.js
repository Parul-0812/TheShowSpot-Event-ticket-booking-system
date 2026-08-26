require("dotenv").config();

const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");
const path=require("path");

const userApi=require("./api/user");
const bookingApi=require("./api/booking");
const eventRoute=require("./api/events");
const eventRequestApi=require("./api/eventRequest");
const paymentRoutes=require("./api/payment");
const adminApi=require("./api/admin");

const app=express();

app.use(cors());

app.use(express.json({
    verify:(req,res,buf)=>{
        if(req.originalUrl==="/payment/webhook"){
            req.rawBody=buf.toString();
        }
    }
}));

app.use("/uploads",express.static(path.join(__dirname,"uploads")));

app.use("/user",userApi);
app.use("/booking",bookingApi);
app.use("/events",eventRoute);
app.use("/event-request",eventRequestApi);
app.use("/payment",paymentRoutes);
app.use("/admin",adminApi);

mongoose.connect("mongodb://127.0.0.1:27017/TheShowSpot")
.then(()=>{
    console.log("MongoDB Connected");
})
.catch(error=>{
    console.log("MongoDB Connection Error:",error);
});

app.get("/",(req,res)=>{
    res.send("TheShowSpot Backend Running");
});

app.listen(5000,()=>{
    console.log("Server started on port 5000");
});