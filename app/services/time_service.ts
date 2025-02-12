import { DateTime } from "luxon"

const defaultFormat = 'yyyy-MM-dd HH:mm:ss'

const getDateTime = (hoursToAdd: number = 0) => {
    return DateTime.now().plus({ hours: hoursToAdd }).toFormat(defaultFormat)
}

const changeDateTimeFormat = (dateTime: string) => {
    return DateTime.fromISO(dateTime).setZone('UTC').toFormat(defaultFormat)
}

export default { getDateTime, changeDateTimeFormat }
