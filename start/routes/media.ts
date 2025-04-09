import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const MediaController = () => import('#controllers/media_controller')

router.group(() => {
    router.get('/', [MediaController, 'getMedias'])

    router.post('/', [MediaController, 'createMedia'])

    router.put('/:mediaId', [MediaController, 'updateMedia'])

    router.patch('/inactivate/:mediaId', [MediaController, 'inactivateMedia'])
}).prefix('/api/medias').use(middleware.auth())
