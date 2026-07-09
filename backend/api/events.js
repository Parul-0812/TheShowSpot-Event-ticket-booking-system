const express = require("express");

const router = express.Router();

const Event = require("../database/events");



// add event

router.post("/add",async(req,res)=>{


    try{


        const event = new Event(req.body);


        await event.save();


        res.json({

            success:true,

            message:"Event Added"

        });


    }

    catch(error){


        res.json({

            success:false,

            message:"Failed"

        })


    }


});



// get events

router.get("/all",async(req,res)=>{


    const events = await Event.find();


    res.json({

        success:true,

        data:events

    })


})


module.exports = router;