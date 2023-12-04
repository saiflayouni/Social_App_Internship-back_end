// category routes

import { Router } from 'express'
import { getCategories, addCategory } from '../controllers/categoryController.js'

const router = Router()

router.route('/').get(getCategories)
router.route('/add').post(addCategory)

export default router
