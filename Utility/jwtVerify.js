const jwt = require("jsonwebtoken")
const userModel = require("../Models/authModels")
const decodeJwt=async (token)=>{
  
           
        const decode= await jwt.verify(token,process.env.jwt_secret)
        const user= await userModel.findById(decode?.id).select('-password')
        return user
}
module.exports=decodeJwt