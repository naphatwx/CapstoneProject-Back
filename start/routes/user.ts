import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const UsersController = () => import('#controllers/users_controller')

router.group(() => {

    router.post('/login', [UsersController, 'login'])

    router.get('/authenticate', [UsersController, 'authenticateToken'])

    router.group(() => {
        router.get('', [UsersController, 'getUsers'])

        router.get('/:userId', [UsersController, 'getUserById'])

        router.post('', [UsersController, 'createUser'])

        router.put('/:userId', [UsersController, 'updateUser'])

        router.patch('/inactivate/:userId', [UsersController, 'inactivateUser'])

        router.patch('/logout', [UsersController, 'logout'])
    }).use(middleware.auth())
}).prefix('/api/users')
