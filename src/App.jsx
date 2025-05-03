import { useEffect} from 'react'
import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import {AppSidebar}  from './AppSidebar'
import Home from './Page/Home'
import Login from './Page/Login'
import { Toaster } from "@/components/ui/sonner"
import Employee_profile from './employee/employee_profile'
import Dashboard_allEmployee from './employee/Dashboard_allEmployee'
import Sale from './Create_Sale/Sale'
import AddProducts from './Page/AddProducts'
import ProductSale from './Create_Sale/ProductSale'
import PrintPage from './Page/PrintPage'
import Products from './Page/Products'
import UserProfile from './Page/Profile'
import PageNotFound from './Page/PageNotFound'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { logOutUser } from './store/userSlice'

function App() {
 
  let userStore = useSelector((state)=>state.user);
  let Authenticated = userStore.isAuthenticated;
  let dispatch = useDispatch();
useEffect(()=>{
  const verifyToken = async()=>{
     try {
       await axios.get(`https://sale-report.onrender.com/user/check`,{
        withCredentials:true,
      })
     } catch (error) {
      dispatch(logOutUser());
     }
  }
  verifyToken()
},[])
  return (
 
<>

<BrowserRouter>
      <SidebarProvider>
        <div className="flex h-screen">
          {/* Sidebar on the left */}
         { Authenticated&&<AppSidebar />}

          {/* Main content area */}
          <main className="flex-1 p-4 flex-row">
           
           {Authenticated&&<SidebarTrigger />}

            {/* Route content */}
            <Routes>
              <Route path="/" element={Authenticated === true ? <Home /> : <Navigate to="/login" />}/>
              <Route path="/login" element={Authenticated===false? <Login/>:<Navigate to = '/'/>} />
              <Route path="/products" element={Authenticated?<Products/>:<Navigate to = '/login'/>} />

              <Route path="/addEmployee" element={Authenticated&&userStore.user?.isAdmin?<Employee_profile/>:<Navigate to = '/'/>} />
              <Route path="/dashboard/allEmployee" element={Authenticated&&userStore.user?.isAdmin?<Dashboard_allEmployee/>:<Navigate to = '/'/>} />
              <Route path="/sales" element={Authenticated?<Sale/>:<Navigate to ='/'/>}/>
              <Route path="/addProducts" element={Authenticated&&userStore.user?.isAdmin?<AddProducts/>:<Navigate to ='/login'/>}/>
              <Route path="/saleProducts" element={Authenticated?<ProductSale/>:<Navigate to = '/login'/>}/>
              <Route path="/print" element={Authenticated?<PrintPage/>:<Navigate to = '/login'/>}/>
              <Route path="/profile" element={Authenticated?<UserProfile/>:<Navigate to = '/login'/>}/>
              <Route path="*" element={<PageNotFound/>}/>

            </Routes>
          </main>
        </div>
      </SidebarProvider>
      <Toaster position="top-center" />
    </BrowserRouter>
</>

  )
}

export default App
