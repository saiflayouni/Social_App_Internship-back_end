import { Schema, model } from 'mongoose'

export default model(
    'Comment',
    new Schema({
        content: {
            type: String,
            trim: true,
            required: true,
        },
        votes: {
            type: Number,
            default: 0,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        post: {
            type: Schema.Types.ObjectId,
            ref: 'Post',
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    })
)
