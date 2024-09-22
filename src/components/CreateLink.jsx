import { useUrl } from '@/contextAPI/Context'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from './ui/button';
import { Input } from './ui/input';
import Error from './Error';
import { Card } from './ui/card';
import * as yup from "yup"
import usefetch from '@/hooks/usefetch';
import { QRCode } from 'react-qrcode-logo';
import { createUrl } from '@/db/api.urls';
import { BeatLoader } from 'react-spinners';

const CreateLink = () => {
    const {user} = useUrl();
    const navigate = useNavigate();
    const ref = useRef()
    let [searchParams,setSearchParams] = useSearchParams()
    const longlink = searchParams.get("createNewUrl");

    const [errors,setErrors] = useState({});
    const [formValues,setFormValues] = useState({
      title:"",
      longUrl:longlink ? longlink : "",
      customUrl: "",
    })

    const schema = yup.object().shape({
      title: yup.string().required("Title is required"),
      longUrl: yup
      .string()
      .url("Must be Valid URL")
      .required("Long URL is required"),
      customUrl: yup
      .string()
      
    })

    const handleChange = (e) => {
      setFormValues({
        ...formValues,
        [e.target.id]: e.target.value
      })
    }

     // Now Creating our url
     const{
      data,
      error,
      loading,
      fn:createUrlFunction
    }= usefetch(createUrl,{...formValues,user_id:user?.id})

    useEffect(()=>{
       if(error === null && data){
        navigate(`/link/${data[0].id}`)
       }
    },[error,data])
   

   

     const handleCreateNewURl = async()=>{
          setErrors([]);
          try {
            await schema.validate(formValues,{abortEarly:false})
            const canvas = ref.current.canvasRef.current;
            const blob = await new Promise((resolve) => canvas.toBlob(resolve));

            await createUrlFunction(blob)
          } catch (error) {
            const newErrors = {};

            error?.inner?.forEach((err)=>{
              newErrors[err.path] = err.message
            })
            setErrors(newErrors);
            
          }
     }

  return (
     <Dialog 
     defaultOpen={longlink}
     onOpenChange={(res)=>{
      if(!res){
        setSearchParams({})
      }
     }}
     >
        <DialogTrigger>
            <Button className="bg-blue-500 text-white hover:bg-blue-300">Create New Link</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-[black]">
            <DialogHeader>
            <DialogTitle className="font-bold text-2xl">Create New</DialogTitle>
            
            </DialogHeader>
            {formValues?.longUrl && <QRCode value={formValues?.longUrl} size={130} ref={ref}/>}
            <Input
            id = "title"
            placeholder="Short Link's Title"   
            value = {formValues.title}
            onChange = {handleChange}
            />
            {errors.title && <Error errMessage={errors.title}/>}

            <Input
            id = "longUrl"
            placeholder="Enter Your Looong URL"  
            value = {formValues.longUrl}
            onChange = {handleChange}
            />
            {errors.longUrl && <Error errMessage={errors.longUrl}/>}
           
           <div className=' flex items-center gap-2'>
            <Card className="p-2">shortify.in</Card>/        
            <Input
            id = "customUrl"
            placeholder="Custom Link (optional)" 
            value = {formValues.customUrl}
            onChange = {handleChange}
            />
            </div>
            {error && <Error errMessage={error.message}/>}
            <DialogFooter className="sm:justify-start">
              <Button disabled={loading} className="bg-white text-black hover:text-white" onClick={handleCreateNewURl}>
                {loading ? <BeatLoader size={10} color='white'/> :"Create"}
              </Button>
            </DialogFooter>
        </DialogContent>
        </Dialog>

    
  )
}

export default CreateLink
