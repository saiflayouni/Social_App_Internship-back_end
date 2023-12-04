import { Router } from 'express'
import { runRssParser } from '../controllers/RSSController.js'

const router = Router()

router.route('/').get(runRssParser)

export default router
