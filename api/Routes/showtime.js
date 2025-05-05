import express from 'express'
import { isAdmin } from '../Middlewares/isAdmin.js'
import { create, getAll, getByMovieGrouped, getOne, remove, update } from '../Controllers/showtimeCn.js'

const showTimeRouter = express.Router()

showTimeRouter.route('/').get(getAll).post(isAdmin,create)
showTimeRouter.route('/by-movie-group/:movieId').get(getByMovieGrouped)
showTimeRouter.route('/:id').get(getOne).patch(isAdmin,update).delete(isAdmin,remove) 

export default showTimeRouter
