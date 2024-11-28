import router from '@adonisjs/core/services/router'

const PeriodsController = () => import('#controllers/periods_controller')

router.group(() => {
    router.get('', [PeriodsController, 'index']).as('periods.index')
}).prefix('/api/periods')
