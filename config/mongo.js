import mongoose from 'mongoose'

import { __DEV__ } from './default.js'

export default function (connectedCallBack) {
    const MONGO_URL = __DEV__
        ? `mongodb://localhost:27017/${process.env.DBNAME || 'NebulaGaming'}`
        : `${process.env.ATLAS_DB}`

    mongoose.set('debug', __DEV__)
    mongoose.set('strictQuery', false)
    mongoose.Promise = global.Promise

    mongoose
        .connect(MONGO_URL)
        .then((c) => {
            console.log(`Connected to ${c.connection.db.databaseName}`)
            connectedCallBack()
        })
        .catch((err) => console.error(err))
}
