import { Schema, model } from 'mongoose'

export default model(
    'Event',
    new Schema({
        title: {
            type: String,
            unique: true,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        startDateTime: {
            type: Date,
            unique: true,
            required: true,
        },
        endDateTime: {
            type: Date,
            unique: true,
            required: true,
        },
        topic: {
            type: String,
            required: true,
        },
        bonus: {
            type: Number,
            required: true,
        },
    })
)
