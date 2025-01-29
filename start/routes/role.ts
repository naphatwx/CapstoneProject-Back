import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const RolesController = () => import('#controllers/roles_controller')

router.group(() => {
    router.get('', [RolesController, 'index']).as('roles.all')
}).prefix('/api/roles').use(middleware.auth())
