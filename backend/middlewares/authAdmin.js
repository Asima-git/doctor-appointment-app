import jwt from 'jsonwebtoken'

//admin authentication middleware
const authAdmin = async (req,res,next)=>{
  try {
    
    const {atoken} = req.headers
    if(!atoken){
        return res.status(500).json({ success:false, message: "NOT authorized please login again" });
    }
    const token_decode = jwt.verify(atoken,process.env.JWT_SECRTE);
    if(token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD){
        return res.status(500).json({ success:false, message: "NOT authorized please login again" });
    }
    next()
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ success:false, message: "An error occurred" });
  }
}

export default authAdmin