
import advertisement_service from '#services/advertisement_service'
import scheduler from 'adonisjs-scheduler/services/main'

// scheduler.command("inspire").everyFiveSeconds()

// scheduler.call(() => {
//     console.log("Pruge DB!")
// }).everySecond()

scheduler.call(async () => {
    const expiredAds = await advertisement_service.getExpiredAds()
    console.log('expiredAds', expiredAds)
    if (expiredAds.length !== 0) {
        await advertisement_service.inactivateAds(expiredAds.map(ads => ads.adsId))
    }
}).dailyAt('22:45')