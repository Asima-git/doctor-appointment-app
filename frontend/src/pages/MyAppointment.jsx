import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const MyAppointment = () => {
  const { backendURL, token, getDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([])
  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const navigate = useNavigate()
  const slotDateFormate = (slotDate) => {
    const dateArr = slotDate.split('_')
    return dateArr[0] + " " + months[Number(dateArr[1])] + ", " + dateArr[2]
  }
  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(
        `${backendURL}/api/user/appointments`,
        { headers: { token: token } }
      );
      if (data.success) {
        console.log(data.data);
        setAppointments(data.data.reverse())
        getDoctorsData()
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        toast.error(error.response.data.message || "Something went wrong!");
      }
    }
  }
  const cancleAppoitntment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendURL}/api/user/cancle-appointment`, { appointmentId },
        { headers: { token: token } }
      );
      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
      } else {
        toast.error(data.message || "Something went wrong!");
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        toast.error(error.response.data.message || "Something went wrong!");
      }
    }
  }

  //  const initpay = (order)=>{
  //   const options = {
  //     key : import.meta.env.VITE_RAZORPAY_KEY_ID,
  //     amount:order.amount,
  //     currency:order.currency,
  //     name:'Appointment Payment',
  //     description:'Appointment Payment',
  //     order_id:order.id,
  //     receipt:order.receipt,
  //     handler:async(res)=>{
          // try {
          //   const { data } = await axios.post(
          //     `${backendURL}/api/user/verifypayment`, res,
          //      { headers: { token: token } });
          //  if(data.success){
          //   getUserAppointments()
          //   navigate('/my-appointments')
          //  }
          // } catch (error) {
          //   console.log(error)
          //   toast.error(error)
          // }
  //     }
  //   }
  //   const rezp = new window.Razorpay(options)
  //   rezp.open()
  //  }
  // const appoitmentPay = async(appointmentId)=>{
  //  try {
  //   const { data } = await axios.post(
  //     `${backendURL}/api/user/payment`, { appointmentId },
  //     { headers: { token: token } }
  //   );
  //   if (data.success) {
  //    initpay(data.order)
  //   } else {
  //     toast.error(data.message || "Something went wrong!");
  //   }
  //  } catch (error) {
    
  //  }
  // }
  useEffect(() => {
    if (token) {
      getUserAppointments()
    }
  }, [token])
  return appointments && (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My appointments</p>
      <div>
        {appointments.map((item, index) => (
          <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
            <div>
              <img className='w-32 bg-indigo-50' src={item?.docData?.image} />
            </div>
            <div className='flex-1 text-sm text-zinc-600'>
              <p className='text-neutral-800 font-semibold'>{item?.docData?.name}</p>
              <p>{item?.docData?.speciality}</p>
              <p className='text-neutral-700 font-medium mt-1'>Address:</p>
              <p className='text-xs'> {item?.docData?.address.line1}</p>
              <p className='text-xs'>{item?.docData?.address.line2}</p>
              <p className='text-xs mt-1'><span className='text-sm text-neutral-700 font-medium'>Date & Time:</span> {slotDateFormate(item.slotDate)} |  {item.slotTime}</p>
            </div>
            <div></div>
            <div className='flex flex-col gap-2 justify-end'>
              {!item.canclled && item.payment && !item.isCompleted && <button className='text-sm text-center sm:min-w-48 py-2 border border-gray-400 text-gray-400 rounded  hover:bg-red-600 hover:text-white transition-all duration-300'>Paid</button>}
              {/* {!item.canclled && <button onClick={()=>appoitmentPay(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'>Pay Online</button>} */}
              {!item.canclled && !item.payment && !item.isCompleted && <button className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'>Pay Online</button>}
              {!item.canclled && !item.isCompleted && <button onClick={() => cancleAppoitntment(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded  hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel appointment</button>}
              {item.canclled && !item.isCompleted && <button className='text-sm text-center sm:min-w-48 py-2 border border-red-600 text-red-600 rounded  hover:bg-red-600 hover:text-white transition-all duration-300'>Appoitment Canclled</button>}
              {item.isCompleted && <button className='text-sm text-center sm:min-w-48 py-2 border border-green-600 text-green-600 rounded  hover:bg-green-600 hover:text-white transition-all duration-300'>Completed</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default MyAppointment
