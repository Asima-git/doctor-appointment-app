import validator from 'validator'
import bycrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import Razorpay from 'razorpay'
//API Regsiter user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(404).json({ success: false, message: 'missing deatils' })
    }

    // validation email format
    if (!validator.isEmail(email)) {
      return res.status(500).json({ success: false, message: 'please enter vaild email' })
    }

    // validation for strong password
    if (password.length < 8) {
      return res.status(500).json({ success: false, message: 'please enter strong password' })
    }

    //hashing user password
    const salt = await bycrypt.genSalt(10)
    const hashPassword = await bycrypt.hash(password, salt)
    const userData = {
      name,
      email,
      password: hashPassword
    }

    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRTE)

    return res.status(200).json({ success: true, token: token, message: 'User register successfully!' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: error.message })
  }
}

//API for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await userModel.findOne({ email })

    if (!user) {
      return res.status(404).json({ success: false, message: 'user does not exist' })
    }

    const isMatch = await bycrypt.compare(password, user.password)
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRTE)
      return res.status(200).json({ success: true, token: token, message: 'Logged successfully!' })
    } else {
      return res.status(400).json({ success: false, message: 'Invalid Credetails' })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: error.message })
  }
}

//API get user profile
const getProfile = async (req, res) => {
  try {
    const { userId } = req.body
    const userData = await userModel.findById(userId).select('-password')
    return res.status(200).json({ success: true, data: userData })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: error.message })
  }
}

//API update user profile
const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body
    const imageFile = req.file
    if (!name || !phone || !dob || !gender) {
      return res.status(400).json({ success: false, message: 'Data missing' })
    }

    await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })
    if(imageFile){
      //uplaod image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
      const imageURL = imageUpload.secure_url
      await userModel.findByIdAndUpdate(userId,{image:imageURL})
    }
    return res.status(200).json({ success: true, message:'User Updated'})

  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: error.message })
  }
}

//API BOOK Appointment
const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;

    const docData = await doctorModel.findById(docId).select('-password');
    if (!docData.available) {
      return res.status(400).json({ success: false, message: "Doctor not available" });
    }

    // Ensure slots_books exists
    let slot_booked = { ...docData.slots_books } || {}; 

    // Checking for slot availability
    if (!slot_booked[slotDate]) {
      slot_booked[slotDate] = [];  // Initialize empty array if not present
    }

    if (slot_booked[slotDate].includes(slotTime)) {
      return res.status(400).json({ success: false, message: "Slot not available" });
    }

    slot_booked[slotDate].push(slotTime);

    // Fetch user details
    const userData = await userModel.findById(userId).select('-password');

    // Remove slot_booked from response (to avoid exposing it)
    delete docData.slots_books;

    // Create appointment data
    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now()
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // Save updated slots data in doctorModel
    await doctorModel.findByIdAndUpdate(docId, { slots_books: slot_booked });

    return res.status(200).json({ success: true, message: 'Appointment booked' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

//API TO GET user appointment for frontend my appointment
const listAppointment = async(req,res) =>{
  try {
    const {userId} = req.body
    const appointments = await appointmentModel.find({userId})
    return res.status(200).json({ success: true, data: appointments});

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

//Api to cancle appointment

const cancleAppointment = async(req,res)=>{
  try {
    const {userId,appointmentId} = req.body
    const appoitmentData = await appointmentModel.findById(appointmentId)

    //verify appointment user
    if(appoitmentData.userId != userId){
      return res.status(400).json({ success: false, message: 'Unauthorized action' });
    }
    await appointmentModel.findByIdAndUpdate(appointmentId,{canclled:true})

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

// const razorpayInstance = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

//api for payment using razorpay
// const paymentRazorpay = async(req,res)=>{
//   try {
//     const {appointmentId} = req.body
//     const appointmentData = await appointmentModel.findById(appointmentId)
//     if(!appointmentData || appointmentData.canclled ){
//       return res.status(400).json({ success: false, message: 'Appointment canclled or not found'});
//     }
  
//     //creating options for razorpay payment
//     const options = {
//       amount : appointmentData.amount * 100,
//       currency : process.env.CURRENCY,
//       receipt : appointmentId,
//     }
  
//     //creation of an order
//     const order = await razorpayInstance.orders.create(options)
//     return res.status(200).json({ success: true,order});
    
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// }

//Api to verify payemt of razor pay
const verifyRazorpay = async(req,res)=>{
  try {
     const {razorpay_order_id} = req.body
     const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
     if(orderInfo.status === 'paid' ){
       await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment:true})
       return res.status(200).json({ success: true, message:'Payment Successfull'});
     }else{
      return res.status(500).json({ success: false, message:'Payment failed'});
     }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
export { registerUser, loginUser, getProfile,updateProfile,bookAppointment,listAppointment,
  cancleAppointment
}
