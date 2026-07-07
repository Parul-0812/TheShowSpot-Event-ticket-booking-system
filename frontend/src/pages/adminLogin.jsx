import React,{useState} from "react";
import {useNavigate} from "react-router-dom";
import "../styles/adminLogin.css";


function AdminLogin(){


const navigate = useNavigate();


const [username,setUsername]=useState("");
const [password,setPassword]=useState("");



const loginAdmin = ()=>{


    if(username==="admin" && password==="admin123"){


        localStorage.setItem("admin","true");


        alert("Admin Login Successful");


        navigate("/dashboard");


    }
    else{


        alert("Invalid Admin Details");


    }


}



return(

<div className="admin-container">


<div className="admin-box">


<h1>Admin Login</h1>


<input

type="text"

placeholder="Username"

onChange={(e)=>setUsername(e.target.value)}

/>


<input

type="password"

placeholder="Password"

onChange={(e)=>setPassword(e.target.value)}

/>


<button onClick={loginAdmin}>

Login

</button>


</div>


</div>


)


}


export default AdminLogin;