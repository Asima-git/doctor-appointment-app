import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';

const Appointment = () => {
  const {docId} = useParams()
  const {doctors,currencySymbol} = useContext(AppContext);
  const dayOfWeek = ['SUN','MON','TUE','WED','THU','FRI','SAT']
  const [docInfo,setDocInfo] = useState(null);
  const [docSlot,setDocSlot] = useState([]);
  const [slotIndex,setSlotIndex] = useState(0);
  const [slotTime,setSlotTime] = useState("");
  

  const fetchDoctInfo = () => {
    const docInfo = doctors.find(doc => doc._id === docId);
    setDocInfo(docInfo);
  };

  const getAvailableSlots = async () => {
    setDocSlot([]); // Clear existing slots
    let today = new Date(); // Get the current date
    
    for (let i = 0; i < 7; i++) { // Loop for the next 7 days
      // Getting the date for the current index
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
  
      // Setting end time for the day
      let endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0);
  
      // Setting hours and minutes for the start of the day
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(Math.max(currentDate.getHours() + 1, 10));
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }
  
      let timeSlots = [];
      // Generate time slots until the end of the day
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleString([], { hour: '2-digit', minute: '2-digit' });
        // Add slot
        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime,
        });
        // Increment time by 30 minutes
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
      // Update state with new slots
      setDocSlot(prev => [...prev, timeSlots]);
    }
  };
  
  useEffect(()=>{
  fetchDoctInfo()
  },[doctors,docId])

  useEffect(()=>{
    getAvailableSlots()
    },[docInfo])
  useEffect(()=>{
   console.log(docSlot)
  },[docSlot])
  return docInfo && (
    <div>
    <div className='flex flex-col gap-4 sm:flex-row'>
      {/** doctor details */}
      <div>
         <img src={docInfo.image} className='bg-primary w-full sm:max-w-72 rounded-lg'></img>
      </div>
      <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-10 '>
        {/** doctor info */}
        <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>{docInfo.name} 
          <img className='w-5' src={assets.verified_icon}/>
        </p>
        <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
          <p>{docInfo.degree} - {docInfo.speciality}</p>
          <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
        </div>
          {/** doctor about */}
          <div>
            <p className='flex items-center gap-1 text-sm text-gray-900'>About <img src={assets.info_icon}></img></p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-2'>{docInfo.about}</p>
          </div>
          <p className='text-gray-500 font-medium mt-4'>Appointment fee: <span>{currencySymbol}{docInfo.fees}</span></p>
      </div>
    </div>
    {/** Booking Slot */}
    <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>Booking slots</p>
        <div className='flex gap-3 items-center w-full mt-4'>
          {
            docSlot.length && docSlot.map((item,index)=>( 
               <div onClick={()=>setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white': 'border border-gray-200' }`} key={index}>
                <p>{item[0] && dayOfWeek[item[0].datetime.getDay()]}</p>
                <p>{item[0] && item[0].datetime.getDate()}</p>
               </div>
            ))
          }
        </div>
        <div className='flex items-center gap-3 w-full mt-4 overflow-x-scroll'>
      {
        docSlot.length && docSlot[slotIndex].map((item,index)=>(
           <p onClick={()=>setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 cursor-pointer rounded-full ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'}`} key={index}>
            {
              item.time.toLowerCase()
            }
           </p>
        ))
      }
    </div>
    <button className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full mt-5'>Book an appointment</button>
    </div>
     {/** Listing Realted Doctors */}
     <RelatedDoctors docId={docId} speciality={docInfo.speciality}/>
    </div>
  )
}

export default Appointment
