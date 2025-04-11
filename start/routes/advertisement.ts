import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const AdsController = () => import('#controllers/advertisements_controller')

router.group(() => {
    router.get('', [AdsController, 'getAds'])

    router.get('/oldest', [AdsController, 'getOldestAdsRegisDate'])

    router.get('/export', [AdsController, 'exportAdsExcel'])

    router.get('/:adsId', [AdsController, 'getAdsDetail'])

    router.post('', [AdsController, 'storeAds'])

    router.put('/:adsId', [AdsController, 'updateAds'])

    router.patch('/image/:adsId', [AdsController, 'uploadAdsImageToLMS'])

    router.patch('/approve/:adsId', [AdsController, 'approveAds'])
}).prefix('/api/ads').use(middleware.auth())
