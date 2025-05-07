import express from  'express'
import { adminLogin, auth, checkOtp, forgetPassword, resendCode } from '../Controllers/authCn.js'
const authRouter=express.Router()
authRouter.route('/').post(auth)
authRouter.route('/otp').post(checkOtp)
authRouter.route('/admin').post(adminLogin)
authRouter.route('/forget').post(forgetPassword)
authRouter.route('/resend').post(resendCode)

export default authRouter