import { DateTime } from "luxon"

const defaultFormat = 'yyyy-MM-dd HH:mm:ss'
const defaultZone = 'Asia/Bangkok'

const getDateTimeNow = (zone: string = defaultZone) => {
    return DateTime.now().setZone(zone).toFormat(defaultFormat)
}

const changeDateTimeFormat = (dateTime: string) => {
    return DateTime.fromISO(dateTime).toFormat(defaultFormat)
}

export default { getDateTimeNow, changeDateTimeFormat }