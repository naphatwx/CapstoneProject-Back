import { DateTime } from "luxon"

const getDateTimeNow = (zone: string = 'Asia/Bangkok') => {
    return DateTime.now().setZone(zone).toFormat('yyyy-MM-dd HH:mm:ss')
}

const changeDateTimeFormat = (dateTime: string, zone: string = 'Asia/Bangkok') => {
    return DateTime.fromISO(dateTime).setZone(zone).toFormat('yyyy-MM-dd HH:mm:ss')
}

export default { getDateTimeNow, changeDateTimeFormat }