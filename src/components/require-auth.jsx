import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import { useUrl } from "@/contextAPI/Context.jsx";

function RequireAuth({children}){
    const navigate = useNavigate();
    const {loading, isAuthenticated} = useUrl();

    useEffect(()=>{
        if(!isAuthenticated && loading === false){
            navigate('/auth');
        }
    },[isAuthenticated,loading]);

    if(loading){
        return <BarLoader
        color={"#36d7b7"}
        width={"100%"}
        />
    }

    if(isAuthenticated) return children
}

export default RequireAuth;