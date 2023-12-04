import { Schema, model } from 'mongoose'

export default model(
    'Topic',
    new Schema({
        title: {
            type: String,
            trim: true,
            required: true,
        },
    })
)
