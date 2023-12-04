import { Schema, model } from 'mongoose'

export default model(
    'Post',
    new Schema({
        title: {
            type: String,
            trim: true,
            required: true,
        },
        content: {
            type: String,
            trim: true,
            required: true,
        },
        image: {
            type: String,
            trim: true,
            required: false,
        },
        likes: {
            type: Number,
            required: false,
            default: 0,
        },
        topic: {
            type: Schema.Types.ObjectId,
            ref: 'Topic',
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    })
)
