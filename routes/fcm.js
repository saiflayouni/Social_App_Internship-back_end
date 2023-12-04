import { Router } from 'express'
import { pushToken } from '../controllers/fcm-controller.js'

const router = Router()

router.route('/push-token').post(pushToken)

export default router
