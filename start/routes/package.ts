import router from '@adonisjs/core/services/router'

const PackagesController = () => import('#controllers/packages_controller')

router.get('/packages', [PackagesController, 'index']).as('packages.index')

router.get('/packages/medias', [PackagesController, 'getMediasByPackage']).as('packages.medias')