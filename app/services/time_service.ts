import BadRequestException from "#exceptions/badrequest_exception"
import { DateTime } from "luxon"

const defaultFormat = 'yyyy-MM-dd HH:mm:ss'

const getDateTimeNow = (hoursToAdd: number = 0, formatDateTime: string = defaultFormat) => {
    return DateTime.now().plus({ hours: hoursToAdd }).toFormat(formatDateTime)
}

const changeDateTimeFormat = (dateTime: any, formatDateTime: string = defaultFormat) => {
    dateTime = convertDateTimeToString(dateTime)

    if (!dateTime) {
        return dateTime
    }
    return DateTime.fromISO(dateTime).setZone('UTC').toFormat(formatDateTime)
}

const getDateTimeAsObject = (dateTime: any) => {
    dateTime = convertDateTimeToString(dateTime)
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

const convertDateTimeToString = (dateTime: any) => {
    if (!dateTime) {
        return ''
    }

    // Ensure dateTime is a valid string before passing it to the function
    if (dateTime instanceof Date) {
        return dateTime = dateTime.toISOString() // If it's a Date object, convert it to ISO string
    } else if (typeof dateTime !== 'string') {
        return dateTime = String(dateTime) // If it's not a string, convert it to a string
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

const validateYearAndQuarter = (year: number | string | null = null, quarter: number | string | null = null) => {
    if (!year && quarter) {
        throw new BadRequestException('Quarter cannot be specified without specifying a year')
    }
}

const extractYearMonth = (dateString: any) => {
    // Create a Date object if the input is a string
    const date = dateString instanceof Date ? dateString : new Date(dateString);

    // Extract the year and month
    const year = date.getFullYear();
    // getMonth() returns 0-11, so add 1 and pad with leading zero if needed
    const month = String(date.getMonth() + 1).padStart(2, '0');

    // Return in YYYY-MM format
    return `${year}-${month}`;
}

const getMonthsBetweenDates = (startDateStr: any, endDateStr: any) => {
    // Create DateTime objects with UTC timezone
    const startDate = DateTime.fromISO(convertDateTimeToString(startDateStr), { zone: 'utc' })
    const endDate = endDateStr ? DateTime.fromISO(convertDateTimeToString(endDateStr), { zone: 'utc' }) : DateTime.now().toUTC()

    if (startDate > endDate) {
        throw new BadRequestException('Start date should not be more than end date.')
    }

    // Results array
    const monthsArray = []

    // Set a date to the first day of the start month
    let currentDate = startDate.startOf('month')
    const lastDate = endDate.startOf('month')

    // Loop through each month until we reach or exceed the end month
    while (currentDate <= lastDate) {
        const year = currentDate.year
        const month = currentDate.month.toString().padStart(2, '0') // padStart => If number is single digit (1-9), it will add 0 before (01-09)

        // Add the formatted month to the array
        monthsArray.push(`${year}-${month}`)

        // Move to the next month
        currentDate = currentDate.plus({ months: 1 })
    }

    return monthsArray
}

export default {
    getDateTimeNow,
    changeDateTimeFormat,
    getDateTimeAsObject,
    convertQuarterToMonth,
    validateYearAndQuarter,
    extractYearMonth,
    getMonthsBetweenDates,
    convertDateTimeToString
}
