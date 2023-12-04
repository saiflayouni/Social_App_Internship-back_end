import dayjs from 'dayjs'

import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/default.js'
import userModel from '../models/user.js'
import gencodeModel from '../models/gencode.js'

export async function checkIfUserAlreadyExists(req, res, next) {
    const user = await userModel.findOne({ email: req.body.email })

    if (user) return res.status(400).json({ error: 'User already exists.' })

    next()
}

export async function checkUserById(req, res, next) {
    const user = await userModel.findOne({ _id: req.params.id })

    if (!user) return res.status(404).json({ error: 'User not found' })

    next()
}

export async function checkUserByEmail(req, res, next) {
    const user = await userModel.findOne({ email: req.body.email })

    if (!user) return res.status(404).json({ error: 'User not found' })

    next()
}

export async function checkIfCodeExists(req, res, next) {
    const { code } = req.body

    const codeModel = await gencodeModel.findOne({ code: code })

    if (codeModel === null || dayjs().isAfter(dayjs(codeModel.expiredAt)))
        return res.status(404).json({ error: 'Invalid code' })

    await gencodeModel.deleteOne({ code: code })

    next()
}

export async function checkRole(req, res, next, role) {
    const token = req.header('Authorization').replace('Bearer ', '')

    // @ts-ignore
    const decodedAccess = jwt.decode(token, JWT_SECRET)

    if (!(decodedAccess || decodedAccess?.role === role)) return res.status(401).json({ error: 'Access denied.' })

    next()
}
