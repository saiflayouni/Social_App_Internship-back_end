import express from 'express'
import morgan from 'morgan'
import cors from 'cors'

import mainRouter from './routes/main.js'
import userRouter from './routes/user.js'
import forumRouter from './routes/forum.js'
import adminRouter from './routes/admin.js'
import loadMongoDB from './config/mongo.js'
import eventRouter from './routes/event.js'
import productRouter from './routes/product.js'
import categoryRouter from './routes/category.js'
import offrejobRouter from './routes/offrejob.js'
import articlesRouter from './routes/articles.js'
import quizRouter from './routes/quiz.js'
import fcmRouter from './routes/fcm.js'

import { PORT } from './config/default.js'

import jwtVerif from './middelwares/jwt-verif.js'
import { errorHandler, notFound } from './middelwares/error-handlers.js'
import { checkRole } from './middelwares/user-identity-config.js'

const app = express()

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.json({ limit: '50mb' }))

// app.use(limiter)

app.use('/auth', mainRouter)

app.use('/articles', articlesRouter)

app.use(
    '/img',
    express.static('public/images', {
        extensions: ['jpg', 'jpeg', 'png', 'gif', 'svg'],
    })
)

app.use('/fcm', fcmRouter)

app.use(jwtVerif)

app.use('/quiz', quizRouter)
app.use('/users', userRouter)
app.use('/category', categoryRouter)
app.use('/product', productRouter)
app.use('/offrejob', offrejobRouter)
app.use('/forum', forumRouter)
app.use('/events', eventRouter)

app.use((req, res, next) => checkRole(req, res, next, 0))

app.use('/admin', adminRouter)
app.use(notFound)
app.use(errorHandler)

loadMongoDB(() => {
    // @ts-ignore
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})
