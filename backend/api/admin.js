const express=require("express");
const router=express.Router();

const User=require("../database/user");
const Event=require("../database/events");
const Booking=require("../database/booking");
const EventRequest=require("../database/eventRequest");


// ==========================================
// ADMIN LOGIN
// ==========================================

router.post("/login",async(req,res)=>{

    try{

        const {username,password}=req.body;

        if(!username||!password){

            return res.status(400).json({
                success:false,
                message:"Username and password are required"
            });

        }

        /*
         * For the current project, admin credentials are:
         *
         * Username: admin
         * Password: admin123
         *
         * This keeps your existing admin login working.
         */

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


// ==========================================
// ADMIN DASHBOARD STATISTICS
// ==========================================

router.get("/stats",async(req,res)=>{

    try{

        const [

            totalUsers,
            activeUsers,

            totalEvents,
            approvedEvents,
            pendingEvents,

            successfulBookings,
            pendingBookings,

            revenueResult,

            bookingActivity,

            requestStats,

            recentBookings,
            recentRequests

        ]=await Promise.all([

            User.countDocuments(),

            User.countDocuments({
                status:"Active"
            }),

            Event.countDocuments(),

            Event.countDocuments({
                status:"Approved"
            }),

            Event.countDocuments({
                status:"Pending"
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

            Booking.find({
                paymentStatus:"Successful"
            })
            .sort({
                createdAt:-1
            })
            .limit(6)
            .select(
                "eventName eventDate amount paymentStatus seats createdAt userId"
            )
            .populate(
                "userId",
                "name email"
            ),

            EventRequest.find()
            .sort({
                createdAt:-1
            })
            .limit(6)
            .select(
                "name category organizerName date ticketPrice status createdAt"
            )

        ]);


        // ==========================================
        // REVENUE
        // ==========================================

        const revenue=
            revenueResult.length>0
            ?revenueResult[0].total
            :0;


        // ==========================================
        // REQUEST COUNTS
        // ==========================================

        const requests={
            Approved:0,
            Pending:0,
            Rejected:0
        };


        requestStats.forEach(item=>{

            if(
                requests[item._id]!==undefined
            ){

                requests[item._id]=item.count;

            }

        });


        // ==========================================
        // BOOKING ACTIVITY
        // ==========================================

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

                label:
                    date.toLocaleDateString(
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


        // ==========================================
        // RESPONSE
        // ==========================================

        res.json({

            success:true,

            data:{

                users:{

                    total:totalUsers,

                    active:activeUsers

                },

                events:{

                    total:totalEvents,

                    approved:approvedEvents,

                    pending:pendingEvents

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

                recentRequests

            }

        });

    }

    catch(error){

        console.log(
            "Admin Stats Error:",
            error
        );

        res.status(500).json({

            success:false,

            message:
                "Unable to load admin dashboard"

        });

    }

});


module.exports=router;