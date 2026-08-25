import React,{useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import "../styles/adminLogin.css";

function AdminLogin(){
const navigate=useNavigate();
const[username,setUsername]=useState("");
const[password,setPassword]=useState("");
const[loading,setLoading]=useState(false);
const[error,setError]=useState("");

const loginAdmin=async(e)=>{
e.preventDefault();
if(loading)return;
setError("");
if(!username.trim()||!password){
setError("Please enter your username and password.");
return;
}
try{
setLoading(true);
const result=await axios.post("http://localhost:5000/admin/login",{
username,
password
});
if(!result.data.success){
throw new Error(result.data.message||"Invalid admin credentials");
}
localStorage.setItem("adminToken",result.data.token);
localStorage.setItem("admin",JSON.stringify(result.data.admin));
navigate("/admin-dashboard");
}catch(error){
console.log("Admin Login Error:",error);
setError(error.response?.data?.message||error.message||"Unable to login.");
}finally{
setLoading(false);
}
};

return(
<div className="admin-container">
<div className="admin-box">
<div className="admin-brand">
<div className="admin-logo">TS</div>
<div>
<h2>TheShowSpot</h2>
<span>Administration Portal</span>
</div>
</div>
<h1>Welcome back 👋</h1>
<p className="admin-subtitle">Sign in to manage TheShowSpot.</p>
<form onSubmit={loginAdmin}>
<label>Username</label>
<input type="text" value={username} onChange={e=>setUsername(e.target.value)} placeholder="Enter admin username" autoComplete="username"/>
<label>Password</label>
<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter password" autoComplete="current-password"/>
{error&&<div className="admin-login-error">{error}</div>}
<button type="submit" disabled={loading}>
{loading?"Signing in...":"Sign In →"}
</button>
</form>
<div className="admin-security">🔒 Secure administrator access</div>
</div>
</div>
);
}

export default AdminLogin;