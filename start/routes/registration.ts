import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const RegistrationController = () => import('#controllers/registrations_controller')

router.group(() => {
    router.get('/', [RegistrationController, 'getRegistrationCount'])

    router.get('/:adsId', [RegistrationController, 'getAdsRegisCount'])
}).prefix('/api/registrations').use(middleware.auth())
