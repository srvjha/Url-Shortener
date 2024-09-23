import supabase from "./supabase.js";
import { supabaseUrl } from "./supabase.js";

const { VITE_DEFAULT_SHORT_URL } = import.meta.env;


export async function login({email,password}) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
   // console.log("SupaBase: ",supabase)
    if (error) {
        throw new Error(error.message)
    }
        // console.log("Data: ",data)
        return data.user;
    
}

export async function getCurrentUserSessionDetails(){
    const {data:session,error } = await supabase.auth.getSession();
    if(!session.session) return null;
    if(error){
        throw new Error(error.message)
    }
    return session.session?.user ;
}

export async function signup({name,email,password,profile_photo}) {
    const randomNumber = Math.floor(Math.random() * 1000);
    const fileName = `dp-${name.split(" ").join("-")}-${randomNumber}-${Date.now()}`
    const {error:storageError} =  await supabase.storage
    .from("profile_photo")
    .upload(fileName,profile_photo);
    
    if(storageError) throw new Error(storageError.message);

    // Normal Email Signup

   const {data,error} =  await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
            name,
            profile_photo: `${supabaseUrl}/storage/v1/object/public/profile_photo/${fileName}`
            },
        },
    });

    if(error) throw new Error(error.message);

    return data
    
}

export async function googleAuth() {   
    const url = localStorage.getItem("longLink");
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo:`${VITE_DEFAULT_SHORT_URL}/dashboard?createNew=${url}`
        }
       
    }); 

    if (error) throw new Error(error.message);

    return data.user;
}

export async function logout(){
    const {error} = await supabase.auth.signOut();
    if(error) throw new Error(error.message);
}