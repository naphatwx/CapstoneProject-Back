import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const ChartsController = () => import('#controllers/charts_controller')

router.group(() => {
    router.get('', [ChartsController, 'index'])

    router.get('ads_group_status', [ChartsController, 'getAdsGroupStatus'])

    router.get('ads_group_period', [ChartsController, 'getAdsGroupPeriod'])

    router.get('ads_group_package', [ChartsController, 'getAdsGroupPackage'])

    router.get('top_regis_by_branch', [ChartsController, 'getTopRegisByBranch'])
}).prefix('/api/charts').use(middleware.auth())
