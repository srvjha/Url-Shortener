import supabase from "./supabase";
import { supabaseUrl } from "./supabase";


export async function getAllUrls(user_id){
   const userID = user_id;
   const {data,error} = await supabase
   .from("urls")
   .select("*")
   .eq("user_id",userID);

   if(error){
    console.error(error);
    throw new Error("Unable to load URLs");
   }
   //console.log({data})
   return data
}

export async function deleteUrls(id){
   
   const {data,error} = await supabase
   .from("urls")
   .delete()
   .eq("id",id);

   if(error){
    console.error(error);
    throw new Error("Unable to load URLs");
   }
   // console.log({data})
   return data
}


export async function createUrl({ title, longUrl, customUrl, user_id }, qr_code) {
   const short_url = Math.random().toString(36).substring(2, 9);
   const fileName = `qr-${short_url}`;
   
   // First, upload the QR code file to the storage bucket
   const { error: storageError } = await supabase.storage
      .from("qr_code")
      .upload(fileName, qr_code,{
      contentType: 'image/png'
      });

   // If there was an error during the upload, stop here
   if (storageError) {
      console.error("Error uploading QR code:", storageError.message);
      throw new Error("Error uploading QR code");
   }

   // Once the upload is successful, generate the public URL for the QR code
   const { data: { publicUrl }, error: publicUrlError } = supabase.storage
      .from("qr_code")
      .getPublicUrl(fileName);

   // If there was an error generating the public URL, stop here
   if (publicUrlError) {
      console.error("Error generating public URL:", publicUrlError.message);
      throw new Error("Error generating public URL for QR code");
   }

   console.log("Generated public URL for QR code:", publicUrl);

   // Now insert the record into the "urls" table with the public QR code URL
   const { data, error } = await supabase
      .from("urls")
      .insert([
         {
            title,
            original_url: longUrl,
            custom_url: customUrl || null,
            user_id,
            qr_code: publicUrl,  // Use the public URL of the uploaded QR code
            short_url
         }
      ])
      .select();

   // If there's an error inserting the record, handle it
   if (error) {
      console.error("Error inserting URL record:", error.message);
      throw new Error("Unable to create short URL");
   }

   console.log("Short URL created successfully:", data);

   return data;
}


export async function getLongUrl(id){
   
   const {data,error} = await supabase
   .from("urls")
   .select("id,original_url")
   .or(`short_url.eq.${id},custom_url.eq.${id}`)
   .single();

   if(error){
    console.error(error);
    throw new Error("Unable to load URLs");
   }
   // console.log({data})
   return data
}

export async function getUrl({id,user_id}){
   
   const {data,error} = await supabase
   .from("urls")
   .select("*")
   .eq("id",id)
   .eq("user_id",user_id)
   .single();

   if(error){
    console.error(error);
    throw new Error("Short Url not found");
   }
   // console.log({data})
   return data
}








