import { model, Schema } from 'mongoose'

export default model(
    'Category',
    new Schema({
        name: {
            type: String,
            trim: true,
            required: true,
            unique: true,
        },
        status: {
            type: Number,
            trim: true,
            required: true,
        },
    })
)
