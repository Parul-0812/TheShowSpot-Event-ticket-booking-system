const express = require("express");

const User = require("../database/user");


const router = express.Router();


// register user

router.post("/register", async(req,res)=>{

    const {name,email,password} = req.body;


    const newUser = new User({

        name,
        email,
        password

    });


    await newUser.save();


    res.json({

        message:"Registration successful"

    });


});



// login user

router.post("/login", async(req,res)=>{


    const {email,password}=req.body;


    const user = await User.findOne({

        email:email,
        password:password

    });


    if(user){

        res.json({
            message:"Login successful"
        });

    }

    else{

        res.json({
            message:"Invalid details"
        });

    }


});



module.exports = router;


// login user
router.post("/login", async (req,res)=>{

    const {email,password}=req.body;

    try{
        const user = await User.findOne({email});

        if(!user){
            return res.json({
                success:false,
                message:"User not found"
            });
        }

        if(user.password !== password){
            return res.json({
                success:false,
                message:"Wrong password"
            });
        }

        res.json({
            success:true,
            message:"Login successful",
            user:user
        });

    }
    catch(error){
        res.json({
            success:false,
            message:"Something went wrong"
        });
    }

});