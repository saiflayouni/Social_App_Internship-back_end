import { Schema, model } from 'mongoose'

const choiceSchema = new Schema({
    choice: {
        type: String,
        required: true,
        trim: true,
    },
    isCorrect: {
        type: Boolean,
        default: false,
        required: false,
    },
})

const participants = new Schema({
    answeredBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    isCorrectlyAnswered: {
        type: Boolean,
        default: false,
        required: false,
    },
})

export default model(
    'Quiz',
    new Schema({
        question: {
            type: String,
            trim: true,
            required: true,
        },
        answers: {
            type: [choiceSchema],
            required: true,
        },
        type: {
            type: String,
            trim: true,
            required: true,
        },
        expBonus: {
            type: Number,
            required: true,
        },
        contestants: {
            type: [participants],
            required: false,
        },
        numberOfTries: {
            type: Number,
            default: 3,
            required: false,
        },
    })
)
