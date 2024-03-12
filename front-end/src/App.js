import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Navbar from "./component/Nav";
import Menu from "./component/menu";
import './App.css'
import Main from "./pages/main";
import Employee from "./pages/employee";
import Error from "./pages/error";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Goals from "./pages/goals";
import Timeoff from "./pages/timeoff";
import Working_hours from "./pages/work_hours";
import Staff_salaries from "./pages/Staff_salaries";
import Login from "./pages/login";
import axios from "axios";
import { useEffect, useState } from "react";
import img from "./image/loding.gif"
import EmpGoals from "./pagesEmp/emp_goals";
import Emptimeoff from "./pagesEmp/emp_timeoff";
import MainEmp from "./pagesEmp/main";
import Inbox from "./pagesEmp/inbox";
import Setting from "./pages/setting";


export default function App() {
const [session,setSession] = useState('loding')
  const [typeM,setTypeM] = useState();
  
  async function handler_session(event) {
    await axios.post('http://localhost:8000/api/check_session',
    {'token_M':sessionStorage.getItem('token_M')}).then(({data})=>{
      setTypeM(sessionStorage.getItem('Type_M'))
      setSession(true)
}).catch(({})=>{
  sessionStorage.clear()
  setSession(false)
})
}
useEffect(()=>{
handler_session()
},[session])


 
  if (session == false) {
   
    return(
      <><ToastContainer />
      <Login />
      </>
    )
  }
  else if (session == true && typeM == 'admin'){
  return (
      <BrowserRouter >
      
      <div class="body bg-gray-50 dark:bg-gray-900 flex h-screen" >
    <Menu />
    <div class="flex flex-col flex-1 w-full ">

      <ToastContainer />
      <Navbar />
      <Routes>
      <Route path="/" element={<Main /> } />
      <Route path="/employee" element={<Employee /> } />
      <Route path="/goals" element={<Goals /> } />
      <Route path="/timeoff" element={<Timeoff /> } />
      <Route path="/work_hours" element={<Working_hours /> } />
      <Route path="/salaries" element={<Staff_salaries /> } />
      <Route path="/inbox" element={<Inbox/> } />
      <Route path="*" element={<Error />} />
      </Routes>
      </div>
      </div>
      </BrowserRouter>
    );
  }
  else if (session == true && typeM == 'employee'){
    return (
    <BrowserRouter >
      <div class="flex h-screen bg-gray-50 dark:bg-gray-900" >
    <Menu />
    <div class="flex flex-col flex-1 w-full ">
      <ToastContainer />
      <Navbar />
      <Routes>
      <Route path="/"  element={<MainEmp /> } />
      <Route path="/Empgoals" element={<EmpGoals /> } />
      <Route path="/TimeOFF" element={<Emptimeoff/> } />
      <Route path="/inbox" element={<Inbox/> } />
      <Route path="/setting" element={<Setting/> } />
      <Route path="*" element={<Error />} />
      </Routes>
      </div>
    </div>
      </BrowserRouter>
    )
  }
  else{
    return (
      <div class="flex justify-center items-center h-screen">
  <img src={img} class="object-cover h-full" />
</div>

    )
  }
}


