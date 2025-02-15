import jwt from 'jsonwebtoken'

//user authentication middleware
const authDoctor = async (req,res,next)=>{
  try {
    const {dtoken} = req.headers
    if(!dtoken){
        return res.status(500).json({ success:false, message: "NOT authorized please login again" });
    }
    const token_decode = jwt.verify(dtoken,process.env.JWT_SECRTE);
    req.body.docId = token_decode.id
    next()
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ success:false, message: "An error occurred" });
  }
}

export default authDoctor