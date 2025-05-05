import express from 'express'
import { isAdmin } from '../Middlewares/isAdmin.js'
import { create, getAll, getOne, remove, update } from '../Controllers/movieCn.js'

const movieRouter = express.Router()

movieRouter.route('/').get(getAll).post(isAdmin,create)
movieRouter.route('/:id').get(getOne).patch(isAdmin,update).delete(isAdmin,remove) 

export default movieRouter
