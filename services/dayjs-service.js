import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween.js'

dayjs.extend(isBetween)

/**
 * @param {Date | any} day day supplied
 * @param {Date | undefined} startDate begin interval
 * @param {Date | undefined} endDate end interval
 */
export const checkIfDayIsBetween = (day, startDate, endDate) => dayjs(day).isBetween(dayjs(startDate), dayjs(endDate))

/**
 * @param {Date?} day1
 * @param {Date?} day2
 */
export const checkIfTowDaysAreTheSame = (day1, day2) => dayjs(day1).isSame(dayjs(day2))

/**
 * @param {Date} date
 */
export const getMonth = (date) => dayjs(date).month() + 1

/**
 * @param {Date} date
 */
export const getYear = (date) => dayjs(date).year()

/**
 * @param {Date} date
 * @param {String} x
 * @param {Number} quantity
 */
export const addXToDate = (date, x, quantity) => dayjs(date).add(quantity, x)

/**
 * @param {Date} date
 * @param {String} x
 * @param {Number} quantity
 */
export const substractXFromDate = (date, x, quantity) => dayjs(date).subtract(quantity, x)