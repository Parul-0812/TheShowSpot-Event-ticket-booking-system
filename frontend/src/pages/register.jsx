import {useState} from "react";
import axios from "axios";
import "../styles/auth.css";

function Register(){

const [name,setName]=useState("");
const [email,setEmail]=useState("");
const [phone,setPhone]=useState("");
const [password,setPassword]=useState("");

const registerUser=async(e)=>{
e.preventDefault();

if(!name||!email||!phone||!password){
alert("Please fill all fields");
return;
}

if(phone.length!==10){
alert("Please enter a valid 10-digit mobile number");
return;
}

try{
const result=await axios.post(
"http://localhost:5000/user/register",
{
name,
email,
phone,
password
}
);

alert(result.data.message);

if(result.data.success){
window.location.href="/login";
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
<h1>🎟️ TheShowSpot</h1>
<h2>Create Account</h2>
<form onSubmit={registerUser}>
<input
type="text"
placeholder="Name"
value={name}
onChange={(e)=>setName(e.target.value)}
/>
<input
type="email"
placeholder="Email Address"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>
<input
type="tel"
placeholder="Mobile Number"
value={phone}
maxLength="10"
onChange={(e)=>setPhone(e.target.value.replace(/\D/g,""))}
/>
<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>
<button type="submit">Register</button>
</form>
<p>
Already have an account?
<a href="/login"> Login</a>
</p>
</div>
</div>
);
}

export default Register;