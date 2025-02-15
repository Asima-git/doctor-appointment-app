import React, { useContext } from 'react'
import Login from './pages/Login'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { AdminContext } from './context/AdminContext';
import NavBar from './components/NavBar';
import SideBar from './components/SideBar';
import Dashboard from './pages/Admin/Dashboard';
import AllAppointment from './pages/Admin/AllAppointment';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorsList';
import { Route, Routes } from 'react-router-dom'
import { DoctorContext } from './context/DoctorContext';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import DoctorAppointment from './pages/Doctor/DoctorAppointment';

const App = () => {
  const {aToken} = useContext(AdminContext)
  const {dToken} = useContext(DoctorContext);

  return aToken || dToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      <NavBar />
      <div className='flex items-start'>
        <SideBar />
          <Routes>
            {/* Admin Route */}
            <Route path='/admin-dashboard' element={<Dashboard/>} />
            <Route path='/all-appointments' element={<AllAppointment/>} />
            <Route path='/add-doctor' element={<AddDoctor/>} />
            <Route path='/doctor-list' element={<DoctorsList/>} />

            {/* Doctor Route */}
            <Route path='/doctor-dashboard' element={<DoctorDashboard/>} />
            <Route path='/doctor-profile' element={<DoctorProfile/>} />
            <Route path='/doctor-appointments' element={<DoctorAppointment/>} />
          </Routes>
      </div>
    </div>
  ) : (
    <>
       <Login />
       <ToastContainer />
    </>
  )
}

export default App
