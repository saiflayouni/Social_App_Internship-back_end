import { Router } from 'express'

import {
    getEventsOfMonthAndYear,
    getForToday,
} from '../controllers/eventController.js'

const router = Router()

router.route('/').get(getEventsOfMonthAndYear)

router.route('/today').get(getForToday)

export default router
