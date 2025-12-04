const PlaceController = () => import('#controllers/place_controller/state_controller');
import router from '@adonisjs/core/services/router';
router
    .group(() => {
    router.get('/getAllStates/districts', [PlaceController, 'getStatesWithDistricts']);
    router.get('/getAllStates', [PlaceController, 'getAllStates']);
    router.get('/getAllDistrictsById', [PlaceController, 'getAllDistrictsById']);
})
    .prefix('/api/doc/state');
//# sourceMappingURL=state.js.map