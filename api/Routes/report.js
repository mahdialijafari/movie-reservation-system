import express from 'express'
import { getDailyReport, getReservationStats, getSummary } from '../Controllers/reportCn.js'

const reportRouter = express.Router()

reportRouter.route('/summary').get(getSummary)
reportRouter.route('/reservation-stats').get(getReservationStats)
reportRouter.route('/daily').get(getDailyReport)

export default reportRouter
