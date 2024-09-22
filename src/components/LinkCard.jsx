import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { Check, Clipboard, Copy, Delete, Download, Trash } from 'lucide-react'
import usefetch from '@/hooks/usefetch'
import { deleteUrls } from '@/db/api.urls'
import { BeatLoader } from 'react-spinners'

const LinkCard = ({url,fetchUrls}) => {
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

  const handleClipboard = ()=>{
    navigator.clipboard.writeText(`https://shortify.in/${url?.short_url}`);
    setIsCopy(true);
  }
  if(isCopy){
    setTimeout(()=>{
      setIsCopy(false)
    },3000)
  }

  const{loading:loadingDelete,fn:deleteFunction} = usefetch(deleteUrls,url?.id)


  return (
    <div className='flex flex-col md:flex-row gap-5 border p-4 bg-gray-900 rounded-lg'>
      <img 
      src={url?.qr_code} 
      className='h-32 object-contain ring ring-blue-500 self-start'
      alt="qr code" />
      

      <Link to={`/link/${url?.id}`} className='flex flex-col flex-1'>
      <span className='text-3xl font-extrabold hover:underline cursor-pointer'>{url?.title}</span>
      <span className='text-2xl text-blue-400 font-bold hover:underline cursor-pointer'>
        https://shortify.in/{url?.custom_url ? url?.custom_url : url?.short_url}
      </span>
      <span className='flex items-center gap-1 hover:underline cursor-pointer'>{url?.original_url}</span>
      <span className='flex items-end text-gray-400 font-extralight text-sm flex-1'>{new Date(url?.created_at).toLocaleString()}</span>
      </Link>

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
        <Button variant="ghost" onClick={()=>deleteFunction().then(()=>{
         return fetchUrls()
        })}>
        {  loadingDelete? <BeatLoader size={5} color="white"/>:<Trash/>}
        </Button>
      </div>
    </div>
  )
}

export default LinkCard
