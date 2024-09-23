import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useNavigate } from 'react-router-dom';


const LandingPage = () => {
  const [longUrl,setLongUrl] =  useState();
  const navigate = useNavigate();
  const handleShorten = (e)=>{
    e.preventDefault()
    if(longUrl){
      navigate(`/auth?createNewUrl=${longUrl}`)
    }
  }
  return (
    <div className="flex flex-col items-center">
      <h2 className="mx-10 my-10 sm:my-16 text-3xl sm:text-5xl lg:text-6xl text-white text-center font-extrabold">
      Your Ultimate URL Shortener—Quick, Simple, and Powerful! 👇
      </h2>
      
      <form onSubmit={handleShorten} className="sm:h-14 flex flex-col sm:flex-row w-full sm:w-3/4 md:w-2/4 gap-4 sm:gap-2 px-4">
        <Input 
        className="w-full h-full sm:flex-1"
        type="url"
        value={longUrl}
        onChange = {(e)=>setLongUrl(e.target.value)}
        placeholder="Enter Your URL..." />
        <Button className="w-full h-full sm:w-auto bg-blue-500 text-lg text-white" type="submit">Shorten!</Button>
      </form>
      
      <img src="/bannerurl.webp" alt="banner" className="w-full my-8 sm:my-11 md:px-8 object-cover" />
      <Accordion type="multiple" collapsible className="w-full md:px-11">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            How does the Shortify URL shortener works?
          </AccordionTrigger>
          <AccordionContent>
            When you enter a long URL, our system generates a shorter version of
            that URL. This shortened URL redirects to the original long URL when
            accessed.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            Do I need an account to use the app?
          </AccordionTrigger>
          <AccordionContent>
            Yes. Creating an account allows you to manage your URLs, view
            analytics, and customize your short URLs.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>
            What analytics are available for my shortened URLs?
          </AccordionTrigger>
          <AccordionContent>
            You can view the number of clicks, geolocation data of the clicks
            and device types (mobile/desktop) for each of your shortened URLs.
          </AccordionContent>
        </AccordionItem>
      </Accordion>

    </div>
  );
};

export default LandingPage;
