import gencodeModel from '../models/gencode.js'
import { sendTemplatedEmail } from './mailer.js'

import dayjs from 'dayjs'

/**
 * @param {String} email
 */
export default async function (email) {
    const code = Math.floor(Math.random() * 9000 + 1000)

    const codeModel = await gencodeModel.updateOne(
        { email: email },
        {
            code: code,
            expiredAt: dayjs(Date.now()).add(15, 'minute').add(1, 'hour'),
            email: email,
        },
        { upsert: true }
    )

    if (!codeModel)
        return {
            status: 500,
            error: 'Error creating code.',
        }

    // const emailResp = sendEmailFromEmailJS(email, 'Verification', `Your code is: ${code}\nIt will expire in 15 minutes.`)
    const { error } = await sendTemplatedEmail(email, 'Verification', code)

    return error
        ? {
              status: 500,
              error,
          }
        : {
              status: 200,
              message: 'Code generated successfully, please check your email.',
          }
}
