import router from '@adonisjs/core/services/router';
import { middleware } from '#start/kernel';
const AddressController = () => import('#controllers/address_controller/address_controller');
router
    .group(() => {
    router.get('/', [AddressController, 'index']);
    router.get('/:id', [AddressController, 'show']);
    router.post('/', [AddressController, 'upsert']);
    router.delete('/:id', [AddressController, 'destroy']);
})
    .prefix('/api/doc/address')
    .use(middleware.auth());
//# sourceMappingURL=address_routes.js.map