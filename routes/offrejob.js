import Router from 'express'
import {
    addOfferjob,
    getAllOffrejob,
    deleteOffrejob,
    updateOffrejob,
    getOffrejobById,
} from '../controllers/offrejobController.js'
import { checkIfOfferExists } from '../middelwares/job-offer-checker.js'
import { checkRole } from '../middelwares/user-identity-config.js'

const router = Router()

router.route('/').get(getAllOffrejob)
router.route('/saveoffrejob').post((req, res, next) => checkRole(req, res, next, 2), addOfferjob)
router.route('/deleteoffre/:id').delete(checkIfOfferExists, deleteOffrejob)
router.route('/updateoffre/:id').put(checkIfOfferExists, updateOffrejob)
router.route('/:id').get(checkIfOfferExists, getOffrejobById) // t3aeyet lel get all fi get by id :)

export default router
// sayeeeb aa khra hh
