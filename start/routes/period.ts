import router from '@adonisjs/core/services/router'

const PeriodsController = () => import('#controllers/periods_controller')

router.get('/periods', [PeriodsController, 'index']).as('periods.index')