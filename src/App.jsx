import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import AppLayout from './layouts/app.layout.jsx'
import LandingPage from './pages/LandingPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import AuthPage from './pages/AuthPage.jsx'
import LinkPage from './pages/LinkPage.jsx'
import RedirectLinkPage from './pages/RedirectLinkPage.jsx'
import { UrlProvider } from './contextAPI/Context'
import RequireAuth from './components/require-auth'

const router  = createBrowserRouter([
  {
    element:<AppLayout/>,
    children:[
      {
        path:'/',
        element:<LandingPage/>
      },
      {
        path:'/dashboard',
        element:(<RequireAuth>
            <DashboardPage/> 
        </RequireAuth>),
      
      },
      {
        path:'/auth',
        element:<AuthPage/>
      },
      {
        path:'/link/:id',
        element:(<RequireAuth>
          <LinkPage/>
        </RequireAuth>),
      },
      {
        path:'/:id',
        element:<RedirectLinkPage/>
      }
    ]
  }
])

function App() {
 
  return <UrlProvider>
  <RouterProvider router={router}/>
  </UrlProvider>
}

export default App
