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

    destination: function(req, file, cb) {

        cb(null, "uploads/");

    },

    filename: function(req, file, cb) {

        const uniqueName =
            Date.now() + path.extname(file.originalname);

        cb(null, uniqueName);

    }

});

const upload = multer({

    storage: storage,

    fileFilter: function(req, file, cb) {

        const allowed = /jpeg|jpg|png|webp/;

        const ext = allowed.test(
            path.extname(file.originalname).toLowerCase()
        );

        const mime = allowed.test(file.mimetype);

        if(ext && mime) {

            cb(null, true);

        } else {

            cb(new Error("Only image files are allowed"));

        }

    }

});


// ===============================
// Submit Event Request
// ===============================

router.post(
    "/submit",
    upload.single("image"),
    async(req, res) => {

        try {

            const request = new EventRequest({

                // Host user
                userId: req.body.userId,

                // Event Information
                name: req.body.name,

                category: req.body.category,

                description: req.body.description,

                // Date & Time
                date: req.body.date,

                startTime: req.body.startTime,

                endTime: req.body.endTime,

                // Venue
                venue: req.body.venue,

                city: req.body.city,

                address: req.body.address,

                // Ticket Details
                ticketPrice: Number(req.body.ticketPrice),

                totalSeats: Number(req.body.totalSeats),

                // Organizer
                organizerName: req.body.organizerName,

                email: req.body.email,

                phone: req.body.phone,

                // Image
                image: req.file
                    ? req.file.filename
                    : "",

                // Status
                status: "Pending"

            });

            await request.save();

            res.json({

                success: true,

                message: "Event Submitted Successfully"

            });

        }

        catch(error) {

            console.log(
                "Event Submission Error:",
                error
            );

            res.status(500).json({

                success: false,

                message: "Submission Failed"

            });

        }

    }
);


// ===============================
// Get All Requests
// ===============================

router.get("/all", async(req, res) => {

    try {

        const requests =
            await EventRequest.find()
            .sort({ createdAt: -1 });

        res.json({

            success: true,

            data: requests

        });

    }

    catch(error) {

        console.log(error);

        res.json({

            success: false,

            message: "Unable to Fetch"

        });

    }

});


// ===============================
// Get Requests For One User
// ===============================

router.get("/user/:userId", async(req, res) => {

    try {

        const requests =
            await EventRequest.find({
                userId: req.params.userId
            })
            .sort({ createdAt: -1 });

        res.json({

            success: true,

            data: requests

        });

    }

    catch(error) {

        console.log(
            "User Event Request Error:",
            error
        );

        res.status(500).json({

            success: false,

            message: "Unable to Fetch User Events"

        });

    }

});


// ===============================
// Approve Request
// ===============================

router.put("/approve/:id", async(req, res) => {

    try {

        const request =
            await EventRequest.findById(req.params.id);

        if(!request) {

            return res.json({

                success: false,

                message: "Request Not Found"

            });

        }

        // Prevent approving twice
        if(request.status === "Approved") {

            return res.json({

                success: false,

                message: "Event Already Approved"

            });

        }


        const event = new Event({

            // IMPORTANT:
            // Connect approved event to original host
            userId: request.userId,

            name: request.name,

            category: request.category,

            description: request.description,

            date: request.date,

            startTime: request.startTime,

            endTime: request.endTime,

            venue: request.venue,

            city: request.city,

            address: request.address,

            location: request.city,

            price: Number(request.ticketPrice),

            totalSeats: Number(request.totalSeats),

            image: request.image,

            organizerName: request.organizerName,

            email: request.email,

            phone: request.phone,

            status: "Approved"

        });


        await event.save();


        request.status = "Approved";

        await request.save();


        res.json({

            success: true,

            message: "Event Approved"

        });

    }

    catch(error) {

        console.log(
            "Approval Error:",
            error
        );

        res.status(500).json({

            success: false,

            message: "Approval Failed"

        });

    }

});


// ===============================
// Reject Request
// ===============================

router.put("/reject/:id", async(req, res) => {

    try {

        const request =
            await EventRequest.findById(req.params.id);

        if(!request) {

            return res.json({

                success: false,

                message: "Request Not Found"

            });

        }

        request.status = "Rejected";

        await request.save();


        res.json({

            success: true,

            message: "Request Rejected"

        });

    }

    catch(error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: "Unable to Reject"

        });

    }

});


// ===============================
// Delete Request
// ===============================

router.delete("/delete/:id", async(req, res) => {

    try {

        await EventRequest.findByIdAndDelete(
            req.params.id
        );

        res.json({

            success: true,

            message: "Deleted Successfully"

        });

    }

    catch(error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: "Delete Failed"

        });

    }

});


module.exports = router;