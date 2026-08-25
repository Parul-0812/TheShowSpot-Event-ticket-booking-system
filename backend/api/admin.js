const express=require("express");
const router=express.Router();
const User=require("../database/user");
const Event=require("../database/events");
const Booking=require("../database/booking");
const EventRequest=require("../database/eventRequest");

router.get("/stats",async(req,res)=>{
    try{
        const totalUsers=await User.countDocuments({
            role:"user"
        });

        const totalEvents=await Event.countDocuments({
            status:"Approved"
        });

        const successfulBookings=await Booking.countDocuments({
            paymentStatus:"Successful"
        });

        const revenueResult=await Booking.aggregate([
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
        ]);

        const totalRevenue=revenueResult[0]?.total||0;

        const pendingRequests=await EventRequest.countDocuments({
            status:"Pending"
        });

        const approvedRequests=await EventRequest.countDocuments({
            status:"Approved"
        });

        const rejectedRequests=await EventRequest.countDocuments({
            status:"Rejected"
        });

        const sevenDaysAgo=new Date();
        sevenDaysAgo.setHours(0,0,0,0);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate()-6);

        const bookingActivity=await Booking.aggregate([
            {
                $match:{
                    paymentStatus:"Successful",
                    createdAt:{
                        $gte:sevenDaysAgo
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
                    }
                }
            },
            {
                $sort:{
                    _id:1
                }
            }
        ]);

        const activityMap={};

        bookingActivity.forEach(item=>{
            activityMap[item._id]=item.count;
        });

        const bookingChart=[];

        for(let i=0;i<7;i++){
            const date=new Date(sevenDaysAgo);
            date.setDate(sevenDaysAgo.getDate()+i);

            const dateKey=date.toISOString().split("T")[0];

            bookingChart.push({
                date:dateKey,
                day:date.toLocaleDateString("en-US",{
                    weekday:"short"
                }),
                count:activityMap[dateKey]||0
            });
        }

        res.json({
            success:true,
            data:{
                totalUsers,
                totalEvents,
                successfulBookings,
                totalRevenue,
                pendingRequests,
                approvedRequests,
                rejectedRequests,
                bookingChart
            }
        });
    }
    catch(error){
        console.log("Admin Stats Error:",error);

        res.status(500).json({
            success:false,
            message:"Unable to fetch dashboard statistics"
        });
    }
});

module.exports=router;