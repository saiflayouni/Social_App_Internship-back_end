import FirebaseToken from '../models/firebaseToken.js'

export async function pushToken(req, res) {
    const { token, newToken } = req.body

    const result = await FirebaseToken.updateOne(
        {
            token,
        },
        {
            token: newToken,
        },
        { upsert: true }
    )

    return result.upsertedCount === 0 ? res.status(400) : res.send()
}
