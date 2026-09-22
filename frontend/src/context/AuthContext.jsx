import React,{
createContext,
useContext,
useEffect,
useState
} from "react";

import api from "../utils/api";

const AuthContext=createContext();

export const AuthProvider=({children})=>{

const [user, setUser] = useState(() => {
  try {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
});

const [loading, setLoading] = useState(false);

// Load User
useEffect(() => {
  const loadUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      const res = await api.get("/auth/me");
      if (res.data?.success && res.data?.user) {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
    } catch (error) {
      console.warn("Could not refresh user session:", error);
    } finally {
      setLoading(false);
    }
  };

  loadUser();
}, []);


// Login

const login=async(email,password)=>{

try{

const res=await api.post("/auth/login",{

email,

password

});

localStorage.setItem(

"token",

res.data.token

);

localStorage.setItem(

"user",

JSON.stringify(res.data.user)

);

setUser(res.data.user);

return{

success:true,

user:res.data.user

};

}catch(error){

return{

success:false,

message:error.response?.data?.message

};

}

};


// Signup

const signup=async(data)=>{

try{

const res=await api.post(

"/auth/register",

data

);

localStorage.setItem(

"token",

res.data.token

);

localStorage.setItem(

"user",

JSON.stringify(res.data.user)

);

setUser(res.data.user);

return{

success:true,

user:res.data.user

};

}catch(error){

return{

success:false,

message:error.response?.data?.message

};

}

};


// Logout

const logout=()=>{

localStorage.removeItem("token");

localStorage.removeItem("user");

setUser(null);

};

const updateUser = (updatedData) => {
  setUser((prev) => {
    const next = { ...prev, ...updatedData };
    try {
      localStorage.setItem("user", JSON.stringify(next));
    } catch (err) {
      console.error("Error saving user to localStorage", err);
    }
    return next;
  });
};

return(

<AuthContext.Provider

value={{

user,

setUser,

updateUser,

loading,

login,

signup,

logout

}}

>

{children}

</AuthContext.Provider>

);

};

export const useAuth=()=>{

return useContext(AuthContext);

};