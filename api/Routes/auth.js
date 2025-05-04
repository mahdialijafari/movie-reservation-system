import express from 'express'
import { isAdmin } from '../Middlewares/isAdmin.js'
import { getAll, getOne, update } from '../Controllers/userCn.js'

const userRouter = express.Router()

userRouter.route('/').get(isAdmin, getAll)  // Admin-only
userRouter.route('/:id').get(getOne).patch(update) // Users can see/update themselves or admins

export default userRouter
