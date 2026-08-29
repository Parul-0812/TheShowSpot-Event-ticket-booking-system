const express=require("express");
const router=express.Router();

const User=require("../database/user");
const Event=require("../database/events");
const Booking=require("../database/booking");
const EventRequest=require("../database/eventRequest");

router.post("/login",async(req,res)=>{
    try{
        const {username,password}=req.body;

        if(!username||!password){
            return res.status(400).json({
                success:false,
                message:"Username and password are required"
            });
        }

        if(username!=="admin"||password!=="admin123"){
            return res.status(401).json({
                success:false,
                message:"Invalid admin credentials"
            });
        }

        res.json({
            success:true,
            message:"Admin login successful",
            admin:{
                username:"admin",
                role:"admin"
            }
        });
    }
    catch(error){
        console.log("Admin Login Error:",error);

        res.status(500).json({
            success:false,
            message:"Unable to login"
        });
    }
});


router.get("/stats",async(req,res)=>{
    try{
        const [
            totalUsers,
            activeUsers,
            blockedUsers,
            totalEvents,
            approvedEvents,
            pendingEvents,
            rejectedEvents,
            successfulBookings,
            pendingBookings,
            revenueResult,
            bookingActivity,
            requestStats,
            recentBookings,
            recentRequests,
            recentUsers
        ]=await Promise.all([
            User.countDocuments(),

            User.countDocuments({
                status:"Active"
            }),

            User.countDocuments({
                status:"Blocked"
            }),

            Event.countDocuments(),

            Event.countDocuments({
                status:"Approved"
            }),

            Event.countDocuments({
                status:"Pending"
            }),

            Event.countDocuments({
                status:"Rejected"
            }),

            Booking.countDocuments({
                paymentStatus:"Successful"
            }),

            Booking.countDocuments({
                paymentStatus:"Pending"
            }),

            Booking.aggregate([
                {
                    $match:{
                        paymentStatus:"Successful"
                    }
                },
                {
                    $group:{
                        _id:null,
                        total:{
                            $sum:"$amount"
                        }
                    }
                }
            ]),

            Booking.aggregate([
                {
                    $match:{
                        paymentStatus:"Successful",
                        createdAt:{
                            $gte:new Date(
                                Date.now()-
                                6*24*60*60*1000
                            )
                        }
                    }
                },
                {
                    $group:{
                        _id:{
                            $dateToString:{
                                format:"%Y-%m-%d",
                                date:"$createdAt"
                            }
                        },
                        count:{
                            $sum:1
                        },
                        revenue:{
                            $sum:"$amount"
                        }
                    }
                },
                {
                    $sort:{
                        "_id":1
                    }
                }
            ]),

            EventRequest.aggregate([
                {
                    $group:{
                        _id:"$status",
                        count:{
                            $sum:1
                        }
                    }
                }
            ]),

            Booking.find()
            .sort({
                createdAt:-1
            })
            .limit(8)
            .select(
                "eventName eventDate eventLocation amount paymentStatus paymentMethod transactionId seats createdAt userId"
            )
            .populate(
                "userId",
                "name email"
            ),

            EventRequest.find()
            .sort({
                createdAt:-1
            })
            .limit(8)
            .select(
                "name category organizerName date ticketPrice totalSeats status createdAt"
            ),

            User.find()
            .sort({
                createdAt:-1
            })
            .limit(8)
            .select(
                "name email phone status role createdAt"
            )
        ]);

        const revenue=
            revenueResult.length>0
            ?revenueResult[0].total
            :0;

        const requests={
            Approved:0,
            Pending:0,
            Rejected:0
        };

        requestStats.forEach(item=>{
            if(requests[item._id]!==undefined){
                requests[item._id]=item.count;
            }
        });

        const activityMap={};

        bookingActivity.forEach(item=>{
            activityMap[item._id]={
                count:item.count,
                revenue:item.revenue
            };
        });

        const bookingActivityLast7Days=[];

        for(let i=6;i>=0;i--){
            const date=new Date();

            date.setHours(
                0,
                0,
                0,
                0
            );

            date.setDate(
                date.getDate()-i
            );

            const key=
                date.toISOString()
                .split("T")[0];

            bookingActivityLast7Days.push({
                date:key,
                label:date.toLocaleDateString(
                    "en-IN",
                    {
                        weekday:"short"
                    }
                ),
                count:
                    activityMap[key]?.count||0,
                revenue:
                    activityMap[key]?.revenue||0
            });
        }

        res.json({
            success:true,
            data:{
                users:{
                    total:totalUsers,
                    active:activeUsers,
                    blocked:blockedUsers
                },
                events:{
                    total:totalEvents,
                    approved:approvedEvents,
                    pending:pendingEvents,
                    rejected:rejectedEvents
                },
                bookings:{
                    successful:successfulBookings,
                    pending:pendingBookings
                },
                revenue,
                requests,
                bookingActivity:
                    bookingActivityLast7Days,
                recentBookings,
                recentRequests,
                recentUsers
            }
        });
    }
    catch(error){
        console.log("Admin Stats Error:",error);

        res.status(500).json({
            success:false,
            message:"Unable to load admin dashboard"
        });
    }
});


router.get("/events",async(req,res)=>{
    try{
        const events=await Event.find()
        .sort({
            createdAt:-1
        });

        res.json({
            success:true,
            data:events
        });
    }
    catch(error){
        console.log(error);

        res.status(500).json({
            success:false,
            message:"Unable to fetch events"
        });
    }
});


router.post("/events",async(req,res)=>{
    try{
        const {
            name,
            category,
            description,
            date,
            startTime,
            endTime,
            venue,
            city,
            address,
            price,
            totalSeats,
            image,
            organizerName,
            email,
            phone
        }=req.body;

        if(
            !name||
            !category||
            !date||
            !price||
            !totalSeats
        ){
            return res.status(400).json({
                success:false,
                message:"Please fill all required event fields"
            });
        }

        const event=new Event({
            name,
            category,
            description,
            date,
            startTime,
            endTime,
            venue,
            city,
            address,
            location:city,
            price:Number(price),
            totalSeats:Number(totalSeats),
            image,
            organizerName,
            email,
            phone,
            status:"Approved"
        });

        await event.save();

        res.json({
            success:true,
            message:"Event created successfully",
            data:event
        });
    }
    catch(error){
        console.log(error);

        res.status(500).json({
            success:false,
            message:"Unable to create event"
        });
    }
});


router.put("/events/:id",async(req,res)=>{
    try{
        const event=await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new:true,
                runValidators:true
            }
        );

        if(!event){
            return res.status(404).json({
                success:false,
                message:"Event not found"
            });
        }

        res.json({
            success:true,
            message:"Event updated successfully",
            data:event
        });
    }
    catch(error){
        console.log(error);

        res.status(500).json({
            success:false,
            message:"Unable to update event"
        });
    }
});


router.delete("/events/:id",async(req,res)=>{
    try{
        const event=await Event.findByIdAndDelete(
            req.params.id
        );

        if(!event){
            return res.status(404).json({
                success:false,
                message:"Event not found"
            });
        }

        res.json({
            success:true,
            message:"Event deleted successfully"
        });
    }
    catch(error){
        console.log(error);

        res.status(500).json({
            success:false,
            message:"Unable to delete event"
        });
    }
});


router.get("/bookings",async(req,res)=>{
    try{
        const bookings=await Booking.find()
        .sort({
            createdAt:-1
        })
        .populate(
            "userId",
            "name email phone"
        );

        res.json({
            success:true,
            data:bookings
        });
    }
    catch(error){
        console.log(error);

        res.status(500).json({
            success:false,
            message:"Unable to fetch bookings"
        });
    }
});


router.get("/users",async(req,res)=>{
    try{
        const users=await User.find()
        .sort({
            createdAt:-1
        })
        .select(
            "name email phone role status createdAt"
        );

        res.json({
            success:true,
            data:users
        });
    }
    catch(error){
        console.log(error);

        res.status(500).json({
            success:false,
            message:"Unable to fetch users"
        });
    }
});


router.put("/users/:id/status",async(req,res)=>{
    try{
        const {status}=req.body;

        if(!["Active","Blocked"].includes(status)){
            return res.status(400).json({
                success:false,
                message:"Invalid user status"
            });
        }

        const user=await User.findByIdAndUpdate(
            req.params.id,
            {
                status
            },
            {
                new:true
            }
        );

        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            });
        }

        res.json({
            success:true,
            message:
                status==="Blocked"
                ?"User blocked successfully"
                :"User unblocked successfully",
            data:user
        });
    }
    catch(error){
        console.log(error);

        res.status(500).json({
            success:false,
            message:"Unable to update user"
        });
    }
});


router.get("/payments",async(req,res)=>{
    try{
        const payments=await Booking.find()
        .sort({
            createdAt:-1
        })
        .select(
            "eventName amount paymentMethod paymentStatus transactionId createdAt userId"
        )
        .populate(
            "userId",
            "name email"
        );

        const successful=payments.filter(
            payment=>
                payment.paymentStatus==="Successful"
        );

        const pending=payments.filter(
            payment=>
                payment.paymentStatus==="Pending"
        );

        const revenue=successful.reduce(
            (total,payment)=>
                total+Number(payment.amount||0),
            0
        );

        res.json({
            success:true,
            data:{
                payments,
                successfulCount:successful.length,
                pendingCount:pending.length,
                revenue
            }
        });
    }
    catch(error){
        console.log(error);

        res.status(500).json({
            success:false,
            message:"Unable to fetch payments"
        });
    }
});


router.get("/analytics",async(req,res)=>{
    try{
        const [
            categoryStats,
            eventBookings
        ]=await Promise.all([
            Event.aggregate([
                {
                    $group:{
                        _id:"$category",
                        count:{
                            $sum:1
                        }
                    }
                },
                {
                    $sort:{
                        count:-1
                    }
                }
            ]),

            Booking.aggregate([
                {
                    $match:{
                        paymentStatus:"Successful"
                    }
                },
                {
                    $group:{
                        _id:"$eventName",
                        bookings:{
                            $sum:1
                        },
                        revenue:{
                            $sum:"$amount"
                        }
                    }
                },
                {
                    $sort:{
                        bookings:-1
                    }
                },
                {
                    $limit:8
                }
            ])
        ]);

        res.json({
            success:true,
            data:{
                categoryStats,
                eventBookings
            }
        });
    }
    catch(error){
        console.log(error);

        res.status(500).json({
            success:false,
            message:"Unable to fetch analytics"
        });
    }
});


router.get("/requests",async(req,res)=>{
    try{
        const requests=await EventRequest.find()
        .sort({
            createdAt:-1
        });

        res.json({
            success:true,
            data:requests
        });
    }
    catch(error){
        console.log(error);

        res.status(500).json({
            success:false,
            message:"Unable to fetch event requests"
        });
    }
});


router.put("/requests/:id/approve",async(req,res)=>{
    try{
        const request=await EventRequest.findById(
            req.params.id
        );

        if(!request){
            return res.status(404).json({
                success:false,
                message:"Request not found"
            });
        }

        const event=new Event({
            name:request.name,
            category:request.category,
            description:request.description,
            date:request.date,
            startTime:request.startTime,
            endTime:request.endTime,
            venue:request.venue,
            city:request.city,
            address:request.address,
            location:request.city,
            price:Number(request.ticketPrice),
            totalSeats:Number(request.totalSeats),
            image:request.image,
            organizerName:request.organizerName,
            email:request.email,
            phone:request.phone,
            status:"Approved"
        });

        await event.save();

        request.status="Approved";

        await request.save();

        res.json({
            success:true,
            message:"Event request approved"
        });
    }
    catch(error){
        console.log(error);

        res.status(500).json({
            success:false,
            message:"Unable to approve request"
        });
    }
});


router.put("/requests/:id/reject",async(req,res)=>{
    try{
        const request=
            await EventRequest.findByIdAndUpdate(
                req.params.id,
                {
                    status:"Rejected"
                },
                {
                    new:true
                }
            );

        if(!request){
            return res.status(404).json({
                success:false,
                message:"Request not found"
            });
        }

        res.json({
            success:true,
            message:"Request rejected"
        });
    }
    catch(error){
        console.log(error);

        res.status(500).json({
            success:false,
            message:"Unable to reject request"
        });
    }
});


router.delete("/requests/:id",async(req,res)=>{
    try{
        const request=
            await EventRequest.findByIdAndDelete(
                req.params.id
            );

        if(!request){
            return res.status(404).json({
                success:false,
                message:"Request not found"
            });
        }

        res.json({
            success:true,
            message:"Request deleted successfully"
        });
    }
    catch(error){
        console.log(error);

        res.status(500).json({
            success:false,
            message:"Unable to delete request"
        });
    }
});


module.exports=router;