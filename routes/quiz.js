import Router from 'express'

import { answerQuiz, createQuiz, getQuizz } from '../controllers/quizController.js'
import { checkRole } from '../middelwares/user-identity-config.js'

const router = Router()

router.route('/').post((req, res, next) => checkRole(req, res, next, 0), createQuiz)

router.route('/:quizId').put(answerQuiz).get(getQuizz)

export default router
