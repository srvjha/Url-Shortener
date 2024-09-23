import React from 'react'

const Footer = () => {
  return (
    <div className='p-5 text-center bg-white mt-10'>
       <div className='text-black text-lg font-medium'>Made with 💖 by Saurav Jha</div>
       <div className='text-sm ml-2  text-gray-600 '>
         &copy; <span>2024 Copyright</span> 
         <a 
           href="https://shrnkit.vercel.app" 
           target="_blank" 
           rel="noopener noreferrer" 
           className='text-black cursor-pointer hover:underline hover:text-gray-500 font-medium ml-1'
         >
           Visit My Website
         </a>
       </div>      
    </div>
  )
}

export default Footer
