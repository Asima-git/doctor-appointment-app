import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const DoctorContext = createContext()

const DoctorContextProvider = (props) => {
  const backendURL = import.meta.env.VITE_BACKEND_URL
  const [dToken, setDToken] = useState(localStorage.getItem('dtoken') ? localStorage.getItem('dtoken') : '')
  const [appointments, setAppointments] = useState([])
  const [dashData,setDashData] = useState(false)
  const [profileData,setProfileData] = useState(false)

  const getAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendURL}/api/doctor/appointments`, {
        headers: {
          dtoken: dToken,
          "Content-Type": "application/json",
        },
      });
      if (data.success) {
        setAppointments(data.data)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(`${backendURL}/api/doctor/complete-appointment`, {appointmentId }, {
        headers: {
          dtoken: dToken,
          "Content-Type": "application/json",
        },
      });
      if (data.success) {
        toast.success(data.message)
        getAppointments()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const cancleAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(`${backendURL}/api/doctor/cancle-appointment`,
         {appointmentId}, {
        headers: {
          dtoken: dToken,
          "Content-Type": "application/json",
        },
      });
      if (data.success) {
        toast.success(data.message)
        getAppointments()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

 const getDashData = async()=>{
      try {
        const {data} = await axios.get(`${backendURL}/api/doctor/dashboard`,{
          headers: {
            dtoken: dToken,
            "Content-Type": "application/json",
          },
        });
        if(data.success){
          setDashData(data.data)
        }else{
          toast.error(data.message)
        }
      } catch (error) {
        console.log(error.message)
        toast.error(error.message)
      }
 }

 const getProfileData = async()=>{
  try {
    const {data} = await axios.get(`${backendURL}/api/doctor/profile`,{
      headers: {
        dtoken: dToken,
        "Content-Type": "application/json",
      },
    });
    if(data.success){
      setProfileData(data.data)
      console.log(data.data)
    }else{
      toast.error(data.message)
    }
  } catch (error) {
    console.log(error.message)
    toast.error(error.message)
  }
 }
  const value = {
    backendURL,
    dToken, setDToken, 
    getAppointments,
    appointments, 
    setAppointments,
    completeAppointment,
    cancleAppointment,
    dashData,setDashData,getDashData,
    getProfileData,
    profileData,
    setProfileData
  }
  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  )
}

export default DoctorContextProvider