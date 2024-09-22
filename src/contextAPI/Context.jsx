import usefetch from "@/hooks/usefetch";
import { createContext, useContext, useEffect } from "react";
import { getCurrentUserSessionDetails } from "@/db/api.auth";

export const UrlContext = createContext()

export const UrlProvider = ({children})=>{
  const {data:user,loading,fn:fetchUser} =   usefetch(getCurrentUserSessionDetails);
 // console.log("dbUser: ",user)
  const isAuthenticated = user?.role === "authenticated";

  useEffect(()=>{
    fetchUser();
  },[])

    return <UrlContext.Provider value={{ user,fetchUser,loading,isAuthenticated }}>{children}</UrlContext.Provider>
}

export const useUrl = () => {
   return useContext(UrlContext);
}




