import admin from 'firebase-admin'
import { readFile } from 'fs/promises'

// import serviceAccount from '../fb-key.json' assert { type: 'json' }

let serviceAccount = ''

try {
    const json = await readFile(new URL('../fb-key.json', import.meta.url), { encoding: 'utf-8' })
    serviceAccount = JSON.parse(json)
    admin.initializeApp({
        // @ts-ignore
        credential: admin.credential.cert(serviceAccount),
    })
} catch (err) {
    console.error(err)
}

/**
 * @param {String} topic
 * @param {String} title
 * @param {String} body
 * @param {Object} data
 */
export const sendPushNotification = async (topic, title, body, data) => {
    try {
        return await admin.messaging().send({
            notification: {
                title,
                body,
            },
            data,
            topic: topic.toString(),
        })
    } catch (err) {
        return err
    }
}
