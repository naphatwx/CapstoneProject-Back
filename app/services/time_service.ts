import { DateTime } from "luxon"
import { start } from "repl"

const defaultFormat = 'yyyy-MM-dd HH:mm:ss'

const getDateTimeNow = (hoursToAdd: number = 0, formatDateTime: string = defaultFormat) => {
    return DateTime.now().plus({ hours: hoursToAdd }).toFormat(formatDateTime)
}

const changeDateTimeFormat = (dateTime: any, formatDateTime: string = defaultFormat) => {
    dateTime = checkDateTimeIsValid(dateTime)
    return DateTime.fromISO(dateTime).setZone('UTC').toFormat(formatDateTime)
}

const getDateTimeAsObject = (dateTime: any) => {
    dateTime = checkDateTimeIsValid(dateTime)
    const date = new Date(dateTime)

    return {
        year: date.getUTCFullYear(),  // Get UTC year
        month: date.getUTCMonth() + 1, // Get UTC month (Months are 0-indexed)
        date: date.getUTCDate(),  // Get UTC day
        hour: date.getUTCHours(), // Get UTC hour
        minute: date.getUTCMinutes(), // Get UTC minute
        second: date.getUTCSeconds() // Get UTC second
    }
}

const checkDateTimeIsValid = (dateTime: any) => {
    // Ensure dateTime is a valid string before passing it to the function
    if (dateTime instanceof Date) {
        // If it's a Date object, convert it to ISO string
        return dateTime = dateTime.toISOString()
    } else if (typeof dateTime !== 'string') {
        // If it's not a string, convert it to a string
        return dateTime = String(dateTime)
    }
    return dateTime
}

const convertQuarterToMonth = (quarter: number) => {
    switch (quarter) {
        case 1:
            return {
                start: '01', // January
                end: '03' // March
            }
        case 2:
            return {
                start: '04', // April
                end: '06' // June
            }
        case 3:
            return {
                start: '07', // July
                end: '09' // September
            }
        case 4:
            return {
                start: '10', // October
                end: '12' // December
            }
        default:
            throw new Error('Invalid quarter value. Must be between 1 and 4.')
    }
}

export default { getDateTimeNow, changeDateTimeFormat, getDateTimeAsObject, convertQuarterToMonth }
