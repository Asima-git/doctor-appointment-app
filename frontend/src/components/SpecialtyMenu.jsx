import React from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'

const SpecialtyMenu = () => {
  return (
    <div id='speacility' className='flex flex-col items-center mt-12'>
      <h1 className='text-3xl font-medium text-[#1F2937]'>Find by Speciality </h1>
      <p className='w-1/3 text-center text-sm py-5'>Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.</p>
      <div className='flex sm:justify-center gap-4 pt-5 w-full overflow-x-scroll md:overflow-hidden'>
         {
            specialityData.map((items,index)=>(
                 <Link onClick={()=>scrollTo(0,0)} className='flex flex-col cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500' key={index} to={`/doctors/${items.speciality}`}>
                   <img className='w-16 sm:w-24 mb-2' src={items.image}/>
                   <p>{items.speciality}</p>
                </Link>
            ))
         }
      </div>
    </div>
  )
}

export default SpecialtyMenu
