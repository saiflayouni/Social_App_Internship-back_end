import EventModel from '../models/event.js'
import { checkIfDayIsBetween } from './dayjs-service.js'

/**
 * @param {String} topic
 */
export const isEventRunning = async (topic) => {
    const event = await EventModel.findOne({ topic })

    if (!event) return [false, 0]

    return [checkIfDayIsBetween(new Date(), event.startDateTime, event.endDateTime), event.bonus]
}
