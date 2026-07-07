import "../styles/auth.css";
import axios from "axios";
import React,{useState} from "react";
import { useNavigate } from "react-router-dom";

function Login(){
    const navigate = useNavigate();
    const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
    const loginUser = async(e)=>{

    e.preventDefault();

    try{

        const result = await axios.post(
            "http://localhost:5000/user/login",
            {
                email,
                password
            }
        );
        alert("Login successful");
        localStorage.setItem("isLoggedIn","true");
        navigate("/");

    }
    catch(error){

        console.log(error);
        alert("Something went wrong");

    }

}
return(


<div className="auth-container">


<div className="auth-box">


<h1>🎟️ TheShowSpot</h1>


<h2>Welcome Back</h2>
<form onSubmit={loginUser}>

<input
type="email" placeholder="Enter Email Address"
onChange={(e)=>setEmail(e.target.value)}
/>



<input
type="password" placeholder="Enter Password"
onChange={(e)=>setPassword(e.target.value)}
/>



<button>

Login

</button>

</form>

<p>

New user?

<a href="/register"> Register</a>

</p>



</div>


</div>


)


}


export default Login;