import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const UsersController = () => import('#controllers/users_controller')

router.group(() => {
    router.group(() => {
        router.get('', [UsersController, 'getUsers']).as('users.all')

        router.get('/:userId', [UsersController, 'getUserById']).as('users.details')

        router.put('/:userId', [UsersController, 'updateUser']).as('users.update')

        router.patch('/logout', [UsersController, 'logout']).as('users.logout')
    }).use(middleware.auth())

    router.post('', [UsersController, 'createUser']).as('users.create')

    router.post('/login', [UsersController, 'login']).as('users.login')
}).prefix('/api/users')
