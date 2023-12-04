import { Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'
import { HASH_ROUNDS } from '../config/default.js'

const UserSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
    },
    password: {
        type: String,
        length: 60,
        trim: true,
        required: true,
    },
    createdAd: {
        type: Date,
        trim: true,
        required: true,
    },
    disabledAt: {
        type: Date,
        trim: true,
        required: false,
    },
    phone: {
        type: String,
        trim: true,
        required: true,
    },
    photo: {
        type: String,
        trim: true,
        default: '',
        required: false,
    },
    role: {
        type: Number,
        trim: true,
        required: true,
    },
    level: {
        type: Number,
        trim: true,
        required: true,
    },
    exp: {
        type: Number,
        trim: true,
        default: 0,
        required: false,
    },
    status: {
        type: Number,
        trim: true,
        required: false,
    },
})
// @ts-ignore
UserSchema.pre('save', function (next) {
    this.password = bcrypt.hashSync(this.password, HASH_ROUNDS)
    next()
})
export default model('User', UserSchema)
