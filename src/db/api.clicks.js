import supabase from "./supabase";
import { supabaseUrl } from "./supabase";
import {UAParser} from 'ua-parser-js'
import DeviceDetector from 'device-detector-js';


export async function getClicksForUrls(urlIds){
    console.log({urlIds})
    const {data,error} = await supabase
    .from("clicks")
    .select("*")
    .in("url_id", urlIds);

    if(error){
        console.error(error);
        throw new Error("Unable to load Clicks")
    }
    return data
}

// const parser = new UAParser();
export const storeClicks = async({id,originalUrl})=>{
    try {
      const deviceDetector = new DeviceDetector();
      const result = deviceDetector.parse(window.navigator.userAgent);
      console.log({result})

      const deviceType = result.device.type || "desktop"; // 'smartphone', 'tablet', 'desktop', 'smarttv', etc.
      console.log("Detected device:", deviceType);
      
 
       const response = await fetch("https://ipapi.co/json");
       const {city,country_name:country } = await response.json()
 
       await supabase.from("clicks").insert({
          url_id:id,
          city:city,
          country:country,
          device:deviceType
       });
 
       window.location.href = originalUrl
 
    } catch (error) {
       console.error("Error recording click: ",error);
       
    }
 }

 export async function getClicksForUrl(url_id){
   
    const {data,error} = await supabase
    .from("clicks")
    .select("*")
    .eq("url_id",url_id)
    
 
    if(error){
     console.error(error);
     throw new Error("Unable to load Stats");
    }
    // console.log({data})
    return data
 }