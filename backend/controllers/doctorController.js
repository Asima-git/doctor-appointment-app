import doctorModel from "../models/doctorModel.js"
import bycrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js"

const changeAvailablity = async (req, res) => {
  try {

    const { docId } = req.body
    const docData = await doctorModel.findById(docId)
    await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
    return res.json({ success: true, message: 'Availablity Changed' })
  } catch (error) {
    console.log(error)
    return res.json({ success: false, message: error.message })
  }
}

const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(['-password', '-email']);
    return res.json({ success: true, data: doctors })
  } catch (error) {
    console.log(error)
    return res.json({ success: false, message: error.message })
  }
}

//API for doctor login
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body
    const doctor = await doctorModel.findOne({ email })

    if (!doctor) {
      return res.status(400).json({ success: false, message: 'invalid creadetials' });
    }
    const isMatch = await bycrypt.compare(password, doctor.password)
    if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRTE)
      return res.status(200).json({ success: true, token: token, message: 'Logged successfully!' })
    } else {
      return res.status(400).json({ success: false, message: 'Invalid Credetails' })
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

//API to get doctor appointment for doctor panel
const appointmentDoctor = async (req, res) => {
  try {
    const { docId } = req.body
    const appointments = await appointmentModel.find({ docId })
    return res.status(200).json({ success: true, data: appointments })

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

//API TO MARK Appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
  try {
   const {docId,appointmentId} =  req.body
   const appointmentData = await appointmentModel.findById(appointmentId)

   if(appointmentData && appointmentData.docId === docId){
     await appointmentModel.findByIdAndUpdate(appointmentId,{isCompleted : true})
     return res.status(200).json({ success: true, message:'Appointment Completed'}); 
   }else{
    return res.status(400).json({ success: false, message: 'Mark Failed' });
   }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

//API TO cancle Appointment completed for doctor panel
const appointmentCancle = async (req, res) => {
  try {
   const {docId,appointmentId} =  req.body
   const appointmentData = await appointmentModel.findById(appointmentId)
   if(appointmentData && appointmentData.docId === docId){
     await appointmentModel.findByIdAndUpdate(appointmentId,{canclled : true})
     return res.status(200).json({ success: true, message:'Appointment Cancelled'}); 
   }else{
    return res.status(400).json({ success: false, message: 'Cancellation Failed' });
   }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

//API TO GET DASHBOARD DATA FOR DOCTOR PANEL

const doctorDashboard = async(req,res)=>{
    try {
      const {docId} = req.body
      const appointments =  await appointmentModel.find({docId}) 
      let earnings = 0
      appointments.map((item)=>{
        if(item.isCompleted || item.payment){
          earnings += item.amount
        }
       })
       let patients = []
       appointments.map((item)=>{
         if(!patients.includes(item.userId)){
          patients.push(item.userId)
         }
       })

       const dashData = {
        earnings,
        appointments:appointments.length,
        patients:patients.length,
        latestAppointment :appointments.reverse().slice(0,5)
       }
       return res.status(200).json({ success: true, data: dashData});

    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: error.message });
    }
}
const doctorProfile = async(req,res)=>{
 try {
  const {docId} = req.body
  const profileData = await doctorModel.findById(docId).select('-password');
  return res.status(200).json({ success: true, data: profileData});

 } catch (error) {
  console.error(error);
  return res.status(500).json({ success: false, message: error.message });
 } 
}

//API to update doctor profile data
const updateDoctorProfile = async(req,res)=>
{
 try {
  const {docId,fees,address,available} = req.body
  await doctorModel.findByIdAndUpdate(docId,{fees,address,available})
  return res.status(200).json({ success: true, message:'Profile Updated'});
 } catch (error) {
  console.error(error);
  return res.status(500).json({ success: false, message: error.message });
 }
}
export { changeAvailablity, 
        doctorList, 
        loginDoctor, 
        appointmentDoctor,
        appointmentCancle,
        appointmentComplete,
        doctorDashboard,
        updateDoctorProfile,
        doctorProfile
      }




