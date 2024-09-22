import React, { useEffect, useState } from 'react'
import { Input } from './ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Button } from './ui/button';
import { BeatLoader } from 'react-spinners';
import Error from './Error.jsx';
import * as Yup from "yup"
import usefetch from '@/hooks/usefetch';
import { googleAuth, signup } from '@/db/api.auth.js';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom'
import { useUrl } from '@/contextAPI/Context';
import { FcGoogle } from 'react-icons/fc'; 
  

const Signup = () => {
  const [formData,setFormData] = useState({
    name:"",
    email: '',
    password: '',
    profile_photo:null,
  })

  const [errors,setErrors] = useState([]);

  const{data,loading,error,fn:signupFunction} = usefetch(signup,formData);
  const {data:googleData,error:googleError,loading:googleLoading,fn:googleSignupFunction} = usefetch(googleAuth)
  const {fetchUser} = useUrl();
  const navigate = useNavigate();
  
  const [searchParams] =  useSearchParams()
  const longLink = searchParams.get("createNewUrl")
  useEffect(() => {
    if ((data && error === null) || (googleData && googleError === null)) {
        console.log("Data: ",data)
        navigate(`/dashboard${longLink ? `?createNewUrl=${longLink}` : ""}`);
        fetchUser();
    }
}, [data, error, googleData, googleError]);

 
  // Handlling Input Dynamically using computed property
  const handleInputChange = (e) =>{
    const {name,value,files} = e.target;
    setFormData((prevformData)=>({
      ...prevformData,
      [name]:files ? files[0] : value,

    }))
  }

  // Now Focusing on Validating our email and password
  const handleSignup = async ()=>{
    setErrors([]);
    try {
      // For validating our inputs
      const schema = Yup.object().shape({
        name:Yup.string()
        .required('Name is required'),
        email: Yup.string()
        .email("Invalid Email")
        .required("Email is Required"),
        password: Yup.string()
        .min(6,"Password must be at least 6 characters")
        .required("Password is Required"),
        profile_photo:Yup.mixed()
        .required("Profile picture is required")

      })
      //console.log("Yup: ",Yup)
      await schema.validate(formData, { abortEarly: false });

      // Api Call
      await signupFunction()
      
    } catch (error) {
      const newErrors = {};
      error?.inner?.forEach((err)=>{
        newErrors[err.path] = err.message;
      }) 
      console.log("newError: ",newErrors)  ;
      setErrors(newErrors);
    }
  }

  // google signup

  const handleGoogleSignup = async () => {   
    try {
      await googleSignupFunction()
  
    } catch (error) {
      setErrors({ google: error.message });
    } 
  };
  


  return (
    <div>
     <Card>
        <CardHeader>
            <CardTitle>Signup</CardTitle>
            <CardDescription>Create a new account if you haven't already.</CardDescription>
            {error && <Error errMessage={error.message}/>}
        </CardHeader>

        <CardContent className = "space-y-2">
           <div className='space-y-1'> 
             <Input 
             type="text"
             placeholder="Enter your name"
             name = "name"
             onChange = {handleInputChange}
             />
           
           </div>
           {errors.name && <Error errMessage={errors.name}/>}
           <div className='space-y-1'> 
             <Input 
             type="email"
             placeholder="Enter your email"
             name = "email"
             onChange = {handleInputChange}
             />
           
           </div>
           {errors.email && <Error errMessage={errors.email}/>}
        <div className='space-y-1'> 
             <Input 
             type="password"
             placeholder="Enter your password"
             name = "password"
             onChange = {handleInputChange}
             />
            
           </div>
           {errors.password && <Error errMessage={errors.password}/>}
        <div className='space-y-1'> 
             <Input 
             type="file"
             accept = "image/*"
             name = "profile_photo"
             onChange = {handleInputChange}
             />
            
           </div>
           {errors.profile_photo && <Error errMessage={errors.profile_photo}/>}
           </CardContent>
           <CardFooter>
        <div className=' flex flex-col items-center justify-center  w-full'>        
        <Button className="w-[168px] items-center text-md" onClick={handleSignup}>
            {loading ? <BeatLoader size={10} color='black'/>:"Create New Account"}
           
        </Button>
        <div>
        <div className="flex items-center justify-center my-2">
        <hr className="w-28 border-t border-gray-300" />
        <span className="px-2 text-sm text-gray-600">Or Continue With</span>
        <hr className="w-28 border-t border-gray-300" />
       </div>
        </div>
        <Button 
            className="w-[190px] mt-2  text-md" 
            variant="outline" 
            onClick={handleGoogleSignup}
          >
          
          {googleLoading ? (
        <BeatLoader size={10} color='black' />
    ) : (
        <div className="flex items-center">
            <FcGoogle className="mr-2" size={20} /> {/* Google icon with margin */}
            <span>Sign Up with Google</span> {/* Text */}
        </div>
    )}
          </Button>
          </div>
        </CardFooter>
    </Card>

    </div>
  )
}

export default Signup
