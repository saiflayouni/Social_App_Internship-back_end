import { model, Schema } from 'mongoose'

export default model(
    'Product',
    new Schema({
        name: {
            type: String,
            trim: true,
            required: true,
        },
        image: {
            type: String,
            trim: true,
            required: false,
        },
        description: {
            type: String,
            trim: true,
            required: true,
        },
        status: {
            type: Number,
            trim: true,
            required: true,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        price: {
            type: Number,
            trim: true,
            required: true,
        },
        quantity: {
            type: Number,
            trim: true,
            required: true,
        },
        publisher: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    })
)
