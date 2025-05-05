import express from 'express'
import { isAdmin } from '../Middlewares/isAdmin.js'
import { isLogin } from '../Middlewares/isLogin.js'
import { checkAvailability, createSeats, getSeatsForShowtime } from '../Controllers/seatCn.js'

const seatRouter = express.Router()

seatRouter.route('/showtimeId').get(isLogin,getSeatsForShowtime)
seatRouter.route('/availability').post(isLogin,checkAvailability)
seatRouter.route('/:id').post(isAdmin,createSeats)

export default seatRouter
