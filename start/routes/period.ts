import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const PeriodsController = () => import('#controllers/periods_controller')

router.group(() => {
    router.get('', [PeriodsController, 'getPeriods'])

    router.post('', [PeriodsController, 'createPeriod'])

    router.put('/:periodId', [PeriodsController, 'updatePeriod'])

    router.patch('/inactivate/:periodId', [PeriodsController, 'inactivatePeriod'])
}).prefix('/api/periods').use(middleware.auth())
