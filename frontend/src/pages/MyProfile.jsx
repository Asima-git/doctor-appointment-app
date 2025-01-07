import React, { useState } from 'react'
import { assets } from '../assets/assets'

const MyProfile = () => {
  const [userData, setUserData] = useState({
    name: "Edward Vincent",
    image: assets.profile_pic,
    email: 'richardjameswap@gmail.com',
    phone: '+1  123 456 7890',
    address: {
      lin1: "57th Cross, Richmond",
      lin2: "Circle, Church Road, London"
    },
    gender: 'Male',
    dob: '2002-01-20'
  });
  const [isEdit, setIsEdit] = useState(false);
  return (
    <div>
      <img className='w-36 rounded' src={userData.image} alt='' />
      {
        isEdit ? <input className='bg-gray-50 text-3xl font-medium max-w-60 mt-4' type='text' value={userData.name} onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))} /> : 
        <p className='font-medium text-3xl text-neutral-800 mt-4'>{userData.name}</p>
      }
      <hr className='bg-zinc-400 h-[1px] border-none' />
      <div>
        <p className='text-neutral-500 mt-3 underline'>CONTACT INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Email Id:</p>
          <p className='text-blue-500'>{userData.email}</p>
          <p className='font-medium'>Phone:</p>
          {
            isEdit ? <input className='bg-gray-100 max-w-52' type='text' value={userData.phone} onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))} /> :
             <p className='text-blue-400'>{userData.phone}</p>
          }
          <p className='font-medium'>Address:</p>
          {
           isEdit ?
           <>
             <input className='bg-gray-100 max-w-52' type='text' value={userData.address.lin1} onChange={e => setUserData(prev => ({ ...prev, address:{ ...prev.address,lin1:e.target.value} }))} /> 
             <br/>
             <input className='bg-gray-100 max-w-52' type='text' value={userData.address.lin2} onChange={e => setUserData(prev => ({ ...prev, address:{ ...prev.address,lin2:e.target.value} }))} />
           </> 
           : <p className='text-gray-500'>
            {userData.address.lin1}
            <br/>
            {userData.address.lin2}
           </p>
          }
        </div>
      </div>
      <div>
        <p className='text-neutral-500 mt-3 underline'>BASIC INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Gender:</p>
          {
        isEdit ? <select className='bg-gray-100 max-w-52' onChange={(e)=>setUserData(prev =>({...prev,gender:e.target.value}))} value={userData.gender}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select> : <p className='text-gray-500'>{userData.gender}</p>
      }
        <p className='font-medium'>Birthday:</p>
        {
        isEdit ? <input className='bg-gray-100 max-w-52' type='date' value={userData.dob} onChange={e => setUserData(prev => ({ ...prev, dob: e.target.value }))} /> : 
        <p className='text-gray-500'>{userData.dob}</p>
      }
        </div>
      </div>
      <div className=''>
      {
        isEdit ? <button className='border border-primary px-8 py-2 rounded-full mt-4 hover:bg-primary hover:text-white transition-all' onClick={()=>setIsEdit(false)}>Edit</button> : 
        <button className='border border-primary px-8 py-2 rounded-full mt-4 hover:bg-primary hover:text-white transition-all' onClick={()=>setIsEdit(true)}>Save information</button>
      }
      </div>
    </div>
  )
}

export default MyProfile
