import bcrypt from 'bcrypt'

import userModel from '../models/user.js'
import gencodeModel from '../models/gencode.js'
import {sendTemplatedEmail} from '../services/mailer.js'
import { HASH_ROUNDS } from '../config/default.js'
import { deletImage } from '../services/imageDel.js'

export async function profile(req, res) {
    const user = await userModel.findOne(
        { _id: req.params.id },
        {
            password: 0,
            __v: 0,
            createdAt: 0,
            disabledAt: 0,
            role: 0,
            status: 0,
        }
    )
    res.status(user ? 200 : 404).json(user ?? { error: 'User not found' })
}

export async function changePassword(req, res) {
    const updatedResult = await userModel.updateOne(
        { _id: req.params.id },
        {
            password: bcrypt.hashSync(req.body.password, HASH_ROUNDS),
        },
        { upsert: false }
    )

    if (updatedResult.modifiedCount === 0) return res.status(500).json({ error: 'Could not update password.' })

    res.status(200).json({ message: 'Password changed successfully' })
}

export async function changeLevel(req, res) {
    const updateResult = await userModel.updateOne(
        { _id: req.params.id },
        {
            level: req.body.level,
        },
        { upsert: false }
    )
    if (updateResult.modifiedCount === 0) return res.status(400).json({ error: 'Could not change the level !' })

    res.status(200).json({ message: 'Level changed successfully' })
}

export async function changeUserPhoto(req, res) {
    const user = await userModel.findOne({ _id: req.params.id })
    if (!user) return res.status(404).json({ error: 'Account not found !' })

    const filename = user?.photo

    if (filename) {
        await deletImage(filename, async (err) => {
            if (err) {
                console.error(err)
                return res.status(500).json({ error: 'Error updating your photo.' })
            }
        })
    }
    updatePhoto(req, res)
}

async function updatePhoto(req, res) {
    const updateResult = await userModel.updateOne(
        { _id: req.params.id },
        {
            photo: `${req.file.filename}`,
        },
        { upsert: false }
    )
    if (updateResult.modifiedCount === 0) return res.status(400).json({ error: 'Error updating your photo.' })
    res.status(200).json({ message: `${req.file.filename}` })
}

export async function deleteUser(req, res) {
    const user = await userModel.findOne({ _id: req.params.id })

    if (!user) return res.status(404).json({ error: 'Account not found !' })

    const filename = user?.photo

    if (!filename) return res.status(400).json({ error: 'No photo found !' })

    deletImage(filename, async (err) => {
        if (err) return res.status(400).json({ error: 'Error deleting the account.' })

        const remResult = await userModel.deleteOne({ _id: req.params.id })

        if (remResult.deletedCount === 0) return res.status(400).json({ error: 'Error deleting the account.' })

        res.status(200).json({ message: 'Account deleted!' })
    })
}

export async function updateUser(req, res) {
    const { name, phone } = req.body
    const updateResult = await userModel.updateOne(
        { _id: req.params.id },
        {
            name: name,
            phone: phone,
        },
        { upsert: false }
    )

    if (updateResult.modifiedCount === 0) return res.status(400).json({ error: 'Profile could not be updated.' })
    else res.status(200).json({ message: 'Profile updated successfully!' })
}

export async function requestChangePwdCode(req, res) {
    const code = Math.floor(Math.random() * 9000 + 1000)
    const { email } = req.body

    const createdCode = await gencodeModel.create({
        code: code,
        email: email,
    })

    if (!createdCode)
        return res.status(401).json({
            error: 'Error creating code.',
        })

    const { error } = await sendTemplatedEmail(email, 'Reset password', code)

    return error
        ? res.status(401).json({ error: 'Error sending email!' })
        : res.status(201).json({
              message: 'Code generated successfully, please check your email.',
          })
}

