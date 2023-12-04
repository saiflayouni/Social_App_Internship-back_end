import { Schema, model } from 'mongoose'

export default model(
    'Gencode',
    new Schema({
        code: {
            type: String,
            trim: true,
            required: true,
        },

        expiredAt: {
            type: Date,
            trim: true,
            required: true,
        },
        email: {
            type: String,
            trim: true,
            required: true,
        },
    })
)
