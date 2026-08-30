const express=require("express");
const router=express.Router();
const Booking=require("../database/booking");

router.post("/confirm",async(req,res)=>{
try{
const{transactionId,seats,eventName}=req.body;

if(!transactionId){
return res.json({
success:false,
message:"Transaction ID is required"
});
}

const existingBooking=await Booking.findOne({transactionId});

if(existingBooking){
if(existingBooking.paymentStatus==="Successful"){
return res.json({
success:true,
message:"Booking already confirmed",
ticketId:existingBooking._id
});
}
return res.json({
success:false,
message:"Payment has not been confirmed"
});
}

const bookedBookings=await Booking.find({
eventName,
paymentStatus:"Successful"
});

const bookedSeats=bookedBookings.flatMap(booking=>booking.seats||[]);
const duplicateSeats=(seats||[]).filter(seat=>bookedSeats.includes(seat));

if(duplicateSeats.length>0){
return res.json({
success:false,
message:`These seats are already booked: ${duplicateSeats.join(", ")}`
});
}

const booking=new Booking({
...req.body,
paymentStatus:"Successful",
ticketStatus:"Valid"
});

await booking.save();

res.json({
success:true,
message:"Booking Confirmed",
ticketId:booking._id
});
}catch(error){
console.log("Booking Confirmation Error:",error);
res.status(500).json({
success:false,
message:"Booking Failed"
});
}
});

router.get("/user/:userId",async(req,res)=>{
try{
const bookings=await Booking.find({
userId:req.params.userId,
paymentStatus:"Successful"
}).sort({createdAt:-1});

res.json({
success:true,
data:bookings
});
}catch(error){
console.log(error);
res.json({
success:false,
message:"Unable to fetch user bookings"
});
}
});

router.post("/bookedSeats",async(req,res)=>{
try{
const{eventName}=req.body;

const bookings=await Booking.find({
eventName,
paymentStatus:"Successful"
});

let bookedSeats=[];

bookings.forEach(booking=>{
bookedSeats=[
...bookedSeats,
...(booking.seats||[])
];
});

res.json({
success:true,
bookedSeats:[...new Set(bookedSeats)]
});
}catch(error){
console.log(error);
res.json({
success:false,
message:"Error fetching seats"
});
}
});
router.post("/verify",async(req,res)=>{
    try{
        const {ticketId}=req.body;

        if(!ticketId){
            return res.json({
                success:false,
                message:"Ticket ID is required ❌"
            });
        }

        const ticket=await Booking.findById(ticketId);

        if(!ticket){
            return res.json({
                success:false,
                message:"Fake Ticket ❌"
            });
        }

        if(ticket.paymentStatus!=="Successful"){
            return res.json({
                success:false,
                message:"Payment not completed ❌"
            });
        }

        const verifiedTicket=await Booking.findOneAndUpdate(
            {
                _id:ticketId,
                paymentStatus:"Successful",
                ticketStatus:{
                    $ne:"Used"
                }
            },
            {
                $set:{
                    ticketStatus:"Used"
                }
            },
            {
                new:true
            }
        );

        if(!verifiedTicket){
            return res.json({
                success:false,
                message:"Ticket Already Used ❌"
            });
        }

        res.json({
            success:true,
            message:"Entry Allowed ✅"
        });
    }
    catch(error){
        console.log("Ticket Verification Error:",error);

        res.status(500).json({
            success:false,
            message:"Verification Failed"
        });
    }
});
module.exports=router;