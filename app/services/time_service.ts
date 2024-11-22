import { DateTime } from "luxon"

const defaultFormat = 'yyyy-MM-dd HH:mm:ss'

const getDateTimeNow = () => {
    return DateTime.now().toFormat(defaultFormat)
}

const changeDateTimeFormat = (dateTime: string) => {
    return DateTime.fromISO(dateTime).setZone('UTC').toFormat(defaultFormat)
}

export default { getDateTimeNow, changeDateTimeFormat }