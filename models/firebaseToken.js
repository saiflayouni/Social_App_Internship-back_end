import { Schema, model } from 'mongoose'

export default model(
    'firebaseToken',
    new Schema({
        token: {
            type: String,
            trim: true,
            required: true,
        },
    })
)
