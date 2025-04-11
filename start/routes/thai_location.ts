import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const ThaiLocationsController = () => import('#controllers/thai_locations_controller')

router.group(() => {
    router.get('/provinces', [ThaiLocationsController, 'getProvinces'])

    router.get('/geographies', [ThaiLocationsController, 'getGeographies'])
}).prefix('/api/thai_location').use(middleware.auth())
