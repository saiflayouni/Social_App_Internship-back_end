import jwt from 'jsonwebtoken'

import { JWT_EXPIRATION, JWT_SECRET } from '../config/default.js'

export default function (req, res, next) {
    if (req.header('Authorization') === undefined) return res.status(401).json({ error: 'Authorization denied.' })

    const token = req.header('Authorization').split(' ')[1]
    if (!token) return res.status(401).json({ error: 'Access denied.' })

    jwt.verify(
        token,
        // @ts-ignore
        JWT_SECRET,
        {
            maxAge: JWT_EXPIRATION,
        },
        (err, decoded) => {
            if (err) return res.status(401).json({ error: 'Access denied.' })
            req.id = decoded
            next()
        }
    )
}
