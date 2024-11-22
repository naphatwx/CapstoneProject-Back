import router from '@adonisjs/core/services/router'

const AdsController = () => import('#controllers/advertisements_controller')

router.group(() => {
    router.get('', [AdsController, 'getAds']).as('ads.all')

    router.get('/:adsId', [AdsController, 'getAdsDetail']).as('ads.detail')

    router.post('', [AdsController, 'storeAds']).as('ads.create')

    router.put('/:adsId', [AdsController, 'updateAds']).as('ads.update')

    router.patch('/approve/:adsId', [AdsController, 'approveAds']).as('ads.approve')
}).prefix('/ads')