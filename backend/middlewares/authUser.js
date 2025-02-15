import jwt from 'jsonwebtoken'

//user authentication middleware
const authUser = async (req,res,next)=>{
  try {
    const {token} = req.headers
    if(!token){
        return res.status(500).json({ success:false, message: "NOT authorized please login again" });
    }
    const token_decode = jwt.verify(token,process.env.JWT_SECRTE);
    req.body.userId = token_decode.id
    next()
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ success:false, message: "An error occurred" });
  }
}

export default authUser