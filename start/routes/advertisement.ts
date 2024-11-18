import router from '@adonisjs/core/services/router'

const AdsController = () => import('#controllers/advertisements_controller')

router.get('/ads', [AdsController, 'getAds']).as('ads.all')

router.get('/ads/:adsId', [AdsController, 'getAdsDetail']).as('ads.detail')

router.post('/ads', [AdsController, 'createAds']).as('ads.create')

router.put('/ads/:adsId', [AdsController, 'updateAds']).as('ads.update')