import express from 'express'
import { isAdmin } from '../Middlewares/isAdmin.js'
import { create, getAll, getMovieShowtimesByDate, getOne, remove, update } from '../Controllers/movieCn.js'

const movieRouter = express.Router()

movieRouter.route('/').get(getAll).post(isAdmin,create)
movieRouter.route('/showtimes-by-date').get(getMovieShowtimesByDate)
movieRouter.route('/:id').get(getOne).patch(isAdmin,update).delete(isAdmin,remove) 

export default movieRouter
