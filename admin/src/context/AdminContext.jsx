import { createContext, useState } from "react";
import axios from 'axios'
import {toast} from 'react-toastify';

export const AdminContext = createContext()

const AdminContextProvider = (props)=>{
 const [aToken,setAToken] = useState(localStorage.getItem('atoken')?localStorage.getItem('atoken'):'')
 const [doctors,setDoctors] = useState([]);
 const [appointments,setAppointments] = useState([])
 const [dashData,setDashData] = useState([])

 const backendURL = import.meta.env.VITE_BACKEND_URL
 const getAllDoctors = async()=>{
    try {
        const response = await axios.get(`${backendURL}/api/admin/all-doctors`, {
          headers: {
            atoken: aToken, 
            "Content-Type": "application/json",
          },
        });
      if(response.data.success){
       setDoctors(response.data.data)
      }else{
        toast.error(response.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
 }

const changeAvailablity = async(docId)=>{
   try {
    
    const {data} = await axios.post(`${backendURL}/api/admin/change-availblity`,{docId},
      {
        headers: {
          atoken: aToken, 
          "Content-Type": "application/json",
        },
      })
      if(data.success){
       toast.success(data.message)
       getAllDoctors()
      }else{
        toast.error(data.message)
      }
   } catch (error) {
    toast.error(error.message)
   }
 }

 const getAllAppointment = async()=>{
  try {
    const {data} = await axios.get(`${backendURL}/api/admin/appointments`,
      {
        headers: {
          atoken: aToken, 
          "Content-Type": "application/json",
        },
      }) 
      if(data.success){
        setAppointments(data.data)
        console.log(data.data);
      }else{
        toast.error(data.message)
      }  
  } catch (error) {
    toast.error(error.message)
  }
 }

 const cancleAppointment = async(appointmentId)=>{
   try {
    const {data} = await axios.post(`${backendURL}/api/admin/cancle-appointment`,{appointmentId},
      {
        headers: {
          atoken: aToken, 
          "Content-Type": "application/json",
        },
      })
      if(data.success){
        toast.success(data.message)
        getAllAppointment()
      }else{
        toast.error(data.message)
      }
   } catch (error) {
    toast.error(error.message)
   }
 }

 const getDashData = async()=>{
  try {
    const {data} = await axios.get(`${backendURL}/api/admin/dashboard`,
      {
        headers: {
          atoken: aToken, 
          "Content-Type": "application/json",
        },
      })
      if(data.success){
        setDashData(data.data.dashData)
        console.log(data.data.dashData)
       }else{
         toast.error(data.message)
       }
  } catch (error) {
    toast.error(error.message)
  } 
 } 
const value = {
    aToken,setAToken,
    backendURL,
    doctors,
    getAllDoctors,
    changeAvailablity,
    getAllAppointment,
    appointments,
    cancleAppointment,
    getDashData,
    dashData,
  }
  return (
    <AdminContext.Provider value={value}>
         {props.children}
    </AdminContext.Provider>
  )
}

export default AdminContextProvider