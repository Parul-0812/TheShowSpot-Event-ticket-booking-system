import React,{useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

import UserSidebar from "../components/userSidebar";
import UserNavbar from "../components/userNavbar";

import "../styles/settings.css";


function Settings(){

const navigate = useNavigate();

const storedUser = JSON.parse(localStorage.getItem("user"));


// ---------------- PROFILE ----------------

const [name,setName] = useState(
    storedUser?.name || ""
);

const [email,setEmail] = useState(
    storedUser?.email || ""
);

const [editingProfile,setEditingProfile] = useState(false);

const [savingProfile,setSavingProfile] = useState(false);


// ---------------- PASSWORD ----------------

const [currentPassword,setCurrentPassword] = useState("");
const [newPassword,setNewPassword] = useState("");
const [confirmPassword,setConfirmPassword] = useState("");

const [changingPassword,setChangingPassword] = useState(false);


// ---------------- NOTIFICATIONS ----------------

const [eventNotifications,setEventNotifications] = useState(
    localStorage.getItem("eventNotifications") !== "false"
);

const [bookingNotifications,setBookingNotifications] = useState(
    localStorage.getItem("bookingNotifications") !== "false"
);

const [paymentNotifications,setPaymentNotifications] = useState(
    localStorage.getItem("paymentNotifications") !== "false"
);


// ---------------- PROFILE UPDATE ----------------

const updateProfile = async()=>{

    if(!name.trim() || !email.trim()){

        alert("Name and email cannot be empty.");
        return;

    }

    try{

        setSavingProfile(true);

        const result = await axios.put(

            `http://localhost:5000/user/update-profile/${storedUser._id}`,

            {
                name,
                email
            }

        );

        if(result.data.success){

            // Update localStorage
            localStorage.setItem(
                "user",
                JSON.stringify(result.data.user)
            );

            alert("Profile updated successfully ✅");

            setEditingProfile(false);

            // Refresh so navbar/dashboard get new user data
            window.location.reload();

        }
        else{

            alert(result.data.message);

        }

    }
    catch(error){

        console.log(error);

        alert("Unable to update profile.");

    }
    finally{

        setSavingProfile(false);

    }

};


// ---------------- PASSWORD CHANGE ----------------

const changePassword = async()=>{

    if(!currentPassword || !newPassword || !confirmPassword){

        alert("Please fill all password fields.");
        return;

    }

    if(newPassword.length < 6){

        alert("New password must contain at least 6 characters.");
        return;

    }

    if(newPassword !== confirmPassword){

        alert("New passwords do not match.");
        return;

    }

    try{

        setChangingPassword(true);

        const result = await axios.put(

            `http://localhost:5000/user/change-password/${storedUser._id}`,

            {
                currentPassword,
                newPassword
            }

        );

        if(result.data.success){

            alert("Password changed successfully ✅");

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

        }
        else{

            alert(result.data.message);

        }

    }
    catch(error){

        console.log(error);

        alert("Unable to change password.");

    }
    finally{

        setChangingPassword(false);

    }

};


// ---------------- NOTIFICATION SETTINGS ----------------

const toggleEventNotifications = ()=>{

    const newValue = !eventNotifications;

    setEventNotifications(newValue);

    localStorage.setItem(
        "eventNotifications",
        newValue
    );

};


const toggleBookingNotifications = ()=>{

    const newValue = !bookingNotifications;

    setBookingNotifications(newValue);

    localStorage.setItem(
        "bookingNotifications",
        newValue
    );

};


const togglePaymentNotifications = ()=>{

    const newValue = !paymentNotifications;

    setPaymentNotifications(newValue);

    localStorage.setItem(
        "paymentNotifications",
        newValue
    );

};


// ---------------- LOGOUT ----------------

const logout = ()=>{

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");

    navigate("/login");

};


return(

<div className="user-dashboard">

<UserSidebar/>


<div className="user-dashboard-main">

<UserNavbar/>


<div className="settings-page">


<div className="settings-title">

<h1>Settings</h1>

<p>
Manage your account, security and notification preferences.
</p>

</div>


{/* ================= ACCOUNT ================= */}

<div className="settings-card">

<div className="settings-card-title">

<div>
<h2>👤 Account Information</h2>

<p>
Manage your personal information.
</p>
</div>

<button
className="edit-profile-btn"
onClick={()=>{
setEditingProfile(!editingProfile)
}}
>
{editingProfile ? "Cancel" : "Edit"}
</button>

</div>


<div className="profile-fields">


<div className="setting-field">

<label>Full Name</label>

{editingProfile ?

<input
type="text"
value={name}
onChange={(e)=>setName(e.target.value)}
/>

:

<div className="setting-value">
{name}
</div>

}

</div>


<div className="setting-field">

<label>Email Address</label>

{editingProfile ?

<input
type="email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

:

<div className="setting-value">
{email}
</div>

}

</div>


</div>


{editingProfile && (

<button
className="save-settings-btn"
onClick={updateProfile}
disabled={savingProfile}
>
{savingProfile
?"Saving..."
:"Save Changes"
}
</button>

)}


</div>



{/* ================= NOTIFICATIONS ================= */}

<div className="settings-card">

<div className="settings-card-title">

<div>

<h2>🔔 Notifications</h2>

<p>
Choose which updates you want to receive.
</p>

</div>

</div>


<div className="setting-row">

<div>

<strong>Event Notifications</strong>

<p>
Get updates about upcoming events and event changes.
</p>

</div>


<label className="switch">

<input
type="checkbox"
checked={eventNotifications}
onChange={toggleEventNotifications}
/>

<span></span>

</label>

</div>


<div className="setting-row">

<div>

<strong>Booking Updates</strong>

<p>
Receive booking confirmation and ticket status updates.
</p>

</div>


<label className="switch">

<input
type="checkbox"
checked={bookingNotifications}
onChange={toggleBookingNotifications}
/>

<span></span>

</label>

</div>


<div className="setting-row">

<div>

<strong>Payment Notifications</strong>

<p>
Receive updates related to successful or failed payments.
</p>

</div>


<label className="switch">

<input
type="checkbox"
checked={paymentNotifications}
onChange={togglePaymentNotifications}
/>

<span></span>

</label>

</div>


</div>



{/* ================= SECURITY ================= */}

<div className="settings-card">

<div className="settings-card-title">

<div>

<h2>🔐 Security</h2>

<p>
Keep your account secure.
</p>

</div>

</div>


<div className="password-form">


<div className="setting-field">

<label>Current Password</label>

<input
type="password"
placeholder="Enter current password"
value={currentPassword}
onChange={(e)=>setCurrentPassword(e.target.value)}
/>

</div>


<div className="setting-field">

<label>New Password</label>

<input
type="password"
placeholder="Enter new password"
value={newPassword}
onChange={(e)=>setNewPassword(e.target.value)}
/>

</div>


<div className="setting-field">

<label>Confirm New Password</label>

<input
type="password"
placeholder="Confirm new password"
value={confirmPassword}
onChange={(e)=>setConfirmPassword(e.target.value)}
/>

</div>


<button
className="save-settings-btn"
onClick={changePassword}
disabled={changingPassword}
>
{changingPassword
?"Changing Password..."
:"Change Password"
}
</button>


</div>

</div>



{/* ================= SESSION ================= */}

<div className="settings-card danger-card">

<h2>🚪 Session</h2>

<p>
Sign out of your TheShowSpot account on this device.
</p>

<button
className="logout-settings-btn"
onClick={logout}
>
Logout
</button>

</div>


</div>

</div>

</div>

);

}


export default Settings;