const loginAdmin=async()=>{

    try{

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
                "Invalid admin credentials"
            );

            return;

        }

        localStorage.setItem(
            "admin",
            "true"
        );

        localStorage.setItem(
            "adminUser",
            JSON.stringify(result.admin)
        );

        navigate("/admin-dashboard");

    }
    catch(error){

        console.log(error);

        setError(
            "Unable to connect to the server."
        );

    }

};