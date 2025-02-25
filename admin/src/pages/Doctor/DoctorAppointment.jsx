import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const DoctorAppointment = () => {
  const {dToken,appointments,getAppointments,completeAppointment,cancleAppointment} = useContext(DoctorContext)
  const {calculateAge,slotDateFormate,currency} = useContext(AppContext)

  useEffect(()=>{
   if(dToken){
    getAppointments()
   }
  },[dToken])
  
  return appointments && (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>
      <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll'>
        <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_1fr_1fr_1fr] gap-1 py-3 px-6 border-b'>
          <p>#</p>
          <p>Patients</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>
        {
          appointments.reverse().map((item,index)=>(
             <div className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_1fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={index}>
              <p className='max-sm:hidden'>{index+1}</p>
              <div className='flex items-center gap-2'>
                <img className='w-8 rounded-full' src={item?.userData?.image} /><p>{item?.userData?.name}</p>
              </div>
              <div>
                <p className='text-sm inline border border-primary px-2 rounded-full'>
                  {item.payment ? 'Online' : 'CASH'}
                </p>
              </div>
                <p className='max-sm:hidden'>
                  {calculateAge(item.userData.dob)}
                </p>
                <p>
                  {slotDateFormate(item.slotDate)}, {item.slotTime}
                </p>
                <p>{currency}{item.amount}</p>
                {
                  item.canclled ? <p className='text-red-400 font-medium text-xs'>Cancelled</p> : item.isCompleted ? 
                  <p className='text-green-500 font-medium text-xs'>Completed</p> : 
                  <div className='flex items-center'>
                  <img onClick={()=>cancleAppointment(item._id)} src={assets.cancel_icon} alt="" className='w-10 cursor-pointer'/>
                  <img onClick={()=>completeAppointment(item._id)} src={assets.tick_icon} alt="" className='w-10 cursor-pointer'/>
                </div>
                }
             </div>
          ))
        }
      </div>
    </div>
  )
}
//14.02.45
export default DoctorAppointment
