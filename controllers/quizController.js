import QuizModel from '../models/quiz.js'
import UserModel from '../models/user.js'
import { sendPushNotification } from '../services/notifications-service.js'
import { updateUserLevel } from '../services/exp-service.js'
import { isEventRunning } from '../services/event-service.js'

export async function createQuiz(req, res) {
    const { question, answers, numberOfTries, type, expBonus } = req.body

    const createdQuiz = await QuizModel.create({
        question: question,
        answers: answers,
        type: type,
        expBonus: expBonus,
        numberOfTries: numberOfTries,
    })

    if (!createdQuiz) return res.status(500).json({ error: 'Could not create quiz' })

    const notifResult = await sendPushNotification('quiz', 'A quiz has appeared !', question, {
        quizId: `${createdQuiz._id}`,
    })

    if (typeof notifResult != 'string') {
        createdQuiz.delete()
        return res.status(400).json({ error: notifResult })
    }

    res.status(201).json({ messge: 'Quiz published.' })
}

export async function answerQuiz(req, res) {
    console.log(req.body)
    const { answererId, failOrPass } = req.body
    const { quizId } = req.params

    const quiz = await QuizModel.findOne({ _id: quizId })

    if (!quiz) return res.status(404).json({ error: 'Quiz not found !' })

    const user = await UserModel.findOne({ _id: answererId })

    if (!user) return res.status(404).json({ error: 'User not found !' })

    if (_checkIfAlreadyAnswered(quiz, answererId))
        return res.status(400).json({ message: "You've already answered this quiz !" })

    if (failOrPass) await updateUserLevel(await isEventRunning('QUIZ'), answererId, quiz.expBonus)

    const updateResult = await QuizModel.updateOne(
        { _id: quiz._id },
        {
            $push: {
                contestants: {
                    answeredBy: answererId,
                    isCorrectlyAnswered: failOrPass,
                },
            },
        },
        { upsert: false }
    )

    if (updateResult.modifiedCount == 0) return res.status(400).json({ error: 'Error answering the quiz !' })

    return res.status(200).json({ message: 'Quiz done !' })
}

export async function getQuizz(req, res) {
    const { quizId } = req.params

    const quiz = await QuizModel.findOne(
        { _id: quizId },
        {
            _id: 0,
            __v: 0,
            contestants: 0,
        }
    )

    if (!quiz) return res.status(404).json({ error: 'Quiz not found !' })

    return res.status(200).json(quiz)
}

const _checkIfAlreadyAnswered = (quiz, answererId) =>
    quiz.contestants.findIndex((u) => u.answeredBy == answererId) != -1
