const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const EventRequest = require("../database/eventRequest");
const Event = require("../database/events");


// ===============================
// Multer Configuration
// ===============================

const storage = multer.diskStorage({

    destination: function(req, file, cb){

        cb(null, "uploads/");

    },

    filename: function(req, file, cb){

        const uniqueName = Date.now() + path.extname(file.originalname);

        cb(null, uniqueName);

    }

});

const upload = multer({

    storage: storage,

    fileFilter: function(req, file, cb){

        const allowed = /jpeg|jpg|png|webp/;

        const ext = allowed.test(path.extname(file.originalname).toLowerCase());

        const mime = allowed.test(file.mimetype);

        if(ext && mime){

            cb(null, true);

        }

        else{

            cb(new Error("Only image files are allowed"));

        }

    }

});


// ===============================
// Submit Event Request
// ===============================

router.post("/submit", upload.single("image"), async(req,res)=>{

    try{

        const request = new EventRequest({

            name:req.body.name,

            category:req.body.category,

            description:req.body.description,

            date:req.body.date,

            startTime:req.body.startTime,

            endTime:req.body.endTime,

            venue:req.body.venue,

            city:req.body.city,

            address:req.body.address,

            ticketPrice:req.body.ticketPrice,

            totalSeats:req.body.totalSeats,

            organizerName:req.body.organizerName,

            email:req.body.email,

            phone:req.body.phone,

            image:req.file ? req.file.filename : "",

            status:"Pending"

        });

        await request.save();

        res.json({

            success:true,

            message:"Event Submitted Successfully"

        });

    }

    catch(error){

        console.log(error);

        res.status(500).json({

            success:false,

            message:"Submission Failed"

        });

    }

});


// ===============================
// Get All Requests
// ===============================

router.get("/all", async(req,res)=>{

    try{

        const requests = await EventRequest.find();

        res.json({

            success:true,

            data:requests

        });

    }

    catch(error){

        res.json({

            success:false,

            message:"Unable to Fetch"

        });

    }

});


// ===============================
// Approve Request
// ===============================

router.put("/approve/:id", async(req,res)=>{

    try{

        const request = await EventRequest.findById(req.params.id);

        if(!request){

            return res.json({

                success:false,

                message:"Request Not Found"

            });

        }

        const event = new Event({

            name:request.name,

            category:request.category,

            location:request.city,

            date:request.date,

            time:request.startTime,

            price:request.ticketPrice,

            image:request.image

        });

        await event.save();

        request.status = "Approved";

        await request.save();

        res.json({

            success:true,

            message:"Event Approved"

        });

    }

    catch(error){

        res.json({

            success:false,

            message:"Approval Failed"

        });

    }

});


// ===============================
// Reject Request
// ===============================

router.put("/reject/:id", async(req,res)=>{

    try{

        await EventRequest.findByIdAndUpdate(

            req.params.id,

            {

                status:"Rejected"

            }

        );

        res.json({

            success:true,

            message:"Request Rejected"

        });

    }

    catch(error){

        res.json({

            success:false,

            message:"Unable to Reject"

        });

    }

});


// ===============================
// Delete Request
// ===============================

router.delete("/delete/:id", async(req,res)=>{

    try{

        await EventRequest.findByIdAndDelete(req.params.id);

        res.json({

            success:true,

            message:"Deleted Successfully"

        });

    }

    catch(error){

        res.json({

            success:false,

            message:"Delete Failed"

        });

    }

});

module.exports = router;