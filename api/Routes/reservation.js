import express from 'express'
import { create, getAll, getOne, remove } from '../Controllers/reservationCn.js'
import { isLogin } from '../Middlewares/isLogin.js'

const reservationRouter = express.Router()

reservationRouter.route('/').get(isLogin,getAll).post(isLogin,create)
reservationRouter.route('/:id').get(isLogin,getOne).delete(isLogin,remove) 

export default reservationRouter
