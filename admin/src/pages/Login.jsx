import React, { useContext, useState } from 'react'
import {assets} from '../assets/assets'
import { AdminContext } from '../context/AdminContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { DoctorContext } from '../context/DoctorContext';

const Login = () => {
 const [state,setState] = useState('Admin');
 const [email,setEmail] = useState('');
 const [password,setPassword] = useState('');
 const {setAToken,backendURL} = useContext(AdminContext)
 const {setDToken} = useContext(DoctorContext)
 const onSubmitHandler = async(e)=>{
  e.preventDefault()
  try {
     if(state === 'Admin'){
       const {data} = await axios.post(backendURL + '/api/admin/login',{email,password})
       if(data.success){
        localStorage.setItem('atoken',data?.token)
        setAToken(data?.token);
        
        toast.success(data?.message)
       }
     }else{
      const {data} = await axios.post(backendURL + '/api/doctor/login',{email,password})
      if(data.success){
       localStorage.setItem('dtoken',data?.token)
       setDToken(data?.token);
       console.log(data?.token)
       toast.success(data?.message)
      }
     }
  } catch (error) {
    toast.error(error.response?.data?.message)
  }
 }
  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-sm shadow-lg'>
        <p className='text-2xl font-semibold m-auto'><span className='text-primary'>{state}</span> Login</p>
        <div className='w-full'>
            <p>Email:</p>
            <input onChange={(e)=>setEmail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full p-2 mt-1'  type='email' required></input>
        </div>
        <div className='w-full'>
            <p>Password:</p>
            <input onChange={(e)=>setPassword(e.target.value)} value={password} className='border border-[#DADADA] rounded w-full p-2 mt-1' type='password' required></input>
        </div>
        <button className='bg-primary text-white w-full py-2 mt-1'>Login</button>
        {
            state === 'Admin' ? <p>Doctor Login ? <span className='text-primary underline cursor-pointer' onClick={()=>setState('Doctor')}> Click here</span></p> : 
            <p>Admin Login ? <span className='text-primary underline cursor-pointer ' onClick={()=>setState('Admin')}> Click here</span></p>
        }
      </div>
    </form>
  )
}

export default Login
