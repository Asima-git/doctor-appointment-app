import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const DoctorsList = () => {
  const {doctors,getAllDoctors,aToken,changeAvailablity} = useContext(AdminContext)

  console.log(doctors)
  useEffect(()=>{
   
    if(aToken){
        getAllDoctors();
    }
  },[aToken])
  return (
    <div className='m-5 max-h-[90vh]'>
      <h1 className='text-lg font-medium'>All Doctors</h1>
      <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
  {
    doctors.map((item, index) => (
      <div 
        // onClick={() => navigate(`/appointment/${item._id}`)} 
        key={item._id} 
        className="w-[calc(20%-16px)] border border-blue-100 rounded-xl overflow-hidden cursor-pointer"
      >
        <img src={item.image} className="bg-indigo-50 hover:bg-primary transition-all duration-500" />
        <div className="p-4">
          <p className="text-neutral-800 text-lg font-medium">{item.name}</p>
          <p className="text-neutral-800 text-sm">{item.speciality}</p>
          <div className="flex items-center gap-2 text-sm text-center text-green-500">
            <input onChange={()=>changeAvailablity(item._id)} type="checkbox" checked={item.available} /><p>Available</p>
          </div>
        </div>
      </div>
    ))
  }
</div>
    </div>
  )
}

export default DoctorsList
