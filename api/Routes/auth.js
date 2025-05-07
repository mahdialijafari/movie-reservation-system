import express from  'express'
import { auth, checkOtp, forgetPassword, resendCode } from '../Controllers/authCn.js'
const authRouter=express.Router()
authRouter.route('/').post(auth)
authRouter.route('/otp').post(checkOtp)
authRouter.route('/forget').post(forgetPassword)
authRouter.route('/resend').post(resendCode)

export default authRouter