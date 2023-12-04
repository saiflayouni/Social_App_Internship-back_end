import eventModel from '../models/event.js'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween.js'

dayjs.extend(isBetween)

export async function checkIfEventAlreadyExists(req, res, next) {
    if (
        (await eventModel.findOne({
            $or: [
                { title: req.body.title },
                { startDateTime: req.body.startDateTime },
                { endDateTime: req.body.endDateTime },
            ],
        })) !== null
    )
        return res.status(400).json({ error: 'Event already exists.' })

    next()
}

export async function checkIfEventsOverlap(req, res, next) {
    const events = await eventModel.find()

    const eventsBetween = events.filter((event) => {
        return (
            dayjs(event.startDateTime).isBetween(dayjs(req.body.startDateTime), dayjs(req.body.endDateTime)) ||
            dayjs(event.endDateTime).isBetween(dayjs(req.body.startDateTime), dayjs(req.body.endDateTime))
        )
    })

    if (eventsBetween.length > 0) return res.status(400).json({ error: 'Events cannot overlap each other...' })

    next()
}
