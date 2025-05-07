import express from 'express'
import { create, getAll, getOne, remove } from '../Controllers/reservationCn.js'

const reservationRouter = express.Router()

reservationRouter.route('/').get(getAll).post(create)
reservationRouter.route('/:id').get(getOne).delete(remove) 

export default reservationRouter
