import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const CompaniesController = () => import('#controllers/companies_controller')

router.group(() => {
    router.get('', [CompaniesController, 'getCompanies'])
}).prefix('/api/companies').use(middleware.auth())
