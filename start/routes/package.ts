import router from '@adonisjs/core/services/router'

const PackagesController = () => import('#controllers/packages_controller')

router.group(() => {
    router.get('', [PackagesController, 'getPackages'])

    router.get('/:packageId', [PackagesController, 'getPackageById'])
}).prefix('/api/packages')
