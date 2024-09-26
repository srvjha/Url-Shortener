import { useState } from 'react';
import { useUrl } from '@/contextAPI/Context';
import { getClicksForUrl } from '@/db/api.clicks';
import { deleteUrls, getUrl } from '@/db/api.urls';
import usefetch from '@/hooks/usefetch';
import { LinkIcon } from 'lucide-react';
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BarLoader,BeatLoader } from 'react-spinners';
import { Button } from '@/components/ui/button';
import { Check, Clipboard, Copy, Delete, Download, Trash } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import LocationStats from '@/components/LocationStats';
import DeviceStats from '@/components/DeviceStats';


const LinkPage = () => {
  const {user} = useUrl();
  const navigate = useNavigate();
  const {id} = useParams();

  const [isCopy,setIsCopy] = useState(false)

  const handleDownloadImage = ()=>{
    const imageUrl = url?.qr_code;
    const fileName = url?.title;
    const anchor = document.createElement("a");
    anchor.href = imageUrl;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }
  const { VITE_DEFAULT_SHORT_URL } = import.meta.env;
  const handleClipboard = ()=>{
    const fullShortURL = `${VITE_DEFAULT_SHORT_URL}/${url?.short_url}`;
    navigator.clipboard.writeText(fullShortURL);
    setIsCopy(true);
  }
  if(isCopy){
    setTimeout(()=>{
      setIsCopy(false)
    },3000)
  }

   

   const{
    data:url,
    error,
    loading,
    fn
   } = usefetch(getUrl,{id,user_id:user?.id})
   
   const{
    loading:loadingStats,
    data:stats,
    fn:fnStats
   } = usefetch(getClicksForUrl,id);

   //console.log({url})

   const {loading:loadingDelete,fn:deleteFunction} = usefetch(deleteUrls,id)
   
   useEffect(() => {
    fn();
  }, []);


  useEffect(() => {
    if (!error && loading === false) fnStats();
  }, [loading, error]);


   if(error){
    navigate("/dashboard");
   }

   let link = "";
   if(url) {
    link = url?.custom_url ? url?.custom_url : url.short_url
   }

   
  return (
    <>
   
      {(loading || loadingStats) && (
        <BarLoader className='mb-4' width={"100%"} color="#36d7b7"/>
      )}
      <div className='flex flex-col bg-gray-900 mx-10 rounded-xl border border-gray-700   gap-8 sm:flex-row justify-between p-7'>
      <div className='flex flex-col items-start gap-8 rounded-lg sm:w-2/5'>        
        <span className='text-6xl font-serif font-extrabold hover:underline cursor-pointer'>{url?.title}</span>
        <a 
        href={`${VITE_DEFAULT_SHORT_URL}/${link}`} 
        target="_blank"
        className='text-xl sm:text-lg flex text-blue-400 font-bold hover:underline cursor-pointer'
        >
         {VITE_DEFAULT_SHORT_URL}/{link}
        
        </a>
        <a
         href={url?.original_url} 
         target="_blank"
         className='flex items-center gap-1 hover:underline cursor-pointer'
         >
           <LinkIcon className='p-1'/>
           {url?.original_url}
           </a>
        <span className='flex items-end font-extralight text-sm'>{new Date(url?.created_at).toLocaleString()}</span>
        <div className='flex gap-2'>
        <Button 
        variant="ghost"
        onClick = {handleClipboard}
        >         
        {isCopy === true ? <Check/> :  <Copy/>}
        </Button>
        <Button variant="ghost" onClick={handleDownloadImage}>
          <Download/>
        </Button>
        <Button variant="ghost" onClick={()=>deleteFunction()}>
        {  loadingDelete? <BeatLoader size={5} color="white"/>:<Trash/>}
        </Button>
      </div>

      <img
      src={url?.qr_code}
      className=' self-center sm:self-start ring ring-blue-500 p-1 object-contain'
      alt="QR CODE"
      />
        </div>

        
        <Card className='sm:w-3/5 bg-transparent '>
          <CardHeader>
            <CardTitle  className="text-4xl font-extrabold">Stats</CardTitle>            
          </CardHeader>
          {stats && stats?.length ? (
             <CardContent className="flex flex-col gap-6">
            <Card className="bg-transparent">
              <CardHeader>
                <CardTitle>Total CLicks</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{stats?.length}</p>
              </CardContent>
            </Card>

            <CardTitle>
              <LocationStats stats={stats}/>
            </CardTitle>

            <CardTitle>
              <DeviceStats stats={stats}/>
            </CardTitle>
           </CardContent>
          
          ):(
            <CardContent>
              {
                loadingStats === false 
                ? "No Statistics yet"
                : "Loading Statistics."
              }
            <p>Card Content</p>
          </CardContent>
         
          )}
         
        </Card>

        </div>
      
    </>
  )
}

export default LinkPage
