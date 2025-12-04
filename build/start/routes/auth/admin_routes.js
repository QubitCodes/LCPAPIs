import router from '@adonisjs/core/services/router';
import { middleware } from '#start/kernel';
const AdminController = () => import('#controllers/admin_controller');
router
    .group(() => {
    // Route to get all users and their addresses
    router.get('/users', [AdminController, 'listAllUsers']);
    // Route to get all addresses from all users
    router.get('/addresses', [AdminController, 'listAllAddresses']);
    // Route to get all addresses for a specific user by their ID
    router.get('/users/addresses', [AdminController, 'listUserAddresses']);
})
    .prefix('/api/doc/admin')
    .use([middleware.auth(), middleware.role({ roles: [1, 2] })]);
//# sourceMappingURL=admin_routes.js.map