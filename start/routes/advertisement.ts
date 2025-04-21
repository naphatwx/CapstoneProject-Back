import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const AdsController = () => import('#controllers/advertisements_controller')

router.group(() => {
    router.get('', [AdsController, 'getAdsPage'])

    router.get('/oldest', [AdsController, 'getOldestAdsRegisDate'])

    router.get('/export', [AdsController, 'exportAdsExcel'])

    router.get('/:adsId', [AdsController, 'getAdsDetail'])

    router.post('', [AdsController, 'createAds'])

    router.put('/:adsId', [AdsController, 'updateDraftDate'])

    router.patch('/active/:adsId', [AdsController, 'updateActiveAds'])

    router.patch('/image/:adsId', [AdsController, 'uploadAdsImageToLMS'])

    router.patch('/approve/:adsId', [AdsController, 'approveAds'])

    router.patch('/reject/:adsId', [AdsController, 'rejectAds'])
}).prefix('/api/ads').use(middleware.auth())
