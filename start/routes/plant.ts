import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const PlantsController = () => import('#controllers/plants_controller')

router.group(() => {
    // router.get('', [PlantsController, 'getPlants'])

    // router.get('/:plantCode', [PlantsController, 'getPlantDetail'])

    // router.get('/comCode/:comCode', [PlantsController, 'getPlantsByComCode'])

    // router.post('', [PlantsController, 'createPlant'])

    // router.put('', [PlantsController, 'updatePlant'])
}).prefix('/api/plants').use(middleware.auth())
