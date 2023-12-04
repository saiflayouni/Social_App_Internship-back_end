import { Schema, model } from 'mongoose'

export default model(
    'Offerjob',
    new Schema({
        jobTitle: {
            type: String,
            trim: true,
            required: true,
        },
        jobDescription: {
            type: String,
            trim: true,
            required: true,
        },
        jobAdress: {
            type: String,
            trim: true,
            required: true,
        },
        jobType: {
            type: String,
            trim: true,
            required: true,
        },
        jobPosition: {
            type: String,
            trim: true,
            required: true,
        },
        jobStartDate: {
            type: String,
            trim: true,
            required: true,
        },
        jobEndDate: {
            type: String,
            trim: true, 
            required: true,
        },
       
        jobWebsite: {
            type: String,
            trim: true,
            required: true,
        },
        jobEmail: {
            type: String,
            trim: true,
            required: true,
        },
        postedAt: {
            type: Date,
            trim: true,
            required: true,
        },
        company: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    })
)
