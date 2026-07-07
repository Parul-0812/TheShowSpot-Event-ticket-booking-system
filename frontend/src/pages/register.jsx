import { useState } from "react";
import axios from "axios";
import "../styles/auth.css";


function Register(){
    const [name,setName] = useState("");
const [email,setEmail] = useState("");
const [password,setPassword] = useState("");


const registerUser = async(e)=>{

    e.preventDefault();

    try{

        const result = await axios.post(
            "http://localhost:5000/user/register",
            {
                name:name,
                email:email,
                password:password
            }
        );

        alert(result.data.message);

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
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<button 
type="button"
onClick={registerUser}
>
Register
</button>
</form>
<p>
Already have an account?
<a href="/login"> Login</a>
</p>
</div>
</div>
)
}
export default Register;