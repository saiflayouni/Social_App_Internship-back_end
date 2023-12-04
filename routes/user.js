import Router from 'express'

import {
    profile,
    deleteUser,
    changeUserPhoto,
    changePassword,
    updateUser,
    requestChangePwdCode,
    changeLevel,
} from '../controllers/userController.js'
import multer from '../config/multer.js'
import {
    checkIfCodeExists,
    checkUserByEmail,
    checkUserById,
} from '../middelwares/user-identity-config.js'

const router = Router()

router.route('/:id').get(profile)
router.route('/deleteuser/:id').delete(deleteUser)
router.route('/updateProfile/:id').put(checkUserById, updateUser)
router
    .route('/changePassword/:id')
    .post(checkUserById,  changePassword)
router.route('/changeImage/:id').patch(multer(), changeUserPhoto)
router.route('/requestChangePwd').post(checkUserByEmail, requestChangePwdCode)
router.route('/changeLevel/:id').patch(checkUserById, changeLevel)
export default router
