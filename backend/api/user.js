const express=require("express");
const User=require("../database/user");
const router=express.Router();

router.post("/register",async(req,res)=>{
try{
const {name,email,phone,password}=req.body;

if(!name||!email||!phone||!password){
return res.json({
success:false,
message:"All fields are required"
});
}

const existingUser=await User.findOne({email});

if(existingUser){
return res.json({
success:false,
message:"Email already registered"
});
}

const newUser=new User({
name,
email,
phone,
password
});

await newUser.save();

res.json({
success:true,
message:"Registration successful"
});
}
catch(error){
console.log(error);
res.status(500).json({
success:false,
message:"Registration failed"
});
}
});

router.post("/login",async(req,res)=>{
const {email,password}=req.body;

try{
const user=await User.findOne({email});

if(!user){
return res.json({
success:false,
message:"User not found"
});
}

if(user.password!==password){
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
console.log(error);
res.json({
success:false,
message:"Something went wrong"
});
}
});

// UPDATE USER PROFILE
router.put("/update-profile/:userId", async(req,res)=>{

    try{

        const {name,email} = req.body;

        const user = await User.findById(req.params.userId);

        if(!user){

            return res.json({
                success:false,
                message:"User not found"
            });

        }

        // Check if another account already uses this email
        const existingUser = await User.findOne({
            email,
            _id:{$ne:req.params.userId}
        });

        if(existingUser){

            return res.json({
                success:false,
                message:"Email is already registered"
            });

        }

        user.name = name;
        user.email = email;

        await user.save();

        res.json({

            success:true,
            message:"Profile updated successfully",

            user:{
                _id:user._id,
                name:user.name,
                email:user.email
            }

        });

    }
    catch(error){

        console.log(error);

        res.json({
            success:false,
            message:"Unable to update profile"
        });

    }

});


// CHANGE PASSWORD
router.put("/change-password/:userId", async(req,res)=>{

    try{

        const {currentPassword,newPassword} = req.body;

        const user = await User.findById(req.params.userId);

        if(!user){

            return res.json({
                success:false,
                message:"User not found"
            });

        }

        if(user.password !== currentPassword){

            return res.json({
                success:false,
                message:"Current password is incorrect"
            });

        }

        if(!newPassword || newPassword.length < 6){

            return res.json({
                success:false,
                message:"New password must contain at least 6 characters"
            });

        }

        user.password = newPassword;

        await user.save();

        res.json({

            success:true,
            message:"Password changed successfully"

        });

    }
    catch(error){

        console.log(error);

        res.json({

            success:false,
            message:"Unable to change password"

        });

    }

});
module.exports=router;