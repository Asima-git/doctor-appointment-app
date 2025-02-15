import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Contact from './pages/Contact'
import About from './pages/About'
import Login from './pages/Login'
import MyProfile from './pages/MyProfile'
import MyAppointment from './pages/MyAppointment'
import Appointment from './pages/Appointment'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import { ToastContainer } from 'react-toastify'

const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer/>
      <NavBar/>
       <Routes>
         <Route path='/' element={<Home/>}/>
         <Route path='/doctors' element={<Doctors/>}/>
         <Route path='/doctors/:speciality' element={<Doctors/>}/>
         <Route path='/contact' element={<Contact/>}/>
         <Route path='/about' element={<About/>}/>
         <Route path='/login' element={<Login/>}/>
         <Route path='/my-profile' element={<MyProfile/>}/>
         <Route path='/my-appointments' element={<MyAppointment/>}/>
         <Route path='/appointment/:docId' element={<Appointment/>}/>
       </Routes>
       <Footer/>
    </div>
  )
}

export default App