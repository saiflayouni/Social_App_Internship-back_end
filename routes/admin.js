import Router from 'express'
import {
    listMembers,
    listCompanies,
    disableAccount,
    enableAccount,
    getCountAllUsers,
    getCountAllMembers,
    getCountAllCompanies,
    getCountAllDisabledUsers,
    getCountAllEnabledUsers,
    getCountAllDisabledMembers,
    getCountAllEnabledMembers,
    getCountAllDisabledCompanies,
    getCountAllEnabledCompanies,
    //--------------------------------//
    getAllUsersBystartDateAndFinishDate,
    getCountUsersBystartDateAndFinishDate,
    getCountAllEnabledUsersBystartDateAndFinishDate,
    getCountAllDisabledUsersBystartDateAndFinishDate,
    getAllMethod,
    getAllMethodProducts,
    getCountAllEnableDiscableCount,
    getAllUsers,
    changeRoleUser,
} from '../controllers/adminController.js'
import { checkIfEventAlreadyExists, checkIfEventsOverlap } from '../middelwares/event-checker.js'

import { checkIfCategoryExists } from '../middelwares/category-checker.js'
import { checkUserById } from '../middelwares/user-identity-config.js'
import {
    addCategory,
    getCategory,
    updateCategory,
    hideCategory,
    deleteCategory,
} from '../controllers/categoryController.js'
import { publishEvent } from '../controllers/eventController.js'

const router = Router()

router.route('/allUsers').get(getAllUsers)
router.route('/members').get(listMembers)
router.route('/companies').get(listCompanies)
router.route('/enable/:id').patch(enableAccount)
router.route('/disable/:id').patch(disableAccount)
router.route('/countAlluser').get(getCountAllUsers)
router.route('/countAllMembers').get(getCountAllMembers)
router.route('/countAllCompanies').get(getCountAllCompanies)
router.route('/countAllDisabledUsers').get(getCountAllDisabledUsers)
router.route('/countAllEnabledUsers').get(getCountAllEnabledUsers)
router.route('/countAllDisabledMembers').get(getCountAllDisabledMembers)
router.route('/countAllEnabledMembers').get(getCountAllEnabledMembers)
router.route('/countAllDisabledCompanies').get(getCountAllDisabledCompanies)
router.route('/countAllEnabledCompanies').get(getCountAllEnabledCompanies)
router.route('/changeRoleUser/:id').patch(changeRoleUser)
//--------------------------------//
router.route('/getAllUsersBystartDateAndFinishDate').get(getAllUsersBystartDateAndFinishDate)
router.route('/getCountUsersBystartDateAndFinishDate').get(getCountUsersBystartDateAndFinishDate)
router.route('/getCountAllEnabledUsersBystartDateAndFinishDate').get(getCountAllEnabledUsersBystartDateAndFinishDate)
router.route('/getCountAllDisabledUsersBystartDateAndFinishDate').get(getCountAllDisabledUsersBystartDateAndFinishDate)
router.route('/enable/:id').patch(checkUserById, enableAccount)
router.route('/disable/:id').patch(checkUserById, disableAccount)
router.route('/publishEvents').post(checkIfEventAlreadyExists, checkIfEventsOverlap, publishEvent)

router.route('/category').post(addCategory)
router
    .route('/category/:id')
    .get(getCategory)
    .put(checkIfCategoryExists, updateCategory)
    .patch(checkIfCategoryExists, hideCategory)
    .delete(checkIfCategoryExists, deleteCategory)

router.route('/enable/:id').patch(enableAccount)
router.route('/disable/:id').patch(disableAccount)
router.route('/countAlluser').get(getCountAllUsers)
router.route('/countAllMembers').get(getCountAllMembers)
router.route('/countAllCompanies').get(getCountAllCompanies)
router.route('/countAllDisabledUsers').get(getCountAllDisabledUsers)
router.route('/countAllEnabledUsers').get(getCountAllEnabledUsers)
router.route('/countAllDisabledMembers').get(getCountAllDisabledMembers)
router.route('/countAllEnabledMembers').get(getCountAllEnabledMembers)
router.route('/countAllDisabledCompanies').get(getCountAllDisabledCompanies)
router.route('/countAllEnabledCompanies').get(getCountAllEnabledCompanies)
router.route('/changeRoleUser/:id').patch(changeRoleUser)
//--------------------------------//
router.route('/getAllUsersBystartDateAndFinishDate').get(getAllUsersBystartDateAndFinishDate)
router.route('/getCountUsersBystartDateAndFinishDate').get(getCountUsersBystartDateAndFinishDate)
router.route('/getCountAllEnabledUsersBystartDateAndFinishDate').get(getCountAllEnabledUsersBystartDateAndFinishDate)
router.route('/getCountAllDisabledUsersBystartDateAndFinishDate').get(getCountAllDisabledUsersBystartDateAndFinishDate)

router.route('/getAllMethod').get(getAllMethod)
router.route('/getCountAllEnableDiscableCount').get(getCountAllEnableDiscableCount)

router.route('/statProduct').get(getAllMethodProducts)
export default router
