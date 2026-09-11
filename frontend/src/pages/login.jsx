import "../styles/auth.css";
import axios from "axios";
import React,{useState} from "react";
import {useLocation,useNavigate,Link} from "react-router-dom";

function Login(){

const navigate=useNavigate();
const location=useLocation();
const [email,setEmail]=useState("");
const [password,setPassword]=useState("");
const [loginType,setLoginType]=useState("user");

const event=location.state?.event;
const returnTo=location.state?.returnTo;

const loginUser=async(e)=>{
e.preventDefault();

if(loginType==="admin"){
if(email==="admin@Entrivelle.com"&&password==="admin123"){
alert("Admin Login Successful");
navigate("/admin");
}else{
alert("Invalid Admin Credentials");
}
return;
}

try{
const result=await axios.post(
"https://theshowspot-backend.onrender.com/user/login",
{
email,
password
}
);

if(result.data.success){
alert("Login Successful");
localStorage.setItem("isLoggedIn","true");
localStorage.setItem("user",JSON.stringify(result.data.user));

if(returnTo==="/booking"&&event){
navigate("/booking",{state:{event}});
}else{
navigate("/");
}
}else{
alert(result.data.message);
}
}
catch(error){
console.log(error);
alert("Something went wrong");
}
};

return(
<div className="auth-container">
<div className="auth-box">
<h1>🎟️ Entrivelle</h1>
<h2>{loginType==="user"?"Welcome Back":"Administrator Login"}</h2>
<div className="login-type">
<button
type="button"
className={loginType==="user"?"active":""}
onClick={()=>setLoginType("user")}
>
👤 User Login
</button>
<button
type="button"
className={loginType==="admin"?"active":""}
onClick={()=>setLoginType("admin")}
>
🛡 Admin Login
</button>
</div>
<form onSubmit={loginUser}>
<input
type="email"
placeholder="Enter Email Address"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>
<input
type="password"
placeholder="Enter Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>
<button type="submit">
Login
</button>
</form>
{loginType==="user"&&(
<p>
New user?
<Link to="/register"> Register</Link>
</p>
)}
</div>
</div>
);
}

export default Login;