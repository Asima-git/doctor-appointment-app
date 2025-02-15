import validator from 'validator'
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from "../models/doctorModel.js"
import jwt from 'jsonwebtoken'
import appoinmentModel from '../models/appointmentModel.js'
import userModel from '../models/userModel.js'

///API For adding doctor

const addDoctor = async (req, res) => {
    try {
      const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
      const imageFile = req.file;
      if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address){
        return res.status(400).json({success:false,message:"please enter all field"});
      }
      //validating email format
      if(!validator.isEmail(email)){
        return res.status(400).json({success:false,message:"please enter a valid email"});
      }
      // validating strong password
      if(password.length < 8){
        return res.status(400).json({success:false,message:"please enter a strong password"});
      }

      //hashing doctor password
      const salt = await bcrypt.genSalt(10)
      const hashPassword = await bcrypt.hash(password,salt);

      //upload image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"} )
      const imageUrl = imageUpload.secure_url

      const doctorData = {
        name,
        email,
        image:imageUrl,
        password:hashPassword,
        speciality,
        degree,
        experience,
        about,
        fees,
        address:JSON.parse(address),
        date:Date.now()
      }
     
      const newDoctor = new doctorModel(doctorData)
      await newDoctor.save()

      return res.status(200).json({ success:true,message: "Doctor Added successfully" });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ success:false, message: error });
    }
  };
  
//API For admin login

const loginAdmin =  async(req,res)=>{
  try {
    const {email,password} = req.body   
    
    if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {

      const token = jwt.sign(email+password,process.env.JWT_SECRTE)
      return res.status(200).json({ success:true,token:token,message: "Logged successfully" });

    }else{
      return res.status(500).json({ success:false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ success:false, message: "An error occurred" });
  }
}

//end point get all doctors list for admin panel
const allDoctors =async(req,res)=>{
  try {
     const doctors = await doctorModel.find({}).select('-password')
     return res.status(200).json({ success:true,data:doctors});
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ success:false, message: "An error occurred" });
  }
}

//API to get all appointment list
const appointmentsAdmin = async(req,res)=>{
  try {
    const appointments = await appoinmentModel.find({})
    return res.status(200).json({ success:true, data:appointments});

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ success:false, message: "An error occurred" });
  }
}

//Api to cancle appointment

const appointmentCancle = async(req,res)=>{
  try {
    const {appointmentId} = req.body
    const appoitmentData = await appoinmentModel.findById(appointmentId)

  
  
    await appoinmentModel.findByIdAndUpdate(appointmentId,{canclled:true})

    //relaseing doctor slot 
    const {docId,slotDate,slotTime} = appoitmentData
    const doctorData = await doctorModel.findById(docId)
    let slots_booked = doctorData.slots_books
    slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

    await doctorModel.findByIdAndUpdate(docId,{slots_books:slots_booked})
    return res.status(200).json({ success: true, message: 'Appointment canclled' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

//API to get dashboard data
const adminDashboard = async(req,res)=>{
  try {
    const doctors = await doctorModel.find({})
    const users = await userModel.find({})
    const appointments =  await appoinmentModel.find({})

    const dashData = {
      doctors:doctors.length,
      appointments:appointments.length,
      paitents:users.length,
      latestAppointments:appointments.reverse().slice(0,5)
    }
    return res.status(200).json({ success: true, data: {dashData:dashData}});

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

export {addDoctor,loginAdmin,allDoctors,appointmentsAdmin,appointmentCancle,adminDashboard}
