/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import '#start/routes/auth/user_auth';
import '#start/routes/auth/user_auth_secured';
import '#start/routes/email/otp_verification';
import '#start/routes/auth/get_all';
import '#start/routes/webhook/chat';
import '#start/routes/place/state';
import '#start/routes/auth/address_routes';
import '#start/routes/auth/admin_routes';
import '#start/routes/skill';
import router from '@adonisjs/core/services/router';
const FireBaseAuthController = () => import('#controllers/firebase/fire_auth_controller');
router.get('/', async () => {
    return {
        hello: 'Welcome to CyberFort',
    };
});
router.get('/debug/users', async () => {
    const User = (await import('#models/user')).default;
    return User.all();
});
router.post('/auth/firebase', [FireBaseAuthController, 'firebase']);
//# sourceMappingURL=routes.js.map