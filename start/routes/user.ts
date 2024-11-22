import router from '@adonisjs/core/services/router'

const UsersController = () => import('#controllers/users_controller')

router.group(() => {
    router.get('/:userId', [UsersController, 'getUserById']).as('users.id')
}).prefix('/users')