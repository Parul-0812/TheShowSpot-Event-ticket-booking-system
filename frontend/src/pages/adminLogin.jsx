import React,{useState} from "react";
import {useNavigate} from "react-router-dom";
import "../styles/adminLogin.css";

function AdminLogin(){

    const navigate=useNavigate();

    const [username,setUsername]=useState("");
    const [password,setPassword]=useState("");
    const [error,setError]=useState("");
    const [loading,setLoading]=useState(false);

    const loginAdmin=async(e)=>{
        e.preventDefault();

        try{

            setError("");

            if(!username||!password){
                setError("Please enter your username and password.");
                return;
            }

            setLoading(true);

            const response=await fetch(
                "http://localhost:5000/admin/login",
                {
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        username,
                        password
                    })
                }
            );

            const result=await response.json();

            if(!response.ok||!result.success){
                setError(
                    result.message||
                    "Invalid admin credentials."
                );
                return;
            }

            localStorage.setItem("admin","true");

            localStorage.setItem(
                "adminUser",
                JSON.stringify(result.admin)
            );

            navigate("/admin-dashboard");

        }
        catch(error){

            console.log("Admin Login Error:",error);

            setError(
                "Unable to connect to the server. Please try again."
            );

        }
        finally{
            setLoading(false);
        }
    };

    return(
        <div className="admin-container">

            <div className="admin-box">

                <h1>Admin Login</h1>

                <p>
                    Sign in to manage TheShowSpot
                </p>

                <form onSubmit={loginAdmin}>

                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e)=>{
                            setUsername(e.target.value);
                            setError("");
                        }}
                        autoComplete="username"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e)=>{
                            setPassword(e.target.value);
                            setError("");
                        }}
                        autoComplete="current-password"
                    />

                    {error&&(
                        <div className="admin-login-error">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ?"Signing In..."
                            :"Login"
                        }
                    </button>

                </form>

            </div>

        </div>
    );
}

export default AdminLogin;