import router from '@adonisjs/core/services/router'

const PackagesController = () => import('#controllers/packages_controller')

router.group(() => {
    router.get('', [PackagesController, 'getPackages'])

    router.get('/:packageId', [PackagesController, 'getPackageById'])

    router.post('', [PackagesController, 'createPackage'])

    router.put('/:packageId', [PackagesController, 'updatePackage'])

    router.patch('/inactivate/:packageId', [PackagesController, 'inactivatePackage'])
}).prefix('/api/packages')
