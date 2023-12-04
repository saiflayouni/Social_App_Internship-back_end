import dayjs from 'dayjs'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import userModel from '../models/user.js'
import gencodeModel from '../models/gencode.js'
import { HASH_ROUNDS, JWT_EXPIRATION, JWT_SECRET, REFRESH_EXPIRATION, REFRESH_SECRET } from '../config/default.js'
import verifGenCode from '../services/verifGenCode.js'

export async function registerUser(req, res) {
    const { name, email, password, phone, role } = req.body
    console.log(req.body)
    const createdUser = await userModel.create({
        name: name,
        email: email,
        password: password,
        createdAd: Date.now(),
        phone: phone,
        level: 1,
        role: role,
        status: 0,
    })

    if (!createdUser) return res.status(400).json({ error: 'Could not create account.' })

    const { status, error, message } = await verifGenCode(email)
    return res.status(status).json({ message, error })
}

export async function authenticate(req, res) {
    const userInfo = await userModel.findOne({ email: req.body.email })

    if (!userInfo) return res.status(404).json({ error: 'Invalid email or password.' })

    let bCryptResult = true

    try {
        bCryptResult = bcrypt.compareSync(req.body.password, userInfo.password)

        if (!bCryptResult) return res.status(404).json({ error: 'Invalid email or password.' })
    } catch (err) {
        return res.status(403).json({ error: 'Could not authenticate.' })
    }

    res.status(200).json({
        id: userInfo._id,
        role: userInfo.role,
        token: jwt.sign(
            {
                id: userInfo._id,
                role: userInfo.role,
                status: userInfo.status,
            },
            // @ts-ignore
            JWT_SECRET,
            {
                expiresIn: JWT_EXPIRATION,
            }
        ),
        refresh: jwt.sign(
            {
                type: 'REFRESH',
            },
            // @ts-ignore
            REFRESH_SECRET,
            {
                expiresIn: REFRESH_EXPIRATION,
            }
        ),
    })
}

//verify code and email existed
export async function verifyCode(req, res) {
    const codeModel = await gencodeModel.findOne({
        code: req.body.code,
        email: req.body.email,
    })

    if (codeModel === null || dayjs().isAfter(dayjs(codeModel.expiredAt))) {
        return res.status(404).json({ error: 'Invalid code' })
    }
    return res.status(200).json({ message: 'Code Existe' })
}
export async function authenticateWithGoogle(req, res) {
   
    const googleEmail = req.body.email;
    let userInfo = await userModel.findOne({ email: googleEmail });
  
    if (!userInfo) {
      userInfo = new userModel({
        email: googleEmail,
      });
  
      await userInfo.save();
    }
  
    const token = jwt.sign(
      {
        id: userInfo._id,
        role: userInfo.role,
        status: userInfo.status,
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRATION,
      }
    );
  
    res.status(200).json({
      id: userInfo._id,
      role: userInfo.role,
      token,
    });
  }
  
export async function accountVerificationWithGencode(req, res) {
    // find the code in the database
    const code = await gencodeModel.findOne({ code: req.body.code })

    if (code === null || dayjs(Date.now()).isAfter(code.expiredAt))
        return res.status(404).json({
            error: 'Invalid code',
        })

    // expire the code
    code.expiredAt = new Date()
    await code.save()

    // activate the account with updateOne
    const updateResult = await userModel.updateOne(
        {
            email: req.body.email,
        },
        {
            status: 1,
        },
        { upsert: false }
    )

    const remResult = await gencodeModel.deleteOne({ email: req.body.email })

    if (updateResult.modifiedCount === 0 || remResult.deletedCount === 0)
        return res.status(500).json({ error: 'Could not activate the account.' })

    return res.status(200).json({ message: 'Account activated successfully' })
}

//resend code with remove the current code
export async function resendCode(req, res) {
    const remResult = await gencodeModel.deleteOne({
        email: req.body.email,
    })

    if (remResult.deletedCount === 0) return res.status(500).json({ error: 'Could not resend the code.' })

    const { status, error, message } = await verifGenCode(req.body.email)
    return res.status(status).json({ message, error })
}

export async function resetVerifCode(req, res) {
    const { status, message, error } = await verifGenCode(req.body.email)
    return res.status(status).json({ message, error })
}

export async function forgetPasswordRequest(req, res) {
    const user = await userModel.findOne({ email: req.body.email })

    if (!user) return res.status(404).json({ error: 'Account not found' })

    const { error, message, status } = await verifGenCode(req.body.email)

    return res.status(status).json({ message, error })
}

export async function unsecureChangePassword(req, res) {
    const { email, password } = req.body

    const updateResult = await userModel.updateOne(
        { email: email },
        {
            password: bcrypt.hashSync(password, HASH_ROUNDS),
        },
        { upsert: false }
    )

    if (updateResult.modifiedCount === 0) return res.status(400).json({ error: 'Could not update password.' })
    else res.status(200).json({ message: 'Password updated successfully.' })
}

export async function refreshAccessToken(req, res) {
    if (req.header('Authorization') === undefined) return res.status(401).json({ error: 'Authorization denied.' })

    if (req.body.token === undefined) return res.status(401).json({ error: 'Authorization denied.' })

    const refreshToken = req.header('Authorization').split(' ')[1]
    if (!refreshToken) return res.status(401).json({ error: 'Access denied.' })

    jwt.verify(
        refreshToken,
        // @ts-ignore
        REFRESH_SECRET,
        {
            maxAge: REFRESH_EXPIRATION,
        },
        (err, _) => {
            if (err) return res.status(401).json({ error: 'Access denied.' })

            // @ts-ignore
            const decodedAccess = jwt.decode(req.body.token, JWT_SECRET)

            if (decodedAccess) {
                if (err) return res.status(401).json({ error: 'Access denied.' })

                return res.status(200).json({
                    refresh: jwt.sign(
                        {
                            type: 'REFRESH',
                        },
                        // @ts-ignore
                        REFRESH_SECRET,
                        {
                            expiresIn: REFRESH_EXPIRATION,
                        }
                    ),
                    token: jwt.sign(
                        {
                            id: decodedAccess?.id,
                            role: decodedAccess?.role,
                            status: decodedAccess?.status,
                        },
                        // @ts-ignore
                        JWT_SECRET,
                        {
                            expiresIn: JWT_EXPIRATION,
                        }
                    ),
                })
            }
        }
    )
}
