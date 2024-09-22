import { useUrl } from '@/contextAPI/Context.jsx'
import React, { useEffect, useState } from 'react'
import { BarLoader } from 'react-spinners'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Filter } from 'lucide-react'
import Error from '@/components/Error'
import usefetch from '@/hooks/usefetch'
import { getAllUrls } from '@/db/api.urls.js'
import { getClicksForUrls } from '@/db/api.clicks.js'
import LinkCard from '@/components/LinkCard'
import CreateLink from '@/components/CreateLink'


const DashboardPage = () => {
  const [searchQuery,setSearchQuery] = useState("");
  
  const{user} = useUrl();
 const {data:urls,loading,error,fn:urlFunction} = usefetch(getAllUrls,user?.id)
  const {data:clicks,loading:loadingClicks,error:errorClicks,fn:clicksFunction}= usefetch(
    getClicksForUrls,
    urls?.map((url) => url.id)
  )

  useEffect(()=>{
    urlFunction()
  },[])

  useEffect(()=>{
    if(urls?.length){
      clicksFunction()
    }
   
  },[urls?.length])
 // console.log("urls: ",urls)
    const filteredUrls = urls?.filter((url)=>{
      return url.title.toLowerCase().includes(searchQuery.toLowerCase())
    })

  return (
    <div className=' px-14 mt-2 flex flex-col gap-8 '>
      {loading || loadingClicks && <BarLoader width={"100%"} color='#36d7b7'/>}
      <div className='grid grid-cols-2 gap-4 '>
      <Card className="bg-gray-800 text-white">
        <CardHeader>
          <CardTitle>Links Created</CardTitle>         
        </CardHeader>
        <CardContent>
          <p>{urls?.length}</p>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 text-white">
        <CardHeader>
          <CardTitle>Total Clicks</CardTitle>         
        </CardHeader>
        <CardContent>
          <p>{clicks?.length}</p>
        </CardContent>
      </Card>
      </div>
      
      <div className='flex justify-between'>
        <h1 className='text-4xl font-bold'>My Links</h1>
        <CreateLink/>
      </div>

      <div className='relative'>
       <Input 
       type="text"
       placeholder="Filter Links..."
       value = {searchQuery}
       onChange = {e=>setSearchQuery(e.target.value)}       
       />
       <Filter className='absolute top-2 right-2 p-1'/>
      </div>
      { error && <Error errMessage={error?.message}/> }
      {(filteredUrls || []).map((url,i)=>{
        return <LinkCard key={i} url={url} fetchUrls={urlFunction}/>
      })}
    </div>
  )
}

export default DashboardPage
