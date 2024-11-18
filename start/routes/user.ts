import router from '@adonisjs/core/services/router'

const UsersController = () => import('#controllers/users_controller')

router.get('/users/:userId', [UsersController, 'getUserById']).as('users.id')