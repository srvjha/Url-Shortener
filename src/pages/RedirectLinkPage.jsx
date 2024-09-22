import { storeClicks } from '@/db/api.clicks.js';
import { getLongUrl } from '@/db/api.urls';
import usefetch from '@/hooks/usefetch';
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { BarLoader } from 'react-spinners';

const RedirectLinkPage = () => {
   const {id} = useParams();
   const{loading,data,fn} = usefetch(getLongUrl,id);
   const{loading:loadingStats,fn:statsFunction} = usefetch(storeClicks,{
    id:data?.id,
    originalUrl:data?.original_url,
   })

   useEffect(()=>{
    fn()
   },[])

   useEffect(()=>{
    if(!loading && data){
      statsFunction()
    }
   },[loading])

   if(loading || loadingStats){
    return (
      <>
      <BarLoader width={"100%"} color="36d7b7"/>
      <br />
      Redirecting...
      </>
    )
   }

  return null;
}

export default RedirectLinkPage
