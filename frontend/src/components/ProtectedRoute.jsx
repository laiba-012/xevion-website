import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute=({

children,

roles=[]

})=>{

const{

user,

loading

}=useAuth();


if(loading){

return <h2>Loading...</h2>;

}


if(!user){

return <Navigate to="/login"/>;

}


if(

roles.length>0 &&

!roles.includes(user.role)

){

if(user.role==="admin"){

return <Navigate to="/dashboard/admin"/>;

}

if(user.role==="instructor"){

return <Navigate to="/dashboard/instructor"/>;

}

return <Navigate to="/dashboard"/>;

}

return children;

};

export default ProtectedRoute;