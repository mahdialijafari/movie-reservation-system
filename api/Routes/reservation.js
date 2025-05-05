import express from 'express'
import { isAdmin } from '../Middlewares/isAdmin.js'
import { getAll } from '../Controllers/reservationCn.js'

const reservationRouter = express.Router()

reservationRouter.route('/').get(isAdmin,getAll).post(isAdmin,create)
reservationRouter.route('/:id').get(getOne).patch(isAdmin,update).delete(isAdmin,remove) 

export default reservationRouter
