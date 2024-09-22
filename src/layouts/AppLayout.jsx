import Footer from '@/components/Footer.jsx';
import Header from '../components/Header.jsx'
import React from 'react'
import { Outlet } from 'react-router-dom';

const AppLayout = () => {
  return (
    <div>
      <main className='min-h-screen'>

      <Header />
      <Outlet/>
      </main>
     <Footer/>
      {/* footer */}

     

    </div>
  )
}

export default AppLayout;
