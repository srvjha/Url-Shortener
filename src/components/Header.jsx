import React, { useState,useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LinkIcon, LogOut } from 'lucide-react'
import { useUrl } from '@/contextAPI/Context'
import usefetch from '@/hooks/usefetch'
import { logout } from '@/db/api.auth'
import { BarLoader } from 'react-spinners'

const Header = () => {
  const navigate = useNavigate();
  const {user,fetchUser} = useUrl();
  const [profilePhoto, setProfilePhoto] = useState(null);

  // Effect to determine the profile photo when user changes
  useEffect(() => {
    if (user?.user_metadata?.avatar_url) {
      setProfilePhoto(user.user_metadata.avatar_url);
    } else if (user?.user_metadata?.profile_photo) {
      setProfilePhoto(user.user_metadata.profile_photo);
    } else {
      setProfilePhoto(null); // Fallback if no profile picture is provided
    }
  }, [user]);


 
  // Generate the initials for AvatarFallback
  const picSub = user?.user_metadata?.name?.split(" ").map((data) => data[0]).join("") || "";

  const{loading,fn:logoutFunction} = usefetch(logout)
 
  return (
    <>
    <nav className='py-4 px-14 flex justify-between items-center bg-black'>
      <Link to='/'>
        <img src="/logo.png" className="h-16" alt="Shortify Logo" />
      </Link>

      <div>
        {!user ? (
          <Button onClick={() => navigate("/auth")}>Login</Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger className='w-10 rounded-full overflow-hidden'>
              <Avatar>
               { 
               profilePhoto ? (<AvatarImage src={profilePhoto} className=" object-contain"/>)
                :(<AvatarFallback>{picSub}</AvatarFallback> )              
              }
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{user?.user_metadata?.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/dashboard" className='flex'>
                <LinkIcon className='mr-2 h-4 w-4' />
                My Links
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-400 cursor-pointer">
                <LogOut className='mr-2 h-4 w-4' />
                <span onClick={()=>{
                  logoutFunction().then(()=>{
                    fetchUser()
                    navigate("/")
                  })
                }}>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      
    </nav>
    {loading && <BarLoader className='mb-4' width={"100%"} color='#36d7b7'/>}
    </>
  )
}

export default Header
