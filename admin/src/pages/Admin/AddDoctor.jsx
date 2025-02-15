import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import {toast} from 'react-toastify'
import axios from 'axios'

const AddDoctor = () => {
  const [docImg,setDocImg] = useState(false)
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [experience,setExperience] = useState('1 Year')
  const [fees,setFees] = useState('')
  const [about,setAbout] = useState('')
  const [degree,setDegree] = useState('')
  const [speciality,setSpeciality] = useState('General physician')
  const [address1,setAddress1] = useState('')
  const [address2,setAddress2] = useState('')

  const {backendURL,aToken} = useContext(AdminContext)

  const onSubmitHandler = async(e)=>{
     e.preventDefault()
     try {
      if(!docImg){
        return toast.error('Image Not Selected');
      }
      const formData = new FormData()
      formData.append('image',docImg)
      formData.append('name',name)
      formData.append('email',email)
      formData.append('password',password)
      formData.append('experience',experience)
      formData.append('fees',Number(fees))
      formData.append('about',about)
      formData.append('speciality',speciality)
      formData.append('degree',degree)
      formData.append('address',JSON.stringify({line1:address1,line2:address2}))
      //console log formdata
      formData.forEach((value,key)=>{
        console.log(`${key} : ${value}`)
      })
      const {data} = await axios.post(backendURL + '/api/admin/add-doctor',formData,{
         headers:{aToken}
      })
      if(data.success){
        toast.success(data.message)
        setDocImg(false)
        setName('')
        setEmail('')
        setPassword('')
        setExperience('')
        setFees('')
        setAbout('')
        setDegree('')
        setAddress1('')
        setAddress2('')
      }else{
        toast.error(data.message)
      }
     } catch (error) {
       toast.error(error.response?.data?.message?.errorResponse?.errmsg)
     }
  }

  return (
    <form onSubmit={onSubmitHandler}  className="m-5 w-full">
  <p className="mb-3 text-lg font-medium">Add Doctor</p>
  <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh]">
    <div className="flex items-center gap-4 mb-8 text-gray-500">
      <label htmlFor="doc-img">
        <img
          className="w-16 bg-gray-100 rounded-full cursor-pointer"
          src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
          alt=""
        />
      </label>
      <input onChange={(e)=>setDocImg(e.target.files[0])} type="file" id="doc-img"  hidden />
      <p>
        Upload doctor <br />
        picture
      </p>
    </div>
    <div className="flex flex-col md:flex-row items-start gap-10 text-gray-600">
      <div className="flex-1">
        <div>
          <p>Doctor name</p>
          <input onChange={(e)=>setName(e.target.value)} value={name}
            type="text"
            className="border rounded px-4 py-2 w-full"
            placeholder="Name"
            required
          />
        </div>
        <div>
          <p>Doctor Email</p>
          <input onChange={(e)=>setEmail(e.target.value)} value={email}
            type="email"
            className="border rounded px-4 py-2 w-full"
            placeholder="Email"
            required
          />
        </div>
        <div>
          <p>Doctor Password</p>
          <input onChange={(e)=>setPassword(e.target.value)} value={password}
            type="password"
            className="border rounded px-4 py-2 w-full"
            placeholder="Password"
            required
          />
        </div>
        <div>
          <p>Experience</p>
          <select onChange={(e)=>setExperience(e.target.value)} value={experience} className="border rounded px-4 py-2 w-full">
            <option value="1 Year">1 Year</option>
            <option value="2 Year">2 Year</option>
            <option value="3 Year">3 Year</option>
            <option value="4 Year">4 Year</option>
            <option value="5 Year">5 Year</option>
            <option value="6 Year">6 Year</option>
            <option value="7 Year">7 Year</option>
            <option value="8 Year">8 Year</option>
            <option value="9 Year">9 Year</option>
            <option value="10 Year">10 Year</option>
          </select>
        </div>
        <div>
          <p>Fees</p>
          <input onChange={(e)=>setFees(e.target.value)} value={fees}
            type="number"
            className="border rounded px-4 py-2 w-full"
            placeholder="Fees"
            required
          />
        </div>
      </div>
      <div className="flex-1">
        <div>
          <p>Speciality</p>
          <select onChange={(e)=>setSpeciality(e.target.value)} value={speciality} className="border rounded px-4 py-2 w-full">
            <option value="General physician">General physician</option>
            <option value="Gynecologist">Gynecologist</option>
            <option value="Dermatologist">Dermatologist</option>
            <option value="Pediatricians">Pediatricians</option>
            <option value="Neurologist">Neurologist</option>
            <option value="Gastroenterologist">Gastroenterologistar</option>
          </select>
        </div>
        <div>
          <p>Education</p>
          <input onChange={(e)=>setDegree(e.target.value)} value={degree}
            type="text"
            className="border rounded px-4 py-2 w-full"
            placeholder="Education"
            required
          />
        </div>
        <div>
          <p>Address</p>
          <input onChange={(e)=>setAddress1(e.target.value)} value={address1}
            type="text"
            className="border rounded px-4 py-2 w-full"
            placeholder="Address 1"
            required
          />
          <input
            type="text" onChange={(e)=>setAddress2(e.target.value)} value={address2}
            className="border rounded px-4 py-2 w-full mt-2"
            placeholder="Address 2"
            required
          />
        </div>
       
      </div>
    </div>
    <div className="mt-6">
    <div>
          <p>About Doctor</p>
          <textarea onChange={(e)=>setAbout(e.target.value)} value={about}
            className="border rounded px-4 py-2 w-full"
            placeholder="Write about doctor"
            rows={5}
          ></textarea>
        </div>
      <button type='submit' className="bg-primary text-white px-10 py-3 rounded-full">
        Add Doctor
      </button>
    </div>
  </div>
</form>

  )
}

export default AddDoctor
