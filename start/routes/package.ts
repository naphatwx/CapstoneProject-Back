import router from '@adonisjs/core/services/router'

const PackagesController = () => import('#controllers/packages_controller')

router.group(() => {
    router.get('', [PackagesController, 'index']).as('packages.index')

    router.get('/medias', [PackagesController, 'getMediasByPackage']).as('packages.medias')
}).prefix('/packages')