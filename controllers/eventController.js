'use strict'

import eventModel from '../models/event.js'
import cron from 'node-cron'
import { checkIfDayIsBetween, checkIfTowDaysAreTheSame, getMonth, getYear } from '../services/dayjs-service.js'
import dayjs from 'dayjs'

export async function publishEvent(req, res) {
    if (!(await eventModel.create(req.body))) return res.status(400).json({ error: 'Event not created.' })

    res.status(201).json({ message: 'Event published' })
}

export async function getEventsOfMonthAndYear(req, res) {
    const month = Number.parseInt(req.query.month) || new Date().getMonth() + 1
    const year = Number.parseInt(req.query.year) || new Date().getFullYear()

    const events = await eventModel.find()

    const eventsOfMonth = events.filter((event) => {
        return (
            (getMonth(event.startDateTime) === month || getMonth(event.endDateTime) === month) &&
            (getYear(event.startDateTime) === year || getYear(event.endDateTime) === year)
        )
    })

    if (!eventsOfMonth) return res.status(404).json({ error: 'No events found.' })

    res.status(200).json(eventsOfMonth)
}

export async function getForToday(req, res) {
    const dateToCheck = req.query.day ? new Date(req.query.day) : new Date()

    const events = await eventModel.find({}, { __v: 0 })

    const eventsForToday = events.filter((event) =>
        checkIfDayIsBetween(dateToCheck, event.startDateTime, event.endDateTime)
    )

    res.status(200).json(eventsForToday)
}

const task = cron.schedule('0 30 11 * * *', async function expireEvents() {
    const events = await eventModel.find()

    events.forEach(async (event) => {
        if (checkIfTowDaysAreTheSame(null, event.endDateTime)) await eventModel.findByIdAndDelete(event._id)
    })
})

task.start()
