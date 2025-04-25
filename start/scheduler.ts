import advertisement_service from '#services/advertisement_service'
import scheduler from 'adonisjs-scheduler/services/main'

// scheduler.command("inspire").everyFiveSeconds()

// scheduler.call(() => {
//     console.log("Pruge DB!")
// }).everySecond()

scheduler.call(async () => {
    const expiredAdsList = await advertisement_service.getExpiredAds()
    if (expiredAdsList.length > 0) {
        await advertisement_service.inactivateAds(expiredAdsList.map(ads => ads.adsId))
    }
}).daily()