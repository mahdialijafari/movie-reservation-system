import express from 'express'
import { isAdmin } from '../Middlewares/isAdmin.js'
import { create, getAll, getOne, remove } from '../Controllers/reservationCn.js'
import { isLogin } from '../Middlewares/isLogin.js'

const reservationRouter = express.Router()

reservationRouter.route('/').get(isAdmin,getAll).post(isLogin,create)
reservationRouter.route('/:id').get(isLogin,getOne).delete(isLogin,remove) 

export default reservationRouter
